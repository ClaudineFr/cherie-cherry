"""Les emails envoyés autour d'une commande.

Trois messages :
  - au client, quand son paiement aboutit ;
  - à la propriétaire, pour qu'elle sache qu'une commande est arrivée ;
  - au client, quand sa commande est prête à être retirée.

Aucun n'est indispensable au bon déroulement d'une commande : si l'envoi
échoue, la commande reste payée et enregistrée. Les fonctions ci-dessous
avalent donc leurs erreurs et se contentent de les journaliser — un serveur
d'emails en panne ne doit pas faire échouer un paiement.
"""

import logging

from django.conf import settings
from django.core.mail import EmailMessage

from .models import Order, SiteSettings

logger = logging.getLogger(__name__)


def _adresse_boutique():
    """L'adresse du magasin, telle que saisie dans l'admin."""
    reglages = SiteSettings.objects.first()
    if reglages is None:
        return ""
    morceaux = [
        reglages.street,
        " ".join(filter(None, [reglages.postal_code, reglages.city])),
    ]
    return ", ".join(m for m in morceaux if m.strip())


def _email_proprietaire():
    """Où prévenir la propriétaire.

    La variable d'environnement l'emporte ; sinon on prend l'email de contact
    saisi dans l'admin. Renvoie None si aucun des deux n'est renseigné, auquel
    cas on n'envoie rien plutôt que d'échouer.
    """
    if settings.SHOP_OWNER_EMAIL:
        return settings.SHOP_OWNER_EMAIL
    reglages = SiteSettings.objects.first()
    return (reglages.email or None) if reglages else None


def _recapitulatif(commande):
    """Le détail de la commande, en texte simple."""
    lignes = [
        f"  {item.quantity} × {item.product_name} — {item.total} €"
        for item in commande.items.all()
    ]

    if commande.shipping_fee > 0:
        lignes.append(f"  Livraison — {commande.shipping_fee} €")

    lignes.append("")
    lignes.append(f"  Total : {commande.total} €")
    return "\n".join(lignes)


def _envoyer(sujet, corps, destinataires, repondre_a=None):
    """Envoie un message, sans jamais faire échouer l'appelant.

    Une commande payée le reste même si l'email ne part pas : on journalise
    et on continue. C'est aussi ce qui permet au webhook de répondre 200 à
    Stripe, qui sinon réessaierait indéfiniment.
    """
    if not destinataires:
        logger.warning("Email « %s » non envoyé : aucun destinataire.", sujet)
        return False

    try:
        message = EmailMessage(
            subject=sujet,
            body=corps,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=destinataires,
            # Pour que la propriétaire réponde au client d'un simple « Répondre ».
            reply_to=[repondre_a] if repondre_a else None,
        )
        message.send(fail_silently=False)
        return True
    except Exception:
        logger.exception("Échec de l'envoi de l'email « %s »", sujet)
        return False


def confirmation_au_client(commande):
    """Le récapitulatif envoyé au client dès son paiement accepté."""
    if commande.delivery_method == Order.Delivery.PICKUP:
        mode = (
            "Votre commande est à retirer en boutique.\n"
            "Nous vous préviendrons dès qu'elle sera prête."
        )
        adresse = _adresse_boutique()
        if adresse:
            mode += f"\n\nNotre adresse : {adresse}"
    elif commande.delivery_method == Order.Delivery.RELAY:
        # Sans ce cas, le « else » ci-dessous annoncerait une livraison à
        # domicile et afficherait une adresse vide : le client ne saurait pas
        # où aller chercher son colis.
        mode = "Votre commande sera livrée au point relais suivant :\n"
        for ligne in (
            commande.relay_name,
            commande.relay_address,
            " ".join(
                p for p in (commande.relay_postal_code, commande.relay_city) if p
            ),
        ):
            if ligne:
                mode += f"  {ligne}\n"
        mode += "\nVous serez prévenu(e) par Mondial Relay dès son arrivée."
    else:
        mode = (
            "Votre commande sera expédiée à l'adresse suivante :\n"
            f"  {commande.address_line1}\n"
        )
        if commande.address_line2:
            mode += f"  {commande.address_line2}\n"
        mode += f"  {commande.postal_code} {commande.city}"

    corps = f"""Bonjour {commande.first_name},

Merci pour votre commande ! Nous avons bien reçu votre paiement.

VOTRE COMMANDE (n° {commande.pk})

{_recapitulatif(commande)}

{mode}

Vous disposez d'un droit de rétractation de 14 jours à compter de la
réception de votre commande. Les conditions générales de vente sont
consultables sur notre site.

À très bientôt,
Chérie Cherry
"""

    return _envoyer(
        sujet=f"Votre commande Chérie Cherry n° {commande.pk}",
        corps=corps,
        destinataires=[commande.email],
    )


def alerte_a_la_proprietaire(commande):
    """Le message qui prévient la propriétaire d'une commande à préparer."""
    # get_delivery_method_display() donne le libellé défini sur le modèle :
    # un mode ajouté plus tard s'affichera sans repasser ici.
    mode = commande.get_delivery_method_display()

    adresse = ""
    if commande.delivery_method == Order.Delivery.HOME:
        lignes = [commande.address_line1]
        if commande.address_line2:
            lignes.append(commande.address_line2)
        lignes.append(f"{commande.postal_code} {commande.city}")
        adresse = "\nADRESSE DE LIVRAISON\n" + "\n".join(
            f"  {ligne}" for ligne in lignes
        )
    elif commande.delivery_method == Order.Delivery.RELAY:
        # C'est l'information dont elle a besoin pour éditer l'étiquette :
        # sans elle, l'email annoncerait une expédition sans dire où.
        lignes = [
            ligne
            for ligne in (
                commande.relay_name,
                commande.relay_address,
                " ".join(
                    p
                    for p in (commande.relay_postal_code, commande.relay_city)
                    if p
                ),
                f"N° Mondial Relay : {commande.relay_id}" if commande.relay_id else "",
            )
            if ligne
        ]
        adresse = "\nPOINT RELAIS\n" + "\n".join(f"  {ligne}" for ligne in lignes)

    telephone = f"\n  Téléphone : {commande.phone}" if commande.phone else ""

    corps = f"""Nouvelle commande n° {commande.pk}

CLIENT
  {commande.first_name} {commande.last_name}
  {commande.email}{telephone}

ARTICLES

{_recapitulatif(commande)}

MODE DE RÉCEPTION
  {mode}
{adresse}

Retrouvez cette commande dans votre espace d'administration.
"""

    return _envoyer(
        sujet=f"Nouvelle commande n° {commande.pk} — {commande.total} €",
        corps=corps,
        destinataires=[_email_proprietaire()] if _email_proprietaire() else [],
        # La propriétaire peut répondre directement au client.
        repondre_a=commande.email,
    )


def commande_prete(commande):
    """Prévient le client que sa commande l'attend en boutique."""
    adresse = _adresse_boutique()
    lieu = f"\n\nNotre adresse : {adresse}" if adresse else ""

    corps = f"""Bonjour {commande.first_name},

Votre commande n° {commande.pk} est prête ! Vous pouvez venir la retirer
en boutique aux horaires d'ouverture.{lieu}

VOTRE COMMANDE

{_recapitulatif(commande)}

À très bientôt,
Chérie Cherry
"""

    return _envoyer(
        sujet=f"Votre commande n° {commande.pk} est prête !",
        corps=corps,
        destinataires=[commande.email],
    )

from decimal import Decimal

import stripe
from django.conf import settings
from rest_framework import generics, permissions, status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import GalleryPhoto, Product, OpeningHours, InstagramStory, InstagramPost, MenuDrink, DrinkOfMonth, DrinkOfMonthSettings, Supplement, ContactMessage, SiteSettings, Order, OrderItem
from .serializers import GalleryPhotoSerializer, ProductSerializer, OpeningHoursSerializer, InstagramStorySerializer, InstagramPostSerializer, MenuDrinkSerializer, DrinkOfMonthSerializer, DrinkOfMonthSettingsSerializer, SupplementSerializer, ContactMessageSerializer, SiteSettingsSerializer, CheckoutSerializer

# Tous les endpoints ci-dessous sont en LECTURE SEULE
# (ReadOnlyModelViewSet = seulement GET liste + GET détail).
#
# Le site ne fait que lire ; la cliente modifie ses contenus depuis l'admin
# Django, protégé par mot de passe. Un ModelViewSet exposerait aussi POST,
# PUT et DELETE — et comme l'API est publique et sans authentification,
# n'importe qui pourrait supprimer un produit ou changer un prix.

class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    # Les données à servir : tous les produits.
    queryset = Product.objects.all()

    # Le serializer utilisé pour les transformer en JSON.
    serializer_class = ProductSerializer


class GalleryPhotoViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = GalleryPhoto.objects.all()
    serializer_class = GalleryPhotoSerializer

class OpeningHoursViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = OpeningHours.objects.all()
    serializer_class = OpeningHoursSerializer

class InstagramStoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = InstagramStory.objects.all()
    serializer_class = InstagramStorySerializer

class InstagramPostViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = InstagramPost.objects.all()
    serializer_class = InstagramPostSerializer

class MenuDrinkViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = MenuDrink.objects.filter(available=True)
    serializer_class = MenuDrinkSerializer

class DrinkOfMonthViewSet(viewsets.ReadOnlyModelViewSet):
    # On ne sert que les boissons du mois actives.
    queryset = DrinkOfMonth.objects.filter(active=True)
    serializer_class = DrinkOfMonthSerializer

class SupplementViewSet(viewsets.ReadOnlyModelViewSet):
    # On ne sert que les suppléments disponibles.
    queryset = Supplement.objects.filter(available=True)
    serializer_class = SupplementSerializer

class ContactMessageCreateView(generics.CreateAPIView):
    """Endpoint du formulaire de contact : POST uniquement.

    Contrairement aux autres endpoints, tous en lecture seule, celui-ci
    écrit — mais il ne fait QUE créer un message. On n'expose ni la liste ni
    le détail : les messages se lisent depuis l'admin, pas via l'API publique.
    """

    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer

    # Le réglage global (DjangoModelPermissionsOrAnonReadOnly) interdit toute
    # écriture anonyme. Or ce formulaire est justement fait pour ça : un
    # visiteur non connecté envoie un message. On lève donc la restriction
    # ICI, et seulement ici.
    #
    # Ce n'est pas une porte ouverte : la vue n'accepte QUE la création
    # (CreateAPIView), le serializer n'expose que les champs du formulaire,
    # et le honeypot filtre les bots.
    permission_classes = [permissions.AllowAny]

class DrinkOfMonthSettingsView(APIView):
    """Renvoie les réglages de l'encart (la date de fin), sous forme d'UN objet."""

    # Le réglage global (DjangoModelPermissionsOrAnonReadOnly) déduit les
    # droits du modèle visé, qu'il lit dans `.queryset`. Une APIView n'en a
    # pas — elle construit son objet à la main — et la permission lève alors
    # une erreur 500. On déclare donc explicitement la règle : lecture
    # publique, ce que fait déjà cette vue qui n'expose qu'un GET.
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        settings = DrinkOfMonthSettings.objects.first()
        serializer = DrinkOfMonthSettingsSerializer(
            settings or DrinkOfMonthSettings()
        )
        return Response(serializer.data)

class SiteSettingsView(APIView):
    """Renvoie les coordonnées du site (adresse, contact, réseaux) en UN objet."""

    # Même raison que DrinkOfMonthSettingsView ci-dessus : une APIView n'a pas
    # de `.queryset`, donc la permission par défaut ne sait pas quoi vérifier.
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        settings = SiteSettings.objects.first()
        # Si la proprio n'a pas encore rempli la ligne, on renvoie un objet
        # vide plutôt qu'une erreur : le front affichera juste des champs vides.
        serializer = SiteSettingsSerializer(settings or SiteSettings())
        return Response(serializer.data)

class CheckoutView(APIView):
    """Crée la session de paiement Stripe à partir du panier.

    Le navigateur envoie les identifiants de produits et les quantités ; les
    PRIX sont relus ici, en base. C'est le point central de la sécurité du
    paiement : un prix venant du client peut être modifié avant l'envoi, et
    quelqu'un pourrait acheter un sac à 45 € pour un centime.

    La commande est créée en statut « en attente ». Elle ne passera à
    « payée » que lorsque Stripe nous confirmera le paiement, via le webhook.
    """

    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = CheckoutSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        # --- 1. Relire les produits en base ---
        demandes = {ligne["product_id"]: ligne["quantity"] for ligne in data["items"]}
        produits = Product.objects.filter(id__in=demandes.keys())

        if len(produits) != len(demandes):
            return Response(
                {"detail": "Un des articles de votre panier n'existe plus."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # --- 2. Vérifier le stock ---
        for produit in produits:
            voulu = demandes[produit.id]
            if produit.stock < voulu:
                return Response(
                    {
                        "detail": (
                            f"« {produit.name} » n'est plus disponible en "
                            f"quantité suffisante (reste {produit.stock})."
                        )
                    },
                    status=status.HTTP_409_CONFLICT,
                )

        # --- 3. Calculer les montants, à partir des prix de la base ---
        total_articles = sum(
            (p.price * demandes[p.id] for p in produits), Decimal("0")
        )

        reglages = SiteSettings.objects.first() or SiteSettings()
        frais = Decimal("0")
        if data["delivery_method"] == Order.Delivery.HOME:
            frais = reglages.shipping_fee or Decimal("0")
            seuil = reglages.free_shipping_from
            if seuil is not None and total_articles >= seuil:
                frais = Decimal("0")

        # --- 4. Enregistrer la commande, en attente de paiement ---
        commande = Order.objects.create(
            email=data["email"],
            first_name=data["first_name"],
            last_name=data["last_name"],
            phone=data.get("phone", ""),
            delivery_method=data["delivery_method"],
            address_line1=data.get("address_line1", ""),
            address_line2=data.get("address_line2", ""),
            postal_code=data.get("postal_code", ""),
            city=data.get("city", ""),
            shipping_fee=frais,
            status=Order.Status.PENDING,
        )

        for produit in produits:
            OrderItem.objects.create(
                order=commande,
                product=produit,
                product_name=produit.name,
                unit_price=produit.price,
                quantity=demandes[produit.id],
            )

        # --- 5. Demander la session de paiement à Stripe ---
        # Les montants sont en CENTIMES : l'euro est une devise à deux
        # décimales, donc 1000 = 10,00 €.
        lignes_stripe = [
            {
                "price_data": {
                    "currency": "eur",
                    "product_data": {"name": p.name},
                    "unit_amount": int(p.price * 100),
                },
                "quantity": demandes[p.id],
            }
            for p in produits
        ]

        if frais > 0:
            lignes_stripe.append(
                {
                    "price_data": {
                        "currency": "eur",
                        "product_data": {"name": "Frais de livraison"},
                        "unit_amount": int(frais * 100),
                    },
                    "quantity": 1,
                }
            )

        client = stripe.StripeClient(settings.STRIPE_SECRET_KEY)
        base = settings.FRONTEND_URL.rstrip("/")

        try:
            session = client.checkout.sessions.create(
                params={
                    "mode": "payment",
                    "line_items": lignes_stripe,
                    "customer_email": data["email"],
                    # metadata : nos propres informations, que Stripe nous
                    # renverra dans le webhook. C'est ce qui permettra de
                    # retrouver quelle commande vient d'être payée.
                    "metadata": {"order_id": str(commande.pk)},
                    "success_url": f"{base}/commande/merci?session_id={{CHECKOUT_SESSION_ID}}",
                    "cancel_url": f"{base}/panier",
                }
            )
        except stripe.StripeError:
            # Le paiement n'a pas pu démarrer : on annule la commande pour ne
            # pas laisser traîner une ligne fantôme dans l'admin.
            commande.status = Order.Status.CANCELLED
            commande.save(update_fields=["status"])
            return Response(
                {"detail": "Le paiement est momentanément indisponible."},
                status=status.HTTP_502_BAD_GATEWAY,
            )

        commande.stripe_session_id = session.id
        commande.save(update_fields=["stripe_session_id"])

        # Le front n'a besoin que de l'URL vers laquelle rediriger le client.
        return Response({"url": session.url})

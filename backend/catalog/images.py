"""Réduction des photos téléversées depuis le back-office.

Une photo prise au téléphone pèse volontiers 5 à 8 Mo pour 4000 px de large.
Affichée dans une vignette de 400 px, elle est téléchargée en entier par
chaque visiteuse : c'est le premier poste de lenteur d'un site vitrine, et
personne dans le back-office n'a de raison d'y penser.

On redimensionne donc à l'enregistrement, une fois pour toutes. La cliente
envoie ce qu'elle veut, le site sert une image raisonnable.

Le format de sortie est le JPEG, sauf pour les images à transparence (PNG),
qui la conserveraient mal en JPEG — un fond transparent deviendrait noir.
"""

import os
from io import BytesIO

from django.core.files.base import ContentFile
from PIL import Image, ImageOps

# Qualité JPEG : 85 est le compromis habituel — la différence avec 100 ne se
# voit pas à l'œil sur une photo, pour un fichier trois à quatre fois plus léger.
QUALITE = 85


def reduire(fichier, largeur_max, hauteur_max):
    """Renvoie une version réduite de `fichier`, ou None s'il n'y a rien à faire.

    L'image garde ses proportions et n'est jamais agrandie : une photo déjà
    petite est laissée telle quelle (on renvoie None, et l'appelant conserve
    le fichier d'origine).
    """
    try:
        image = Image.open(fichier)
    except Exception:
        # Fichier illisible ou format non reconnu : on ne touche à rien.
        # La validation du champ ImageField signalera le problème.
        return None

    # Les photos de téléphone portent leur orientation dans les métadonnées
    # EXIF plutôt que dans les pixels : sans ça, une photo prise à la verticale
    # ressort couchée.
    image = ImageOps.exif_transpose(image)

    if image.width <= largeur_max and image.height <= hauteur_max:
        return None

    image.thumbnail((largeur_max, hauteur_max), Image.LANCZOS)

    transparence = image.mode in ("RGBA", "LA", "P")
    tampon = BytesIO()

    if transparence:
        image.convert("RGBA").save(tampon, format="PNG", optimize=True)
        extension = ".png"
    else:
        image.convert("RGB").save(
            tampon, format="JPEG", quality=QUALITE, optimize=True, progressive=True
        )
        extension = ".jpg"

    return ContentFile(tampon.getvalue()), extension


def reduire_champ(instance, nom_champ, largeur_max, hauteur_max):
    """Réduit sur place l'image d'un champ, si besoin.

    À appeler depuis `save()` AVANT l'enregistrement. Ne fait rien quand le
    champ est vide, quand l'image est déjà assez petite, ou quand le fichier
    n'a pas changé depuis la dernière fois (inutile de recompresser à chaque
    modification de prix).
    """
    fichier = getattr(instance, nom_champ, None)
    if not fichier:
        return

    # Un fichier déjà en base n'est retraité que s'il vient d'être remplacé.
    # `hasattr(fichier.file, "content_type")` est vrai pour un envoi en cours.
    if instance.pk and not hasattr(fichier.file, "content_type"):
        return

    resultat = reduire(fichier, largeur_max, hauteur_max)
    if resultat is None:
        return

    contenu, extension = resultat
    base = os.path.splitext(os.path.basename(fichier.name))[0]
    fichier.save(base + extension, contenu, save=False)

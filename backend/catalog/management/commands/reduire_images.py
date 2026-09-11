"""Réduit les images déjà en base, envoyées avant la réduction automatique.

Les nouveaux envois sont réduits à l'enregistrement (voir catalog/images.py).
Cette commande rattrape l'existant — utile une fois après la mise en place,
et si un jour des images arrivent par un autre chemin que le back-office.

    python manage.py reduire_images            # montre ce qui serait fait
    python manage.py reduire_images --appliquer # le fait vraiment

Sans --appliquer, rien n'est modifié : on voit d'abord ce que ça donnerait.
"""

import os

from django.core.management.base import BaseCommand
from PIL import Image

from catalog.images import reduire
from catalog.models import (
    GalleryPhoto,
    InstagramPost,
    InstagramStory,
    Product,
    ProductImage,
)

# Les mêmes dimensions que dans les save() des modèles : une image traitée
# ici doit être identique à une image envoyée depuis le back-office.
CIBLES = [
    (Product, "image", 1600, 1600),
    (ProductImage, "image", 1600, 1600),
    (GalleryPhoto, "image", 1600, 1600),
    (InstagramStory, "image", 800, 800),
    (InstagramPost, "image", 1200, 1200),
]


class Command(BaseCommand):
    help = "Réduit les images déjà stockées (voir --appliquer)."

    def add_arguments(self, parser):
        parser.add_argument(
            "--appliquer",
            action="store_true",
            help="Écrit les images réduites. Sans cette option, simple aperçu.",
        )

    def handle(self, *args, **options):
        appliquer = options["appliquer"]
        total_avant = total_apres = 0
        traitees = ignorees = erreurs = 0

        for modele, champ, largeur, hauteur in CIBLES:
            for objet in modele.objects.all():
                fichier = getattr(objet, champ)
                if not fichier:
                    continue

                try:
                    poids_avant = fichier.size
                    image = Image.open(fichier.path)
                    dimensions = f"{image.width}×{image.height}"
                except Exception as exc:
                    # Fichier absent du disque, ou illisible : on le signale
                    # sans interrompre le reste.
                    erreurs += 1
                    self.stderr.write(f"  ! {fichier.name} : {exc}")
                    continue

                if image.width <= largeur and image.height <= hauteur:
                    ignorees += 1
                    continue

                resultat = reduire(fichier.path, largeur, hauteur)
                if resultat is None:
                    ignorees += 1
                    continue

                contenu, extension = resultat
                poids_apres = len(contenu.read())
                contenu.seek(0)

                total_avant += poids_avant
                total_apres += poids_apres
                traitees += 1

                gain = 100 - (poids_apres * 100 // max(poids_avant, 1))
                self.stdout.write(
                    f"  {modele.__name__}#{objet.pk} {dimensions} "
                    f"{poids_avant // 1024} Ko → {poids_apres // 1024} Ko "
                    f"(−{gain} %)"
                )

                if appliquer:
                    base = os.path.splitext(os.path.basename(fichier.name))[0]
                    fichier.save(base + extension, contenu, save=True)

        self.stdout.write("")
        self.stdout.write(
            f"{traitees} image(s) à réduire, {ignorees} déjà correcte(s)"
            + (f", {erreurs} en erreur" if erreurs else "")
        )
        if traitees:
            self.stdout.write(
                f"{total_avant // 1024 // 1024} Mo → "
                f"{total_apres // 1024 // 1024} Mo"
            )
        if traitees and not appliquer:
            self.stdout.write(
                self.style.WARNING(
                    "Aperçu seulement. Relancez avec --appliquer pour écrire."
                )
            )

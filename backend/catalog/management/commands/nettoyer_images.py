"""Repère les fichiers image que plus rien n'utilise, et propose de les effacer.

Django ne supprime jamais l'ancien fichier quand une image est remplacée, ni
quand un objet est supprimé : les fichiers restent sur le disque sans que rien
ne les référence. Sur le volume Railway, facturé au Go, ça s'accumule.

    python manage.py nettoyer_images             # liste, sans rien toucher
    python manage.py nettoyer_images --appliquer # supprime

Un fichier est « orphelin » quand aucun objet en base ne le référence. La
commande compare donc le disque à la base : prudente par construction, mais
à ne pas lancer pendant un envoi en cours.
"""

import os
import pathlib

from django.conf import settings
from django.core.management.base import BaseCommand

from catalog.models import (
    GalleryPhoto,
    InstagramPost,
    InstagramStory,
    Product,
    ProductImage,
)

MODELES = [Product, ProductImage, GalleryPhoto, InstagramStory, InstagramPost]


class Command(BaseCommand):
    help = "Liste (ou supprime) les fichiers image que plus rien n'utilise."

    def add_arguments(self, parser):
        parser.add_argument(
            "--appliquer",
            action="store_true",
            help="Supprime les fichiers. Sans cette option, simple liste.",
        )

    def handle(self, *args, **options):
        appliquer = options["appliquer"]

        # Tout ce que la base référence, chemin absolu normalisé.
        utilises = set()
        for modele in MODELES:
            for objet in modele.objects.all():
                fichier = getattr(objet, "image", None)
                if fichier:
                    utilises.add(os.path.normpath(fichier.path))

        media = pathlib.Path(settings.MEDIA_ROOT)
        if not media.exists():
            self.stdout.write("Aucun dossier média.")
            return

        orphelins = [
            chemin
            for chemin in media.rglob("*.*")
            if chemin.is_file()
            and os.path.normpath(str(chemin)) not in utilises
        ]

        if not orphelins:
            self.stdout.write("Rien à nettoyer : tous les fichiers sont utilisés.")
            return

        poids = 0
        for chemin in sorted(orphelins, key=lambda p: -p.stat().st_size):
            taille = chemin.stat().st_size
            poids += taille
            self.stdout.write(
                f"  {taille // 1024:>7} Ko  {chemin.relative_to(media)}"
            )
            if appliquer:
                chemin.unlink()

        self.stdout.write("")
        verbe = "supprimé(s)" if appliquer else "orphelin(s)"
        self.stdout.write(
            f"{len(orphelins)} fichier(s) {verbe}, {poids // 1024 // 1024} Mo"
        )
        if not appliquer:
            self.stdout.write(
                self.style.WARNING(
                    "Liste seulement. Relancez avec --appliquer pour supprimer."
                )
            )

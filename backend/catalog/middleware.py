"""Obliger une personne à choisir son mot de passe à sa première connexion.

Le mot de passe créé par la propriétaire circule par SMS ou de vive voix :
il ne doit pas rester en usage. Tant que la personne ne l'a pas remplacé,
toute page du back-office la renvoie vers le formulaire de changement.

C'est un middleware plutôt qu'une vérification dans chaque vue : il n'y a
ainsi aucune page à oublier.
"""

from django.contrib import messages
from django.shortcuts import redirect
from django.urls import reverse


class ForcePasswordChangeMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        user = getattr(request, "user", None)

        if user is not None and user.is_authenticated:
            profil = getattr(user, "staff_profile", None)

            if profil is not None and profil.must_change_password:
                cible = reverse("admin:password_change")

                # Les pages à laisser passer, sinon on s'enferme : le
                # formulaire lui-même, sa page de confirmation, la
                # déconnexion (on doit pouvoir repartir), et les fichiers
                # statiques dont le formulaire a besoin pour s'afficher.
                autorises = (
                    cible,
                    reverse("admin:password_change_done"),
                    reverse("admin:logout"),
                )
                chemin = request.path

                if chemin not in autorises and not chemin.startswith(
                    ("/static/", "/media/")
                ):
                    messages.info(
                        request,
                        "Bienvenue ! Choisissez votre propre mot de passe "
                        "pour continuer : celui qui vous a été transmis ne "
                        "sert qu'à cette première connexion.",
                    )
                    return redirect(cible)

        return self.get_response(request)

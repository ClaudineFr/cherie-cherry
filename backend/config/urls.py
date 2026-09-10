from django.conf import settings
from django.contrib import admin
from django.urls import include, path, re_path
from django.views.static import serve

# Le bouton « Voir le site » de l'admin pointe vers le site public (le front),
# et non vers "/" (le backend, qui n'a pas de page d'accueil). L'URL vient de
# FRONTEND_URL (voir settings.py) pour s'adapter au local / à la prod.
#
# En mode « coming soon », on ajoute ?preview=<jeton> pour que le proxy Next
# reconnaisse l'admin et affiche le vrai site (les visiteurs voient toujours la
# page coming soon). Sans jeton défini, on garde l'URL simple.
if settings.PREVIEW_TOKEN:
    _base = settings.FRONTEND_URL.rstrip("/")
    admin.site.site_url = f"{_base}/?preview={settings.PREVIEW_TOKEN}"
else:
    admin.site.site_url = settings.FRONTEND_URL

# Quand une personne change son mot de passe, elle n'a plus à le faire : on
# lève le drapeau posé à la création du compte (voir StaffProfile et
# catalog/middleware.py). On enveloppe la vue de l'admin plutôt que d'écouter
# un signal : c'est ici, et seulement ici, qu'un nouveau mot de passe est
# réellement enregistré.
_password_change = admin.site.password_change


def _password_change_et_lever_drapeau(request, extra_context=None):
    reponse = _password_change(request, extra_context)

    # Un POST réussi renvoie une redirection : c'est le signe que le
    # changement a été accepté (un formulaire en erreur réaffiche la page).
    if request.method == "POST" and reponse.status_code in (301, 302):
        profil = getattr(request.user, "staff_profile", None)
        if profil is not None and profil.must_change_password:
            profil.must_change_password = False
            profil.save(update_fields=["must_change_password"])

    return reponse


admin.site.password_change = _password_change_et_lever_drapeau

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("catalog.urls")),
    # Django sert lui-même les fichiers media (les photos uploadées depuis
    # l'admin), EN DEV COMME EN PROD. WhiteNoise ne convient pas ici : il
    # n'indexe les fichiers qu'au démarrage, or les photos sont ajoutées
    # après coup. On utilise donc la vue `serve` de Django, branchée sur le
    # dossier MEDIA_ROOT (en prod : le volume persistant /data/media).
    # Note : `static()` de Django ne sert QUE si DEBUG=True, d'où la vue
    # explicite ci-dessous qui marche aussi quand DEBUG=False.
    re_path(
        r"^media/(?P<path>.*)$",
        serve,
        {"document_root": settings.MEDIA_ROOT},
    ),
]

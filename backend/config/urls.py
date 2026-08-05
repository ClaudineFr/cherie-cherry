from django.conf import settings
from django.contrib import admin
from django.urls import include, path, re_path
from django.views.static import serve

# Le bouton « Voir le site » de l'admin pointe vers le site public (le front),
# et non vers "/" (le backend, qui n'a pas de page d'accueil). L'URL vient de
# FRONTEND_URL (voir settings.py) pour s'adapter au local / à la prod.
admin.site.site_url = settings.FRONTEND_URL

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

from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path

# Le bouton « Voir le site » de l'admin pointe vers le site public (le front),
# et non vers "/" (le backend, qui n'a pas de page d'accueil). L'URL vient de
# FRONTEND_URL (voir settings.py) pour s'adapter au local / à la prod.
admin.site.site_url = settings.FRONTEND_URL

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("catalog.urls")),
]

# En développement uniquement : Django sert lui-même les fichiers media
# (les images uploadées). En production, ce sera le rôle du serveur web.
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

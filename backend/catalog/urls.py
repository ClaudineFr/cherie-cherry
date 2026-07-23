from rest_framework.routers import DefaultRouter

from .views import ProduitViewSet

# Le routeur génère automatiquement les URLs à partir du ViewSet.
router = DefaultRouter()
router.register(r"produits", ProduitViewSet)

urlpatterns = router.urls

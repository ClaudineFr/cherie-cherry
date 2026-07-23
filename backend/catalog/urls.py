from rest_framework.routers import DefaultRouter

from .views import ProductViewSet

# Le routeur génère automatiquement les URLs à partir du ViewSet.
router = DefaultRouter()
router.register(r"produits", ProductViewSet)

urlpatterns = router.urls

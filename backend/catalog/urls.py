from rest_framework.routers import DefaultRouter

from .views import GalleryPhotoViewSet, ProductViewSet

router = DefaultRouter()
router.register(r"produits", ProductViewSet)
router.register(r"galerie", GalleryPhotoViewSet)

urlpatterns = router.urls


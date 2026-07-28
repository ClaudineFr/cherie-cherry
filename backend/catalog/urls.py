from rest_framework.routers import DefaultRouter

from .views import GalleryPhotoViewSet, ProductViewSet, OpeningHoursViewSet

router = DefaultRouter()
router.register(r"produits", ProductViewSet)
router.register(r"galerie", GalleryPhotoViewSet)
router.register(r"horaires", OpeningHoursViewSet)


urlpatterns = router.urls


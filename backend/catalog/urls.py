from rest_framework.routers import DefaultRouter

from .views import GalleryPhotoViewSet, ProductViewSet, OpeningHoursViewSet, InstagramStoryViewSet, InstagramPostViewSet

router = DefaultRouter()
router.register(r"produits", ProductViewSet)
router.register(r"galerie", GalleryPhotoViewSet)
router.register(r"horaires", OpeningHoursViewSet)
router.register(r"stories", InstagramStoryViewSet)
router.register(r"posts", InstagramPostViewSet)


urlpatterns = router.urls


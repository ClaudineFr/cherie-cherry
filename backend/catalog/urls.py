from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import GalleryPhotoViewSet, ProductViewSet, OpeningHoursViewSet, InstagramStoryViewSet, InstagramPostViewSet, MenuDrinkViewSet, DrinkOfMonthViewSet, DrinkOfMonthSettingsView, SupplementViewSet, ContactMessageCreateView, SiteSettingsView

router = DefaultRouter()
router.register(r"produits", ProductViewSet)
router.register(r"galerie", GalleryPhotoViewSet)
router.register(r"horaires", OpeningHoursViewSet)
router.register(r"stories", InstagramStoryViewSet)
router.register(r"posts", InstagramPostViewSet)
router.register(r"menu", MenuDrinkViewSet)
router.register(r"boissons-du-mois", DrinkOfMonthViewSet)
router.register(r"supplements", SupplementViewSet)

urlpatterns = router.urls + [
    path("reglages-boissons-du-mois/", DrinkOfMonthSettingsView.as_view()),
    path("contact/", ContactMessageCreateView.as_view()),
    path("parametres/", SiteSettingsView.as_view()),
]



from rest_framework import viewsets

from .models import GalleryPhoto, Product, OpeningHours, InstagramStory, InstagramPost, MenuDrink, DrinkOfMonth, DrinkOfMonthSettings
from .serializers import GalleryPhotoSerializer, ProductSerializer, OpeningHoursSerializer, InstagramStorySerializer, InstagramPostSerializer, MenuDrinkSerializer, DrinkOfMonthSerializer, DrinkOfMonthSettingsSerializer


class ProductViewSet(viewsets.ModelViewSet):
    # Les données à servir : tous les produits.
    queryset = Product.objects.all()

    # Le serializer utilisé pour les transformer en JSON.
    serializer_class = ProductSerializer


class GalleryPhotoViewSet(viewsets.ModelViewSet):
    queryset = GalleryPhoto.objects.all()
    serializer_class = GalleryPhotoSerializer

class OpeningHoursViewSet(viewsets.ModelViewSet):
    queryset = OpeningHours.objects.all()
    serializer_class = OpeningHoursSerializer

class InstagramStoryViewSet(viewsets.ModelViewSet):
    queryset = InstagramStory.objects.all()
    serializer_class = InstagramStorySerializer

class InstagramPostViewSet(viewsets.ModelViewSet):
    queryset = InstagramPost.objects.all()
    serializer_class = InstagramPostSerializer

class MenuDrinkViewSet(viewsets.ModelViewSet):
    queryset = MenuDrink.objects.filter(available=True)
    serializer_class = MenuDrinkSerializer

class DrinkOfMonthViewSet(viewsets.ModelViewSet):
    # On ne sert que les boissons du mois actives.
    queryset = DrinkOfMonth.objects.filter(active=True)
    serializer_class = DrinkOfMonthSerializer

from rest_framework.views import APIView
from rest_framework.response import Response


class DrinkOfMonthSettingsView(APIView):
    """Renvoie les réglages de l'encart (la date de fin), sous forme d'UN objet."""

    def get(self, request):
        settings = DrinkOfMonthSettings.objects.first()
        serializer = DrinkOfMonthSettingsSerializer(
            settings or DrinkOfMonthSettings()
        )
        return Response(serializer.data)

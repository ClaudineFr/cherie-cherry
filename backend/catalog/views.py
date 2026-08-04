from rest_framework import viewsets

from .models import GalleryPhoto, Product, OpeningHours, InstagramStory, InstagramPost, MenuDrink, DrinkOfMonth, DrinkOfMonthSettings, Supplement, ContactMessage, SiteSettings
from .serializers import GalleryPhotoSerializer, ProductSerializer, OpeningHoursSerializer, InstagramStorySerializer, InstagramPostSerializer, MenuDrinkSerializer, DrinkOfMonthSerializer, DrinkOfMonthSettingsSerializer, SupplementSerializer, ContactMessageSerializer, SiteSettingsSerializer


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

class SupplementViewSet(viewsets.ModelViewSet):
    # On ne sert que les suppléments disponibles.
    queryset = Supplement.objects.filter(available=True)
    serializer_class = SupplementSerializer

from rest_framework import generics


class ContactMessageCreateView(generics.CreateAPIView):
    """Endpoint du formulaire de contact : POST uniquement.

    Contrairement aux autres endpoints (ModelViewSet, lecture + écriture),
    celui-ci ne fait QUE créer un message. On n'expose ni la liste ni le
    détail : les messages se lisent depuis l'admin, pas via l'API publique.
    """

    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer


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

class SiteSettingsView(APIView):
    """Renvoie les coordonnées du site (adresse, contact, réseaux) en UN objet."""

    def get(self, request):
        settings = SiteSettings.objects.first()
        # Si la proprio n'a pas encore rempli la ligne, on renvoie un objet
        # vide plutôt qu'une erreur : le front affichera juste des champs vides.
        serializer = SiteSettingsSerializer(settings or SiteSettings())
        return Response(serializer.data)

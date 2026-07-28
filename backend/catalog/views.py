from rest_framework import viewsets

from .models import GalleryPhoto, Product, OpeningHours, InstagramStory, InstagramPost
from .serializers import GalleryPhotoSerializer, ProductSerializer, OpeningHoursSerializer, InstagramStorySerializer, InstagramPostSerializer


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

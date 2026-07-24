from rest_framework import viewsets

from .models import GalleryPhoto, Product
from .serializers import GalleryPhotoSerializer, ProductSerializer


class ProductViewSet(viewsets.ModelViewSet):
    """Gère l'API des produits : lister, voir, créer, modifier, supprimer."""

    # Les données à servir : tous les produits.
    queryset = Product.objects.all()

    # Le serializer utilisé pour les transformer en JSON.
    serializer_class = ProductSerializer


class GalleryPhotoViewSet(viewsets.ModelViewSet):
    """Gère l'API de la galerie : lister, voir, créer, modifier, supprimer."""

    queryset = GalleryPhoto.objects.all()
    serializer_class = GalleryPhotoSerializer

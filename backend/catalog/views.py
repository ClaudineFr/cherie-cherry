from rest_framework import viewsets

from .models import Product
from .serializers import ProductSerializer


class ProductViewSet(viewsets.ModelViewSet):
    """Gère l'API des produits : lister, voir, créer, modifier, supprimer."""

    # Les données à servir : tous les produits.
    queryset = Product.objects.all()

    # Le serializer utilisé pour les transformer en JSON.
    serializer_class = ProductSerializer

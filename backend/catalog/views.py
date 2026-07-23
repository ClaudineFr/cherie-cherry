from rest_framework import viewsets

from .models import Produit
from .serializers import ProduitSerializer


class ProduitViewSet(viewsets.ModelViewSet):
    """Gère l'API des produits : lister, voir, créer, modifier, supprimer."""

    # Les données à servir : tous les produits.
    queryset = Produit.objects.all()

    # Le serializer utilisé pour les transformer en JSON.
    serializer_class = ProduitSerializer

from rest_framework import serializers
from .models import Produit
class ProduitSerializer(serializers.ModelSerializer):
    """Décrit comment un Produit est transformé en JSON (et inversement)."""

    class Meta:
        model = Produit
        # Les champs qu'on expose dans l'API.
        fields = [
            "id",
            "nom",
            "categorie",
            "description",
            "prix",
            "stock",
            "coup_de_coeur",
        ]
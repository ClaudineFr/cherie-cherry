from rest_framework import serializers

from .models import Product


class ProductSerializer(serializers.ModelSerializer):
    """Décrit comment un Product est transformé en JSON (et inversement)."""

    class Meta:
        model = Product
        # Les champs qu'on expose dans l'API.
        fields = [
            "id",
            "name",
            "category",
            "description",
            "price",
            "stock",
            "featured",
            "image"
        ]

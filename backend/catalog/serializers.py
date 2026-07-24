from rest_framework import serializers

from .models import GalleryPhoto, Product


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


class GalleryPhotoSerializer(serializers.ModelSerializer):
    """Décrit comment une GalleryPhoto est transformée en JSON."""

    class Meta:
        model = GalleryPhoto
        fields = [
            "id",
            "image",
            "alt",
        ]


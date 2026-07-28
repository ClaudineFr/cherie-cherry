from rest_framework import serializers

from .models import GalleryPhoto, Product, OpeningHours, InstagramStory, InstagramPost

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
    class Meta:
        model = GalleryPhoto
        fields = [
            "id",
            "image",
            "alt",
        ]

class OpeningHoursSerializer(serializers.ModelSerializer):
    # Champ "calculé" : en plus du numéro (day=0), on expose le libellé
    # ("Lundi") pour que le front l'affiche sans avoir à le deviner.
    # source="get_day_display" appelle la méthode que Django génère tout seul.
    day_label = serializers.CharField(source="get_day_display", read_only=True)

    class Meta:
        model = OpeningHours
        fields = [
            "id",
            "day",
            "day_label",
            "opens_at",
            "closes_at",
            "closed",
        ]

class InstagramStorySerializer(serializers.ModelSerializer):
    class Meta:
        model = InstagramStory
        fields = [
            "id",
            "image",
            "handle",
            "order",
        ]

class InstagramPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = InstagramPost
        fields = [
            "id",
            "image",
            "caption",
            "link",
            "order",
        ]

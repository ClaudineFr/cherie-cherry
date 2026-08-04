from rest_framework import serializers

from .models import GalleryPhoto, Product, OpeningHours, InstagramStory, InstagramPost, MenuDrink, DrinkOfMonth, DrinkOfMonthSettings, Supplement, SiteSettings

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

class MenuDrinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = MenuDrink
        fields = [
            "id",
            "name",
            "description",
            "price",
            "category",
            "order",
            "available",
        ]

class DrinkOfMonthSerializer(serializers.ModelSerializer):
    class Meta:
        model = DrinkOfMonth
        fields = [
            "id",
            "name",
            "description",
            "price",
            "order",
            "active",
        ]


class DrinkOfMonthSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = DrinkOfMonthSettings
        fields = [
            "available_until",
        ]


class SupplementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplement
        fields = [
            "id",
            "label",
            "price",
            "order",
            "available",
        ]

class SiteSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteSettings
        fields = [
            "street",
            "postal_code",
            "city",
            "email",
            "phone",
            "instagram_url",
            "tiktok_url",
        ]

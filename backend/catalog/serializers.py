from rest_framework import serializers

from .models import GalleryPhoto, Product, OpeningHours, InstagramStory, InstagramPost, MenuDrink, DrinkOfMonth, DrinkOfMonthSettings, Supplement, ContactMessage, SiteSettings, ProductImage

class ProductImageSerializer(serializers.ModelSerializer):
    """Une photo de galerie d'un produit, en JSON."""

    class Meta:
        model = ProductImage
        fields = ["id", "image", "alt", "order"]


class ProductSerializer(serializers.ModelSerializer):
    """Décrit comment un Product est transformé en JSON (et inversement)."""

    # Les photos liées à ce produit. On réutilise le serializer ci-dessus.
    #
    # many=True : c'est une liste (un produit a plusieurs photos).
    # read_only=True : l'API ne sert qu'à lire, la cliente passe par l'admin.
    #
    # Le nom `images` doit correspondre au related_name de la ForeignKey :
    # c'est comme ça que DRF sait où aller chercher les photos.
    images = ProductImageSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        # Les champs qu'on expose dans l'API.
        fields = [
            "id",
            "slug",
            "name",
            "category",
            "description",
            "price",
            "stock",
            "featured",
            "image",
            "images",
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


class ContactMessageSerializer(serializers.ModelSerializer):
    # Champ "honeypot" (pot de miel) anti-spam : un champ que le formulaire
    # cache aux visiteurs mais que les bots, qui remplissent tout, vont
    # remplir. write_only => il ne ressort jamais dans le JVON renvoyé ;
    # required=False => un humain n'a pas à le remplir.
    # Il n'existe PAS sur le modèle : on ne le stocke pas, on le vérifie juste.
    website = serializers.CharField(
        required=False, allow_blank=True, write_only=True
    )

    class Meta:
        model = ContactMessage
        # Les champs qu'un visiteur envoie. is_read / created_at sont gérés
        # côté serveur, jamais fournis par le formulaire.
        fields = [
            "name",
            "email",
            "subject",
            "message",
            "website",
        ]

    def validate_website(self, value):
        # Si le honeypot est rempli, c'est un bot : on refuse.
        if value:
            raise serializers.ValidationError("Envoi refusé.")
        return value

    def create(self, validated_data):
        # Le honeypot ne fait pas partie du modèle : on le retire avant de
        # créer le ContactMessage.
        validated_data.pop("website", None)
        return super().create(validated_data)


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

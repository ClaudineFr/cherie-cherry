from rest_framework import serializers

from .models import GalleryPhoto, Product, OpeningHours, InstagramStory, InstagramPost, MenuDrink, DrinkOfMonth, DrinkOfMonthSettings, Supplement, ContactMessage, SiteSettings, ProductImage, Order, LegalSettings

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

class LegalSettingsSerializer(serializers.ModelSerializer):
    """Les informations juridiques, pour les pages légales du front."""

    class Meta:
        model = LegalSettings
        fields = [
            "company_name",
            "legal_form",
            "share_capital",
            "siret",
            "vat_number",
            "publication_director",
            "host_name",
            "host_address",
            "host_contact",
            "dispatch_delay",
            "delivery_delay",
            "pickup_delay",
            "mediator",
            "data_retention",
            "terms_updated_at",
        ]


class CheckoutLineSerializer(serializers.Serializer):
    """Une ligne du panier telle que le navigateur l'envoie.

    Serializer « nu » (pas de ModelSerializer) : ça ne correspond à aucune
    table, c'est juste la forme attendue des données entrantes.

    On ne reçoit QUE l'identifiant du produit et la quantité. Surtout pas le
    prix : il sera relu en base. Un prix venant du navigateur est une donnée
    que n'importe qui peut modifier avant l'envoi.
    """

    product_id = serializers.IntegerField(min_value=1)
    quantity = serializers.IntegerField(min_value=1, max_value=99)


class CheckoutSerializer(serializers.Serializer):
    """Ce que le formulaire de commande envoie pour lancer le paiement."""

    email = serializers.EmailField()
    first_name = serializers.CharField(max_length=80)
    last_name = serializers.CharField(max_length=80)
    phone = serializers.CharField(max_length=30, required=False, allow_blank=True)

    delivery_method = serializers.ChoiceField(choices=Order.Delivery.choices)

    # Adresse : facultative ici, car inutile pour un retrait. La cohérence
    # est vérifiée dans validate() ci-dessous.
    address_line1 = serializers.CharField(max_length=200, required=False, allow_blank=True)
    address_line2 = serializers.CharField(max_length=200, required=False, allow_blank=True)
    postal_code = serializers.CharField(max_length=10, required=False, allow_blank=True)
    city = serializers.CharField(max_length=100, required=False, allow_blank=True)

    # allow_empty=False : on refuse un panier vide.
    items = CheckoutLineSerializer(many=True, allow_empty=False)

    def validate(self, data):
        """Vérifie la cohérence de l'ensemble, une fois chaque champ validé.

        validate() (sans suffixe) voit TOUS les champs à la fois, contrairement
        à validate_<champ> qui n'en voit qu'un. C'est ce qu'il faut ici, car la
        règle dépend de deux champs : l'adresse n'est exigée que si le mode
        de livraison est « à domicile ».
        """
        if data["delivery_method"] == Order.Delivery.HOME:
            manquants = [
                champ
                for champ in ("address_line1", "postal_code", "city")
                if not data.get(champ)
            ]
            if manquants:
                raise serializers.ValidationError(
                    {champ: "Ce champ est requis pour une livraison." for champ in manquants}
                )

        # Un même produit ne doit pas apparaître deux fois : sinon le stock
        # serait vérifié ligne par ligne, et deux lignes de 3 passeraient
        # alors qu'il ne reste que 5 exemplaires.
        ids = [ligne["product_id"] for ligne in data["items"]]
        if len(ids) != len(set(ids)):
            raise serializers.ValidationError(
                {"items": "Un même produit ne peut pas figurer sur deux lignes."}
            )

        return data

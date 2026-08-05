from django.contrib import admin
from django.utils.html import format_html

from .models import GalleryPhoto, OpeningHours, Product, InstagramStory, InstagramPost, MenuDrink, DrinkOfMonth, DrinkOfMonthSettings, Supplement, ContactMessage, SiteSettings


class ImagePreviewMixin:
    """Ajoute un aperçu de l'image (miniature) dans l'admin.

    Les modèles à image (galerie, stories, posts, produits) ont tous un champ
    ``image``. Plutôt que de recopier la même méthode dans chaque classe admin,
    on la factorise ici : il suffit de faire hériter la classe admin de ce
    mixin, puis d'ajouter "thumbnail" à ``list_display`` (liste) et/ou à
    ``readonly_fields`` (formulaire).

    ``image_field`` : nom du champ image du modèle (par défaut "image"),
    surchargeable si un modèle nommait son champ autrement.
    """

    image_field = "image"

    @admin.display(description="aperçu")
    def thumbnail(self, obj):
        image = getattr(obj, self.image_field, None)
        # Pas d'image (champ optionnel non rempli) : on affiche un tiret discret
        # plutôt qu'une balise <img> cassée.
        if not image:
            return "—"
        # format_html échappe l'URL : pas d'injection possible via le nom de
        # fichier. object-fit: cover pour un cadrage propre quel que soit le ratio.
        return format_html(
            '<img src="{}" style="height:48px;width:48px;object-fit:cover;'
            'border-radius:8px;" alt="" />',
            image.url,
        )

    @admin.display(description="aperçu de l'image")
    def image_preview(self, obj):
        """Aperçu plus grand, pour le formulaire d'édition (readonly_fields)."""
        image = getattr(obj, self.image_field, None)
        if not image:
            return "Aucune image pour le moment."
        return format_html(
            '<img src="{}" style="max-height:220px;max-width:100%;'
            'border-radius:12px;" alt="" />',
            image.url,
        )

@admin.register(Product)
class ProductAdmin(ImagePreviewMixin, admin.ModelAdmin):
    # Colonnes affichées dans la liste des produits (miniature en tête).
    list_display = ["thumbnail", "name", "category", "price", "stock", "featured"]

    # Cases modifiables directement depuis la liste, sans ouvrir chaque produit.
    list_editable = ["price", "stock", "featured"]

    # Filtres dans la colonne de droite.
    list_filter = ["category", "featured"]

    # Barre de recherche (par nom).
    search_fields = ["name"]

    # Aperçu de l'image dans le formulaire (l'image reste éditable, l'aperçu
    # montre celle déjà enregistrée).
    readonly_fields = ["image_preview"]

@admin.register(GalleryPhoto)
class GalleryPhotoAdmin(ImagePreviewMixin, admin.ModelAdmin):
    list_display = ["thumbnail", "alt", "created_at"]
    readonly_fields = ["image_preview"]

@admin.register(OpeningHours)
class OpeningHoursAdmin(admin.ModelAdmin):
    # Colonnes affichées dans la liste des horaires.
    list_display = ["__str__", "opens_at", "closes_at", "closed"]

    # Cases modifiables directement depuis la liste, sans ouvrir chaque jour.
    list_editable = ["opens_at", "closes_at", "closed"]

@admin.register(InstagramStory)
class InstagramStoryAdmin(ImagePreviewMixin, admin.ModelAdmin):
    list_display = ["thumbnail", "handle", "order", "created_at"]

    # L'ordre modifiable directement dans la liste, sans ouvrir chaque story.
    list_editable = ["order"]

    readonly_fields = ["image_preview"]

@admin.register(InstagramPost)
class InstagramPostAdmin(ImagePreviewMixin, admin.ModelAdmin):
    list_display = ["thumbnail", "__str__", "order", "link", "created_at"]

    # L'ordre modifiable directement dans la liste.
    list_editable = ["order"]

    readonly_fields = ["image_preview"]

@admin.register(MenuDrink)
class MenuDrinkAdmin(admin.ModelAdmin):
    # Colonnes affichées dans la liste des boissons.
    list_display = ["name", "category", "price", "order", "available"]

    # Modifiables directement depuis la liste, sans ouvrir chaque boisson.
    list_editable = ["price", "order", "available"]

    # Filtre par catégorie dans la colonne de droite.
    list_filter = ["category", "available"]

    # Barre de recherche par nom.
    search_fields = ["name"]

@admin.register(DrinkOfMonth)
class DrinkOfMonthAdmin(admin.ModelAdmin):
    list_display = ["name", "price", "order", "active"]
    list_editable = ["price", "order", "active"]
    list_filter = ["active"]
    search_fields = ["name"]

@admin.register(DrinkOfMonthSettings)
class DrinkOfMonthSettingsAdmin(admin.ModelAdmin):
    list_display = ["__str__", "available_until"]

    # On autorise l'ajout SEULEMENT s'il n'y a pas déjà une ligne :
    # ces réglages sont uniques (un seul encart à régler).
    def has_add_permission(self, request):
        return not DrinkOfMonthSettings.objects.exists()

    # On empêche la suppression : la ligne de réglages doit toujours exister.
    def has_delete_permission(self, request, obj=None):
        return False

@admin.register(Supplement)
class SupplementAdmin(admin.ModelAdmin):
    list_display = ["label", "price", "order", "available"]
    list_editable = ["price", "order", "available"]
    list_filter = ["available"]
    search_fields = ["label"]

@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    # Les messages viennent des visiteurs (via le formulaire du site), pas de
    # la proprio. L'admin ne sert donc qu'à LES CONSULTER, en lecture seule.

    # Colonnes de la liste : d'un coup d'œil, qui a écrit, à propos de quoi,
    # quand, et si c'est déjà lu ou non.
    list_display = ["name", "subject", "email", "created_at", "is_read"]

    # "lu / non-lu" cochable directement dans la liste, sans ouvrir chaque
    # message : c'est le seul champ que la proprio a besoin de modifier.
    list_editable = ["is_read"]

    # Filtre lu / non-lu + par date dans la colonne de droite.
    list_filter = ["is_read", "created_at"]

    # Recherche par nom, email ou sujet.
    search_fields = ["name", "email", "subject"]

    # Tous les champs du message sont en lecture seule quand on l'ouvre :
    # on ne réécrit pas ce qu'un visiteur a envoyé.
    readonly_fields = ["name", "email", "subject", "message", "created_at"]

    # On empêche de créer un message à la main depuis l'admin : ils ne
    # doivent arriver que par le formulaire du site.
    def has_add_permission(self, request):
        return False


@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    # Regroupe les champs par thème dans le formulaire pour s'y retrouver.
    fieldsets = [
        ("Adresse", {"fields": ["street", "postal_code", "city"]}),
        ("Contact", {"fields": ["email", "phone"]}),
        ("Réseaux sociaux", {"fields": ["instagram_url", "tiktok_url"]}),
    ]

    # Singleton (comme DrinkOfMonthSettings) : on autorise l'ajout SEULEMENT
    # s'il n'existe pas déjà une ligne.
    def has_add_permission(self, request):
        return not SiteSettings.objects.exists()

    # Et on interdit la suppression : ces coordonnées doivent toujours exister.
    def has_delete_permission(self, request, obj=None):
        return False

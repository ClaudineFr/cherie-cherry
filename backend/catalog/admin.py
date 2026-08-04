from django.contrib import admin

from .models import GalleryPhoto, OpeningHours, Product, InstagramStory, InstagramPost, MenuDrink, DrinkOfMonth, DrinkOfMonthSettings, Supplement, ContactMessage

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    # Colonnes affichées dans la liste des produits.
    list_display = ["name", "category", "price", "stock", "featured"]

    # Cases modifiables directement depuis la liste, sans ouvrir chaque produit.
    list_editable = ["price", "stock", "featured"]

    # Filtres dans la colonne de droite.
    list_filter = ["category", "featured"]

    # Barre de recherche (par nom).
    search_fields = ["name"]

@admin.register(GalleryPhoto)
class GalleryPhotoAdmin(admin.ModelAdmin):
    list_display = ["alt", "created_at"]

@admin.register(OpeningHours)
class OpeningHoursAdmin(admin.ModelAdmin):
    # Colonnes affichées dans la liste des horaires.
    list_display = ["__str__", "opens_at", "closes_at", "closed"]

    # Cases modifiables directement depuis la liste, sans ouvrir chaque jour.
    list_editable = ["opens_at", "closes_at", "closed"]

@admin.register(InstagramStory)
class InstagramStoryAdmin(admin.ModelAdmin):
    list_display = ["handle", "order", "created_at"]

    # L'ordre modifiable directement dans la liste, sans ouvrir chaque story.
    list_editable = ["order"]

@admin.register(InstagramPost)
class InstagramPostAdmin(admin.ModelAdmin):
    list_display = ["__str__", "order", "link", "created_at"]

    # L'ordre modifiable directement dans la liste.
    list_editable = ["order"]

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

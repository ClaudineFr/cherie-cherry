from django.contrib import admin

from .models import GalleryPhoto, OpeningHours, Product



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

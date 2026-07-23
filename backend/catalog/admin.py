from django.contrib import admin

from .models import Product


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

from django.contrib import admin

from .models import Produit


@admin.register(Produit)
class ProduitAdmin(admin.ModelAdmin):
    # Colonnes affichées dans la liste des produits.
    list_display = ["nom", "categorie", "prix", "stock", "coup_de_coeur"]

    # Cases modifiables directement depuis la liste, sans ouvrir chaque produit.
    list_editable = ["prix", "stock", "coup_de_coeur"]

    # Filtres dans la colonne de droite.
    list_filter = ["categorie", "coup_de_coeur"]

    # Barre de recherche (par nom).
    search_fields = ["nom"]

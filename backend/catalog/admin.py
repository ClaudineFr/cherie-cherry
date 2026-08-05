from django.contrib import admin
from django.utils.safestring import mark_safe

from .models import GalleryPhoto, OpeningHours, Product, InstagramStory, InstagramPost, MenuDrink, DrinkOfMonth, DrinkOfMonthSettings, Supplement, ContactMessage, SiteSettings

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

    # Colonnes de la liste : le statut visuel en tête (pastille « Nouveau »),
    # puis qui a écrit, à propos de quoi, et quand.
    list_display = ["status", "name", "subject", "email", "created_at"]

    # Filtre lu / non-lu + par date dans la colonne de droite.
    list_filter = ["is_read", "created_at"]

    # Recherche par nom, email ou sujet.
    search_fields = ["name", "email", "subject"]

    # Tri par défaut : les non-lus d'abord (is_read=False remonte), puis les
    # plus récents en haut. La proprio voit tout de suite ce qui est nouveau.
    ordering = ["is_read", "-created_at"]

    # Navigation par date au-dessus de la liste.
    date_hierarchy = "created_at"

    # Actions groupées : cocher plusieurs messages puis les marquer d'un coup.
    actions = ["mark_as_read", "mark_as_unread"]

    # Tous les champs du message sont en lecture seule quand on l'ouvre :
    # on ne réécrit pas ce qu'un visiteur a envoyé.
    readonly_fields = ["name", "email", "subject", "message", "created_at"]

    @admin.display(description="statut", ordering="is_read")
    def status(self, obj):
        # Non lu : pastille rose vive « Nouveau » pour attirer l'œil.
        # Lu : mention discrète en gris. Le HTML est 100 % statique (aucune
        # donnée utilisateur interpolée) : mark_safe suffit et est sûr ici.
        if obj.is_read:
            return mark_safe('<span style="color:#999;">Lu</span>')
        return mark_safe(
            '<span style="display:inline-block;padding:2px 10px;border-radius:999px;'
            'background:#d9709c;color:#fff;font-weight:600;font-size:0.75rem;">'
            '● Nouveau</span>'
        )

    @admin.display(description="Marquer comme lu")
    def mark_as_read(self, request, queryset):
        updated = queryset.update(is_read=True)
        self.message_user(request, f"{updated} message(s) marqué(s) comme lu(s).")

    @admin.display(description="Marquer comme non lu")
    def mark_as_unread(self, request, queryset):
        updated = queryset.update(is_read=False)
        self.message_user(request, f"{updated} message(s) marqué(s) comme non lu(s).")

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

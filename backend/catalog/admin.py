from django.contrib import admin
from django.shortcuts import redirect
from django.urls import reverse
from django.utils.html import format_html
from django.utils.safestring import mark_safe

from . import emails
from .models import GalleryPhoto, OpeningHours, Product, InstagramStory, InstagramPost, MenuDrink, DrinkOfMonth, DrinkOfMonthSettings, Supplement, ContactMessage, SiteSettings, ProductImage, Order, OrderItem, LegalSettings, AboutPage, AboutValue, ShippingSettings


class SingletonAdminMixin:
    """Édition directe d'un modèle « singleton » (une seule ligne).

    Pour SiteSettings et DrinkOfMonthSettings, la cliente n'a pas à voir une
    liste d'un seul élément : cliquer sur la rubrique doit l'amener droit au
    formulaire d'édition. On intercepte donc la vue liste (``changelist_view``)
    et on redirige vers le formulaire de l'unique ligne, en la créant si elle
    n'existe pas encore.

    ``has_add_permission`` / ``has_delete_permission`` restent gérés par chaque
    classe (ajout interdit s'il existe déjà une ligne, suppression interdite).
    """

    def changelist_view(self, request, extra_context=None):
        # get_or_create sur pk=None ? Non : on prend la 1re ligne, ou on en
        # crée une vierge. Les champs sont tous optionnels/à défaut, donc une
        # ligne « vide » est valide et sera remplie par la cliente.
        obj = self.model.objects.first()
        if obj is None:
            obj = self.model.objects.create()
        # Nom d'URL de la page de modification : admin:<app>_<model>_change.
        url = reverse(
            f"admin:{self.model._meta.app_label}_{self.model._meta.model_name}_change",
            args=[obj.pk],
        )
        return redirect(url)


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

class ProductImageInline(admin.TabularInline):
    """Les photos éditées directement dans la fiche du produit.

    « Inline » = un modèle lié qu'on édite depuis le formulaire du parent,
    au lieu d'une rubrique séparée dans le menu. Pour la cliente c'est bien
    plus naturel : elle ouvre un produit et gère ses photos au même endroit.
    """

    model = ProductImage
    # TabularInline = une ligne par photo (compact). L'autre option,
    # StackedInline, empile un formulaire complet par photo (plus aéré,
    # mais vite très long dès qu'il y a plusieurs images).

    # Nombre de formulaires vides proposés pour ajouter de nouvelles photos.
    extra = 1

    fields = ["image", "alt", "order"]

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

    # Les photos supplémentaires s'éditent dans la fiche du produit.
    inlines = [ProductImageInline]

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
class DrinkOfMonthSettingsAdmin(SingletonAdminMixin, admin.ModelAdmin):
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
class SiteSettingsAdmin(SingletonAdminMixin, admin.ModelAdmin):
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


# --- Tableau de bord de l'accueil ---------------------------------------
#
# La home de l'admin (template admin/index.html) est plutôt vide. On y ajoute
# une carte « Messages » avec le nombre de messages non lus et un aperçu des
# derniers. Django ne passe pas ces données au template par défaut : on
# enveloppe donc la vue index du site admin pour enrichir son contexte.
#
# On ne touche QUE l'accueil : les autres pages admin passent par d'autres
# vues et ne sont pas affectées.
_default_admin_index = admin.site.index


def _dashboard_index(request, extra_context=None):
    extra_context = extra_context or {}

    # Titre (h1) de la home : « Page d'accueil » au lieu de « Site administration ».
    extra_context["title"] = "Page d'accueil"

    unread = ContactMessage.objects.filter(is_read=False)
    extra_context["cc_unread_count"] = unread.count()
    # Aperçu : les 3 messages non lus les plus récents.
    extra_context["cc_unread_preview"] = unread.order_by("-created_at")[:3]

    # Rangée de stats : quelques chiffres du site en un coup d'œil.
    extra_context["cc_products_count"] = Product.objects.count()
    # Produits en rupture (stock à 0) : à réapprovisionner, donc actionnable.
    extra_context["cc_products_out_of_stock"] = Product.objects.filter(stock=0).count()
    # Boissons actuellement proposées au menu.
    extra_context["cc_drinks_count"] = MenuDrink.objects.filter(available=True).count()
    extra_context["cc_gallery_count"] = GalleryPhoto.objects.count()

    # Commandes payées mais pas encore expédiées ni retirées : c'est ce qui
    # demande une action de la propriétaire, donc ce qu'elle doit voir en
    # premier. Les commandes « en attente » n'y figurent pas : leur paiement
    # n'a pas abouti, il n'y a rien à préparer.
    extra_context["cc_orders_to_handle"] = Order.objects.filter(
        status=Order.Status.PAID
    ).count()

    return _default_admin_index(request, extra_context)


admin.site.index = _dashboard_index

class OrderItemInline(admin.TabularInline):
    """Les articles de la commande, affichés dans la fiche commande."""

    model = OrderItem
    extra = 0

    # Une commande payée est un document comptable : on la consulte, on ne
    # la réécrit pas. Tout est donc en lecture seule.
    readonly_fields = ["product", "product_name", "unit_price", "quantity", "line_total"]
    can_delete = False

    @admin.display(description="total")
    def line_total(self, obj):
        return f"{obj.total} €"

    def has_add_permission(self, request, obj=None):
        return False


class ATraiterFilter(admin.SimpleListFilter):
    """« Ce qui m'attend » : les commandes payées qui n'ont pas encore bougé.

    Le filtre par statut existe déjà, mais il oblige à savoir lequel chercher.
    Ici la question est plus simple — qu'est-ce que je dois préparer
    aujourd'hui ? Les commandes en attente de paiement n'en font pas partie :
    rien n'a été réglé, il n'y a rien à emballer.
    """

    title = "à traiter"
    parameter_name = "a_traiter"

    def lookups(self, request, model_admin):
        return [("1", "Commandes à préparer")]

    def queryset(self, request, queryset):
        if self.value() == "1":
            return queryset.filter(status=Order.Status.PAID)
        return queryset


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = [
        "__str__",
        "created_at",
        "status",
        "delivery_method",
        "total_display",
        "email",
    ]

    # La cliente change surtout le statut : autant le faire depuis la liste.
    list_editable = ["status"]

    list_filter = [ATraiterFilter, "status", "delivery_method", "created_at"]

    search_fields = [
        "last_name",
        "first_name",
        "email",
        "stripe_session_id",
        "tracking_number",
    ]

    date_hierarchy = "created_at"

    inlines = [OrderItemInline]

    # Ce que le client a saisi et ce que Stripe a répondu ne se modifient
    # pas à la main : ce sont des faits, pas des réglages. Seuls le statut
    # et la note interne restent modifiables.
    readonly_fields = [
        "email", "first_name", "last_name", "phone",
        "delivery_method", "address_line1", "address_line2",
        "postal_code", "city", "shipping_fee",
        "relay_id", "relay_name", "relay_address",
        "relay_postal_code", "relay_city",
        "stripe_session_id", "created_at", "updated_at",
        "total_display", "relay_display", "destinataire_display",
    ]

    def get_fieldsets(self, request, obj=None):
        """Ne montre que les champs qui concernent le mode de livraison.

        Une commande en point relais affichait quatre lignes d'adresse vides,
        et une commande en retrait six. Des tirets alignés ne disent rien
        d'utile : ils font surtout douter qu'une information manque.
        """
        fieldsets = super().get_fieldsets(request, obj)
        if obj is None:
            return fieldsets

        inutiles = set()
        if obj.delivery_method != Order.Delivery.HOME:
            inutiles |= {"address_line1", "address_line2", "postal_code", "city"}
        if obj.delivery_method != Order.Delivery.RELAY:
            inutiles.add("relay_display")
        if obj.delivery_method == Order.Delivery.PICKUP:
            # Rien à expédier : ni frais, ni adresse à recopier.
            inutiles |= {"shipping_fee", "destinataire_display"}

        return [
            (
                titre,
                {
                    **options,
                    "fields": [
                        champ
                        for champ in options["fields"]
                        if champ not in inutiles
                    ],
                },
            )
            for titre, options in fieldsets
        ]

    @admin.display(description="à recopier chez Mondial Relay")
    def destinataire_display(self, obj):
        """L'adresse du destinataire, prête à recopier sur l'étiquette.

        Elle crée ses étiquettes à la main : sans ce bloc, il faut piocher
        dans cinq champs éparpillés et retaper — c'est là que se glissent les
        fautes qui font revenir un colis.

        Pour un point relais, le destinataire reste le CLIENT : c'est son nom
        qui va sur l'étiquette, le relais n'étant que le lieu de retrait,
        désigné par son numéro.
        """
        if obj.delivery_method == Order.Delivery.PICKUP:
            return "—"

        lignes = [f"{obj.first_name} {obj.last_name}".strip()]

        if obj.delivery_method == Order.Delivery.RELAY:
            if obj.relay_id:
                lignes.append(f"Point relais n° {obj.relay_id}")
            lignes += [
                p
                for p in (
                    obj.relay_name,
                    obj.relay_address,
                    " ".join(
                        x for x in (obj.relay_postal_code, obj.relay_city) if x
                    ),
                )
                if p
            ]
        else:
            lignes += [
                p
                for p in (
                    obj.address_line1,
                    obj.address_line2,
                    " ".join(x for x in (obj.postal_code, obj.city) if x),
                )
                if p
            ]

        if obj.phone:
            lignes.append(f"Tél. {obj.phone}")
        lignes.append(obj.email)

        # <pre> : le texte garde ses retours à la ligne, donc un copier-coller
        # arrive chez Mondial Relay dans la même forme qu'à l'écran.
        return format_html(
            '<pre style="margin:0;font:inherit;white-space:pre-wrap;'
            'user-select:all;cursor:text">{}</pre>',
            "\n".join(lignes),
        )

    @admin.display(description="point relais")
    def relay_display(self, obj):
        """Le point relais en une ligne, plutôt que cinq champs à lire.

        Une commande sur deux n'en a pas (retrait, domicile) : afficher les
        cinq champs bruts remplirait la fiche de vides. Le tiret dit « pas
        de relais » sans laisser douter d'une information manquante.
        """
        if not obj.relay_id:
            return "—"
        lignes = [obj.relay_name, obj.relay_address]
        ville = " ".join(p for p in (obj.relay_postal_code, obj.relay_city) if p)
        if ville:
            lignes.append(ville)
        return f"{' · '.join(p for p in lignes if p)} (n° {obj.relay_id})"

    # Regroupement du formulaire, pour que la cliente s'y retrouve.
    fieldsets = [
        ("Suivi", {"fields": ["status", "tracking_number", "notes"]}),
        ("Client", {"fields": ["first_name", "last_name", "email", "phone"]}),
        (
            "Livraison",
            {
                "fields": [
                    "delivery_method",
                    "address_line1",
                    "address_line2",
                    "postal_code",
                    "city",
                    "relay_display",
                    "shipping_fee",
                    "destinataire_display",
                ]
            },
        ),
        ("Paiement", {"fields": ["total_display", "stripe_session_id"]}),
        ("Dates", {"fields": ["created_at", "updated_at"]}),
    ]

    @admin.display(description="total")
    def total_display(self, obj):
        return f"{obj.total} €"

    # Les commandes viennent des clients, pas de l'admin : on n'en crée pas
    # à la main.
    def has_add_permission(self, request):
        return False

    def save_model(self, request, obj, form, change):
        """Prévient le client quand sa commande passe à « prête à retirer ».

        On lit l'ancien statut AVANT d'enregistrer : sans ça, impossible de
        distinguer un passage à « prête » d'un simple enregistrement d'une
        commande déjà prête — et le client recevrait le même email à chaque
        fois que la propriétaire ouvre puis sauvegarde la fiche.
        """
        ancien_statut = None
        if change and obj.pk:
            ancien_statut = (
                Order.objects.filter(pk=obj.pk)
                .values_list("status", flat=True)
                .first()
            )

        super().save_model(request, obj, form, change)

        # Réservé au retrait en boutique : cet email dit « venez la retirer
        # aux horaires d'ouverture », ce qui est faux pour un colis expédié.
        # « Prête à retirer » sur une commande en livraison est une erreur de
        # saisie — on ne prévient pas le client sur cette base.
        vient_de_passer_a_prete = (
            obj.status == Order.Status.READY
            and ancien_statut != Order.Status.READY
            and obj.delivery_method == Order.Delivery.PICKUP
        )
        # Le pendant pour les commandes livrées. Sans lui, elle marque la
        # commande « expédiée » et le client n'apprend rien.
        vient_de_passer_a_expediee = (
            obj.status == Order.Status.SHIPPED
            and ancien_statut != Order.Status.SHIPPED
            and obj.delivery_method != Order.Delivery.PICKUP
        )

        if vient_de_passer_a_prete or vient_de_passer_a_expediee:
            envoye = (
                emails.commande_prete(obj)
                if vient_de_passer_a_prete
                else emails.commande_expediee(obj)
            )
            if envoye:
                self.message_user(
                    request, f"{obj.first_name} a été prévenu(e) par email."
                )
            else:
                # Envoi raté : on le dit, plutôt que de laisser la
                # propriétaire croire que son client est au courant.
                self.message_user(
                    request,
                    "L'email n'a pas pu être envoyé — prévenez le client "
                    "autrement.",
                    level="warning",
                )


@admin.register(LegalSettings)
class LegalSettingsAdmin(SingletonAdminMixin, admin.ModelAdmin):
    """Les informations juridiques, éditées en une seule page.

    Singleton comme SiteSettings : cliquer sur la rubrique ouvre directement le
    formulaire, sans passer par une liste d'un seul élément.
    """

    fieldsets = [
        (
            "Votre entreprise",
            {
                "fields": [
                    "company_name",
                    "legal_form",
                    "share_capital",
                    "siret",
                    "vat_number",
                    "publication_director",
                ],
                "description": "Ces informations apparaissent dans les "
                "mentions légales et les conditions de vente.",
            },
        ),
        (
            "Hébergeur du site",
            {
                "fields": ["host_name", "host_address", "host_contact"],
                "description": "La loi impose d'indiquer qui héberge le "
                "site. Demandez ces informations à votre développeuse.",
            },
        ),
        (
            "Vente en ligne",
            {
                "fields": [
                    "dispatch_delay",
                    "delivery_delay",
                    "pickup_delay",
                    "mediator",
                    "data_retention",
                    "terms_updated_at",
                ],
                "description": "Les délais annoncés à vos clients, et "
                "l'organisme de médiation auquel vous adhérez.",
            },
        ),
    ]

    def has_add_permission(self, request):
        return not LegalSettings.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False


class AboutValueInline(admin.TabularInline):
    """Les valeurs, éditées depuis la page À propos elle-même."""

    model = AboutValue
    extra = 1
    fields = ["icon", "title", "text", "order", "visible"]


@admin.register(AboutPage)
class AboutPageAdmin(SingletonAdminMixin, admin.ModelAdmin):
    """Le contenu de la page « À propos », en un seul formulaire."""

    inlines = [AboutValueInline]

    fieldsets = [
        (
            "Votre histoire",
            {
                "fields": ["intro", "story", "closing"],
                "description": "Le texte de la page « À propos ». Dans "
                "« votre histoire », laissez une ligne vide entre deux "
                "paragraphes.",
            },
        ),
    ]

    def has_add_permission(self, request):
        return not AboutPage.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(ShippingSettings)
class ShippingSettingsAdmin(SingletonAdminMixin, admin.ModelAdmin):
    """Les tarifs d'expédition, sur leur propre page."""

    fieldsets = [
        (
            "Tarifs d'expédition",
            {
                "fields": ["shipping_fee", "free_shipping_from"],
                "description": "Ce que vous facturez pour envoyer un colis. "
                "Ces montants s'appliquent aux nouvelles commandes ; les "
                "commandes déjà passées gardent le tarif qui était en vigueur.",
            },
        ),
    ]

    def has_add_permission(self, request):
        return not ShippingSettings.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False

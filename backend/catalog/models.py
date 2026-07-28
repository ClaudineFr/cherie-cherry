from django.db import models


class Product(models.Model):
    """Un article vendu dans le concept store.

    Chaque instance de cette classe = une ligne dans la table de la base.
    Chaque attribut ci-dessous = une colonne.
    """

    # Les catégories possibles. Format : (valeur_en_base, libellé_affiché).
    # On reprend les mêmes catégories que le front (products.ts).
    class Category(models.TextChoices):
        JEWELRY = "jewelry", "Bijoux"
        STATIONERY = "stationery", "Papeterie"
        BAGS = "bags", "Sacs"
        CLOTHING = "clothing", "Vêtements"

    name = models.CharField("nom", max_length=120)

    category = models.CharField(
        "catégorie",
        max_length=20,
        choices=Category.choices,
    )

    description = models.TextField("description", blank=True)

    # DecimalField = idéal pour de l'argent (pas d'erreur d'arrondi).
    # max_digits = nombre total de chiffres, decimal_places = chiffres après la virgule.
    price = models.DecimalField("prix (€)", max_digits=7, decimal_places=2)

    stock = models.PositiveIntegerField("stock", default=0)

    featured = models.BooleanField("coup de cœur", default=False)

     # Image du produit. upload_to = sous-dossier dans MEDIA_ROOT où ranger le fichier.
    # blank=True + null=True = le produit peut ne pas avoir d'image (optionnel).
    image = models.ImageField(
        "image",
        upload_to="products/",
        blank=True,
        null=True,
    )

    # Rempli automatiquement à la création / modification.
    created_at = models.DateTimeField("créé le", auto_now_add=True)
    updated_at = models.DateTimeField("modifié le", auto_now=True)

    class Meta:
        verbose_name = "produit"
        verbose_name_plural = "produits"
        ordering = ["category", "name"]

    def __str__(self):
        # Ce que Django affichera pour représenter un produit (ex. dans l'admin).
        return self.name



class GalleryPhoto(models.Model):
    """Une photo d'ambiance affichée dans la galerie de la page d'accueil.

    La proprio ajoute/supprime ces photos depuis l'admin.
    """

    image = models.ImageField(
        "image",
        upload_to="gallery/",
    )

    # Texte alternatif : décrit la photo pour l'accessibilité (lecteurs d'écran)
    # et s'affiche si l'image ne charge pas.
    alt = models.CharField("texte alternatif", max_length=200)

    created_at = models.DateTimeField("créé le", auto_now_add=True)

    class Meta:
        verbose_name = "photo de galerie"
        verbose_name_plural = "photos de galerie"
        ordering = ["-created_at"]

    def __str__(self):
        return self.alt

class OpeningHours(models.Model):
    """Les horaires d'ouverture pour un jour de la semaine.

    Une ligne = un jour. La proprio modifie ça depuis l'admin.
    """

    # Les jours de la semaine. La valeur en base est un numéro (0 = lundi)
    # pour que le tri se fasse dans le bon ordre. Le libellé, lui, est affiché.
    class Day(models.IntegerChoices):
        MONDAY = 0, "Lundi"
        TUESDAY = 1, "Mardi"
        WEDNESDAY = 2, "Mercredi"
        THURSDAY = 3, "Jeudi"
        FRIDAY = 4, "Vendredi"
        SATURDAY = 5, "Samedi"
        SUNDAY = 6, "Dimanche"

    # unique=True : on ne veut qu'UNE seule ligne par jour.
    day = models.IntegerField("jour", choices=Day.choices, unique=True)

    # TimeField = une heure seule (sans date). null=True car un jour fermé
    # n'a pas d'horaire.
    opens_at = models.TimeField("ouverture", null=True, blank=True)
    closes_at = models.TimeField("fermeture", null=True, blank=True)

    closed = models.BooleanField("fermé", default=False)

    class Meta:
        verbose_name = "horaire d'ouverture"
        verbose_name_plural = "horaires d'ouverture"
        ordering = ["day"]

    def __str__(self):
        # get_day_display() : Django génère ça tout seul à partir des choices.
        # Il renvoie le libellé ("Lundi") plutôt que le numéro (0).
        return self.get_day_display()

class InstagramStory(models.Model):
    """Une « story » Instagram mise en avant sur la page d'accueil.

    Ce ne sont pas de vraies stories Instagram (via l'API Meta), mais des
    photos que la proprio choisit et upload elle-même depuis l'admin, affichées
    en ronds façon stories. Chaque rond renvoie vers un lien Instagram.
    """

    image = models.ImageField(
        "image",
        upload_to="stories/",
    )

    # Le @ affiché sous le rond (ex. "@carla_psu") ou un titre court.
    handle = models.CharField("légende / @handle", max_length=100)


    # Pour ranger les ronds dans l'ordre voulu : plus le nombre est petit,
    # plus le rond apparaît tôt. La proprio ajuste ça depuis l'admin.
    order = models.PositiveIntegerField("ordre d'affichage", default=0)

    created_at = models.DateTimeField("créé le", auto_now_add=True)

    class Meta:
        verbose_name = "story Instagram"
        verbose_name_plural = "stories Instagram"
        # On trie d'abord par ordre, puis par date de création (plus récent
        # d'abord) pour départager deux stories de même ordre.
        ordering = ["order", "-created_at"]

    def __str__(self):
        return self.handle

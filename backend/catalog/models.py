from django.core.exceptions import ValidationError
from django.core.validators import MinValueValidator
from django.db import models
from django.utils.text import slugify



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

    # L'identifiant du produit dans l'URL : /concept-store/collier-dore-fin
    # Rempli automatiquement à partir du nom (voir save() plus bas), donc la
    # unique = deux produits ne peuvent pas se partager la même URL.
    slug = models.SlugField(
        "identifiant URL",
        max_length=140,
        unique=True,
        blank=True,
    )


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

    def save(self, *args, **kwargs):
        """Fabrique le slug à partir du nom si la cliente n'en a pas mis.

        slugify("Collier doré fin") donne "collier-dore-fin" : minuscules,
        accents retirés, espaces en tirets.

        Le suffixe numérique gère le cas de deux produits homonymes : sans
        lui, le second enregistrement planterait sur la contrainte unique.
        """
        if not self.slug:
            base = slugify(self.name)
            candidate = base
            counter = 2
            # exclude(pk=...) : en modification, on ne se compare pas à soi-même.
            while (
                Product.objects.filter(slug=candidate)
                .exclude(pk=self.pk)
                .exists()
            ):
                candidate = f"{base}-{counter}"
                counter += 1
            self.slug = candidate
        super().save(*args, **kwargs)

class ProductImage(models.Model):
    """Une photo supplémentaire pour un produit.

    Le champ `image` de Product reste la photo principale (celle de la
    grille). Ce modèle-ci permet d'en ajouter d'autres, affichées en galerie
    sur la fiche produit. La cliente les gère depuis la fiche du produit
    dans l'admin, sans passer par une rubrique séparée.
    """

    # ForeignKey = le lien vers le produit. C'est ce qui fait qu'un produit
    # peut avoir PLUSIEURS photos (relation « un à plusieurs »).
    #
    # on_delete=CASCADE : si le produit est supprimé, ses photos le sont
    # aussi. Sans ça on garderait des photos orphelines pointant dans le vide.
    #
    # related_name="images" : le nom du chemin inverse. Il permet d'écrire
    # `mon_produit.images.all()` pour récupérer les photos d'un produit.
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name="images",
        verbose_name="produit",
    )

    image = models.ImageField("image", upload_to="products/")

    alt = models.CharField(
        "texte alternatif",
        max_length=200,
        blank=True,
        help_text="Décrit la photo pour les lecteurs d'écran. "
        "Si vide, le nom du produit est utilisé.",
    )

    order = models.PositiveIntegerField(
        "ordre d'affichage", default=1, validators=[MinValueValidator(1)]
    )

    class Meta:
        verbose_name = "photo du produit"
        verbose_name_plural = "photos du produit"
        ordering = ["order", "id"]

    def __str__(self):
        return self.alt or f"Photo de {self.product.name}"




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

    def clean(self):
        """Cohérence des horaires, vérifiée avant l'enregistrement (admin).

        Trois règles :
        1. Jour fermé : on vide les heures automatiquement (elles n'ont pas de
           sens, et le front les masque de toute façon).
        2. Jour ouvert : les deux heures sont obligatoires.
        3. Jour ouvert : ouverture et fermeture ne peuvent pas être identiques
           (durée nulle). On n'impose PAS fermeture > ouverture : un créneau qui
           passe minuit (ex. 22h–02h) reste valable.
        """
        if self.closed:
            # Nettoyage silencieux : un jour fermé n'a pas d'horaires.
            self.opens_at = None
            self.closes_at = None
            return

        # À partir d'ici, le jour est ouvert.
        if self.opens_at is None or self.closes_at is None:
            raise ValidationError(
                "Pour un jour ouvert, renseignez l'heure d'ouverture ET de "
                "fermeture, ou cochez « fermé »."
            )

        if self.opens_at == self.closes_at:
            raise ValidationError(
                "L'heure d'ouverture et de fermeture ne peuvent pas être "
                "identiques."
            )

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
    order = models.PositiveIntegerField(
        "ordre d'affichage", default=1, validators=[MinValueValidator(1)]
    )

    created_at = models.DateTimeField("créé le", auto_now_add=True)

    class Meta:
        verbose_name = "story Instagram"
        verbose_name_plural = "stories Instagram"
        # On trie d'abord par ordre, puis par date de création (plus récent
        # d'abord) pour départager deux stories de même ordre.
        ordering = ["order", "-created_at"]

    def __str__(self):
        return self.handle

class InstagramPost(models.Model):
    """Une publication Instagram de la marque, affichée dans le feed de la home.

    Ce n'est PAS un vrai feed Instagram live (pas d'API Meta) : ce sont des
    posts que le client réplique à la main depuis l'admin. Chaque vignette
    renvoie vers la vraie publication Instagram.
    """

    image = models.ImageField(
        "image",
        upload_to="posts/",
    )

    # Légende courte affichée sous / sur la vignette (optionnelle).
    caption = models.CharField("légende", max_length=200, blank=True)

    # Le lien vers la vraie publication Instagram. C'est là que pointe le clic.
    link = models.URLField("lien vers le post")

    # Pour ranger les posts dans l'ordre voulu (plus petit = affiché en premier).
    order = models.PositiveIntegerField(
        "ordre d'affichage", default=1, validators=[MinValueValidator(1)]
    )

    created_at = models.DateTimeField("créé le", auto_now_add=True)

    class Meta:
        verbose_name = "post Instagram"
        verbose_name_plural = "posts Instagram"
        ordering = ["order", "-created_at"]

    def __str__(self):
        # La légende si elle existe, sinon un repère avec l'id.
        return self.caption or f"Post #{self.pk}"


class MenuDrink(models.Model):
    """Une boisson de la carte permanente du coffee shop.

    La proprio ajoute / modifie / retire ces boissons depuis l'admin.
    """

    class Category(models.TextChoices):
        COFFEE = "coffee", "Coffee"
        MATCHA = "matcha", "Matcha & more"

    name = models.CharField("nom", max_length=120)

    description = models.CharField("description", max_length=200, blank=True)

    # DecimalField. Le « € » sera
    # ajouté côté front à l'affichage.
    price = models.DecimalField("prix (€)", max_digits=7, decimal_places=2)

    category = models.CharField(
        "catégorie",
        max_length=20,
        choices=Category.choices,
    )

    order = models.PositiveIntegerField(
        "ordre d'affichage", default=1, validators=[MinValueValidator(1)]
    )

    # Décocher pour masquer une boisson sans la supprimer (rupture, saison...).
    available = models.BooleanField("affichée sur le site", default=True)

    class Meta:
        verbose_name = "boisson du menu"
        verbose_name_plural = "boissons du menu"
        ordering = ["category", "order"]

    def __str__(self):
        return self.name

class DrinkOfMonth(models.Model):
    """Une « boisson du mois » : une création éphémère mise en avant.

    Séparée du menu permanent (MenuDrink). La proprio les gère depuis l'admin.
    """

    name = models.CharField("nom", max_length=120)

    description = models.CharField("description", max_length=200, blank=True)

    price = models.DecimalField("prix (€)", max_digits=7, decimal_places=2)

    # Pour ranger les boissons du mois dans l'ordre voulu (comme les stories).
    order = models.PositiveIntegerField(
        "ordre d'affichage", default=1, validators=[MinValueValidator(1)]
    )

    # Décocher pour la retirer du site sans la supprimer.
    active = models.BooleanField("affichée sur le site", default=True)

    created_at = models.DateTimeField("créé le", auto_now_add=True)

    class Meta:
        verbose_name = "boisson du mois"
        verbose_name_plural = "boissons du mois"
        ordering = ["order", "-created_at"]

    def __str__(self):
        return self.name


class DrinkOfMonthSettings(models.Model):
    """Réglages de l'encart « boissons du mois ».

    On ne garde qu'UNE seule ligne : c'est un réglage global de l'encart,
    pas une donnée par boisson. La cliente y choisit la date de fin.
    """

    # Date jusqu'à laquelle les boissons du mois sont proposées.
    # null/blank = optionnel : si vide, aucune phrase « durée limitée ».
    available_until = models.DateField(
        "disponibles jusqu'au",
        null=True,
        blank=True,
    )

    class Meta:
        # Libellé orienté « métier » : c'est la phrase « durée limitée » affichée
        # sous les boissons du mois, pas un réglage technique.
        verbose_name = "note « durée limitée »"
        verbose_name_plural = "note « durée limitée »"

    def __str__(self):
        return "Réglages des boissons du mois"


class Supplement(models.Model):
    """Un supplément proposé sur les boissons (lait végétal, sirop...).

    Affiché dans l'encart « Suppléments » de la page coffee shop. La proprio
    modifie le libellé et le prix depuis l'admin.
    """

    # Le libellé complet du supplément, ex. "Lait : avoine, amande, sans lactose".
    label = models.CharField("libellé", max_length=200)

    # Le prix du supplément (le « + » et le « € » sont ajoutés à l'affichage).
    price = models.DecimalField("prix (€)", max_digits=7, decimal_places=2)

    # Pour ranger les suppléments dans l'ordre voulu (comme le menu).
    order = models.PositiveIntegerField(
        "ordre d'affichage", default=1, validators=[MinValueValidator(1)]
    )

    # Décocher pour masquer un supplément sans le supprimer.
    available = models.BooleanField("affiché sur le site", default=True)

    class Meta:
        verbose_name = "supplément"
        verbose_name_plural = "suppléments"
        ordering = ["order"]

    def __str__(self):
        return self.label


class ContactMessage(models.Model):
    """Un message envoyé via le formulaire de contact du site.

    Chaque envoi du formulaire crée une ligne ici. La proprio les lit depuis
    l'admin (elle ne les crée pas : ils viennent des visiteurs). Le formulaire
    poste sur l'API, qui enregistre le message.
    """

    name = models.CharField("nom", max_length=120)
    email = models.EmailField("email")
    subject = models.CharField("sujet", max_length=200)
    message = models.TextField("message")

    # Passe à True quand la proprio a lu / traité le message, pour distinguer
    # d'un coup d'œil ce qui est nouveau.
    is_read = models.BooleanField("lu", default=False)

    created_at = models.DateTimeField("reçu le", auto_now_add=True)

    class Meta:
        verbose_name = "message de contact"
        verbose_name_plural = "messages de contact"
        # Les plus récents en haut de la liste.
        ordering = ["-created_at"]

    def __str__(self):
        # Repère lisible dans l'admin : qui + sujet.
        return f"{self.name} — {self.subject}"


class SiteSettings(models.Model):
    """Les coordonnées et liens de la boutique, affichés un peu partout.

    Comme DrinkOfMonthSettings, c'est un SINGLETON : on ne garde qu'UNE
    seule ligne. Ce sont des réglages globaux du site (pas une liste), que
    la proprio modifie depuis l'admin. Ça remplace les infos aujourd'hui
    codées en dur dans le footer, la page contact, etc.
    """

    # --- Adresse (découpée pour un affichage souple) ---
    street = models.CharField("rue", max_length=200, blank=True)
    postal_code = models.CharField("code postal", max_length=10, blank=True)
    city = models.CharField("ville", max_length=100, blank=True)

    # --- Contact ---
    email = models.EmailField("email", blank=True)
    phone = models.CharField("téléphone", max_length=30, blank=True)

    # --- Réseaux sociaux (URL complète du profil) ---
    instagram_url = models.URLField("lien Instagram", blank=True)
    tiktok_url = models.URLField("lien TikTok", blank=True)

    class Meta:
        verbose_name = "coordonnées du site"
        verbose_name_plural = "coordonnées du site"

    def __str__(self):
        return "Coordonnées du site"

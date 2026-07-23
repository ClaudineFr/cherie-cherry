from django.db import models


class Produit(models.Model):
    """Un article vendu dans le concept store.

    Chaque instance de cette classe = une ligne dans la table de la base.
    Chaque attribut ci-dessous = une colonne.
    """

    # Les catégories possibles. Format : (valeur_en_base, libellé_affiché).
    # On reprend les mêmes catégories que le front (products.ts).
    class Categorie(models.TextChoices):
        BIJOUX = "bijoux", "Bijoux"
        PAPETERIE = "papeterie", "Papeterie"
        SACS = "sacs", "Sacs"
        VETEMENTS = "vetements", "Vêtements"

    nom = models.CharField("nom", max_length=120)

    categorie = models.CharField(
        "catégorie",
        max_length=20,
        choices=Categorie.choices,
    )

    description = models.TextField("description", blank=True)

    # DecimalField = idéal pour de l'argent (pas d'erreur d'arrondi).
    # max_digits = nombre total de chiffres, decimal_places = chiffres après la virgule.
    prix = models.DecimalField("prix (€)", max_digits=7, decimal_places=2)

    stock = models.PositiveIntegerField("stock", default=0)

    coup_de_coeur = models.BooleanField("coup de cœur", default=False)

    # Rempli automatiquement à la création / modification.
    cree_le = models.DateTimeField("créé le", auto_now_add=True)
    modifie_le = models.DateTimeField("modifié le", auto_now=True)

    class Meta:
        verbose_name = "produit"
        verbose_name_plural = "produits"
        ordering = ["categorie", "nom"]

    def __str__(self):
        # Ce que Django affichera pour représenter un produit (ex. dans l'admin).
        return self.nom

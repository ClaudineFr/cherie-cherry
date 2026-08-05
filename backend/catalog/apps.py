from django.apps import AppConfig


class CatalogConfig(AppConfig):
    name = 'catalog'
    # Nom affiché dans l'admin (à la place de « Catalog »).
    verbose_name = "Contenu du site"

"""Petits filtres de gabarit pour l'accueil personnalisé du BO.

`split` transforme une chaîne "A,B,C" en liste ["A", "B", "C"], ce qui permet
de tester l'appartenance exacte d'un modèle à une catégorie dans le template
admin/_category_module.html (sans risque de collision de sous-chaînes).
"""

from django import template

register = template.Library()


@register.filter
def split(value, separator=","):
    """Découpe une chaîne en liste selon `separator` (virgule par défaut)."""
    return [part.strip() for part in value.split(separator)]


@register.filter
def exclude_app(app_list, app_label):
    """Retourne la liste d'apps privée de celle dont l'app_label est donné.

    Sert à masquer « Authentification et autorisation » (app_label "auth") de la
    barre latérale : ces écrans restent accessibles via le menu « Mon compte ».
    """
    return [app for app in app_list if app.get("app_label") != app_label]


@register.simple_tag(takes_context=True)
def sections_accordees(context):
    """Les rubriques du BO visibles par l'utilisateur courant.

    Sert à la barre latérale : une rubrique non accordée ne doit pas
    apparaître, sinon le lien mène à une page « permission refusée ».
    Renvoie un ensemble de clés (voir catalog/sections.py).
    """
    from catalog.sections import keys_for_user

    request = context.get("request")
    if request is None or not request.user.is_authenticated:
        return set()
    return keys_for_user(request.user)

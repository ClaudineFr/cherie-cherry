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

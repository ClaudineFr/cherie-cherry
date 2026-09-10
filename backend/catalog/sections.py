"""Les rubriques du back-office, et les permissions Django qu'elles recouvrent.

La cliente raisonne en rubriques du menu (« Coffee shop », « Concept store »),
pas en permissions Django (`catalog.change_menudrink`). Ce module fait la
traduction entre les deux, une fois pour toutes :

- le formulaire de création d'un compte affiche des cases par rubrique ;
- la barre latérale masque les rubriques non accordées ;
- Django, lui, continue de travailler avec ses permissions habituelles, donc
  la sécurité reste celle du framework — on ne réinvente rien.

Ajouter une rubrique au BO ? Ajoutez-la ici, et la case, le menu et les
permissions suivent.
"""

# Chaque rubrique liste les modèles qu'elle recouvre (en minuscules, comme
# Django les nomme dans ses permissions).
SECTIONS = [
    {
        "key": "accueil_site",
        "label": "Accueil du site",
        "help": "Les stories, les posts Instagram et les photos d'ambiance.",
        "models": ["instagramstory", "instagrampost", "galleryphoto"],
    },
    {
        "key": "coffee_shop",
        "label": "Coffee shop",
        "help": "La carte des boissons, la boisson du mois et les suppléments.",
        "models": [
            "menudrink",
            "drinkofmonth",
            "supplement",
            "drinkofmonthsettings",
        ],
    },
    {
        "key": "a_propos",
        "label": "À propos",
        "help": "Le texte de la page « À propos » et les trois valeurs.",
        "models": ["aboutpage", "aboutvalue"],
    },
    {
        "key": "concept_store",
        "label": "Concept store",
        "help": "Les produits de la boutique, leurs photos, prix et stock.",
        "models": ["product", "productimage"],
    },
    {
        "key": "commandes",
        "label": "Commandes",
        "help": (
            "Les commandes des clientes, avec leurs coordonnées et les "
            "montants payés. Donne aussi le droit d'annuler et rembourser."
        ),
        "models": ["order", "orderitem"],
    },
    {
        "key": "infos_pratiques",
        "label": "Infos pratiques",
        "help": "Les horaires d'ouverture.",
        "models": ["openinghours"],
    },
    {
        "key": "messages",
        "label": "Messages",
        "help": "Les messages reçus par le formulaire de contact.",
        "models": ["contactmessage"],
    },
    {
        "key": "reglages",
        "label": "Réglages",
        "help": (
            "Les coordonnées, la livraison et les informations légales. "
            "Ces réglages s'appliquent à tout le site."
        ),
        "models": ["sitesettings", "shippingsettings", "legalsettings"],
    },
]

# Les rubriques sensibles : cochées, elles donnent accès à des données
# personnelles (commandes, messages) ou à des réglages qui engagent la
# boutique. Le formulaire les signale, sans les interdire.
SENSITIVE = {"commandes", "reglages"}

# Une alternante peut consulter, ajouter et modifier — jamais supprimer.
# Django n'a pas de corbeille : une suppression est définitive. Pour retirer
# un élément du site, on décoche « affiché sur le site », qui est réversible.
ACTIONS = ("view", "add", "change")


def section_by_key(key):
    for section in SECTIONS:
        if section["key"] == key:
            return section
    return None


def permission_codenames(keys):
    """Les codes de permission Django correspondant à des rubriques.

    Renvoie par exemple {"view_product", "add_product", "change_product", …}
    pour la rubrique « Concept store ».
    """
    codenames = set()
    for key in keys:
        section = section_by_key(key)
        if not section:
            continue
        for model in section["models"]:
            for action in ACTIONS:
                codenames.add(f"{action}_{model}")
    return codenames


def keys_for_user(user):
    """Les rubriques auxquelles un utilisateur a accès.

    Une rubrique est considérée accordée dès que l'utilisateur peut consulter
    l'un de ses modèles : c'est ce qui décide de l'affichage dans le menu.
    Un superutilisateur les a toutes.
    """
    if user.is_superuser:
        return {section["key"] for section in SECTIONS}

    granted = set()
    for section in SECTIONS:
        for model in section["models"]:
            if user.has_perm(f"catalog.view_{model}"):
                granted.add(section["key"])
                break
    return granted

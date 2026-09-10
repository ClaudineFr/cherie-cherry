"""Génération de mots de passe lisibles pour les comptes du back-office.

Un mot de passe créé à la main est souvent faible, et un mot de passe
aléatoire du type « xK7#mQ2$vL » se recopie mal : la propriétaire va le
dicter au téléphone ou l'écrire sur un papier. On produit donc des mots de
passe de la forme « Cerise-4821-Menthe » : deux mots courants et quatre
chiffres, sans caractère ambigu.

Sur la solidité : deux mots tirés parmi ~90 et quatre chiffres donnent de
l'ordre de 90 × 90 × 10 000 = 81 millions de combinaisons. C'est peu face à
une attaque hors ligne, mais ce mot de passe ne sert qu'une fois — la
personne en choisit un autre à sa première connexion (voir
`StaffProfile.must_change_password`) — et Django limite de toute façon les
tentatives de connexion.
"""

import secrets

# Des mots simples, sans accent ni piège d'orthographe : ils doivent se
# dicter et se retaper sans hésitation. Registre volontairement proche de
# l'univers de la maison.
MOTS = [
    "Cerise", "Menthe", "Vanille", "Praline", "Amande", "Noisette",
    "Caramel", "Chocolat", "Framboise", "Myrtille", "Abricot", "Peche",
    "Citron", "Orange", "Mangue", "Coco", "Miel", "Cannelle",
    "Lavande", "Jasmin", "Rose", "Pivoine", "Tulipe", "Iris",
    "Marguerite", "Coquelicot", "Bleuet", "Muguet", "Camelia", "Dahlia",
    "Matcha", "Latte", "Moka", "Espresso", "Chai", "Cappuccino",
    "Croissant", "Brioche", "Madeleine", "Financier", "Palmier", "Sable",
    "Velours", "Satin", "Lin", "Coton", "Soie", "Cachemire",
    "Cuivre", "Laiton", "Nacre", "Perle", "Opale", "Ambre",
    "Aurore", "Zephyr", "Brise", "Nuage", "Etoile", "Comete",
    "Colline", "Riviere", "Jardin", "Verger", "Bosquet", "Prairie",
    "Bergamote", "Verveine", "Tilleul", "Camomille", "Anis", "Basilic",
    "Figue", "Grenade", "Nectarine", "Papaye", "Ananas", "Melon",
    "Sorbet", "Granite", "Nougat", "Guimauve", "Meringue", "Ganache",
    "Comptoir", "Terrasse", "Vitrine", "Boutique", "Atelier", "Fabrique",
]


def generer(mots=MOTS):
    """Un mot de passe du type « Cerise-4821-Menthe ».

    `secrets` et non `random` : c'est le module prévu pour ce qui touche à la
    sécurité, avec une source d'aléa non prédictible.
    """
    premier = secrets.choice(mots)
    # Deux mots distincts : « Cerise-1234-Cerise » ferait douter d'un bug.
    second = secrets.choice([m for m in mots if m != premier])
    chiffres = secrets.randbelow(10000)
    return f"{premier}-{chiffres:04d}-{second}"

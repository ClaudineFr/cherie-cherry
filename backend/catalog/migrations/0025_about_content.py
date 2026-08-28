from django.db import migrations


def remplir_la_page(apps, schema_editor):
    """Reprend le texte qui était écrit en dur dans la page « À propos ».

    La cliente récupère ainsi une base à retoucher plutôt qu'un formulaire
    vide. Le contenu est celui qui s'affichait déjà sur le site : c'est un
    point de départ, à réécrire avec sa vraie histoire.

    apps.get_model() et non un import direct : la migration doit rester
    rejouable telle quelle, même si les modèles changent plus tard.
    """
    AboutPage = apps.get_model("catalog", "AboutPage")
    AboutValue = apps.get_model("catalog", "AboutValue")

    # Une seule page : on ne fait rien si elle existe déjà (base déjà remplie).
    if AboutPage.objects.exists():
        return

    page = AboutPage.objects.create(
        intro=(
            "Un coffee shop et concept store né d'une envie simple : "
            "réunir sous un même toit tout ce qu'on aime."
        ),
        story=(
            "Chérie Cherry est né en plein cœur de Carpentras, de l'envie de "
            "créer un endroit à son image : chaleureux, féminin et un brin "
            "gourmand. L'idée ? Un lieu où l'on peut aussi bien s'attabler "
            "autour d'un matcha latte que dénicher la petite pièce déco qui "
            "manquait à la maison.\n"
            "\n"
            "D'un côté, le coffee shop : cafés de spécialité, matcha et "
            "pâtisseries faites maison, à déguster sur place dans un décor "
            "pensé comme un cocon. De l'autre, le concept store : déco, "
            "papeterie et prêt-à-porter féminin, chinés et sélectionnés avec "
            "soin.\n"
            "\n"
            "Deux univers, une même signature : le plaisir des jolies choses, "
            "faites et choisies avec attention."
        ),
        closing=(
            "Chérie Cherry, c'est avant tout un lieu à vivre. Le mieux reste "
            "encore de pousser la porte : on vous y attend"
        ),
    )

    valeurs = [
        (
            "flower",
            "Fait avec soin",
            "Pâtisseries maison, pièces chinées une à une : chaque détail est "
            "choisi, jamais standardisé.",
        ),
        (
            "coffee",
            "Le goût avant tout",
            "Cafés de spécialité et matcha sélectionnés avec exigence, pour "
            "des boissons qu'on prend le temps de savourer.",
        ),
        (
            "heart",
            "Un lieu qui rassemble",
            "Un coin de Provence où l'on vient pour un café, on repart avec "
            "un carnet, et on revient pour l'ambiance.",
        ),
    ]
    for rang, (icone, titre, texte) in enumerate(valeurs, start=1):
        AboutValue.objects.create(
            page=page, icon=icone, title=titre, text=texte, order=rang
        )


class Migration(migrations.Migration):

    dependencies = [
        ("catalog", "0024_aboutpage_aboutvalue"),
    ]

    operations = [
        migrations.RunPython(
            remplir_la_page,
            # Annuler la migration supprimerait les tables de toute façon :
            # rien à défaire ici.
            migrations.RunPython.noop,
        ),
    ]

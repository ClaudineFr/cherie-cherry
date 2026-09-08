from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("catalog", "0030_add_admin_help_text"),
    ]

    operations = [
        migrations.AddField(
            model_name="order",
            name="cancel_reason",
            field=models.CharField(
                blank=True,
                choices=[
                    ("out_of_stock", "Article finalement indisponible"),
                    ("damaged", "Article abîmé ou défectueux"),
                    ("customer_request", "Demande du client"),
                    ("other", "Autre motif"),
                ],
                help_text="Renseigné automatiquement lors d'une annulation. "
                "Détermine ce que dit l'email envoyé au client.",
                max_length=20,
                verbose_name="motif d'annulation",
            ),
        ),
    ]

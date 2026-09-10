"""Gestion des comptes du back-office, en français et par rubriques.

L'écran natif de Django (« Utilisateurs ») expose des permissions à l'unité —
`catalog.change_menudrink` et une centaine d'autres — ce qui est illisible
pour la propriétaire. On le remplace par un formulaire qui parle sa langue :
un nom, un identifiant, un mot de passe, et des cases par rubrique du menu.

La traduction rubriques → permissions Django vit dans `sections.py`. C'est
Django qui applique les droits ensuite : rien n'est réinventé ici.
"""

from django import forms
from django.contrib import admin, messages
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import Group, Permission, User
from django.contrib.auth.forms import AdminPasswordChangeForm
from django.utils.html import format_html
from django.utils.safestring import mark_safe
from django.utils.translation import gettext_lazy as _

from .models import StaffProfile
from .passwords import generer
from .sections import SECTIONS, SENSITIVE, keys_for_user, permission_codenames


# L'écran natif « Groupes » n'a plus de raison d'être : les droits se règlent
# compte par compte, avec les cases du formulaire ci-dessous.
admin.site.unregister(Group)
admin.site.unregister(User)


class SectionsField(forms.MultipleChoiceField):
    """Les rubriques du BO, en cases à cocher."""

    widget = forms.CheckboxSelectMultiple

    def __init__(self, **kwargs):
        choices = []
        for section in SECTIONS:
            label = section["label"]
            if section["key"] in SENSITIVE:
                # Les rubriques sensibles sont signalées dans le libellé même :
                # la propriétaire doit savoir ce qu'elle ouvre.
                label = format_html(
                    '{} <span class="cc-perm-warn">— {}</span>',
                    label,
                    section["help"],
                )
            else:
                label = format_html(
                    '{} <span class="cc-perm-help">— {}</span>',
                    label,
                    section["help"],
                )
            choices.append((section["key"], label))

        kwargs.setdefault("choices", choices)
        kwargs.setdefault("required", False)
        kwargs.setdefault("label", "Ce que cette personne peut gérer")
        super().__init__(**kwargs)


class StaffCreationForm(forms.ModelForm):
    """Créer un compte : nom, identifiant, mot de passe, rubriques."""

    # Un seul champ, en clair et prérempli : ce mot de passe est fait pour
    # être lu et transmis, pas retenu. Le masquer obligerait à le saisir deux
    # fois pour rien, alors qu'il ne servira qu'une seule connexion.
    password1 = forms.CharField(
        label="Mot de passe",
        widget=forms.TextInput(attrs={"class": "cc-password-field"}),
        help_text=(
            "Généré automatiquement, prêt à être transmis. Le bouton en "
            "propose un autre si besoin."
        ),
    )
    must_change_password = forms.BooleanField(
        label="Demander un nouveau mot de passe à la première connexion",
        initial=True,
        required=False,
        help_text=(
            "Recommandé : la personne choisit alors le sien, et celui que vous "
            "venez de transmettre ne sert qu'une fois."
        ),
    )
    sections = SectionsField()

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Prérempli à l'ouverture du formulaire, pas à la validation : si la
        # saisie est rejetée, on garde le mot de passe déjà affiché plutôt que
        # d'en proposer un nouveau que la propriétaire n'aurait pas noté.
        if not self.is_bound:
            self.fields["password1"].initial = generer()

    class Meta:
        model = User
        fields = ("username", "first_name", "last_name", "email")
        labels = {
            "username": "Identifiant",
            "first_name": "Prénom",
            "last_name": "Nom",
            "email": "Email",
        }
        help_texts = {
            "username": "Ce que la personne saisira pour se connecter.",
            "email": "Facultatif. Sert à retrouver un mot de passe oublié.",
        }

    def clean_password1(self):
        mdp = self.cleaned_data.get("password1", "")
        if len(mdp) < 8:
            raise forms.ValidationError(
                "Le mot de passe doit faire au moins 8 caractères."
            )
        return mdp

    def save(self, commit=True):
        user = super().save(commit=False)
        user.set_password(self.cleaned_data["password1"])
        # `is_staff` ouvre l'accès au back-office ; les rubriques cochées
        # décident de ce qu'on y voit.
        user.is_staff = True
        if commit:
            user.save()
        # Les permissions sont posées par StaffAdmin.save_model : ici, sur un
        # ajout, l'utilisateur n'a pas encore d'identifiant tant qu'il n'est
        # pas enregistré, et l'admin appelle save(commit=False).
        return user


class StaffChangeForm(forms.ModelForm):
    """Modifier un compte. Le mot de passe se change par un lien à part."""

    sections = SectionsField()

    class Meta:
        model = User
        fields = ("username", "first_name", "last_name", "email", "is_active")
        labels = {
            "username": "Identifiant",
            "first_name": "Prénom",
            "last_name": "Nom",
            "email": "Email",
            "is_active": "Compte actif",
        }
        help_texts = {
            "is_active": (
                "Décochez pour suspendre l'accès sans supprimer le compte — "
                "par exemple à la fin d'un contrat. C'est réversible, "
                "contrairement à une suppression."
            ),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.instance and self.instance.pk:
            self.fields["sections"].initial = sorted(keys_for_user(self.instance))

    def save(self, commit=True):
        # Comme à la création, les permissions sont posées par
        # StaffAdmin.save_model, une fois l'utilisateur enregistré.
        return super().save(commit=commit)


def apply_sections(user, keys):
    """Aligne les permissions d'un compte sur les rubriques cochées.

    On remplace l'ensemble des permissions plutôt que d'ajouter aux
    existantes : décocher une rubrique doit bel et bien retirer l'accès.
    """
    codenames = permission_codenames(keys)
    perms = Permission.objects.filter(
        content_type__app_label="catalog",
        codename__in=codenames,
    )
    user.user_permissions.set(perms)


# Django tire les titres des écrans du verbose_name du modèle (« Ajout de
# utilisateur »…). On le renomme une fois pour toutes : c'est un compte du
# back-office, pas un « utilisateur ».
User._meta.verbose_name = "compte"
User._meta.verbose_name_plural = "comptes du back-office"


@admin.register(User)
class StaffAdmin(UserAdmin):
    """Les comptes du back-office, présentés simplement."""

    add_form = StaffCreationForm
    form = StaffChangeForm

    list_display = ("identifiant", "nom_complet", "rubriques", "etat")
    # UserAdmin fait pointer le lien de la ligne vers une colonne qui n'existe
    # plus ici : on le remet sur l'identifiant.
    list_display_links = ("identifiant",)
    list_filter = ("is_active",)
    search_fields = ("username", "first_name", "last_name", "email")
    ordering = ("username",)
    save_on_top = True

    # UserAdmin déclare des fieldsets pensés pour ses propres formulaires :
    # on les redéfinit, sinon Django cherche des champs qui n'existent plus ici.
    add_fieldsets = (
        (
            "La personne",
            {"fields": ("first_name", "last_name", "email")},
        ),
        (
            "Ses identifiants",
            {"fields": ("username", "password1", "must_change_password")},
        ),
        (
            "Ce qu'elle peut gérer",
            {
                "fields": ("sections",),
                "description": (
                    "Cochez les rubriques du menu auxquelles cette personne "
                    "aura accès. Elle pourra y consulter, ajouter et modifier, "
                    "mais pas supprimer."
                ),
            },
        ),
    )

    fieldsets = (
        (
            "La personne",
            {"fields": ("first_name", "last_name", "email")},
        ),
        (
            "Ses identifiants",
            {"fields": ("username", "is_active")},
        ),
        (
            "Ce qu'elle peut gérer",
            {
                "fields": ("sections",),
                "description": (
                    "Cochez les rubriques du menu auxquelles cette personne "
                    "aura accès. Elle pourra y consulter, ajouter et modifier, "
                    "mais pas supprimer."
                ),
            },
        ),
    )

    filter_horizontal = ()

    class Media:
        css = {"all": ("admin/cc-permissions.css",)}
        # Les boutons « en générer un autre » et « copier » à côté du mot
        # de passe.
        js = ("admin/cc_password.js",)

    @admin.display(description="Identifiant", ordering="username")
    def identifiant(self, obj):
        return obj.username

    @admin.display(description="Nom")
    def nom_complet(self, obj):
        return obj.get_full_name() or "—"

    @admin.display(description="Accès")
    def rubriques(self, obj):
        # mark_safe et non format_html : ces libellés sont écrits ici, sans
        # donnée extérieure à interpoler (format_html exige un argument).
        if obj.is_superuser:
            return mark_safe('<span class="cc-badge-all">Tout le back-office</span>')
        keys = keys_for_user(obj)
        if not keys:
            return mark_safe('<span class="cc-badge-none">Aucun accès</span>')
        labels = [s["label"] for s in SECTIONS if s["key"] in keys]
        return ", ".join(labels)

    @admin.display(description="État", boolean=True)
    def etat(self, obj):
        return obj.is_active

    def get_queryset(self, request):
        # Une gestionnaire ne voit pas les comptes propriétaires : elle ne
        # doit pas pouvoir toucher au compte qui a tous les droits.
        qs = super().get_queryset(request)
        if request.user.is_superuser:
            return qs
        return qs.filter(is_superuser=False)

    def has_module_permission(self, request):
        # Seule la propriétaire gère les comptes.
        return request.user.is_superuser

    def has_view_permission(self, request, obj=None):
        return request.user.is_superuser

    def has_add_permission(self, request):
        return request.user.is_superuser

    def has_change_permission(self, request, obj=None):
        return request.user.is_superuser

    def has_delete_permission(self, request, obj=None):
        # Supprimer un compte efface aussi l'historique de ses actions.
        # Pour retirer un accès, on décoche « Compte actif » : réversible.
        return False

    def delete_model(self, request, obj):
        raise PermissionError("La suppression de compte est désactivée.")

    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)

        # Les rubriques sont appliquées ici, et pas dans le formulaire :
        # l'admin appelle save(commit=False), si bien qu'à la création le
        # compte n'existe pas encore quand le formulaire se sauvegarde — or
        # poser des permissions demande un utilisateur enregistré.
        if "sections" in form.cleaned_data:
            apply_sections(obj, form.cleaned_data["sections"])

        # « Doit choisir un nouveau mot de passe » : mémorisé sur le profil,
        # Django ne sachant pas le retenir lui-même.
        if "must_change_password" in form.cleaned_data:
            profil, _ = StaffProfile.objects.get_or_create(user=obj)
            profil.must_change_password = form.cleaned_data["must_change_password"]
            profil.save()

        if not change:
            mdp = form.cleaned_data.get("password1", "")
            messages.info(
                request,
                format_html(
                    "Compte créé. À transmettre à {} par un moyen sûr "
                    "(SMS, en main propre) — identifiant : <strong>{}</strong>, "
                    "mot de passe : <strong>{}</strong>. "
                    "Ce mot de passe ne sera plus affiché.",
                    obj.first_name or obj.username,
                    obj.username,
                    mdp,
                ),
            )

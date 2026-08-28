from rest_framework import permissions, viewsets


from .models import GalleryPhoto, Product, OpeningHours, InstagramStory, InstagramPost, MenuDrink, DrinkOfMonth, DrinkOfMonthSettings, Supplement, ContactMessage, SiteSettings
from .serializers import GalleryPhotoSerializer, ProductSerializer, OpeningHoursSerializer, InstagramStorySerializer, InstagramPostSerializer, MenuDrinkSerializer, DrinkOfMonthSerializer, DrinkOfMonthSettingsSerializer, SupplementSerializer, ContactMessageSerializer, SiteSettingsSerializer

# Tous les endpoints ci-dessous sont en LECTURE SEULE
# (ReadOnlyModelViewSet = seulement GET liste + GET détail).
#
# Le site ne fait que lire ; la cliente modifie ses contenus depuis l'admin
# Django, protégé par mot de passe. Un ModelViewSet exposerait aussi POST,
# PUT et DELETE — et comme l'API est publique et sans authentification,
# n'importe qui pourrait supprimer un produit ou changer un prix.

class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    # Les données à servir : tous les produits.
    queryset = Product.objects.all()

    # Le serializer utilisé pour les transformer en JSON.
    serializer_class = ProductSerializer


class GalleryPhotoViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = GalleryPhoto.objects.all()
    serializer_class = GalleryPhotoSerializer

class OpeningHoursViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = OpeningHours.objects.all()
    serializer_class = OpeningHoursSerializer

class InstagramStoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = InstagramStory.objects.all()
    serializer_class = InstagramStorySerializer

class InstagramPostViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = InstagramPost.objects.all()
    serializer_class = InstagramPostSerializer

class MenuDrinkViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = MenuDrink.objects.filter(available=True)
    serializer_class = MenuDrinkSerializer

class DrinkOfMonthViewSet(viewsets.ReadOnlyModelViewSet):
    # On ne sert que les boissons du mois actives.
    queryset = DrinkOfMonth.objects.filter(active=True)
    serializer_class = DrinkOfMonthSerializer

class SupplementViewSet(viewsets.ReadOnlyModelViewSet):
    # On ne sert que les suppléments disponibles.
    queryset = Supplement.objects.filter(available=True)
    serializer_class = SupplementSerializer

from rest_framework import generics


class ContactMessageCreateView(generics.CreateAPIView):
    """Endpoint du formulaire de contact : POST uniquement.

    Contrairement aux autres endpoints, tous en lecture seule, celui-ci
    écrit — mais il ne fait QUE créer un message. On n'expose ni la liste ni
    le détail : les messages se lisent depuis l'admin, pas via l'API publique.
    """

    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer

    # Le réglage global (DjangoModelPermissionsOrAnonReadOnly) interdit toute
    # écriture anonyme. Or ce formulaire est justement fait pour ça : un
    # visiteur non connecté envoie un message. On lève donc la restriction
    # ICI, et seulement ici.
    #
    # Ce n'est pas une porte ouverte : la vue n'accepte QUE la création
    # (CreateAPIView), le serializer n'expose que les champs du formulaire,
    # et le honeypot filtre les bots.
    permission_classes = [permissions.AllowAny]

from rest_framework.views import APIView
from rest_framework.response import Response


class DrinkOfMonthSettingsView(APIView):
    """Renvoie les réglages de l'encart (la date de fin), sous forme d'UN objet."""

    def get(self, request):
        settings = DrinkOfMonthSettings.objects.first()
        serializer = DrinkOfMonthSettingsSerializer(
            settings or DrinkOfMonthSettings()
        )
        return Response(serializer.data)

class SiteSettingsView(APIView):
    """Renvoie les coordonnées du site (adresse, contact, réseaux) en UN objet."""

    def get(self, request):
        settings = SiteSettings.objects.first()
        # Si la proprio n'a pas encore rempli la ligne, on renvoie un objet
        # vide plutôt qu'une erreur : le front affichera juste des champs vides.
        serializer = SiteSettingsSerializer(settings or SiteSettings())
        return Response(serializer.data)

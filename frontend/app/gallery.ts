// Ce fichier fait le pont entre l'API Django et la galerie d'ambiance.
// Les photos ne sont plus codées en dur : la proprio les gère depuis l'admin.

// L'URL vient d'une variable d'environnement (voir .env.local), comme pour
// les produits, pour pouvoir pointer vers une autre API en production.
const API_URL = process.env.API_GALLERY_URL;

// Une photo telle que l'affichage l'attend.
// src est une URL (chaîne), pas un import statique : l'image vit côté API.
export type Photo = {
  src: string;
  alt: string;
};

// La forme brute renvoyée par l'API (image = URL absolue construite par Django).
type ApiPhoto = {
  id: number;
  image: string;
  alt: string;
};

// Va chercher les photos sur l'API et les convertit au format `Photo`.
export async function fetchGallery(): Promise<Photo[]> {
  if (!API_URL) {
    throw new Error(
      "API_GALLERY_URL n'est pas définie. Vérifie ton fichier .env.local.",
    );
  }

  const res = await fetch(API_URL, {
    // Pas de cache : on veut la galerie à jour à chaque visite.
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`API galerie : réponse ${res.status}`);
  }

  const data: ApiPhoto[] = await res.json();

  return data.map((item) => ({
    src: item.image,
    alt: item.alt,
  }));
}

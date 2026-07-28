// Ce fichier fait le pont entre l'API Django et les « stories » Instagram
// mises en avant sur la page d'accueil (ronds façon stories).
// Ce ne sont PAS de vraies stories Instagram : ce sont des photos que la
// proprio choisit et upload depuis l'admin. Même principe que gallery.ts.

// L'URL vient d'une variable d'environnement (voir .env.local), comme pour
// la galerie, les produits et les horaires.
const API_URL = process.env.API_STORIES_URL;

// Une story telle que l'affichage l'attend.
// src est une URL (chaîne) : l'image vit côté API.
export type Story = {
  src: string;
  handle: string;
};

// La forme brute renvoyée par l'API.
type ApiStory = {
  id: number;
  image: string;
  handle: string;
  order: number;
};

// Va chercher les stories sur l'API et les convertit au format `Story`.
// L'API les renvoie déjà triées par `order` (défini côté Django).
export async function fetchStories(): Promise<Story[]> {
  if (!API_URL) {
    throw new Error(
      "API_STORIES_URL n'est pas définie. Vérifie ton fichier .env.local.",
    );
  }

  const res = await fetch(API_URL, {
    // Pas de cache : on veut les stories à jour à chaque visite.
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`API stories : réponse ${res.status}`);
  }

  const data: ApiStory[] = await res.json();

  return data.map((item) => ({
    src: item.image,
    handle: item.handle,
  }));
}

// Ce fichier fait le pont entre l'API Django et le feed de posts Instagram
// de la marque sur la page d'accueil.
// Ce n'est PAS un vrai feed Instagram live : ce sont des posts que le client
// réplique à la main depuis l'admin. Chaque post renvoie vers la vraie publi.
// Même principe que stories.ts et gallery.ts.
const API_URL = process.env.API_POSTS_URL;

// Un post tel que l'affichage l'attend.
// src = l'image (URL) ; caption = la légende ; link = vers la vraie publi Instagram.
export type Post = {
  src: string;
  caption: string;
  link: string;
};
type ApiPost = {
  id: number;
  image: string;
  caption: string;
  link: string;
  order: number;
};

// Va chercher les posts sur l'API et les convertit au format `Post`.
// L'API les renvoie déjà triés par `order` (défini côté Django).
export async function fetchPosts(): Promise<Post[]> {
  if (!API_URL) {
    throw new Error(
      "API_POSTS_URL n'est pas définie. Vérifie ton fichier .env.local.",
    );
  }

  const res = await fetch(API_URL, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`API posts : réponse ${res.status}`);
  }

  const data: ApiPost[] = await res.json();

  return data.map((item) => ({
    src: item.image,
    caption: item.caption,
    link: item.link,
  }));
}

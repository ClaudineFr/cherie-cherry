// Ce fichier fait le pont entre l'API Django et le format attendu par la grille.

import type { Category, Product, ProductImage } from "./products";

// L'URL vient de la variable d'environnement API_PRODUCTS_URL (voir .env.local).
// Ainsi on peut pointer vers une autre API en production sans toucher au code.
const API_URL = process.env.API_PRODUCTS_URL;

// La forme brute d'un produit tel que l'API le renvoie.
// Noter : category en anglais, price en chaîne de caractères.
type ApiProduct = {
  id: number;
  slug: string;
  name: string;
  category: string;
  description: string;
  price: string;
  stock: number;
  featured: boolean;
  image?: string | null;
  images?: ProductImage[];
};

// Traduction des catégories de l'API (anglais) vers les libellés du front (français).
const CATEGORY_LABELS: Record<string, Category> = {
  jewelry: "Bijoux",
  stationery: "Papeterie",
  bags: "Sacs",
  clothing: "Vêtements",
};

// Va chercher les produits sur l'API et les convertit au format `Product` du front.
export async function fetchProducts(): Promise<Product[]> {
  if (!API_URL) {
    throw new Error(
      "API_PRODUCTS_URL n'est pas définie. Vérifie ton fichier .env.local.",
    );
  }
  const res = await fetch(API_URL, {
    // Ne pas mettre en cache : on veut les prix/stock à jour à chaque visite.
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`API produits : réponse ${res.status}`);
  }

  const data: ApiProduct[] = await res.json();

  // Conversion API -> format du front.
  return data.map((item) => ({
    id: item.id,
    slug: item.slug,
    name: item.name,
    category: CATEGORY_LABELS[item.category] ?? "Bijoux", // repli si catégorie inconnue
    description: item.description || undefined,
    price: Number(item.price), // "45.00" (chaîne) -> 45 (nombre)
    stock: item.stock,
    featured: item.featured,
    image: item.image,
    images: item.images ?? [],
  }));
}

// Va chercher UN produit à partir de son slug (l'identifiant dans l'URL).
//
// L'API ne sait interroger un produit que par son id, pas par son slug. Plutôt
// que de toucher au backend, on récupère la liste et on y cherche : le
// catalogue est petit, et la requête est de toute façon déjà faite ailleurs.
// À revoir si la boutique grossit beaucoup.
//
// Renvoie undefined si aucun produit ne correspond : c'est à l'appelant
// d'en faire un 404.
export async function fetchProductBySlug(
  slug: string,
): Promise<Product | undefined> {
  const products = await fetchProducts();
  return products.find((product) => product.slug === slug);
}

// Ce fichier fait le pont entre l'API Django et le format attendu par la grille.

import type { Category, Product } from "./products";

// L'URL vient de la variable d'environnement API_PRODUCTS_URL (voir .env.local).
// Ainsi on peut pointer vers une autre API en production sans toucher au code.
const API_URL = process.env.API_PRODUCTS_URL;

// La forme brute d'un produit tel que l'API le renvoie.
// Noter : category en anglais, price en chaîne de caractères.
type ApiProduct = {
  id: number;
  name: string;
  category: string;
  description: string;
  price: string;
  stock: number;
  featured: boolean;
  image?: string | null;
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
    name: item.name,
    category: CATEGORY_LABELS[item.category] ?? "Bijoux", // repli si catégorie inconnue
    description: item.description || undefined,
    price: Number(item.price), // "45.00" (chaîne) -> 45 (nombre)
    featured: item.featured,
    image: item.image,
  }));
}

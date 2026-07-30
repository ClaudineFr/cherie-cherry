// La carte n'est plus écrite en dur ici : les boissons viennent de l'API
// Django (comme les horaires, la galerie, etc.). On les récupère puis on les
// regroupe par catégorie pour l'affichage.

// L'URL vient d'une variable d'environnement (voir .env.local).
const API_URL = process.env.API_MENU_URL;

// --- Textes qui ne bougent pas : on les garde en dur ---

export const servingNote =
  "Toutes nos boissons sont disponibles chaudes ou glacées.";

export const supplements = [
  "Lait : avoine, amande, sans lactose + 0,50 €",
  "Sirop : vanille, caramel, noisette, coco + 0,50 €",
];

// --- Les boissons, côté API ---

// Une boisson telle que l'API la renvoie.
// category = "coffee" ou "matcha" (la valeur en base).
// price = une chaîne comme "4.50" (Django renvoie les décimaux en texte).
export type MenuDrink = {
  id: number;
  name: string;
  description: string;
  price: string;
  category: "coffee" | "matcha";
  order: number;
  available: boolean;
};

// La forme qu'attend la page : une catégorie avec son libellé + ses boissons.
export type Drink = {
  name: string;
  description?: string;
  price: string;
};

export type MenuCategory = {
  category: string;
  items: Drink[];
};

// Le libellé affiché pour chaque catégorie (la valeur en base → le titre lisible).
// L'ordre des clés ici = l'ordre des sections sur la page.
const CATEGORY_LABELS: Record<MenuDrink["category"], string> = {
  coffee: "Coffee",
  matcha: "Matcha & more",
};

// Transforme "4.50" en "4,50 €" (virgule française + symbole euro).
function formatPrice(price: string): string {
  return `${price.replace(".", ",")} €`;
}

// Va chercher les boissons sur l'API. En cas d'échec (API injoignable),
// on renvoie une liste vide plutôt que de faire planter la page.
async function fetchDrinks(): Promise<MenuDrink[]> {
  if (!API_URL) {
    console.error("API_MENU_URL n'est pas définie. Vérifie ton .env.local.");
    return [];
  }

  try {
    const res = await fetch(API_URL, {
      // Pas de cache : on veut la carte à jour à chaque visite.
      cache: "no-store",
    });
    if (!res.ok) {
      console.error(`API menu : réponse ${res.status}`);
      return [];
    }
    return await res.json();
  } catch (err) {
    console.error("Impossible de joindre l'API menu :", err);
    return [];
  }
}

// Récupère les boissons et les regroupe par catégorie, dans l'ordre défini
// par CATEGORY_LABELS. Les catégories sans boisson ne sont pas affichées.
export async function fetchMenu(): Promise<MenuCategory[]> {
  const drinks = await fetchDrinks();

  // On trie par ordre d'affichage (le champ `order` géré dans l'admin).
  const sorted = [...drinks].sort((a, b) => a.order - b.order);

  const categories: MenuCategory[] = [];

  for (const key of Object.keys(CATEGORY_LABELS) as MenuDrink["category"][]) {
    const items = sorted
      .filter((drink) => drink.category === key)
      .map((drink) => ({
        name: drink.name,
        description: drink.description || undefined,
        price: formatPrice(drink.price),
      }));

    // On n'ajoute la section que si elle contient au moins une boisson.
    if (items.length > 0) {
      categories.push({ category: CATEGORY_LABELS[key], items });
    }
  }

  return categories;
}

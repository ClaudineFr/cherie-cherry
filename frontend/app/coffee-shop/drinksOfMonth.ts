// Les « boissons du mois » : des créations éphémères mises en avant, gérées
// depuis l'admin Django (modèle DrinkOfMonth, séparé du menu permanent).

// L'URL vient d'une variable d'environnement (voir .env.local).
const API_URL = process.env.API_DRINKS_OF_MONTH_URL;
const SETTINGS_URL = process.env.API_DRINKS_OF_MONTH_SETTINGS_URL;

// Une boisson du mois telle que l'API la renvoie.
// price = une chaîne comme "5.90" (Django renvoie les décimaux en texte).
export type DrinkOfMonth = {
  id: number;
  name: string;
  description: string;
  price: string;
  order: number;
  active: boolean;
};

// La forme utilisée par la page (prix déjà mis en forme "5,90 €").
export type DrinkOfMonthItem = {
  name: string;
  description?: string;
  price: string;
};

// Transforme "5.90" en "5,90 €" (virgule française + symbole euro).
function formatPrice(price: string): string {
  return `${price.replace(".", ",")} €`;
}

// Va chercher les boissons du mois sur l'API. En cas d'échec (API injoignable),
// on renvoie une liste vide plutôt que de faire planter la page.
export async function fetchDrinksOfMonth(): Promise<DrinkOfMonthItem[]> {
  if (!API_URL) {
    console.error(
      "API_DRINKS_OF_MONTH_URL n'est pas définie. Vérifie ton .env.local.",
    );
    return [];
  }

  try {
    const res = await fetch(API_URL, {
      // Pas de cache : on veut les boissons du mois à jour à chaque visite.
      cache: "no-store",
    });
    if (!res.ok) {
      console.error(`API boissons du mois : réponse ${res.status}`);
      return [];
    }

    const data: DrinkOfMonth[] = await res.json();

    // On trie par ordre d'affichage, puis on met en forme pour la page.
    return [...data]
      .sort((a, b) => a.order - b.order)
      .map((drink) => ({
        name: drink.name,
        description: drink.description || undefined,
        price: formatPrice(drink.price),
      }));
  } catch (err) {
    console.error("Impossible de joindre l'API boissons du mois :", err);
    return [];
  }
}

// --- La phrase « durée limitée » ---

// Transforme une date ISO "2026-08-31" en "31/08" (jour/mois, à la française).
function formatDay(isoDate: string): string {
  const [, month, day] = isoDate.split("-");
  return `${day}/${month}`;
}

// Va chercher la date de fin choisie dans l'admin et construit la phrase à
// afficher. Renvoie null s'il n'y a pas de date (ou si l'API est injoignable) :
// dans ce cas, aucune phrase n'est affichée.
export async function fetchDrinksOfMonthNote(): Promise<string | null> {
  if (!SETTINGS_URL) {
    console.error(
      "API_DRINKS_OF_MONTH_SETTINGS_URL n'est pas définie. Vérifie ton .env.local.",
    );
    return null;
  }

  try {
    const res = await fetch(SETTINGS_URL, { cache: "no-store" });
    if (!res.ok) {
      console.error(`API réglages boissons du mois : réponse ${res.status}`);
      return null;
    }

    const data: { available_until: string | null } = await res.json();
    if (!data.available_until) {
      return null;
    }

    return `Durée limitée jusqu'au ${formatDay(data.available_until)}`;
  } catch (err) {
    console.error("Impossible de joindre l'API réglages boissons du mois :", err);
    return null;
  }
}

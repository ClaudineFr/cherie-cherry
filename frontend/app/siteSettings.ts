// L'URL vient d'une variable d'environnement (voir .env.local), comme pour
// la galerie, les produits et les horaires.
const API_URL = process.env.API_SETTINGS_URL;

// Les coordonnées du site telles que l'API les renvoie. Ce sont les mêmes
// champs que le modèle SiteSettings côté Django (un seul objet, pas une liste).
// Chaque champ peut être une chaîne vide si la proprio ne l'a pas rempli.
export type SiteSettings = {
  street: string;
  postal_code: string;
  city: string;
  email: string;
  phone: string;
  instagram_url: string;
  tiktok_url: string;
};

// Objet vide utilisé en repli : si l'API est injoignable ou l'URL absente,
// on renvoie ça plutôt que de planter. Les composants testeront chaque champ
// avant de l'afficher, donc des champs vides = rien ne s'affiche.
const EMPTY: SiteSettings = {
  street: "",
  postal_code: "",
  city: "",
  email: "",
  phone: "",
  instagram_url: "",
  tiktok_url: "",
};

// Va chercher les coordonnées sur l'API. Renvoie toujours un objet (jamais
// null) : en cas de souci, c'est l'objet vide ci-dessus.
export async function fetchSiteSettings(): Promise<SiteSettings> {
  if (!API_URL) {
    console.error("API_SETTINGS_URL n'est pas définie. Vérifie ton .env.local.");
    return EMPTY;
  }

  try {
    const res = await fetch(API_URL, {
      cache: "no-store",
    });
    if (!res.ok) {
      console.error(`API paramètres : réponse ${res.status}`);
      return EMPTY;
    }

    return (await res.json()) as SiteSettings;
  } catch (err) {
    console.error("Impossible de joindre l'API paramètres :", err);
    return EMPTY;
  }
}

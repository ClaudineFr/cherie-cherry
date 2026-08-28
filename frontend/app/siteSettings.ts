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
    console.error(
      "API_SETTINGS_URL n'est pas définie. Vérifie ton .env.local.",
    );
    return EMPTY;
  }

  try {
    const res = await fetch(API_URL, {
      // Pas de cache : on veut les coordonnées à jour à chaque visite.
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

// L'adresse sur une seule ligne : « 7 rue de la République, 84200 Carpentras ».
// Utilisée dans les pages légales, où l'adresse s'insère dans une phrase.
// Renvoie « à compléter » si la propriétaire ne l'a pas renseignée, pour que
// le trou reste visible plutôt que de laisser une phrase bancale.
export function adresseEnLigne(site: SiteSettings): string {
  const morceaux = [
    site.street,
    [site.postal_code, site.city].filter(Boolean).join(" "),
  ].filter((m) => m.trim() !== "");
  return morceaux.length > 0 ? morceaux.join(", ") : "à compléter";
}

// L'email de contact, ou « à compléter » s'il manque.
export function emailOuACompleter(site: SiteSettings): string {
  return site.email.trim() || "à compléter";
}

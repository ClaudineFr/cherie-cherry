// Les informations juridiques (raison sociale, SIRET, délais, médiateur…),
// éditées par la propriétaire depuis l'admin. Même principe que
// siteSettings.ts : l'URL vient d'une variable d'environnement.
const API_URL = process.env.API_LEGAL_URL;

// Les mêmes champs que le modèle LegalSettings côté Django. Chacun peut être
// vide tant que la propriétaire ne l'a pas renseigné.
export type LegalSettings = {
  company_name: string;
  legal_form: string;
  share_capital: string;
  siret: string;
  vat_number: string;
  publication_director: string;
  host_name: string;
  host_address: string;
  host_contact: string;
  dispatch_delay: string;
  delivery_delay: string;
  pickup_delay: string;
  mediator: string;
  data_retention: string;
  terms_updated_at: string | null;
};

const EMPTY: LegalSettings = {
  company_name: "",
  legal_form: "",
  share_capital: "",
  siret: "",
  vat_number: "",
  publication_director: "",
  host_name: "",
  host_address: "",
  host_contact: "",
  dispatch_delay: "",
  delivery_delay: "",
  pickup_delay: "",
  mediator: "",
  data_retention: "",
  terms_updated_at: null,
};

// Renvoie toujours un objet, jamais null : une page légale doit s'afficher
// même si l'API est injoignable.
export async function fetchLegalSettings(): Promise<LegalSettings> {
  if (!API_URL) {
    console.error("API_LEGAL_URL n'est pas définie. Vérifie ton .env.local.");
    return EMPTY;
  }

  try {
    const res = await fetch(API_URL, { cache: "no-store" });
    if (!res.ok) {
      console.error(`API infos légales : réponse ${res.status}`);
      return EMPTY;
    }
    return (await res.json()) as LegalSettings;
  } catch (err) {
    console.error("Impossible de joindre l'API infos légales :", err);
    return EMPTY;
  }
}

// Ce qu'on affiche quand la propriétaire n'a pas encore rempli un champ.
//
// Une page légale incomplète vaut mieux qu'une page cassée, mais le trou doit
// rester visible : la mention signale au lecteur — et à la propriétaire — que
// l'information manque, plutôt que de laisser un blanc silencieux.
export function ouACompleter(valeur: string): string {
  return valeur.trim() || "à compléter";
}

// Formate la date de mise à jour des CGV (« 28 août 2026 »).
export function formatDate(iso: string | null): string {
  if (!iso) return "à compléter";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "à compléter";
  return d.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

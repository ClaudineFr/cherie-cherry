// Le contenu de la page « À propos », édité depuis l'admin.
const API_URL = process.env.API_ABOUT_URL;

// Une valeur mise en avant (les cartes sous le récit).
export type AboutValue = {
  id: number;
  // La clé de l'icône, traduite en dessin par le composant (voir a-propos/page.tsx).
  icon: string;
  title: string;
  text: string;
  order: number;
};

export type AboutPage = {
  intro: string;
  // Le récit déjà découpé en paragraphes par Django.
  story_paragraphs: string[];
  closing: string;
  values: AboutValue[];
};

const EMPTY: AboutPage = {
  intro: "",
  story_paragraphs: [],
  closing: "",
  values: [],
};

export async function fetchAboutPage(): Promise<AboutPage> {
  if (!API_URL) {
    console.error("API_ABOUT_URL n'est pas définie. Vérifie ton .env.local.");
    return EMPTY;
  }

  try {
    const res = await fetch(API_URL, { cache: "no-store" });
    if (!res.ok) {
      console.error(`API à propos : réponse ${res.status}`);
      return EMPTY;
    }
    return (await res.json()) as AboutPage;
  } catch (err) {
    console.error("Impossible de joindre l'API à propos :", err);
    return EMPTY;
  }
}

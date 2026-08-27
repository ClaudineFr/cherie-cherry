// L'URL vient d'une variable d'environnement (voir .env.local), comme pour
// la galerie et les produits.
const API_URL = process.env.API_HOURS_URL;

// Un horaire tel que l'API le renvoie.
// day = numéro du jour (0 = lundi … 6 = dimanche), utile pour trier.
// day_label = le libellé prêt à afficher ("Lundi"), calculé côté Django.
// opens_at / closes_at = "HH:MM:SS" ou null si le jour est fermé.
export type OpeningHours = {
  day: number;
  day_label: string;
  opens_at: string | null;
  closes_at: string | null;
  closed: boolean;
};

// Va chercher les horaires sur l'API. On les trie par `day` pour être sûr
// de les avoir dans l'ordre lundi → dimanche, quoi que renvoie l'API.
export async function fetchOpeningHours(): Promise<OpeningHours[]> {
  if (!API_URL) {
    console.error("API_HOURS_URL n'est pas définie. Vérifie ton .env.local.");
    return [];
  }

  try {
    const res = await fetch(API_URL, {
      cache: "no-store",
    });
    if (!res.ok) {
      console.error(`API horaires : réponse ${res.status}`);
      return [];
    }

    const data: OpeningHours[] = await res.json();
    return [...data].sort((a, b) => a.day - b.day);
  } catch (err) {
    console.error("Impossible de joindre l'API horaires :", err);
    return [];
  }
}

// --- Mise en forme pour l'affichage ---
function formatTime(time: string): string {
  const [hours, minutes] = time.split(":");
  return `${hours}h${minutes}`;
}

// Décrit l'horaire d'UN jour : soit "Fermé", soit "de 10h30 à 19h00".
// Deux jours qui donnent la même chaîne pourront être regroupés.
function describeHours(day: OpeningHours): string {
  if (day.closed || !day.opens_at || !day.closes_at) {
    return "Fermé";
  }
  return `de ${formatTime(day.opens_at)} à ${formatTime(day.closes_at)}`;
}

export type HoursRange = {
  days: string;
  hours: string;
  firstDay: string;
  lastDay: string;
};

export function groupOpeningHours(hours: OpeningHours[]): HoursRange[] {
  const ranges: HoursRange[] = [];

  // On n'affiche que les jours ouverts : les jours fermés sont ignorés.
  const openDays = hours.filter(
    (day) => !day.closed && day.opens_at && day.closes_at,
  );

  for (const day of openDays) {
    const label = describeHours(day);
    const dayName =
      day.day_label.charAt(0).toLowerCase() + day.day_label.slice(1);
    const last = ranges[ranges.length - 1];

    // Si le jour précédent avait EXACTEMENT le même horaire, on étend la plage
    // au lieu de créer une nouvelle ligne.
    if (last && last.hours === label) {
      last.lastDay = dayName;
      last.days = `Du ${last.firstDay} au ${last.lastDay}`;
    } else {
      ranges.push({
        days: dayName,
        hours: label,
        firstDay: dayName,
        lastDay: dayName,
      });
    }
  }

  return ranges;
}

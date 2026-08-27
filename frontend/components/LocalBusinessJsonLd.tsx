import type { SiteSettings } from "@/app/siteSettings";
import type { OpeningHours } from "@/app/openingHours";

// URL canonique du site (cf. metadataBase dans app/layout.tsx).
const BASE_URL = "https://www.cheriecherry.fr";

// schema.org attend les jours en abréviations anglaises à 2 lettres.
// Notre API numérote 0 = lundi … 6 = dimanche.
const DAY_CODES = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

// "10:30:00" (format API) → "10:30" (format attendu par schema.org).
function toHm(time: string): string {
  return time.slice(0, 5);
}

// Construit les entrées openingHoursSpecification à partir des horaires de l'API.
// On ignore les jours fermés : leur absence suffit à indiquer la fermeture.
function buildOpeningHours(hours: OpeningHours[]) {
  return hours
    .filter((day) => !day.closed && day.opens_at && day.closes_at)
    .map((day) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: DAY_CODES[day.day],
      opens: toHm(day.opens_at as string),
      closes: toHm(day.closes_at as string),
    }));
}

type Props = {
  settings: SiteSettings;
  hours: OpeningHours[];
};

// Données structurées JSON-LD (schema.org) décrivant l'établissement.
// Google peut s'en servir pour afficher adresse, horaires et téléphone
// directement dans les résultats de recherche et sur Maps.
export default function LocalBusinessJsonLd({ settings, hours }: Props) {
  // On ne déclare que les champs réellement renseignés (les champs vides de
  // SiteSettings sont omis pour ne pas envoyer d'infos vides à Google).
  const sameAs = [settings.instagram_url, settings.tiktok_url].filter(Boolean);

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "CafeOrCoffeeShop",
    name: "Chérie Cherry",
    description:
      "Chérie Cherry, coffee shop et concept store : café, déco, papeterie et prêt-à-porter féminin.",
    url: BASE_URL,
    image: `${BASE_URL}/opengraph-image`,
  };

  if (settings.phone) data.telephone = settings.phone;
  if (settings.email) data.email = settings.email;
  if (sameAs.length) data.sameAs = sameAs;

  // Adresse postale : on ne l'ajoute que si au moins un champ est rempli.
  if (settings.street || settings.postal_code || settings.city) {
    data.address = {
      "@type": "PostalAddress",
      streetAddress: settings.street || undefined,
      postalCode: settings.postal_code || undefined,
      addressLocality: settings.city || undefined,
      addressCountry: "FR",
    };
  }

  const openingHours = buildOpeningHours(hours);
  if (openingHours.length) data.openingHoursSpecification = openingHours;

  return (
    <script
      type="application/ld+json"
      // JSON-LD est du contenu de données, pas du HTML : dangerouslySetInnerHTML
      // est la façon standard (et sûre ici) de l'injecter.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

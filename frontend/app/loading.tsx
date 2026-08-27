// Fichier spécial Next.js : affiché pendant que page.tsx récupère coordonnées
// et horaires sur l'API (`fetchSiteSettings()` / `fetchOpeningHours()`).

import Loader from "@/components/Loader";

export default function Loading() {
  return (
    <main className="home-page is-loading flex-1">
      {/* Hero statique affiché tel quel : seul le bas de page attend l'API. */}
      <section className="home-hero flex flex-col items-center justify-center gap-6 bg-pink-soft px-6 py-24 text-center">
        <p className="home-hero-eyebrow text-sm uppercase tracking-[0.3em] text-green">
          Carpentras · Provence
        </p>
        <h1 className="home-hero-title font-serif text-4xl leading-tight text-green sm:text-6xl">
          Chérie Cherry
        </h1>
        <p className="home-hero-tagline max-w-md text-base text-ink/80">
          Coffee &amp; Matcha Club — un coffee shop et concept store où café,
          déco, papeterie et mode se rencontrent.
        </p>
      </section>

      <Loader size="lg" className="py-28" />
    </main>
  );
}

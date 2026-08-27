// Fichier spécial Next.js : affiché pendant que page.tsx récupère horaires et
// coordonnées sur l'API (`fetchOpeningHours()` / `fetchSiteSettings()`).

import Loader from "@/components/Loader";

export default function Loading() {
  return (
    <main className="contact-page is-loading flex-1 bg-cream px-6 py-20">
      <div className="contact-container mx-auto max-w-3xl">
        {/* Même en-tête que la vraie page (texte statique, disponible tout de
            suite) : seul le bloc coordonnées + formulaire attend l'API. */}
        <p className="contact-eyebrow text-center text-sm uppercase tracking-[0.3em] text-green">
          Une question ?
        </p>
        <h1 className="contact-title mt-3 text-center font-serif text-4xl text-green">
          Contactez-nous
        </h1>

        <Loader size="lg" className="py-24" />
      </div>
    </main>
  );
}

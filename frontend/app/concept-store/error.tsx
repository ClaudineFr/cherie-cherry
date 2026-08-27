"use client";
// ↑ Obligatoire : les "error boundaries" React doivent être des Client Components.

// Fichier spécial Next.js : affiché automatiquement si le rendu de la page
// lève une erreur (par ex. l'API Django est injoignable / éteinte).

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <main className="concept-store-page is-error flex-1 bg-cream px-6 py-20">
      <div className="error-panel mx-auto max-w-md text-center">
        <p className="error-eyebrow text-sm uppercase tracking-[0.3em] text-green">
          Concept store
        </p>
        <h1 className="error-title mt-3 font-serif text-3xl text-green">
          Boutique momentanément indisponible
        </h1>
        <p className="error-text mt-4 text-base text-ink/70">
          Nous n’arrivons pas à charger les produits pour le moment. Merci de
          réessayer dans un instant.
        </p>
        <button
          type="button"
          onClick={() => unstable_retry()}
          className="error-retry mt-8 rounded-full bg-green px-6 py-2 text-sm text-cream transition hover:bg-green/90"
        >
          Réessayer
        </button>
      </div>
    </main>
  );
}

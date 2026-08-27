// Fichier spécial Next.js : affiché automatiquement pendant que page.tsx
// récupère la carte sur l'API (les `await fetchMenu()` & co). Next l'enveloppe
// dans un <Suspense> et le remplace par la vraie page dès que tout est arrivé.

import Loader from "@/components/Loader";

export default function Loading() {
  return (
    <main className="flex-1 bg-cream px-6 py-20">
      <div className="mx-auto max-w-3xl">
        {/* Même en-tête que la vraie page, pour éviter tout « saut » visuel
            au moment où le contenu arrive. */}
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-green">
            Coffee &amp; Matcha Club
          </p>
          <h1 className="mt-3 font-serif text-4xl text-green">
            Le coffee shop
          </h1>
        </div>

        {/* Le loader, centré dans la zone où la carte va s'afficher. */}
        <Loader size="lg" label="Préparation de la carte…" className="py-24" />
      </div>
    </main>
  );
}

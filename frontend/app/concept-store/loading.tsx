// Fichier spécial Next.js : affiché automatiquement pendant que page.tsx
// récupère les produits (le `await fetchProducts()`). Next l'enveloppe dans
// un <Suspense> et le remplace par la vraie page dès que les données arrivent.

export default function Loading() {
  return (
    <main className="flex-1 bg-cream px-6 py-20">
      <div className="mx-auto max-w-5xl">
        {/* Même en-tête que la vraie page, pour éviter tout "saut" visuel */}
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-green">
            Concept store
          </p>
          <h1 className="mt-3 font-serif text-4xl text-green">La boutique</h1>
          <p className="mx-auto mt-4 max-w-md text-base text-ink/70">
            Déco, papeterie et prêt-à-porter féminin, chinés et sélectionnés
            avec soin.
          </p>
        </div>

        {/* Grille de cartes "fantômes" qui pulsent le temps du chargement */}
        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="flex animate-pulse flex-col rounded-2xl border border-green/10 bg-cream p-5"
            >
              <div className="mb-4 aspect-square rounded-xl bg-green/10" />
              <div className="h-4 w-2/3 rounded bg-green/10" />
              <div className="mt-2 h-3 w-1/3 rounded bg-green/10" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

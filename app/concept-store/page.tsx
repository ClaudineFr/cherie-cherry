import ProductGrid from "./ProductGrid";

export default function ConceptStorePage() {
  return (
    <main className="flex-1 bg-cream px-6 py-20">
      <div className="mx-auto max-w-5xl">
        {/* En-tête */}
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

        <div className="mt-16">
          <ProductGrid />
        </div>
      </div>
    </main>
  );
}

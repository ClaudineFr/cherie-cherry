import ProductGrid from "./ProductGrid";
import { fetchProducts } from "./api";

// Server Component asynchrone : le fetch se fait sur le serveur Next
// (donc pas besoin de CORS), puis on passe les produits à la grille.
export default async function ConceptStorePage() {
  const products = await fetchProducts();

  return (
    <main className="flex-1 bg-cream px-6 py-12 sm:py-20">
      <div className="mx-auto max-w-5xl">
        {/* En-tête. Resserré sur mobile : le sous-menu des catégories et les
            premiers produits doivent rester visibles sans faire défiler. */}
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-green sm:text-sm">
            Concept store
          </p>
          <h1 className="mt-2 font-serif text-3xl text-green sm:mt-3 sm:text-4xl">
            La boutique
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm text-ink/70 sm:mt-4 sm:text-base">
            Déco, papeterie et prêt-à-porter féminin, chinés et sélectionnés
            avec soin.
          </p>
        </div>

        <div className="mt-8 sm:mt-14">
          <ProductGrid products={products} />
        </div>
      </div>
    </main>
  );
}

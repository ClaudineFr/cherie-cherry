"use client";
// ↑ Ce composant est interactif (clics, saisie, filtrage à la volée).
//   La directive "use client" dit à Next.js de l'exécuter dans le navigateur.

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaSliders } from "react-icons/fa6";
import { type Category, type Product } from "./products";
import AddToCartButton from "@/components/AddToCartButton";
import CategoryTabs from "./CategoryTabs";
import FilterControls, { priceRanges } from "./FilterControls";
import FilterSheet from "./FilterSheet";

export default function ProductGrid({ products }: { products: Product[] }) {
  // Chaque filtre = un morceau d'état. Quand l'état change,
  // React ré-affiche automatiquement la grille filtrée.
  const [category, setCategory] = useState<Category | "all">("all");
  const [priceIndex, setPriceIndex] = useState<number | "all">("all");
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [search, setSearch] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);

  // Le compteur des onglets ignore la catégorie choisie (sinon toutes les
  // autres afficheraient 0) mais tient compte des autres filtres : le chiffre
  // annonce donc bien ce qu'on trouvera en cliquant.
  const matchesSecondary = (product: Product) => {
    if (priceIndex !== "all" && !priceRanges[priceIndex].test(product.price))
      return false;
    if (featuredOnly && !product.featured) return false;
    if (
      search.trim() !== "" &&
      !product.name.toLowerCase().includes(search.trim().toLowerCase())
    )
      return false;
    return true;
  };

  const counts = useMemo(() => {
    const result: Record<string, number> = {};
    for (const product of products) {
      if (!matchesSecondary(product)) continue;
      result[product.category] = (result[product.category] ?? 0) + 1;
    }
    return result;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products, priceIndex, featuredOnly, search]);

  const totalMatching = useMemo(
    () => products.filter(matchesSecondary).length,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [products, priceIndex, featuredOnly, search],
  );

  // Un produit reste affiché s'il passe TOUS les filtres.
  const filtered = products.filter(
    (product) =>
      (category === "all" || product.category === category) &&
      matchesSecondary(product),
  );

  // Combien de filtres secondaires sont actifs : sert au badge du bouton
  // « Filtrer » sur mobile, pour qu'on sache qu'un filtre est posé même
  // panneau fermé.
  const activeCount =
    (priceIndex === "all" ? 0 : 1) +
    (featuredOnly ? 1 : 0) +
    (search.trim() === "" ? 0 : 1);

  // Remet tous les filtres à leur valeur de départ.
  const clearAll = () => {
    setCategory("all");
    setPriceIndex("all");
    setFeaturedOnly(false);
    setSearch("");
  };

  // La boutique est vide : ni onglets ni filtres à afficher.
  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-green/10 bg-cream px-6 py-16 text-center">
        <p className="font-serif text-xl text-green">
          La boutique se remplit bientôt
        </p>
        <p className="mt-2 text-sm text-ink/50">
          De jolies choses arrivent très prochainement. Revenez vite&nbsp;!
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* --- Sous-menu des catégories --- */}
      <div className="border-b border-green/10">
        <CategoryTabs
          value={category}
          onChange={setCategory}
          counts={counts}
          total={totalMatching}
        />
      </div>

      {/* --- Barre d'action mobile : les filtres secondaires tiennent dans un
              panneau, pour que les produits restent visibles à l'arrivée. --- */}
      <div className="mt-4 flex items-center justify-between sm:hidden">
        <p className="text-xs text-ink/50">
          {filtered.length} produit{filtered.length > 1 ? "s" : ""}
        </p>
        <button
          type="button"
          onClick={() => setSheetOpen(true)}
          className="flex items-center gap-2 rounded-full border border-green/20 px-4 py-1.5 text-xs text-green transition hover:border-green/50"
        >
          <FaSliders className="h-3 w-3" />
          Filtrer
          {activeCount > 0 && (
            <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-green px-1 text-[0.6rem] text-cream">
              {activeCount}
            </span>
          )}
        </button>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-10 sm:mt-10 sm:grid-cols-[14rem_1fr]">
        {/* --- Colonne de filtres : desktop seulement --- */}
        <aside className="hidden h-fit rounded-2xl border border-green/10 bg-cream px-5 py-5 sm:block">
          <div className="flex items-baseline justify-between border-b border-green/10 pb-3">
            <p className="font-serif text-lg text-green">Filtres</p>
            <button
              type="button"
              onClick={clearAll}
              className="text-[0.7rem] uppercase tracking-wider text-ink/40 transition hover:text-green"
            >
              Tout effacer
            </button>
          </div>

          <div className="pt-4">
            <FilterControls
              search={search}
              onSearchChange={setSearch}
              priceIndex={priceIndex}
              onPriceChange={setPriceIndex}
              featuredOnly={featuredOnly}
              onFeaturedChange={setFeaturedOnly}
            />
          </div>
        </aside>

        {/* --- Colonne de produits --- */}
        <div>
          {filtered.length > 0 ? (
            <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-8 xl:grid-cols-3">
              {filtered.map((product) => (
                <li
                  key={product.id ?? product.name}
                  className="flex flex-col rounded-2xl border border-green/10 bg-cream p-3 sm:p-5"
                >
                  {/* La photo et le titre mènent à la fiche produit. On n'enveloppe
                      PAS toute la carte : le bouton « Ajouter au panier » se
                      retrouverait dans le lien, ce qui est du HTML invalide et
                      déclencherait les deux actions d'un seul clic. */}
                  <Link
                    href={`/concept-store/${product.slug}`}
                    tabIndex={-1}
                    aria-hidden
                    className="relative mb-3 block aspect-square overflow-hidden rounded-xl bg-pink sm:mb-4"
                  >
                    {product.image && (
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1280px) 40vw, 25vw"
                        className="object-cover transition duration-300 hover:scale-105"
                      />
                    )}
                    {product.featured && (
                      <span className="absolute left-2 top-2 rounded-full bg-green px-2 py-0.5 text-[0.6rem] text-cream sm:left-3 sm:top-3 sm:px-3 sm:py-1 sm:text-xs">
                        Coup de cœur
                      </span>
                    )}
                  </Link>

                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="font-serif text-base text-green sm:text-lg">
                      {/* Le lien porté par le titre est le seul atteignable au
                          clavier : celui de la photo est masqué (aria-hidden)
                          pour ne pas annoncer deux fois la même destination. */}
                      <Link
                        href={`/concept-store/${product.slug}`}
                        className="transition hover:opacity-70"
                      >
                        {product.name}
                      </Link>
                    </h3>
                    <span className="whitespace-nowrap text-sm text-green sm:text-base">
                      {product.price} €
                    </span>
                  </div>
                  {product.description && (
                    <p className="mt-1 hidden text-sm text-ink/50 sm:block">
                      {product.description}
                    </p>
                  )}

                  {/* mt-auto pousse le bouton en bas : toutes les cartes d'une
                      même rangée alignent leur bouton, quelle que soit la
                      longueur de la description. */}
                  <div className="mt-auto">
                    {product.id !== undefined && (
                      <AddToCartButton
                        product={{
                          id: product.id,
                          name: product.name,
                          price: product.price,
                          image: product.image,
                          stock: product.stock ?? 0,
                        }}
                      />
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="py-16 text-center">
              <p className="text-ink/50">
                Aucun produit ne correspond à ces filtres.
              </p>
              <button
                type="button"
                onClick={clearAll}
                className="mt-4 text-sm text-green underline underline-offset-4 transition hover:opacity-70"
              >
                Effacer les filtres
              </button>
            </div>
          )}
        </div>
      </div>

      {/* --- Panneau de filtres mobile --- */}
      <FilterSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        resultCount={filtered.length}
        onClear={clearAll}
      >
        <FilterControls
          search={search}
          onSearchChange={setSearch}
          priceIndex={priceIndex}
          onPriceChange={setPriceIndex}
          featuredOnly={featuredOnly}
          onFeaturedChange={setFeaturedOnly}
        />
      </FilterSheet>
    </div>
  );
}

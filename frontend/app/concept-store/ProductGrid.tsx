"use client";
// ↑ Ce composant est interactif (clics, saisie, filtrage à la volée).
//   La directive "use client" dit à Next.js de l'exécuter dans le navigateur.

import { useState } from "react";
import Image from "next/image";
import { categories, type Category, type Product } from "./products";

// `test` renvoie true si le prix du produit entre dans la tranche.
const priceRanges = [
  { label: "Moins de 20 €", test: (p: number) => p < 20 },
  { label: "20 – 50 €", test: (p: number) => p >= 20 && p <= 50 },
  { label: "Plus de 50 €", test: (p: number) => p > 50 },
];

export default function ProductGrid({ products }: { products: Product[] }) {
  // Chaque filtre = un morceau d'état. Quand l'état change,
  // React ré-affiche automatiquement la grille filtrée.
  const [category, setCategory] = useState<Category | "all">("all");
  const [priceIndex, setPriceIndex] = useState<number | "all">("all");
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [search, setSearch] = useState("");

  // On part de tous les produits, puis on retire ceux qui ne passent
  // pas chaque filtre actif. Un produit reste affiché s'il passe TOUS les filtres.
  const filtered = products.filter((product) => {
    if (category !== "all" && product.category !== category) return false;
    if (priceIndex !== "all" && !priceRanges[priceIndex].test(product.price))
      return false;
    if (featuredOnly && !product.featured) return false;
    if (
      search.trim() !== "" &&
      !product.name.toLowerCase().includes(search.trim().toLowerCase())
    )
      return false;
    return true;
  });
  const clearAll = () => {
    setCategory("all");
    setPriceIndex("all");
    setFeaturedOnly(false);
    setSearch("");
  };

  // Style d'une ligne de filtre dans la sidebar (actif / inactif).
  // La ligne active passe en vert ; sinon elle s'éclaire au survol.
  const row = (active: boolean) =>
    `filter-option${active ? " filter-option--active" : ""} w-full rounded-lg px-3 py-1 text-left text-[0.7rem] transition ${
      active ? "font-medium text-green" : "text-ink/60 hover:text-green"
    }`;
  const sectionTitle =
    "filter-group-title mb-2 text-[0.65rem] uppercase tracking-[0.2em] text-green/70";

  return (
    <div className="product-grid-layout grid grid-cols-1 gap-10 md:grid-cols-[16rem_1fr]">
      {/* Colonne de filtres */}
      <aside className="product-filters h-fit rounded-2xl border border-green/10 bg-cream px-5 py-5">
        <div className="product-filters-header flex items-baseline justify-between border-b border-green/10 pb-3">
          <p className="product-filters-title font-serif text-lg text-green">Filtres</p>
          <button
            type="button"
            onClick={clearAll}
            className="product-filters-clear text-[0.7rem] uppercase tracking-wider text-ink/40 transition hover:text-green"
          >
            Tout effacer
          </button>
        </div>

        {/* Recherche */}
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un produit…"
          className="product-filters-search mt-4 w-full rounded-full border border-green/20 bg-cream px-4 py-1.5 text-[0.7rem] text-ink outline-none placeholder:text-ink/40 focus:border-green/50"
        />

        {/* Filtre par catégorie */}
        <div className="filter-group filter-group--category mt-4 border-t border-green/10 pt-4">
          <p className={sectionTitle}>Catégorie</p>
          <div className="filter-options flex flex-col gap-0.5">
            <button
              type="button"
              onClick={() => setCategory("all")}
              className={row(category === "all")}
            >
              Tout
            </button>
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={row(category === c)}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Filtre par prix */}
        <div className="filter-group filter-group--price mt-4 border-t border-green/10 pt-4">
          <p className={sectionTitle}>Prix</p>
          <div className="filter-options flex flex-col gap-0.5">
            <button
              type="button"
              onClick={() => setPriceIndex("all")}
              className={row(priceIndex === "all")}
            >
              Tous les prix
            </button>
            {priceRanges.map((range, i) => (
              <button
                key={range.label}
                type="button"
                onClick={() => setPriceIndex(i)}
                className={row(priceIndex === i)}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        {/* Coups de cœur */}
        <div className="filter-group filter-group--featured mt-4 border-t border-green/10 pt-4">
          <button
            type="button"
            onClick={() => setFeaturedOnly((v) => !v)}
            className={row(featuredOnly)}
          >
            ♥ Coups de cœur
          </button>
        </div>
      </aside>

      {/* Colonne de produits */}
      <div className="product-results">
        {filtered.length > 0 ? (
          <ul className="product-list grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((product) => (
              <li
                key={product.id ?? product.name}
                className="product-card flex flex-col rounded-2xl border border-green/10 bg-cream p-5"
              >
                <div className="product-card-media relative mb-4 aspect-square overflow-hidden rounded-xl bg-pink">
                  {product.image && (
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      className="product-card-image object-cover"
                    />
                  )}
                  {product.featured && (
                    <span className="product-card-badge absolute left-3 top-3 rounded-full bg-green px-3 py-1 text-xs text-cream">
                      Coup de cœur
                    </span>
                  )}
                </div>

                <div className="product-card-heading flex items-baseline justify-between gap-3">
                  <h3 className="product-card-name font-serif text-lg text-green">
                    {product.name}
                  </h3>
                  <span className="product-card-price whitespace-nowrap text-green">
                    {product.price} €
                  </span>
                </div>
                {product.description && (
                  <p className="product-card-description mt-1 text-sm text-ink/50">
                    {product.description}
                  </p>
                )}
              </li>
            ))}
          </ul>
        ) : products.length === 0 ? (
          <div className="product-empty rounded-2xl border border-green/10 bg-cream px-6 py-16 text-center">
            <p className="product-empty-title font-serif text-xl text-green">
              La boutique se remplit bientôt
            </p>
            <p className="product-empty-text mt-2 text-sm text-ink/50">
              De jolies choses arrivent très prochainement. Revenez vite&nbsp;!
            </p>
          </div>
        ) : (
          <p className="product-no-results text-center text-ink/50">
            Aucun produit ne correspond à ces filtres.
          </p>
        )}
      </div>
    </div>
  );
}

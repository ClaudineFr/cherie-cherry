"use client";
// ↑ Ce composant est interactif (clics, saisie, filtrage à la volée).
//   La directive "use client" dit à Next.js de l'exécuter dans le navigateur.

import { useState } from "react";
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

  // Remet tous les filtres à leur valeur de départ.
  const clearAll = () => {
    setCategory("all");
    setPriceIndex("all");
    setFeaturedOnly(false);
    setSearch("");
  };

  // Style d'une ligne de filtre dans la sidebar (actif / inactif).
  // La ligne active passe en vert ; sinon elle s'éclaire au survol.
  const row = (active: boolean) =>
    `w-full rounded-lg px-3 py-1 text-left text-[0.7rem] transition ${
      active ? "font-medium text-green" : "text-ink/60 hover:text-green"
    }`;

  // Petit titre de section dans la sidebar.
  const sectionTitle =
    "mb-2 text-[0.65rem] uppercase tracking-[0.2em] text-green/70";

  return (
    <div className="grid grid-cols-1 gap-10 md:grid-cols-[16rem_1fr]">
      {/* --- Colonne de filtres (sidebar) --- */}
      <aside className="h-fit rounded-2xl border border-green/10 bg-cream px-5 py-5">
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

        {/* search */}
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un produit…"
          className="mt-4 w-full rounded-full border border-green/20 bg-cream px-4 py-1.5 text-[0.7rem] text-ink outline-none placeholder:text-ink/40 focus:border-green/50"
        />

        {/* Filtre par catégorie */}
        <div className="mt-4 border-t border-green/10 pt-4">
          <p className={sectionTitle}>Catégorie</p>
          <div className="flex flex-col gap-0.5">
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
        <div className="mt-4 border-t border-green/10 pt-4">
          <p className={sectionTitle}>Prix</p>
          <div className="flex flex-col gap-0.5">
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
        <div className="mt-4 border-t border-green/10 pt-4">
          <button
            type="button"
            onClick={() => setFeaturedOnly((v) => !v)}
            className={row(featuredOnly)}
          >
            ♥ Coups de cœur
          </button>
        </div>
      </aside>

      {/* --- Colonne de produits --- */}
      <div>
        {filtered.length > 0 ? (
          <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((product) => (
              <li
                key={product.id ?? product.name}
                className="flex flex-col rounded-2xl border border-green/10 bg-cream p-5"
              >
                <div className="relative mb-4 aspect-square rounded-xl bg-pink">
                  {product.featured && (
                    <span className="absolute left-3 top-3 rounded-full bg-green px-3 py-1 text-xs text-cream">
                      Coup de cœur
                    </span>
                  )}
                </div>
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-serif text-lg text-green">
                    {product.name}
                  </h3>
                  <span className="whitespace-nowrap text-green">
                    {product.price} €
                  </span>
                </div>
                {product.description && (
                  <p className="mt-1 text-sm text-ink/50">
                    {product.description}
                  </p>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-ink/50">
            Aucun produit ne correspond à ces filtres.
          </p>
        )}
      </div>
    </div>
  );
}

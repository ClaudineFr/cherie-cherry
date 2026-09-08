"use client";

// Les filtres secondaires (recherche, prix, coups de cœur), sans mise en page
// propre : c'est le parent qui décide où les poser — la colonne de gauche en
// desktop, le panneau glissant en mobile. Un seul jeu de contrôles pour les
// deux, donc pas d'état à synchroniser ni de balisage à maintenir en double.

export type PriceRange = { label: string; test: (price: number) => boolean };

export const priceRanges: PriceRange[] = [
  { label: "Moins de 20 €", test: (p) => p < 20 },
  { label: "20 – 50 €", test: (p) => p >= 20 && p <= 50 },
  { label: "Plus de 50 €", test: (p) => p > 50 },
];

type Props = {
  search: string;
  onSearchChange: (value: string) => void;
  priceIndex: number | "all";
  onPriceChange: (value: number | "all") => void;
  featuredOnly: boolean;
  onFeaturedChange: (value: boolean) => void;
};

export default function FilterControls({
  search,
  onSearchChange,
  priceIndex,
  onPriceChange,
  featuredOnly,
  onFeaturedChange,
}: Props) {
  // Une ligne de filtre : la valeur active passe en vert.
  const row = (active: boolean) =>
    `w-full rounded-lg px-3 py-1.5 text-left text-sm transition sm:py-1 sm:text-[0.7rem] ${
      active ? "font-medium text-green" : "text-ink/60 hover:text-green"
    }`;

  const sectionTitle =
    "mb-2 text-[0.65rem] uppercase tracking-[0.2em] text-green/70";

  return (
    <>
      <div>
        <label htmlFor="product-search" className="sr-only">
          Rechercher un produit
        </label>
        <input
          id="product-search"
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Rechercher un produit…"
          className="w-full rounded-full border border-green/20 bg-cream px-4 py-2 text-sm text-ink outline-none placeholder:text-ink/40 focus:border-green/50 sm:py-1.5 sm:text-[0.7rem]"
        />
      </div>

      <div className="mt-5 border-t border-green/10 pt-4">
        <p className={sectionTitle}>Prix</p>
        <div className="flex flex-col gap-0.5">
          <button
            type="button"
            onClick={() => onPriceChange("all")}
            className={row(priceIndex === "all")}
          >
            Tous les prix
          </button>
          {priceRanges.map((range, i) => (
            <button
              key={range.label}
              type="button"
              onClick={() => onPriceChange(i)}
              className={row(priceIndex === i)}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 border-t border-green/10 pt-4">
        <button
          type="button"
          onClick={() => onFeaturedChange(!featuredOnly)}
          aria-pressed={featuredOnly}
          className={row(featuredOnly)}
        >
          ♥ Coups de cœur
        </button>
      </div>
    </>
  );
}

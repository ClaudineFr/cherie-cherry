"use client";

import { categories, type Category } from "./products";

type Props = {
  value: Category | "all";
  onChange: (value: Category | "all") => void;
  // Le nombre de produits par catégorie n'est pas affiché : il sert seulement
  // à repérer les catégories vides, pour les désactiver.
  counts: Record<string, number>;
  total: number;
};

// Le sous-menu de catégories, juste sous le titre de la page.
//
// Sur mobile la ligne défile horizontalement plutôt que de passer à la ligne :
// les produits restent ainsi visibles sans avoir à faire défiler la page.
// `-mx-6 px-6` fait déborder la zone de défilement jusqu'aux bords de l'écran
// (la page a px-6), pour qu'on voie bien qu'il y a d'autres onglets à droite.
export default function CategoryTabs({
  value,
  onChange,
  counts,
  total,
}: Props) {
  const tabs: { key: Category | "all"; label: string; count: number }[] = [
    { key: "all", label: "Tout", count: total },
    ...categories.map((c) => ({ key: c, label: c, count: counts[c] ?? 0 })),
  ];

  return (
    <div
      role="tablist"
      aria-label="Catégories"
      className="-mx-6 flex gap-7 overflow-x-auto px-6 pb-px [scrollbar-width:none] sm:mx-0 sm:justify-center sm:px-0 [&::-webkit-scrollbar]:hidden"
    >
      {tabs.map((tab) => {
        const active = value === tab.key;
        // Une catégorie sans produit ne mène qu'à une page vide : on la laisse
        // visible (la boutique a bien ce rayon) mais on la désactive.
        const empty = tab.count === 0 && !active;

        return (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={active}
            disabled={empty}
            onClick={() => onChange(tab.key)}
            // shrink-0 : les onglets gardent leur largeur et débordent
            // horizontalement au lieu d'être compressés.
            className={`shrink-0 whitespace-nowrap border-b-2 pb-3 pt-1 font-serif text-base transition ${
              active
                ? "border-green text-green"
                : empty
                  ? "cursor-not-allowed border-transparent text-ink/25"
                  : "border-transparent text-ink/50 hover:text-green"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

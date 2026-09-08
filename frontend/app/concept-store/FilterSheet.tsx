"use client";

import { useEffect, useRef } from "react";
import { FaXmark } from "react-icons/fa6";

type Props = {
  open: boolean;
  onClose: () => void;
  // Combien de produits l'utilisateur verra en validant.
  resultCount: number;
  onClear: () => void;
  children: React.ReactNode;
};

// Le panneau de filtres mobile : il monte depuis le bas de l'écran, par-dessus
// la grille. C'est ce que font les boutiques mobiles, et cela évite que les
// filtres poussent les produits hors de l'écran.
export default function FilterSheet({
  open,
  onClose,
  resultCount,
  onClear,
  children,
}: Props) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Fermeture au clavier, et focus déplacé dans le panneau à l'ouverture :
  // sans cela, la touche Tab continuerait de parcourir la page derrière.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);

    // Le fond ne défile plus pendant que le panneau est ouvert.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    panelRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  return (
    // Toujours dans le DOM, masqué par translate : la transition peut jouer
    // dans les deux sens. `invisible` empêche le panneau fermé d'être
    // atteignable au clavier.
    <div
      className={`fixed inset-0 z-50 sm:hidden ${
        open ? "visible" : "invisible"
      }`}
      aria-hidden={!open}
    >
      {/* Voile : un clic dessus ferme le panneau. */}
      <button
        type="button"
        tabIndex={-1}
        aria-label="Fermer les filtres"
        onClick={onClose}
        className={`absolute inset-0 bg-green/30 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Filtres"
        tabIndex={-1}
        className={`absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-cream px-6 pb-8 pt-5 shadow-2xl outline-none transition-transform duration-300 ease-out ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {/* La petite barre d'attrape, signal habituel d'un panneau glissant. */}
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-green/20" />

        <div className="flex items-baseline justify-between border-b border-green/10 pb-3">
          <p className="font-serif text-xl text-green">Filtres</p>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onClear}
              className="text-[0.7rem] uppercase tracking-wider text-ink/40 transition hover:text-green"
            >
              Tout effacer
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Fermer les filtres"
              className="text-green"
            >
              <FaXmark className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="pt-4">{children}</div>

        {/* Le bouton de validation annonce le résultat : on sait ce qu'on
            obtient avant de refermer le panneau. */}
        <button
          type="button"
          onClick={onClose}
          className="mt-7 w-full rounded-full bg-green px-6 py-3 text-sm text-cream transition hover:bg-green-deep"
        >
          {resultCount > 0
            ? `Voir ${resultCount} produit${resultCount > 1 ? "s" : ""}`
            : "Aucun résultat"}
        </button>
      </div>
    </div>
  );
}

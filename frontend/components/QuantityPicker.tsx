"use client";

import { FaMinus, FaPlus } from "react-icons/fa6";

type Props = {
  quantity: number;
  // Au-delà, il n'y a plus d'exemplaires disponibles.
  max: number;
  onChange: (quantity: number) => void;
  // Pour que les lecteurs d'écran sachent de quel produit on parle.
  label: string;
};

// Deux boutons − / + encadrant la quantité. Descendre à 0 retire la ligne,
// c'est géré par le panier lui-même (voir setQuantity dans CartContext).
export default function QuantityPicker({
  quantity,
  max,
  onChange,
  label,
}: Props) {
  const button =
    "flex h-7 w-7 items-center justify-center rounded-full border border-green/20 text-green transition hover:bg-green hover:text-cream disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-green";

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => onChange(quantity - 1)}
        aria-label={`Retirer un ${label}`}
        className={button}
      >
        <FaMinus className="h-2.5 w-2.5" />
      </button>

      {/* aria-live : le changement de quantité est annoncé à voix haute. */}
      <span
        aria-live="polite"
        className="min-w-6 text-center text-sm text-green"
      >
        {quantity}
      </span>

      <button
        type="button"
        onClick={() => onChange(quantity + 1)}
        disabled={quantity >= max}
        aria-label={`Ajouter un ${label}`}
        className={button}
      >
        <FaPlus className="h-2.5 w-2.5" />
      </button>
    </div>
  );
}

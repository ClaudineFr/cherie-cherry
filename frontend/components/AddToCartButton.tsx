"use client";

import { useEffect, useState } from "react";
import { useCart, type CartLine } from "./CartContext";

// Le bouton reçoit tout ce qu'il faut pour créer une ligne de panier,
// sauf la quantité (toujours 1 au clic depuis la grille).
type Props = {
  product: Omit<CartLine, "quantity">;
};

export default function AddToCartButton({ product }: Props) {
  const { addLine, lines, isReady } = useCart();

  // Petit retour visuel après le clic : le libellé passe à « Ajouté ✓ »
  // pendant deux secondes, pour confirmer que le clic a bien été pris.
  const [justAdded, setJustAdded] = useState(false);

  // On nettoie le minuteur si le composant disparaît entre-temps
  // (changement de filtre par exemple), sinon React râle.
  useEffect(() => {
    if (!justAdded) return;
    const timer = setTimeout(() => setJustAdded(false), 2000);
    return () => clearTimeout(timer);
  }, [justAdded]);

  // Tant que le panier n'est pas relu depuis le navigateur, on fait comme
  // s'il était vide : le serveur ne connaît pas son contenu, et afficher
  // « Ajouter » puis « Stock atteint » déclencherait une erreur d'hydratation.
  const inCart = isReady
    ? (lines.find((l) => l.id === product.id)?.quantity ?? 0)
    : 0;

  const soldOut = product.stock <= 0;
  // Tout le stock est déjà dans le panier : on ne peut pas en ajouter plus.
  const maxedOut = !soldOut && inCart >= product.stock;

  const label = soldOut
    ? "Épuisé"
    : maxedOut
      ? "Stock atteint"
      : justAdded
        ? "Ajouté ✓"
        : "Ajouter au panier";

  return (
    <button
      type="button"
      disabled={soldOut || maxedOut}
      onClick={() => {
        addLine(product);
        setJustAdded(true);
      }}
      // aria-live : les lecteurs d'écran annoncent le passage à « Ajouté ✓ ».
      aria-live="polite"
      className="mt-4 w-full rounded-full bg-green px-4 py-2 text-[0.7rem] uppercase tracking-[0.08em] text-cream transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
    >
      {label}
    </button>
  );
}

"use client";

import Link from "next/link";
import { FaBagShopping } from "react-icons/fa6";
import { useCart } from "./CartContext";

// L'icône panier de la navbar, avec une pastille indiquant le nombre d'articles.
export default function CartLink({ onNavigate }: { onNavigate?: () => void }) {
  const { count, isReady } = useCart();

  // Tant que le panier n'est pas relu depuis le navigateur, on n'affiche
  // pas la pastille : le serveur ne connaît pas encore son contenu, et
  // afficher « 0 » puis « 3 » provoquerait une erreur d'hydratation.
  const showCount = isReady && count > 0;

  return (
    <Link
      href="/panier"
      onClick={onNavigate}
      aria-label={
        showCount
          ? `Panier, ${count} article${count > 1 ? "s" : ""}`
          : "Panier, vide"
      }
      className="relative transition-opacity hover:opacity-70"
    >
      <FaBagShopping className="h-5 w-5" />
      {showCount && (
        <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-pink px-1 text-[0.6rem] font-medium text-green">
          {count}
        </span>
      )}
    </Link>
  );
}

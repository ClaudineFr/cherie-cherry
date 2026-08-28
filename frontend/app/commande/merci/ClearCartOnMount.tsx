"use client";

import { useEffect, useRef } from "react";
import { useCart } from "@/components/CartContext";

// Vide le panier une fois le paiement passé.
//
// Composant sans rendu : il n'existe que pour cet effet de bord. On le place
// dans la page de remerciement plutôt que dans la Server Action, parce que le
// panier vit dans le navigateur — le serveur n'y a pas accès.
export default function ClearCartOnMount() {
  const { clear, lines } = useCart();

  // Le vidage est une synchronisation avec le stockage du navigateur, pas un
  // état d'affichage : on le fait donc bien dans un effet. Le garde-fou évite
  // de rappeler clear() à chaque rendu.
  const dejaFait = useRef(false);

  useEffect(() => {
    if (dejaFait.current || lines.length === 0) return;
    dejaFait.current = true;
    clear();
  }, [clear, lines.length]);

  return null;
}

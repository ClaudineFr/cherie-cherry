"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/components/CartContext";
import QuantityPicker from "@/components/QuantityPicker";

// Affiche le contenu du panier. Version simple pour l'instant : la gestion
// fine des quantités et le passage au paiement viendront ensuite.
export default function CartSummary() {
  const { lines, total, count, removeLine, setQuantity, isReady } = useCart();

  // Le panier n'est lu qu'une fois la page arrivée dans le navigateur.
  // Sans ce garde-fou, on afficherait brièvement « panier vide » à tout
  // le monde, y compris à ceux qui ont des articles.
  if (!isReady) {
    return <p className="text-center text-ink/50">Chargement du panier…</p>;
  }

  if (lines.length === 0) {
    return (
      <div className="rounded-2xl border border-green/10 bg-cream px-6 py-16 text-center">
        <p className="font-serif text-xl text-green">Votre panier est vide</p>
        <p className="mt-2 text-sm text-ink/50">
          Découvrez notre sélection de jolies choses.
        </p>
        <Link
          href="/concept-store"
          className="mt-6 inline-block rounded-full bg-green px-6 py-2 text-[0.7rem] uppercase tracking-[0.08em] text-cream transition hover:opacity-80"
        >
          Voir la boutique
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-green/10 bg-cream px-6 py-6">
      <ul className="divide-y divide-green/10">
        {lines.map((line) => (
          <li key={line.id} className="flex items-start gap-4 py-4">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-pink">
              {line.image && (
                <Image
                  src={line.image}
                  alt={line.name}
                  fill
                  sizes="4rem"
                  className="object-cover"
                />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="font-serif text-lg text-green">{line.name}</p>
              <p className="text-sm text-ink/50">{line.price.toFixed(2)} €</p>

              <div className="mt-2">
                <QuantityPicker
                  quantity={line.quantity}
                  max={line.stock}
                  onChange={(q) => setQuantity(line.id, q)}
                  label={line.name}
                />
              </div>

              {/* On prévient quand le + est bloqué, sinon le bouton grisé
                  reste inexpliqué. */}
              {line.quantity >= line.stock && (
                <p className="mt-1 text-[0.7rem] text-ink/40">
                  Dernier{line.stock > 1 ? "s" : ""} exemplaire
                  {line.stock > 1 ? "s" : ""} disponible
                  {line.stock > 1 ? "s" : ""}
                </p>
              )}
            </div>

            <span className="whitespace-nowrap text-green">
              {(line.price * line.quantity).toFixed(2)} €
            </span>

            <button
              type="button"
              onClick={() => removeLine(line.id)}
              aria-label={`Retirer ${line.name} du panier`}
              className="text-[0.7rem] uppercase tracking-wider text-ink/40 transition hover:text-green"
            >
              Retirer
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex items-baseline justify-between border-t border-green/10 pt-4">
        <span className="text-[0.7rem] uppercase tracking-[0.08em] text-ink/50">
          Total ({count} article{count > 1 ? "s" : ""})
        </span>
        <span className="font-serif text-2xl text-green">
          {total.toFixed(2)} €
        </span>
      </div>

      <p className="mt-4 text-center text-sm text-ink/50">
        Retrait en boutique. Le paiement en ligne arrive très bientôt.
      </p>
    </div>
  );
}

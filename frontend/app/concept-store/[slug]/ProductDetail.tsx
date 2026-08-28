"use client";
// Interactif : on change de photo, on choisit une quantité, on ajoute au panier.

import { useEffect, useState } from "react";
import Image from "next/image";
import { useCart } from "@/components/CartContext";
import QuantityPicker from "@/components/QuantityPicker";
import type { Product } from "../products";

export default function ProductDetail({ product }: { product: Product }) {
  const { addLine, lines, isReady } = useCart();

  // La photo principale d'abord, puis les photos supplémentaires triées.
  // filter(Boolean) écarte le cas d'un produit sans photo principale.
  const photos = [
    product.image,
    ...(product.images ?? [])
      .slice()
      .sort((a, b) => a.order - b.order)
      .map((img) => img.image),
  ].filter((src): src is string => Boolean(src));

  const [activePhoto, setActivePhoto] = useState(0);
  // La quantité voulue, telle que choisie. Elle est plafonnée plus bas, au
  // rendu, plutôt que corrigée après coup : si le panier se remplit dans un
  // autre onglet, la valeur affichée reste juste sans aller-retour d'état.
  const [wantedQuantity, setWantedQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    if (!justAdded) return;
    const timer = setTimeout(() => setJustAdded(false), 2500);
    return () => clearTimeout(timer);
  }, [justAdded]);

  const stock = product.stock ?? 0;

  // Comme ailleurs, on attend que le panier soit relu côté navigateur avant
  // de tenir compte de son contenu (sinon : erreur d'hydratation).
  const inCart = isReady
    ? (lines.find((l) => l.id === product.id)?.quantity ?? 0)
    : 0;

  // Ce qu'on peut encore ajouter, une fois déduit ce qui est déjà au panier.
  const remaining = Math.max(0, stock - inCart);

  const soldOut = stock <= 0;
  const maxedOut = !soldOut && remaining === 0;

  // La quantité réellement utilisée : jamais plus que ce qu'il reste.
  const quantity = Math.min(wantedQuantity, Math.max(1, remaining));

  // Le produit vient de l'API, donc il a forcément un id. Le test rassure
  // TypeScript, pour qui `id` reste optionnel sur le type Product.
  const canAdd = product.id !== undefined && !soldOut && !maxedOut;

  return (
    <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
      {/* --- Colonne photos --- */}
      <div>
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-pink">
          {photos.length > 0 ? (
            <Image
              src={photos[activePhoto]}
              alt={product.name}
              fill
              // priority : c'est l'image principale de la page, on demande à
              // Next de la charger en priorité plutôt qu'en différé.
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-green/40">
              Photo à venir
            </div>
          )}

          {product.featured && (
            <span className="absolute left-4 top-4 rounded-full bg-green px-3 py-1 text-xs text-cream">
              Coup de cœur
            </span>
          )}
        </div>

        {/* Vignettes : seulement s'il y a plusieurs photos à départager. */}
        {photos.length > 1 && (
          <ul className="mt-4 flex gap-3">
            {photos.map((src, i) => (
              <li key={src}>
                <button
                  type="button"
                  onClick={() => setActivePhoto(i)}
                  aria-label={`Voir la photo ${i + 1} sur ${photos.length}`}
                  aria-current={i === activePhoto}
                  className={`relative h-16 w-16 overflow-hidden rounded-lg bg-pink transition ${
                    i === activePhoto
                      ? "ring-2 ring-green"
                      : "opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    sizes="4rem"
                    className="object-cover"
                  />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* --- Colonne informations --- */}
      <div>
        <p className="text-[0.7rem] uppercase tracking-[0.2em] text-green/70">
          {product.category}
        </p>

        <h1 className="mt-2 font-serif text-4xl text-green">{product.name}</h1>

        <p className="mt-4 font-serif text-2xl text-green">
          {product.price.toFixed(2)} €
        </p>

        {product.description && (
          <p className="mt-6 text-base leading-relaxed text-ink/70">
            {product.description}
          </p>
        )}

        <div className="mt-8 border-t border-green/10 pt-8">
          {soldOut ? (
            <p className="text-sm text-ink/50">
              Cet article n’est plus disponible pour le moment.
            </p>
          ) : (
            <>
              <div className="flex items-center gap-6">
                <span className="text-[0.7rem] uppercase tracking-[0.08em] text-ink/50">
                  Quantité
                </span>
                <QuantityPicker
                  quantity={quantity}
                  max={Math.max(1, remaining)}
                  // Le sélecteur descend jusqu'à 0 pour retirer une ligne du
                  // panier ; ici on reste à 1 au minimum.
                  onChange={(q) => setWantedQuantity(Math.max(1, q))}
                  label={product.name}
                />
              </div>

              <button
                type="button"
                disabled={!canAdd}
                onClick={() => {
                  if (product.id === undefined) return;
                  addLine(
                    {
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      image: product.image,
                      stock,
                    },
                    quantity,
                  );
                  setJustAdded(true);
                  setWantedQuantity(1);
                }}
                className="mt-6 w-full rounded-full bg-green px-6 py-3 text-[0.7rem] uppercase tracking-[0.08em] text-cream transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {maxedOut ? "Stock atteint" : "Ajouter au panier"}
              </button>

              {/* aria-live : le message est annoncé aux lecteurs d'écran
                  quand il apparaît, sans déplacer le focus. */}
              <p aria-live="polite" className="mt-3 text-center text-sm">
                {justAdded && (
                  <span className="text-green">Ajouté au panier ✓</span>
                )}
              </p>

              {isReady && inCart > 0 && (
                <p className="mt-1 text-center text-[0.7rem] text-ink/40">
                  Déjà {inCart} dans votre panier
                </p>
              )}

              {/* On ne parle du stock que s'il devient un frein à l'achat. */}
              {remaining > 0 && remaining <= 3 && (
                <p className="mt-3 text-center text-[0.7rem] text-ink/40">
                  Plus que {remaining} exemplaire{remaining > 1 ? "s" : ""}{" "}
                  disponible{remaining > 1 ? "s" : ""}
                </p>
              )}
            </>
          )}

          <p className="mt-6 text-center text-[0.7rem] text-ink/40">
            Retrait en boutique
          </p>
        </div>
      </div>
    </div>
  );
}

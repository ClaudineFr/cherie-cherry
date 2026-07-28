"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Story } from "@/app/stories";

// Composant CLIENT : il gère l'affichage de la rangée ET la détection du
// défilement (impossible côté serveur). Les données lui sont passées en props
// par le composant serveur InstagramStories, qui reste responsable du fetch.
export default function StoriesRow({ stories }: { stories: Story[] }) {
  // Référence directe vers la rangée <ul>, pour lire sa position de scroll.
  const rowRef = useRef<HTMLUListElement>(null);

  // Faut-il afficher le voile de gauche / de droite ?
  // Gauche : seulement si on a déjà slidé (scrollLeft > 0) → caché au départ.
  // Droite : tant qu'il reste du contenu à droite → visible au départ.
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  // Recalcule quels voiles montrer à partir de la position de scroll actuelle.
  function updateVeils() {
    const el = rowRef.current;
    if (!el) return;

    // scrollLeft = de combien on a fait glisser vers la droite (0 = tout à gauche).
    setShowLeft(el.scrollLeft > 0);

    // Reste-t-il du contenu à droite ? On compare la position au maximum
    // atteignable. La marge de 1px évite les faux négatifs d'arrondi.
    const maxScroll = el.scrollWidth - el.clientWidth;
    setShowRight(el.scrollLeft < maxScroll - 1);
  }

  // Au montage : on calcule l'état initial (utile si le contenu tient sans
  // scroll → pas de voile droit) et on réagit au redimensionnement de la fenêtre.
  useEffect(() => {
    updateVeils();
    window.addEventListener("resize", updateVeils);
    return () => window.removeEventListener("resize", updateVeils);
  }, [stories]);

  return (
    <div className="relative">
      {/* Voiles dégradés (mobile seulement). Chacun n'est rendu que quand il a
          du sens : gauche une fois qu'on a slidé, droite tant qu'il reste à voir.
          pointer-events-none : ne bloque pas le swipe. */}
      {showLeft && (
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-cream to-transparent md:hidden" />
      )}
      {showRight && (
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-cream to-transparent md:hidden" />
      )}

      {/* Mobile : rangée qui défile horizontalement (swipe), calibrée pour montrer
          ~2 vignettes à la fois. Desktop (lg) : grille de 4, sans défilement. */}
      <ul
        ref={rowRef}
        onScroll={updateVeils}
        // Tablette et + (md, ≥768px) : grille de 4 colonnes, SANS défilement
        // (overflow-visible), resserrée (max-w-2xl) et bien espacée (gap-8).
        // Téléphone : rangée qui défile (swipe), ~2 vignettes visibles.
        className="mx-auto flex snap-x snap-mandatory gap-4 overflow-x-auto px-2 pb-2 sm:gap-6 md:grid md:max-w-5xl md:grid-cols-4 md:gap-4 md:justify-items-center md:overflow-visible"
      >
        {stories.map((story) => (
          <li
            key={story.src}
            // basis-[42%] : chaque vignette occupe ~42 % de la largeur écran sur
            // téléphone → on en voit ~2, la 3e dépasse et invite au swipe.
            // snap-start : le défilement s'aligne joliment sur chaque vignette.
            // md:basis-auto : dès la tablette, la grille reprend la main.
            className="flex w-full flex-shrink-0 basis-[42%] snap-start flex-col items-center gap-2 sm:basis-[38%] md:basis-auto"
          >
            <span className="w-full rounded-2xl bg-gradient-to-tr from-pink to-green p-[3px]">
              <span className="block rounded-2xl bg-cream p-[3px]">
                <Image
                  src={story.src}
                  alt={story.handle}
                  // Format portrait (ratio 3/4), comme la référence Noka.
                  width={220}
                  height={300}
                  // w-full + aspect-[3/4] : la vignette remplit sa place en
                  // gardant le format portrait ; object-cover recadre sans déformer.
                  className="aspect-[3/4] w-full rounded-xl object-cover"
                  sizes="(min-width: 1024px) 25vw, 45vw"
                />
              </span>
            </span>
            <span className="max-w-full truncate text-xs text-ink/70">
              {story.handle}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

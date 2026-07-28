"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Story } from "@/app/stories";

// Composant CLIENT : il gère l'affichage de la rangée ET la détection du
// défilement (impossible côté serveur). Les données lui sont passées en props
// par le composant serveur InstagramStories, qui reste responsable du fetch.
export default function StoriesRow({ stories }: { stories: Story[] }) {
  const rowRef = useRef<HTMLUListElement>(null);

  const [showRight, setShowRight] = useState(true);

  // Recalcule le voile de droite à partir de la position de scroll actuelle.
  function updateVeil() {
    const el = rowRef.current;
    if (!el) return;

    const maxScroll = el.scrollWidth - el.clientWidth;
    setShowRight(el.scrollLeft < maxScroll - 5);
  }

  useEffect(() => {
    updateVeil();
    window.addEventListener("resize", updateVeil);
    return () => window.removeEventListener("resize", updateVeil);
  }, [stories]);

  return (
    <div className="relative">
      {showRight && (
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-cream to-transparent md:hidden" />
      )}

      <ul
        ref={rowRef}
        onScroll={updateVeil}
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
                  width={220}
                  height={300}
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

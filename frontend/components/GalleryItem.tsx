"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Photo } from "@/app/gallery";

type GalleryItemProps = {
  photo: Photo;
  index: number; // sert à décaler l'apparition (effet cascade)
};

export default function GalleryItem({ photo, index }: GalleryItemProps) {
  // `visible` = la photo est-elle entrée dans l'écran ? (false au départ)
  // Si l'utilisateur préfère moins d'animation, on démarre visible : pas de
  // fondu à observer. (On teste `typeof window` car ce code tourne aussi côté
  // serveur, où `window` n'existe pas.)
  const [visible, setVisible] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  // `ref` = un lien direct vers l'élément <figure> dans le DOM, pour l'observer.
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Animation désactivée (déjà visible) : rien à observer.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // L'IntersectionObserver prévient quand l'élément entre dans l'écran.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect(); // une seule fois : on arrête d'observer
        }
      },
      { threshold: 0.15 }, // déclenche quand ~15 % de la photo est visible
    );

    observer.observe(el);
    return () => observer.disconnect(); // nettoyage si le composant disparaît
  }, []);

  return (
    <figure
      ref={ref}
      style={{ transitionDelay: `${index * 80}ms` }}
      className={`mb-4 transition-all duration-700 ease-out ${
        visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      }`}
    >
      <Image
        src={photo.src}
        alt={photo.alt}
        // L'API ne fournit pas les dimensions réelles. On donne des valeurs
        // indicatives (ratio 3/4) pour que next/image réserve de la place ;
        // `h-auto` laisse ensuite le vrai ratio s'appliquer une fois chargé.
        width={600}
        height={800}
        className="h-auto w-full rounded-2xl"
        sizes="(min-width: 1024px) 33vw, 50vw"
      />
    </figure>
  );
}

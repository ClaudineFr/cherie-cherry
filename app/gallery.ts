// Pour modifier la galerie : on ajoute/retire des entrées ici, pas dans l'affichage.
// Chaque photo est importée statiquement pour que next/image l'optimise
// et connaisse ses dimensions (pas de saut de mise en page au chargement).

import type { StaticImageData } from "next/image";
import ambiance1 from "@/public/gallery/ambiance-1.jpg";
import ambiance2 from "@/public/gallery/ambiance-2.png";

export type Photo = {
  src: StaticImageData;
  alt: string;
};

export const gallery: Photo[] = [
  { src: ambiance1, alt: "Le coin café de Chérie Cherry" },
  { src: ambiance2, alt: "L'ambiance du concept store" },
];

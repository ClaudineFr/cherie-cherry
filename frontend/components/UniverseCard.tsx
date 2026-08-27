import Link from "next/link";
import Image, { type StaticImageData } from "next/image";

type UniverseCardProps = {
  href: string;
  image: StaticImageData;
  eyebrow: string;
  title: string;
  description: string;
  /* À activer pour la première carte visible (image LCP, au-dessus de la ligne de flottaison) */
  preload?: boolean;
};

export default function UniverseCard({
  href,
  image,
  eyebrow,
  title,
  description,
  preload = false,
}: UniverseCardProps) {
  return (
    <Link
      href={href}
      className="universe-card group relative flex h-80 flex-col justify-end overflow-hidden rounded-3xl p-8 text-cream"
    >
      {/* Image de fond */}
      <Image
        src={image}
        alt={title}
        fill
        sizes="(max-width: 640px) 100vw, 512px"
        preload={preload}
        className="universe-card-image object-cover transition-transform duration-500 group-hover:scale-105"
      />
      {/* Voile sombre */}
      <div className="universe-card-overlay absolute inset-0 bg-green/50" />

      <div className="universe-card-content relative flex flex-col gap-2">
        <p className="universe-card-eyebrow text-xs uppercase tracking-[0.25em] text-cream/80">
          {eyebrow}
        </p>
        <h3 className="universe-card-title font-serif text-3xl text-cream">
          {title}
        </h3>
        <p className="universe-card-description max-w-xs text-sm text-cream/90">
          {description}
        </p>
        <span className="universe-card-cta mt-2 text-sm uppercase tracking-widest">
          Découvrir →
        </span>
      </div>
    </Link>
  );
}

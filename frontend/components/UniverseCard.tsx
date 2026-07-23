import Link from "next/link";
import Image, { type StaticImageData } from "next/image";

type UniverseCardProps = {
  href: string;
  image: StaticImageData;
  eyebrow: string;
  title: string;
  description: string;
};

export default function UniverseCard({
  href,
  image,
  eyebrow,
  title,
  description,
}: UniverseCardProps) {
  return (
    <Link
      href={href}
      className="group relative flex h-80 flex-col justify-end overflow-hidden rounded-3xl p-8 text-cream"
    >
      {/* Image de fond */}
      <Image
        src={image}
        alt={title}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
      {/* Voile sombre pour la lisibilité du texte */}
      <div className="absolute inset-0 bg-green/50" />

      {/* Contenu au-dessus du voile */}
      <div className="relative flex flex-col gap-2">
        <p className="text-xs uppercase tracking-[0.25em] text-cream/80">
          {eyebrow}
        </p>
        <h3 className="font-serif text-3xl">{title}</h3>
        <p className="max-w-xs text-sm text-cream/90">{description}</p>
        <span className="mt-2 text-sm uppercase tracking-widest">
          Découvrir →
        </span>
      </div>
    </Link>
  );
}

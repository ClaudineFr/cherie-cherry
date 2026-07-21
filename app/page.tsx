import CategoryCard from "@/components/CategoryCard";
import cafeImg from "@/public/categories/cafe.png";
import decoImg from "@/public/categories/deco.png";
import papeterieImg from "@/public/categories/papeterie.png";
import modeImg from "@/public/categories/mode.png";

export default function Home() {
  return (
    <main className="flex-1">
      {/* Section hero */}
      <section className="flex flex-col items-center justify-center gap-6 bg-pink-soft px-6 py-24 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-green">
          Carpentras · Provence
        </p>
        <h1 className="font-serif text-4xl leading-tight text-green sm:text-6xl">
          Chérie Cherry
        </h1>
        <p className="max-w-md text-base text-ink/80">
          Coffee &amp; Matcha Club — un coffee shop et concept store où café,
          déco, papeterie et mode se rencontrent.
        </p>
      </section>

      {/* Section catégories */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <h2 className="mb-12 text-center font-serif text-3xl text-green">
          Ce qu&apos;on propose
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <CategoryCard
            image={cafeImg}
            title="Café & Matcha"
            description="Cafés de spécialité, matcha latte et douceurs maison."
            priority={true}
          />
          <CategoryCard
            image={decoImg}
            title="Déco"
            description="Objets et pièces déco chinés pour la maison."
            priority={true}
          />
          <CategoryCard
            image={papeterieImg}
            title="Papeterie"
            description="Carnets, cartes et petits trésors de bureau."
            priority={true}
          />
          <CategoryCard
            image={modeImg}
            title="Mode"
            description="Une sélection prêt-à-porter féminine et raffinée."
            priority={true}
          />
        </div>
      </section>
    </main>
  );
}

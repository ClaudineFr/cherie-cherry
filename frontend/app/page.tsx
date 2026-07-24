import UniverseCard from "@/components/UniverseCard";
import Gallery from "@/components/Gallery";
import coffeeShopImg from "@/public/universes/coffee-shop.jpg";
import conceptStoreImg from "@/public/universes/concept-store.jpg";

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

      {/* Section : nos deux univers */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <h2 className="mb-12 text-center font-serif text-3xl text-green">
          Nos deux univers
        </h2>
        <div className="grid gap-6 sm:grid-cols-2">
          <UniverseCard
            href="/coffee-shop"
            image={coffeeShopImg}
            eyebrow="Coffee & Matcha Club"
            title="Le coffee shop"
            description="Cafés de spécialité, matcha et pâtisseries maison, à savourer sur place."
            preload
          />
          <UniverseCard
            href="/concept-store"
            image={conceptStoreImg}
            eyebrow="Concept store"
            title="La boutique"
            description="Déco, papeterie et prêt-à-porter féminin, chinés avec soin."
          />
        </div>
      </section>

      {/* Section galerie / ambiance */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <h2 className="mb-4 text-center font-serif text-3xl text-green">
          L&apos;ambiance
        </h2>
        <p className="mx-auto mb-12 max-w-md text-center text-base text-ink/70">
          Un aperçu de notre univers, entre coffee shop et concept store.
        </p>
        <Gallery />
      </section>
    </main>
  );
}

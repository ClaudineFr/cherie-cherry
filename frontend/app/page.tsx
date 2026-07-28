import UniverseCard from "@/components/UniverseCard";
import Gallery from "@/components/Gallery";
import InstagramStories from "@/components/InstagramStories";
import InstagramFeed from "@/components/InstagramFeed";
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
      <section className="mx-auto max-w-5xl px-6 py-12 md:py-16">
        <h2 className="mb-12 text-center font-serif text-2xl text-green md:text-3xl">
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

      {/* Section : stories Instagram mises en avant */}
      <section className="mx-auto max-w-5xl px-6 py-12 md:py-16">
        <h2 className="mb-4 text-center font-serif text-2xl text-green md:text-3xl">
          Chérie Cherry &amp; Vous
        </h2>
        <p className="mx-auto mb-12 max-w-md text-center text-sm text-ink/70 md:text-base">
          Vos plus beaux moments partagés en boutique.
        </p>
        <InstagramStories />
      </section>

      {/* Section : feed Instagram de la marque */}
      <section className="mx-auto max-w-5xl px-6 py-12 md:py-16">
        <h2 className="mb-4 text-center font-serif text-2xl text-green md:text-3xl">
          Rejoignez la communauté
        </h2>
        <p className="mx-auto mb-12 text-center text-xs text-ink/70 md:text-sm">
          Suivez{" "}
          <a
            href="https://www.instagram.com/cheriecherry.fr"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-pink-vivid underline underline-offset-2 transition-opacity hover:opacity-70"
          >
            @cheriecherry.fr
          </a>{" "}
          sur Instagram.
        </p>
        <InstagramFeed />
      </section>

      {/* Section galerie / ambiance */}
      <section className="mx-auto max-w-5xl px-6 py-12 md:py-16">
        <h2 className="mb-4 text-center font-serif text-2xl text-green md:text-3xl">
          L&apos;ambiance
        </h2>
        <p className="mx-auto mb-12 max-w-md text-center text-sm text-ink/70 md:text-base">
          Un aperçu de notre univers, entre coffee shop et concept store.
        </p>
        <Gallery />
      </section>
    </main>
  );
}

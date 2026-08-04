import type { Metadata } from "next";
import { fetchSiteSettings } from "@/app/siteSettings";

export const metadata: Metadata = {
  title: "À propos — Chérie Cherry",
  description:
    "L'histoire de Chérie Cherry, coffee shop et concept store à Carpentras : notre esprit, nos valeurs et les mains derrière le lieu.",
};

const values = [
  {
    emoji: "🌸",
    title: "Fait avec soin",
    text: "Pâtisseries maison, pièces chinées une à une : chaque détail est choisi, jamais standardisé.",
  },
  {
    emoji: "☕",
    title: "Le goût avant tout",
    text: "Cafés de spécialité et matcha sélectionnés avec exigence, pour des boissons qu'on prend le temps de savourer.",
  },
  {
    emoji: "🤍",
    title: "Un lieu qui rassemble",
    text: "Un coin de Provence où l'on vient pour un café, on repart avec un carnet, et on revient pour l'ambiance.",
  },
];

export default async function AProposPage() {
  // Adresse éditable depuis l'admin, glissée dans la phrase de signature.
  const settings = await fetchSiteSettings();

  return (
    <main className="flex-1 bg-cream px-6 py-20">
      <div className="mx-auto max-w-3xl">
        {/* En-tête */}
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-green">
            Notre histoire
          </p>
          <h1 className="mt-3 font-serif text-4xl text-green">
            À propos de Chérie Cherry
          </h1>
          <p className="mx-auto mt-4 max-w-md text-base text-ink/70">
            Un coffee shop et concept store né d&apos;une envie simple :
            réunir sous un même toit tout ce qu&apos;on aime.
          </p>
        </div>

        {/* Récit */}
        <div className="mt-16 flex flex-col gap-6 text-base leading-relaxed text-ink/80">
          <p>
            {/* TODO : à remplacer par la vraie histoire de la fondatrice */}
            Chérie Cherry est né en plein cœur de Carpentras, de l&apos;envie
            de créer un endroit à son image : chaleureux, féminin et un brin
            gourmand. L&apos;idée&nbsp;? Un lieu où l&apos;on peut aussi bien
            s&apos;attabler autour d&apos;un matcha latte que dénicher la petite
            pièce déco qui manquait à la maison.
          </p>
          <p>
            D&apos;un côté, le <strong className="text-green">coffee shop</strong>
            &nbsp;: cafés de spécialité, matcha et pâtisseries faites maison, à
            déguster sur place dans un décor pensé comme un cocon. De
            l&apos;autre, le{" "}
            <strong className="text-green">concept store</strong>&nbsp;: déco,
            papeterie et prêt-à-porter féminin, chinés et sélectionnés avec soin.
          </p>
          <p>
            Deux univers, une même signature&nbsp;: le plaisir des jolies choses,
            faites et choisies avec attention.
          </p>
        </div>

        {/* Valeurs */}
        <div className="mt-16 grid gap-6 sm:grid-cols-3">
          {values.map((value) => (
            <div
              key={value.title}
              className="flex flex-col items-center gap-2 rounded-2xl bg-pink-soft px-5 py-8 text-center"
            >
              <span className="text-2xl">{value.emoji}</span>
              <p className="font-serif text-lg text-green">{value.title}</p>
              <p className="text-sm text-ink/70">{value.text}</p>
            </div>
          ))}
        </div>

        {/* Signature */}
        <p className="mt-16 rounded-2xl bg-pink-soft px-6 py-6 text-center text-sm text-ink/70">
          🍒&nbsp;Chérie Cherry, c&apos;est avant tout un lieu à vivre. Le mieux
          reste encore de pousser la porte&nbsp;: on vous y attend
          {settings.street && `, au ${settings.street}`}
          {settings.city && `, à ${settings.city}`}.
        </p>
      </div>
    </main>
  );
}

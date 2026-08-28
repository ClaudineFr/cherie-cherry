import type { Metadata } from "next";
import type { IconType } from "react-icons";
import {
  LuFlower,
  LuCoffee,
  LuHeart,
  LuSparkles,
  LuGift,
  LuLeaf,
} from "react-icons/lu";
import { fetchSiteSettings } from "@/app/siteSettings";
import { fetchAboutPage } from "@/app/aboutPage";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "L'histoire de Chérie Cherry, coffee shop et concept store à Carpentras : notre esprit, nos valeurs et les mains derrière le lieu.",
};

// Les icônes proposées dans l'admin. La cliente choisit un libellé
// (« Fleur », « Cœur »…), Django enregistre la clé, et c'est ici qu'on la
// traduit en dessin — choisir une icône n'est pas un travail d'éditrice,
// mais le catalogue doit rester le même des deux côtés.
const ICONS: Record<string, IconType> = {
  flower: LuFlower,
  coffee: LuCoffee,
  heart: LuHeart,
  sparkles: LuSparkles,
  gift: LuGift,
  leaf: LuLeaf,
};

export default async function AProposPage() {
  // Le contenu et l'adresse viennent tous deux de l'admin.
  const [about, settings] = await Promise.all([
    fetchAboutPage(),
    fetchSiteSettings(),
  ]);

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
          {about.intro && (
            <p className="mx-auto mt-4 max-w-md text-base text-ink/70">
              {about.intro}
            </p>
          )}
        </div>

        {/* Récit */}
        {about.story_paragraphs.length > 0 && (
          <div className="mt-16 flex flex-col gap-6 text-base leading-relaxed text-ink/80">
            {about.story_paragraphs.map((paragraphe, i) => (
              // Les paragraphes n'ont pas d'identifiant propre et peuvent être
              // réécrits à tout moment : leur position est la seule clé stable.
              <p key={i}>{paragraphe}</p>
            ))}
          </div>
        )}

        {/* Valeurs */}
        {about.values.length > 0 && (
          <div className="mt-16 grid gap-6 sm:grid-cols-3">
            {about.values.map((value) => {
              // Icône inconnue (clé retirée du code) : on retombe sur le cœur
              // plutôt que de planter la page.
              const Icon = ICONS[value.icon] ?? LuHeart;
              return (
                <div
                  key={value.id}
                  className="flex flex-col items-center gap-2 rounded-2xl bg-pink-soft px-5 py-8 text-center"
                >
                  <Icon className="text-xl text-green" aria-hidden />
                  <p className="font-serif text-lg text-green">{value.title}</p>
                  <p className="text-sm text-ink/70">{value.text}</p>
                </div>
              );
            })}
          </div>
        )}

        {/* Signature : l'adresse est ajoutée à la phrase saisie dans l'admin. */}
        {about.closing && (
          <p className="mt-16 rounded-2xl bg-pink-soft px-6 py-6 text-center text-sm text-ink/70">
            {about.closing}
            {settings.street && `, au ${settings.street}`}
            {settings.city && `, à ${settings.city}`}.
          </p>
        )}
      </div>
    </main>
  );
}

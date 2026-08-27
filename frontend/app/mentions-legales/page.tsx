import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions légales",
  description:
    "Mentions légales du site Chérie Cherry : éditeur, hébergeur et propriété intellectuelle.",
};

export default function MentionsLegalesPage() {
  return (
    <main className="legal-page flex-1 bg-cream px-6 py-20">
      <div className="legal-container mx-auto max-w-3xl">
        {/* En-tête */}
        <div className="legal-header text-center">
          <p className="legal-eyebrow text-sm uppercase tracking-[0.3em] text-green">
            Informations légales
          </p>
          <h1 className="legal-title mt-3 font-serif text-4xl text-green">
            Mentions légales
          </h1>
        </div>

        {/* Sections légales */}
        <div className="legal-sections mt-16 flex flex-col gap-12 text-sm leading-relaxed text-ink/80">
          {/* Éditeur du site */}
          <section className="legal-section">
            <h2 className="legal-section-title mb-4 font-serif text-2xl text-green">
              Éditeur du site
            </h2>
            <p>
              {/* TODO : remplacer chaque [À COMPLÉTER] par les vraies informations */}
              Le site <strong>cheriecherry.fr</strong> est édité par&nbsp;:
            </p>
            <ul className="legal-list mt-3 flex flex-col gap-1">
              <li>Raison sociale&nbsp;: [À COMPLÉTER]</li>
              <li>Forme juridique&nbsp;: [À COMPLÉTER — ex. SARL, SAS, EI]</li>
              <li>Capital social&nbsp;: [À COMPLÉTER, le cas échéant]</li>
              <li>
                Siège social&nbsp;: 7 rue de la République, 84200 Carpentras
              </li>
              <li>SIRET&nbsp;: [À COMPLÉTER]</li>
              <li>Numéro de TVA intracommunautaire&nbsp;: [À COMPLÉTER]</li>
              <li>Téléphone&nbsp;: [À COMPLÉTER]</li>
              <li>Email&nbsp;: contact@cheriecherry.fr</li>
              <li>
                Directeur / directrice de la publication&nbsp;: [À COMPLÉTER]
              </li>
            </ul>
          </section>

          {/* Hébergeur */}
          <section className="legal-section">
            <h2 className="legal-section-title mb-4 font-serif text-2xl text-green">
              Hébergeur
            </h2>
            <p>Le site est hébergé par&nbsp;:</p>
            <ul className="legal-list mt-3 flex flex-col gap-1">
              {/* TODO : renseigner l'hébergeur réel (ex. Vercel, OVH…) */}
              <li>Nom&nbsp;: [À COMPLÉTER — ex. Vercel Inc., OVH…]</li>
              <li>Adresse&nbsp;: [À COMPLÉTER]</li>
              <li>Contact&nbsp;: [À COMPLÉTER]</li>
            </ul>
          </section>

          {/* Propriété intellectuelle */}
          <section className="legal-section">
            <h2 className="legal-section-title mb-4 font-serif text-2xl text-green">
              Propriété intellectuelle
            </h2>
            <p>
              L&apos;ensemble des contenus présents sur ce site (textes, images,
              logo, éléments graphiques et mise en page) est la propriété de
              Chérie Cherry, sauf mention contraire, et est protégé par le droit
              d&apos;auteur. Toute reproduction ou utilisation, totale ou
              partielle, sans autorisation préalable est interdite.
            </p>
          </section>

          {/* Contact */}
          <section className="legal-section">
            <h2 className="legal-section-title mb-4 font-serif text-2xl text-green">
              Contact
            </h2>
            <p>
              Pour toute question relative au site, vous pouvez nous écrire à
              l&apos;adresse{" "}
              <a
                href="mailto:contact@cheriecherry.fr"
                className="legal-link text-green underline underline-offset-2"
              >
                contact@cheriecherry.fr
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}

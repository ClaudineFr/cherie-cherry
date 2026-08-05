import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description:
    "Politique de confidentialité de Chérie Cherry : données collectées via le formulaire de contact, finalité, durée de conservation et vos droits.",
};

export default function ConfidentialitePage() {
  return (
    <main className="flex-1 bg-cream px-6 py-20">
      <div className="mx-auto max-w-3xl">
        {/* En-tête */}
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-green">
            Vos données personnelles
          </p>
          <h1 className="mt-3 font-serif text-4xl text-green">
            Politique de confidentialité
          </h1>
          <p className="mx-auto mt-4 max-w-md text-base text-ink/70">
            Chérie Cherry attache de l&apos;importance à la protection de vos
            données. Voici comment elles sont traitées.
          </p>
        </div>

        {/* Sections */}
        <div className="mt-16 flex flex-col gap-12 text-sm leading-relaxed text-ink/80">
          {/* Responsable du traitement */}
          <section>
            <h2 className="mb-4 font-serif text-2xl text-green">
              Responsable du traitement
            </h2>
            <p>
              {/* TODO : renseigner l'identité du responsable (souvent identique à l'éditeur des mentions légales) */}
              Les données collectées via ce site sont traitées par Chérie
              Cherry, [À COMPLÉTER — raison sociale], dont le siège social est
              situé au 7 rue de la République, 84200 Carpentras. Pour toute
              question, vous pouvez écrire à{" "}
              <a
                href="mailto:contact@cheriecherry.fr"
                className="text-green underline underline-offset-2"
              >
                contact@cheriecherry.fr
              </a>
              .
            </p>
          </section>

          {/* Données collectées */}
          <section>
            <h2 className="mb-4 font-serif text-2xl text-green">
              Données collectées
            </h2>
            <p>
              Nous collectons uniquement les données que vous nous transmettez
              volontairement via le formulaire de contact&nbsp;:
            </p>
            <ul className="mt-3 flex list-disc flex-col gap-1 pl-5">
              <li>votre nom&nbsp;;</li>
              <li>votre adresse email&nbsp;;</li>
              <li>l&apos;objet et le contenu de votre message.</li>
            </ul>
            <p className="mt-3">
              Aucune donnée n&apos;est collectée à votre insu, et aucune
              création de compte n&apos;est requise.
            </p>
          </section>

          {/* Finalité et base légale */}
          <section>
            <h2 className="mb-4 font-serif text-2xl text-green">
              Pourquoi ces données&nbsp;?
            </h2>
            <p>
              Ces informations servent uniquement à traiter votre demande et à
              y répondre. La base légale de ce traitement est l&apos;intérêt
              légitime de Chérie Cherry à répondre aux sollicitations qui lui
              sont adressées.
            </p>
          </section>

          {/* Durée de conservation */}
          <section>
            <h2 className="mb-4 font-serif text-2xl text-green">
              Durée de conservation
            </h2>
            <p>
              {/* TODO : ajuster la durée réellement pratiquée */}
              Vos données sont conservées le temps nécessaire au traitement de
              votre demande, puis supprimées dans un délai de [À COMPLÉTER —
              ex. 12 mois] après notre dernier échange.
            </p>
          </section>

          {/* Destinataires */}
          <section>
            <h2 className="mb-4 font-serif text-2xl text-green">
              Qui a accès à vos données&nbsp;?
            </h2>
            <p>
              Vos données sont destinées exclusivement à Chérie Cherry et ne
              sont ni vendues, ni cédées, ni transmises à des tiers à des fins
              commerciales.
            </p>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="mb-4 font-serif text-2xl text-green">Cookies</h2>
            <p>
              Ce site n&apos;utilise aucun cookie de suivi, de publicité ni de
              mesure d&apos;audience. Seuls les cookies strictement nécessaires
              à son bon fonctionnement peuvent être utilisés, sans traitement
              de vos données personnelles à des fins de profilage.
            </p>
          </section>

          {/* Vos droits */}
          <section>
            <h2 className="mb-4 font-serif text-2xl text-green">Vos droits</h2>
            <p>
              Conformément au Règlement général sur la protection des données
              (RGPD), vous disposez d&apos;un droit d&apos;accès, de
              rectification, d&apos;effacement et d&apos;opposition sur vos
              données. Pour exercer ces droits, écrivez-nous à{" "}
              <a
                href="mailto:contact@cheriecherry.fr"
                className="text-green underline underline-offset-2"
              >
                contact@cheriecherry.fr
              </a>
              .
            </p>
            <p className="mt-3">
              Si vous estimez, après nous avoir contactés, que vos droits ne
              sont pas respectés, vous pouvez adresser une réclamation à la
              CNIL (
              <a
                href="https://www.cnil.fr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green underline underline-offset-2"
              >
                www.cnil.fr
              </a>
              ).
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}

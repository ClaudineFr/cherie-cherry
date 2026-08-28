import type { Metadata } from "next";
import { fetchLegalSettings, ouACompleter } from "../legalSettings";
import {
  adresseEnLigne,
  emailOuACompleter,
  fetchSiteSettings,
} from "../siteSettings";

export const metadata: Metadata = {
  title: "Mentions légales",
  description:
    "Mentions légales du site Chérie Cherry : éditeur, hébergeur et propriété intellectuelle.",
};

export default async function MentionsLegalesPage() {
  // Les informations viennent de l'admin : la propriétaire les met à jour
  // elle-même, sans passer par une modification du site.
  const [legal, site] = await Promise.all([
    fetchLegalSettings(),
    fetchSiteSettings(),
  ]);

  return (
    <main className="flex-1 bg-cream px-6 py-20">
      <div className="mx-auto max-w-3xl">
        {/* En-tête */}
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-green">
            Informations légales
          </p>
          <h1 className="mt-3 font-serif text-4xl text-green">
            Mentions légales
          </h1>
        </div>

        {/* Sections légales */}
        <div className="mt-16 flex flex-col gap-12 text-sm leading-relaxed text-ink/80">
          {/* Éditeur du site */}
          <section>
            <h2 className="mb-4 font-serif text-2xl text-green">
              Éditeur du site
            </h2>
            <p>
              Le site <strong>cheriecherry.fr</strong> est édité par&nbsp;:
            </p>
            <ul className="mt-3 flex flex-col gap-1">
              <li>Raison sociale&nbsp;: {ouACompleter(legal.company_name)}</li>
              <li>Forme juridique&nbsp;: {ouACompleter(legal.legal_form)}</li>
              {legal.share_capital && (
                <li>Capital social&nbsp;: {legal.share_capital}</li>
              )}
              <li>Siège social&nbsp;: {adresseEnLigne(site)}</li>
              <li>SIRET&nbsp;: {ouACompleter(legal.siret)}</li>
              {legal.vat_number && (
                <li>
                  Numéro de TVA intracommunautaire&nbsp;: {legal.vat_number}
                </li>
              )}
              <li>Téléphone&nbsp;: {ouACompleter(site.phone)}</li>
              <li>Email&nbsp;: {emailOuACompleter(site)}</li>
              <li>
                Directeur / directrice de la publication&nbsp;:{" "}
                {ouACompleter(legal.publication_director)}
              </li>
            </ul>
          </section>

          {/* Hébergeur */}
          <section>
            <h2 className="mb-4 font-serif text-2xl text-green">Hébergeur</h2>
            <p>Le site est hébergé par&nbsp;:</p>
            <ul className="mt-3 flex flex-col gap-1">
              <li>Nom&nbsp;: {ouACompleter(legal.host_name)}</li>
              <li>Adresse&nbsp;: {ouACompleter(legal.host_address)}</li>
              <li>Contact&nbsp;: {ouACompleter(legal.host_contact)}</li>
            </ul>
          </section>

          {/* Propriété intellectuelle */}
          <section>
            <h2 className="mb-4 font-serif text-2xl text-green">
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
          <section>
            <h2 className="mb-4 font-serif text-2xl text-green">Contact</h2>
            <p>
              Pour toute question relative au site, vous pouvez nous écrire à
              l&apos;adresse{" "}
              <a
                href={`mailto:${site.email}`}
                className="text-green underline underline-offset-2"
              >
                {emailOuACompleter(site)}
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}

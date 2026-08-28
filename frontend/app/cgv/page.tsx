import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Conditions générales de vente",
  description:
    "Conditions générales de vente de la boutique en ligne Chérie Cherry : commande, paiement, livraison, retrait en boutique et droit de rétractation.",
};

// Les CGV de la boutique en ligne.
//
// ⚠️ Ce texte couvre les mentions rendues obligatoires par le code de la
// consommation pour la vente à distance, mais il doit être relu et complété
// par la propriétaire (et idéalement par un professionnel du droit) : il
// engage son entreprise. Les [À COMPLÉTER] marquent les informations que
// seule elle possède.
export default function CGVPage() {
  const section = "mb-4 font-serif text-2xl text-green";
  const sousTitre = "mt-6 mb-2 font-medium text-green";

  return (
    <main className="flex-1 bg-cream px-6 py-20">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-green">
            Informations légales
          </p>
          <h1 className="mt-3 font-serif text-4xl text-green">
            Conditions générales de vente
          </h1>
          <p className="mt-4 text-sm text-ink/50">
            Dernière mise à jour&nbsp;: [À COMPLÉTER — date de mise en ligne]
          </p>
        </div>

        <div className="mt-16 flex flex-col gap-12 text-sm leading-relaxed text-ink/80">
          <section>
            <h2 className={section}>1. Objet et champ d’application</h2>
            <p>
              Les présentes conditions générales de vente régissent les ventes
              de produits conclues sur le site www.cheriecherry.fr entre&nbsp;:
            </p>
            <ul className="mt-3 flex flex-col gap-1">
              <li>
                Le vendeur&nbsp;: [À COMPLÉTER — raison sociale], dont le siège
                social est situé 7 rue de la République, 84200 Carpentras,
                immatriculée sous le numéro SIRET [À COMPLÉTER], ci-après
                «&nbsp;le Vendeur&nbsp;»&nbsp;;
              </li>
              <li>
                Toute personne physique non commerçante effectuant un achat sur
                le site, ci-après «&nbsp;le Client&nbsp;».
              </li>
            </ul>
            <p className="mt-3">
              Toute commande passée sur le site suppose l’acceptation préalable
              et sans réserve des présentes conditions. Elles peuvent être
              modifiées à tout moment&nbsp;; les conditions applicables sont
              celles en vigueur à la date de la commande.
            </p>
            <p className="mt-3">
              Les informations légales complètes figurent dans les{" "}
              <Link
                href="/mentions-legales"
                className="text-green underline underline-offset-2"
              >
                mentions légales
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className={section}>2. Produits</h2>
            <p>
              Les produits proposés sont ceux figurant sur le site le jour de sa
              consultation, dans la limite des stocks disponibles. Chaque
              produit est présenté avec une description et une ou plusieurs
              photographies.
            </p>
            <p className="mt-3">
              Les photographies sont les plus fidèles possibles mais ne peuvent
              assurer une similitude parfaite avec le produit, notamment en
              raison des réglages d’écran. Une partie des articles étant chinée
              ou fabriquée en petite série, de légères variations d’aspect
              peuvent exister d’un exemplaire à l’autre.
            </p>
            <p className="mt-3">
              En cas d’indisponibilité d’un produit après passation de la
              commande, le Client en est informé et remboursé dans les meilleurs
              délais.
            </p>
          </section>

          <section>
            <h2 className={section}>3. Prix</h2>
            <p>
              Les prix sont indiqués en euros, toutes taxes comprises, hors
              frais de livraison. Les frais de livraison éventuels sont indiqués
              avant la validation définitive de la commande.
            </p>
            <p className="mt-3">
              Le Vendeur se réserve le droit de modifier ses prix à tout
              moment&nbsp;; les produits sont facturés sur la base des tarifs en
              vigueur au moment de l’enregistrement de la commande.
            </p>
          </section>

          <section>
            <h2 className={section}>4. Commande</h2>
            <p>
              Le Client sélectionne les produits, renseigne ses coordonnées,
              choisit son mode de réception puis procède au paiement. La
              validation du paiement vaut conclusion du contrat de vente.
            </p>
            <p className="mt-3">
              Un email de confirmation récapitulant la commande est adressé au
              Client. Le Vendeur se réserve le droit d’annuler toute commande
              présentant un caractère anormal ou frauduleux.
            </p>
          </section>

          <section>
            <h2 className={section}>5. Paiement</h2>
            <p>
              Le paiement s’effectue en ligne par carte bancaire, via la
              plateforme sécurisée Stripe. Les coordonnées bancaires du Client
              sont transmises directement à Stripe et ne transitent pas par les
              serveurs du Vendeur, qui n’y a à aucun moment accès.
            </p>
            <p className="mt-3">
              La commande est enregistrée dès confirmation du paiement par
              Stripe. En cas de refus de paiement, la commande est
              automatiquement annulée.
            </p>
          </section>

          <section>
            <h2 className={section}>6. Retrait en boutique et livraison</h2>

            <h3 className={sousTitre}>Retrait en boutique</h3>
            <p>
              Le retrait est gratuit. La commande est mise à disposition à
              l’adresse du magasin, 7 rue de la République, 84200 Carpentras,
              aux horaires d’ouverture. Le Client est prévenu dès que sa
              commande est prête et dispose de [À COMPLÉTER — ex. 14 jours] pour
              venir la récupérer.
            </p>

            <h3 className={sousTitre}>Livraison à domicile</h3>
            <p>
              Les livraisons sont assurées en France métropolitaine uniquement.
              Les frais de livraison sont indiqués avant validation de la
              commande et peuvent être offerts à partir d’un certain montant
              d’achat.
            </p>
            <p className="mt-3">
              Les commandes sont expédiées sous [À COMPLÉTER — ex. 3 jours
              ouvrés] à compter de la confirmation du paiement. Le délai de
              livraison indicatif est de [À COMPLÉTER — ex. 2 à 5 jours ouvrés]
              après expédition. Conformément à l’article L.216-1 du code de la
              consommation, la livraison intervient au plus tard trente (30)
              jours après la conclusion du contrat.
            </p>
            <p className="mt-3">
              En cas de retard de livraison, le Client peut demander la
              résolution de la vente dans les conditions prévues aux articles
              L.216-2 et suivants du même code. Les risques sont transférés au
              Client au moment de la prise de possession physique des produits.
            </p>
          </section>

          <section>
            <h2 className={section}>7. Droit de rétractation</h2>
            <p>
              Conformément à l’article L.221-18 du code de la consommation, le
              Client dispose d’un délai de{" "}
              <strong className="text-green">quatorze (14) jours</strong> à
              compter de la réception de sa commande pour exercer son droit de
              rétractation, sans avoir à motiver sa décision ni à supporter
              d’autres coûts que les frais de retour.
            </p>
            <p className="mt-3">
              Pour exercer ce droit, le Client notifie sa décision par une
              déclaration dénuée d’ambiguïté, par email à
              contact@cheriecherry.fr ou par courrier à l’adresse du siège.
            </p>
            <p className="mt-3">
              Les produits doivent être retournés dans leur état d’origine,
              complets et non utilisés, dans les quatorze (14) jours suivant la
              notification. Les frais de retour restent à la charge du Client.
            </p>
            <p className="mt-3">
              Le remboursement intervient dans les quatorze (14) jours suivant
              la récupération des produits, par le même moyen de paiement que
              celui utilisé lors de la commande.
            </p>

            <h3 className={sousTitre}>Exceptions</h3>
            <p>
              Conformément à l’article L.221-28 du code de la consommation, le
              droit de rétractation ne s’applique pas aux produits confectionnés
              sur mesure ou nettement personnalisés, ni aux produits descellés
              ne pouvant être renvoyés pour des raisons d’hygiène.
            </p>
          </section>

          <section>
            <h2 className={section}>8. Garanties</h2>
            <p>
              Indépendamment de toute garantie commerciale, le Vendeur reste
              tenu de la garantie légale de conformité (articles L.217-4 et
              suivants du code de la consommation) et de la garantie contre les
              vices cachés (articles 1641 et suivants du code civil).
            </p>
            <p className="mt-3">
              Le Client dispose de deux (2) ans à compter de la délivrance du
              bien pour agir au titre de la garantie de conformité, et peut
              choisir entre la réparation et le remplacement du produit.
            </p>
          </section>

          <section>
            <h2 className={section}>9. Données personnelles</h2>
            <p>
              Les données collectées lors de la commande sont nécessaires à son
              traitement et ne sont utilisées que dans ce cadre. Leur traitement
              est détaillé dans la{" "}
              <Link
                href="/confidentialite"
                className="text-green underline underline-offset-2"
              >
                politique de confidentialité
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className={section}>10. Réclamations et litiges</h2>
            <p>
              Pour toute réclamation, le Client peut écrire à
              contact@cheriecherry.fr. Les présentes conditions sont soumises au
              droit français.
            </p>
            <p className="mt-3">
              Conformément à l’article L.612-1 du code de la consommation, le
              Client peut recourir gratuitement à un médiateur de la
              consommation en vue de la résolution amiable d’un litige&nbsp;: [À
              COMPLÉTER — nom et coordonnées du médiateur souscrit].
            </p>
            <p className="mt-3">
              Le Client peut également utiliser la plateforme européenne de
              règlement en ligne des litiges accessible à l’adresse
              ec.europa.eu/consumers/odr.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}

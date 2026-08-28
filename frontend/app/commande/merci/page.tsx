import type { Metadata } from "next";
import Link from "next/link";
import ClearCartOnMount from "./ClearCartOnMount";

export const metadata: Metadata = {
  title: "Merci pour votre commande",
  robots: { index: false, follow: false },
};

// Page d'arrivée après un paiement réussi.
//
// Elle n'enregistre RIEN : c'est le webhook Stripe qui confirme la commande,
// côté serveur. Un client peut fermer son onglet avant d'arriver ici, ou le
// rouvrir plus tard — sa commande est valide dans les deux cas. Cette page
// ne fait que rassurer et vider le panier.
export default function MerciPage() {
  return (
    <main className="flex-1 bg-cream px-6 py-20">
      <div className="mx-auto max-w-xl text-center">
        <ClearCartOnMount />

        <p className="text-sm uppercase tracking-[0.3em] text-green">
          Commande confirmée
        </p>

        <h1 className="mt-3 font-serif text-4xl text-green">
          Merci pour votre commande&nbsp;!
        </h1>

        <p className="mt-6 text-base leading-relaxed text-ink/70">
          Votre paiement a bien été enregistré. Vous allez recevoir un email de
          confirmation avec le détail de votre commande.
        </p>

        <div className="mt-8 rounded-2xl border border-green/10 bg-cream px-6 py-6 text-left">
          <p className="font-serif text-lg text-green">Et maintenant&nbsp;?</p>
          <ul className="mt-3 space-y-2 text-sm text-ink/60">
            <li>
              • Si vous avez choisi le <strong>retrait en boutique</strong>,
              nous vous préviendrons dès que votre commande sera prête.
            </li>
            <li>
              • Si vous avez choisi la <strong>livraison</strong>, votre colis
              part sous quelques jours.
            </li>
          </ul>
        </div>

        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/concept-store"
            className="rounded-full bg-green px-6 py-2 text-[0.7rem] uppercase tracking-[0.08em] text-cream transition hover:opacity-80"
          >
            Retour à la boutique
          </Link>
          <Link
            href="/contact"
            className="rounded-full border border-green/20 px-6 py-2 text-[0.7rem] uppercase tracking-[0.08em] text-green transition hover:border-green/50"
          >
            Une question&nbsp;?
          </Link>
        </div>
      </div>
    </main>
  );
}

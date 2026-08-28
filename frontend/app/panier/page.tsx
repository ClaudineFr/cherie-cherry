import type { Metadata } from "next";
import CartSummary from "./CartSummary";

export const metadata: Metadata = {
  title: "Panier",
  // Une page de panier n'a aucun intérêt dans les résultats de recherche,
  // et son contenu est propre à chaque visiteur.
  robots: { index: false, follow: true },
};

export default function PanierPage() {
  return (
    <main className="flex-1 bg-cream px-6 py-20">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-green">
            Concept store
          </p>
          <h1 className="mt-3 font-serif text-4xl text-green">Votre panier</h1>
        </div>

        <div className="mt-16">
          <CartSummary />
        </div>
      </div>
    </main>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FaChevronLeft } from "react-icons/fa6";
import { fetchProductBySlug } from "../api";
import ProductDetail from "./ProductDetail";

// Le nom du dossier ([slug]) donne le nom du paramètre. Next 16 le fournit
// dans une promesse, d'où le `await` : la valeur n'est pas connue au moment
// où le composant est appelé.
type Props = { params: Promise<{ slug: string }> };

// Next appelle cette fonction avant d'afficher la page, pour remplir le titre
// de l'onglet et les métadonnées de partage. On refait un appel à l'API, mais
// Next met en cache le résultat le temps de la requête : le produit n'est
// pas récupéré deux fois.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await fetchProductBySlug(slug);

  if (!product) return { title: "Produit introuvable" };

  return {
    title: product.name,
    description:
      product.description ||
      `${product.name}, à découvrir au concept store Chérie Cherry.`,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.image ? [product.image] : undefined,
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await fetchProductBySlug(slug);

  // Slug inconnu (produit supprimé, lien erroné) : on rend la page 404
  // du site plutôt qu'une page vide ou une erreur.
  if (!product) notFound();

  return (
    <main className="flex-1 bg-cream px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/concept-store"
          className="inline-flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.08em] text-ink/50 transition hover:text-green"
        >
          <FaChevronLeft className="h-2.5 w-2.5" />
          Retour à la boutique
        </Link>

        <div className="mt-8">
          <ProductDetail product={product} />
        </div>
      </div>
    </main>
  );
}

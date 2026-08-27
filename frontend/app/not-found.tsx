import Link from "next/link";

// Page 404 : affichée pour toute URL inconnue. Rendue à l'intérieur du layout
// racine, elle garde donc la Navbar et le Footer — le visiteur reste dans le
// site et peut rebondir facilement.
export default function NotFound() {
  return (
    <main className="not-found-page flex flex-1 flex-col items-center justify-center bg-cream px-6 py-24 text-center">
      <p className="not-found-eyebrow text-sm uppercase tracking-[0.3em] text-green">
        Oups…
      </p>

      <p className="not-found-code mt-6 font-serif text-7xl leading-none text-pink-deep sm:text-8xl">
        404
      </p>

      <h1 className="not-found-title mt-6 font-serif text-3xl text-green sm:text-4xl">
        Cette page a filé
      </h1>

      <p className="not-found-text mt-4 max-w-md text-base text-ink/70">
        La page que vous cherchez n&apos;existe pas ou a été déplacée. Mais il y
        a plein d&apos;autres jolies choses à découvrir chez Chérie Cherry.
      </p>

      <div className="not-found-actions mt-10">
        <Link
          href="/"
          className="not-found-link text-sm text-green underline underline-offset-4 transition-colors hover:text-green-deep"
        >
          Retour à l&apos;accueil
        </Link>
      </div>
    </main>
  );
}

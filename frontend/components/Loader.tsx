// Loader réutilisable, aux couleurs de la marque.
//
// Pas de "use client" : le composant n'a ni état ni événement, c'est du CSS pur.
// Il peut donc être utilisé aussi bien dans un Server Component (un
// `loading.tsx` de page) que dans un composant client (un bouton).
//
// Usages typiques :
//   <Loader />                       → loader de page, centré, avec le texte
//   <Loader size="sm" label={null} /> → petit, dans un bouton, sans texte

type LoaderProps = {
  /** Taille de l'anneau. sm = dans un bouton, md = dans une section, lg = page entière. */
  size?: "sm" | "md" | "lg";
  /**
   * Texte affiché sous l'anneau. `null` pour n'afficher que l'anneau
   * (le texte reste alors lisible par les lecteurs d'écran, cf. sr-only).
   */
  label?: string | null;
  /** Classes Tailwind supplémentaires (marges, hauteur du conteneur…). */
  className?: string;
};

// Diamètre de l'anneau + épaisseur du trait, par taille.
const sizes = {
  sm: "h-4 w-4 border-2",
  md: "h-8 w-8 border-2",
  lg: "h-12 w-12 border-[3px]",
};

export default function Loader({
  size = "md",
  label = "Chargement…",
  className = "",
}: LoaderProps) {
  return (
    // role="status" : annonce aux lecteurs d'écran qu'une zone est en cours
    // de mise à jour. aria-live="polite" : ils l'annoncent sans couper
    // l'utilisateur dans sa lecture.
    <div
      role="status"
      aria-live="polite"
      className={`flex flex-col items-center justify-center ${label ? "gap-3" : ""} ${className}`}
    >
      {/* L'anneau : un cercle dont on ne colore que le haut du trait
          (border-t-pink-vivid). En tournant, on ne voit donc qu'un arc rose
          glisser sur un anneau vert pâle.
          motion-reduce:animate-none → l'anneau ne tourne pas si la personne a
          demandé moins d'animations dans les réglages de son système. */}
      <span
        aria-hidden="true"
        className={`inline-block animate-spin rounded-full border-green/15 border-t-pink-vivid motion-reduce:animate-none ${sizes[size]}`}
      />

      {/* Le texte : visible si `label` est fourni, sinon masqué à l'écran mais
          toujours lu par les lecteurs d'écran (sr-only). */}
      {label ? (
        <p className="text-sm tracking-wide text-green/70">{label}</p>
      ) : (
        <span className="sr-only">Chargement…</span>
      )}
    </div>
  );
}

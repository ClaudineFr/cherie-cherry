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
      className={`loader loader--${size} flex flex-col items-center justify-center ${label ? "gap-3" : ""} ${className}`}
    >
      {/* Seul le haut du trait est coloré : en tournant, un arc rose glisse sur
          l'anneau. motion-reduce:animate-none respecte prefers-reduced-motion. */}
      <span
        aria-hidden="true"
        className={`loader-ring inline-block animate-spin rounded-full border-green/15 border-t-pink-vivid motion-reduce:animate-none ${sizes[size]}`}
      />

      {/* Sans `label`, le texte reste lu par les lecteurs d'écran (sr-only). */}
      {label ? (
        <p className="loader-label text-sm tracking-wide text-green/70">
          {label}
        </p>
      ) : (
        <span className="loader-label sr-only">Chargement…</span>
      )}
    </div>
  );
}

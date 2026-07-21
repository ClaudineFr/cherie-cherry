import { FaInstagram, FaTiktok } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="bg-green text-cream">
      {/* Zone principale : 3 colonnes, le bloc central mis en avant */}
      <div className="mx-auto grid max-w-4xl gap-10 px-8 py-14 text-center sm:grid-cols-3 sm:items-start sm:gap-8">
        {/* Contact */}
        <div className="flex flex-col items-center gap-2 text-xs text-cream/80">
          <p className="mb-2 uppercase tracking-widest text-cream">Contact</p>
          <p>7 rue de la République</p>
          <p>84200 Carpentras</p>
          <p>Du mardi au dimanche · 10h30 – 19h00</p>
        </div>

        {/* Bloc central : le nom + baseline, mis en avant */}
        <div className="flex flex-col items-center gap-2">
          <p className="font-serif text-xl leading-none">Chérie Cherry</p>
          <p className="mt-1 text-[0.65rem] uppercase tracking-[0.25em] text-cream/70">
            Coffee &amp; Matcha Club
          </p>
          <p className="max-w-xs text-xs text-cream/80">
            Un coffee shop et concept store en plein cœur de Carpentras : café,
            matcha, déco, papeterie et mode.
          </p>
        </div>

        {/* Réseaux sociaux */}
        <div className="flex flex-col items-center gap-2 text-xs">
          <p className="mb-2 uppercase tracking-widest text-cream">Nous suivre</p>
          <div className="flex gap-3">
            <a
              href="https://www.instagram.com/cheriecherry.fr"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-cream/10 transition-colors hover:bg-cream/25"
            >
              <FaInstagram className="h-4 w-4" />
            </a>
            <a
              href="https://www.tiktok.com/@cheriecherry.fr"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-cream/10 transition-colors hover:bg-cream/25"
            >
              <FaTiktok className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Barre copyright séparée */}
      <div className="border-t border-cream/15 py-4">
        <p className="text-center text-xs text-cream/50">
          © 2026 Chérie Cherry. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
}

import Image from "next/image";
import { FaInstagram, FaTiktok } from "react-icons/fa6";
import logo from "@/public/logo-comingsoon.png";

// Page « bientôt disponible » affichée le temps de finir le site.
// Elle est en plein écran (fixed inset-0) pour recouvrir la Navbar et le
// Footer du layout racine : le visiteur ne voit qu'elle.
// L'affichage est piloté par le proxy (proxy.ts) via la variable COMING_SOON.
export default function ComingSoonPage() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-8 bg-green px-6 text-center text-cream">
      <Image
        src={logo}
        alt="Chérie Cherry"
        priority
        className="h-auto w-64 sm:w-80"
      />

      <div className="flex flex-col items-center gap-3">
        <p className="text-xs uppercase tracking-[0.3em] text-cream/70">
          Coffee &amp; Matcha Club
        </p>
        <h1 className="font-serif text-3xl text-pink-vivid sm:text-4xl">
          Bientôt disponible
        </h1>
        <p className="max-w-sm text-xs text-cream/80">
          Le site internet de notre coffee shop et concept store ouvre très
          prochainement. Suivez-nous pour ne rien manquer.
        </p>
      </div>

      {/* Réseaux sociaux, mêmes liens et style que le footer */}
      <div className="flex gap-3">
        <a
          href="https://www.instagram.com/cheriecherry.fr"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-cream/10 transition-colors hover:bg-cream/25"
        >
          <FaInstagram className="h-5 w-5" />
        </a>
        <a
          href="https://www.tiktok.com/@cheriecherry.fr"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="TikTok"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-cream/10 transition-colors hover:bg-cream/25"
        >
          <FaTiktok className="h-5 w-5" />
        </a>
      </div>
    </div>
  );
}

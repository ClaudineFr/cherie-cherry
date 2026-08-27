import Image from "next/image";
import { FaInstagram, FaTiktok } from "react-icons/fa6";
import logo from "@/public/logo-comingsoon.png";
import { fetchSiteSettings } from "@/app/siteSettings";

// Page « bientôt disponible » affichée le temps de finir le site.
// Elle est en plein écran (fixed inset-0) pour recouvrir la Navbar et le
// Footer du layout racine : le visiteur ne voit qu'elle.
// L'affichage est piloté par le proxy (proxy.ts) via la variable COMING_SOON.
export default async function ComingSoonPage() {
  const settings = await fetchSiteSettings();

  return (
    <div className="coming-soon-page fixed inset-0 z-50 flex flex-col items-center justify-center gap-8 bg-green px-6 text-center text-cream">
      <Image
        src={logo}
        alt="Chérie Cherry"
        priority
        className="coming-soon-logo h-auto w-64 sm:w-80"
      />

      <div className="coming-soon-content flex flex-col items-center gap-3">
        <p className="coming-soon-eyebrow text-sm uppercase tracking-[0.3em] text-cream/70">
          Coffee &amp; Matcha Club
        </p>
        <h1 className="coming-soon-title font-serif text-4xl text-pink-vivid sm:text-5xl">
          Bientôt disponible
        </h1>
        <p className="coming-soon-text max-w-md text-sm text-cream/80 sm:text-base">
          Le site internet de notre coffee shop et concept store ouvre très
          prochainement. Suivez-nous pour ne rien manquer.
        </p>
      </div>

      {/* Réseaux sociaux (mêmes liens que le footer) */}
      <div className="coming-soon-social flex gap-3">
        {settings.instagram_url && (
          <a
            href={settings.instagram_url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="coming-soon-social-link coming-soon-social-link--instagram flex h-10 w-10 items-center justify-center rounded-full bg-cream/10 transition-colors hover:bg-cream/25"
          >
            <FaInstagram className="h-5 w-5" />
          </a>
        )}
        {settings.tiktok_url && (
          <a
            href={settings.tiktok_url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="TikTok"
            className="coming-soon-social-link coming-soon-social-link--tiktok flex h-10 w-10 items-center justify-center rounded-full bg-cream/10 transition-colors hover:bg-cream/25"
          >
            <FaTiktok className="h-5 w-5" />
          </a>
        )}
      </div>
    </div>
  );
}

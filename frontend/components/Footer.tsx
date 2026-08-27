import Link from "next/link";
import { FaInstagram, FaTiktok } from "react-icons/fa6";
import { fetchOpeningHours, groupOpeningHours } from "@/app/openingHours";
import { fetchSiteSettings } from "@/app/siteSettings";

// async : le footer va chercher horaires + coordonnées sur l'API au rendu
// (Server Component).
export default async function Footer() {
  // On récupère les horaires puis on les regroupe (jours identiques fusionnés).
  const hours = groupOpeningHours(await fetchOpeningHours());

  // Les coordonnées éditables depuis l'admin (adresse, réseaux sociaux).
  const settings = await fetchSiteSettings();

  return (
    <footer className="footer bg-green text-cream">
      <div className="footer-columns mx-auto grid max-w-4xl gap-10 px-8 py-14 text-center sm:grid-cols-3 sm:items-start sm:gap-8">
        {/* Contact */}
        <div className="footer-contact flex flex-col items-center gap-2 text-xs text-cream/80">
          <p className="footer-column-title mb-2 uppercase tracking-widest text-cream">Contact</p>
          {/* Adresse : chaque ligne ne s'affiche que si elle est renseignée. */}
          {settings.street && <p>{settings.street}</p>}
          {(settings.postal_code || settings.city) && (
            <p>
              {settings.postal_code} {settings.city}
            </p>
          )}
          {/* Horaires : une ligne par plage de jours regroupée */}
          <div className="footer-hours mt-2 flex flex-col gap-0.5">
            <p className="footer-column-title uppercase tracking-widest text-cream">Horaires</p>
            {hours.map((range) => (
              <p key={range.days}>
                {range.days} {range.hours}
              </p>
            ))}
          </div>
        </div>

        {/* Bloc central : le nom + baseline, mis en avant */}
        <div className="footer-brand flex flex-col items-center gap-2">
          <p className="footer-brand-name font-serif text-xl leading-none">Chérie Cherry</p>
          <p className="footer-brand-baseline mt-1 text-[0.65rem] uppercase tracking-[0.25em] text-cream/70">
            Coffee &amp; Matcha Club
          </p>
          <p className="footer-brand-description max-w-xs text-xs text-cream/80">
            Un coffee shop et concept store en plein cœur de Carpentras : café,
            matcha, déco, papeterie et mode.
          </p>
        </div>

        {/* Réseaux sociaux */}
        <div className="footer-social flex flex-col items-center gap-2 text-xs">
          <p className="footer-column-title mb-2 uppercase tracking-widest text-cream">
            Nous suivre
          </p>
          <div className="footer-social-links flex gap-3">
            {/* Chaque réseau ne s'affiche que si son lien est renseigné. */}
            {settings.instagram_url && (
              <a
                href={settings.instagram_url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="footer-social-link footer-social-link--instagram flex h-9 w-9 items-center justify-center rounded-full bg-cream/10 transition-colors hover:bg-cream/25"
              >
                <FaInstagram className="h-4 w-4" />
              </a>
            )}
            {settings.tiktok_url && (
              <a
                href={settings.tiktok_url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="footer-social-link footer-social-link--tiktok flex h-9 w-9 items-center justify-center rounded-full bg-cream/10 transition-colors hover:bg-cream/25"
              >
                <FaTiktok className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Barre copyright séparée — empilée sur mobile, en ligne sur sm+ */}
      <div className="footer-bottom border-t border-cream/15 py-4 text-xs text-cream/50">
        <div className="footer-bottom-inner flex flex-col items-center gap-2 sm:flex-row sm:justify-center sm:gap-2">
          <span>© 2026 Chérie Cherry. Tous droits réservés.</span>
          <span aria-hidden="true" className="hidden sm:inline">
            ·
          </span>
          {/* Liens légaux : côte à côte sous le copyright sur mobile */}
          <span className="footer-legal-links flex items-center gap-2">
            <Link
              href="/mentions-legales"
              className="underline underline-offset-2 transition-opacity hover:opacity-70"
            >
              Mentions légales
            </Link>
            <span aria-hidden="true">·</span>
            <Link
              href="/confidentialite"
              className="underline underline-offset-2 transition-opacity hover:opacity-70"
            >
              Confidentialité
            </Link>
          </span>
        </div>
      </div>
    </footer>
  );
}

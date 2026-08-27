import type { IconType } from "react-icons";
import { LuMail, LuMapPin, LuClock } from "react-icons/lu";
import ContactForm from "@/components/ContactForm";
import { fetchOpeningHours, groupOpeningHours } from "@/app/openingHours";
import { fetchSiteSettings } from "@/app/siteSettings";

// async : la page va chercher horaires + coordonnées sur l'API au rendu
// (Server Component).
export default async function ContactPage() {
  // Horaires regroupés (jours fermés masqués), transformés en texte.
  // Ex. "Mardi – Samedi · 10h30 – 19h00".
  const ranges = groupOpeningHours(await fetchOpeningHours());
  const horaires = ranges
    .map((range) => `${range.days} · ${range.hours}`)
    .join(" — ");
  const settings = await fetchSiteSettings();

  // Adresse sur une ligne, ex. "7 rue de la République, 84200 Carpentras".
  // On assemble seulement les morceaux renseignés (pas de virgule orpheline).
  const adresse = [
    settings.street,
    `${settings.postal_code} ${settings.city}`.trim(),
  ]
    .filter(Boolean)
    .join(", ");

  // On ne montre chaque encart que s'il a une valeur (email/adresse peuvent
  // être vides tant que la proprio ne les a pas remplis).
  const contactInfos = [
    settings.email && { Icon: LuMail, label: "Email", value: settings.email },
    adresse && { Icon: LuMapPin, label: "Adresse", value: adresse },
    horaires && { Icon: LuClock, label: "Horaires", value: horaires },
  ].filter(Boolean) as { Icon: IconType; label: string; value: string }[];

  // Carte Google Maps déduite de l'adresse (pas de champ dédié dans l'admin).
  const mapsSrc = adresse
    ? `https://www.google.com/maps?q=${encodeURIComponent(adresse)}&output=embed`
    : null;

  return (
    <main className="contact-page flex-1 bg-cream px-6 py-20">
      <div className="contact-container mx-auto max-w-3xl">
        <p className="contact-eyebrow text-center text-sm uppercase tracking-[0.3em] text-green">
          Une question ?
        </p>
        <h1 className="contact-title mt-3 text-center font-serif text-4xl text-green">
          Contactez-nous
        </h1>

        {/* Bandeau coordonnées */}
        <div className="contact-infos mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {contactInfos.map((info) => (
            <div
              key={info.label}
              className="contact-info-card flex flex-col items-center gap-1 rounded-2xl bg-pink-soft px-4 py-6 text-center"
            >
              <info.Icon
                className="contact-info-icon text-xl text-green"
                aria-hidden
              />
              <p className="contact-info-label text-xs uppercase tracking-widest text-green">
                {info.label}
              </p>
              <p className="contact-info-value text-sm text-ink/70">
                {info.value}
              </p>
            </div>
          ))}
        </div>

        {/* Formulaire */}
        <div className="contact-form-wrapper mt-14">
          <ContactForm />
        </div>

        {/* Carte Google Maps */}
        {mapsSrc && (
          <div className="contact-map mt-14">
            <h2 className="contact-map-title mb-4 text-center font-serif text-2xl text-green">
              Nous trouver
            </h2>
            <iframe
              title={`Carte — Chérie Cherry, ${adresse}`}
              src={mapsSrc}
              className="contact-map-frame h-80 w-full rounded-2xl border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        )}
      </div>
    </main>
  );
}

import ContactForm from "@/components/ContactForm";

const contactInfos = [
  { emoji: "📞", label: "Téléphone", value: "04 90 XX XX XX" },
  { emoji: "✉️", label: "Email", value: "contact@cheriecherry.fr" },
  {
    emoji: "📍",
    label: "Adresse",
    value: "7 rue de la République, 84200 Carpentras",
  },
  { emoji: "🕒", label: "Horaires", value: "Mar. – Dim. · 10h30 – 19h00" },
];

export default function ContactPage() {
  return (
    <main className="flex-1 bg-cream px-6 py-20">
      <div className="mx-auto max-w-3xl">
        <p className="text-center text-sm uppercase tracking-[0.3em] text-green">
          Une question ?
        </p>
        <h1 className="mt-3 text-center font-serif text-4xl text-green">
          Contactez-nous
        </h1>

        {/* Bandeau coordonnées */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {contactInfos.map((info) => (
            <div
              key={info.label}
              className="flex flex-col items-center gap-1 rounded-2xl bg-pink-soft px-4 py-6 text-center"
            >
              <span className="text-2xl">{info.emoji}</span>
              <p className="text-xs uppercase tracking-widest text-green">
                {info.label}
              </p>
              <p className="text-sm text-ink/70">{info.value}</p>
            </div>
          ))}
        </div>

        {/* Formulaire pleine largeur */}
        <div className="mt-14">
          <ContactForm />
        </div>

        {/* Carte Google Maps */}
        <div className="mt-14">
          <h2 className="mb-4 text-center font-serif text-2xl text-green">
            Nous trouver
          </h2>
          <iframe
            title="Carte — Chérie Cherry, 7 rue de la République, Carpentras"
            src="https://www.google.com/maps?q=7+rue+de+la+R%C3%A9publique+84200+Carpentras&output=embed"
            className="h-80 w-full rounded-2xl border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </div>
    </main>
  );
}

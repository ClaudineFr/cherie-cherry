"use client";

import { useEffect, useState } from "react";

export default function ContactForm() {
  // 1. L'état du formulaire : un objet avec nos 4 champs.
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  // 2. L'état pour savoir si le message a été "envoyé".
  const [sent, setSent] = useState(false);

  // 2b. Quand "sent" passe à true, on attend 4s puis on réinitialise tout.
  useEffect(() => {
    if (!sent) return; // rien à faire tant qu'on n'a pas envoyé

    const timer = setTimeout(() => {
      setForm({ name: "", email: "", subject: "", message: "" });
      setSent(false);
    }, 4000);

    // Nettoyage : si le composant disparaît avant la fin, on annule le minuteur.
    return () => clearTimeout(timer);
  }, [sent]);

  // 3. Appelé à chaque frappe dans un champ : met à jour l'état.
  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  }

  // 4. Appelé à la soumission du formulaire.
  function handleSubmit(event: React.FormEvent) {
    event.preventDefault(); // empêche le rechargement de page par défaut
    console.log("Message envoyé (simulation) :", form);
    setSent(true);
  }

  // 5. Si déjà envoyé, on affiche un message de confirmation à la place.
  if (sent) {
    return (
      <p className="rounded-2xl bg-pink-soft px-6 py-8 text-center text-green">
        Merci {form.name} ! Votre message a bien été envoyé. 🍒
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <input
          type="text"
          name="name"
          placeholder="Votre nom"
          value={form.name}
          onChange={handleChange}
          required
          className="rounded-xl border border-green/20 bg-white px-4 py-3 text-sm outline-none focus:border-green"
        />
        <input
          type="email"
          name="email"
          placeholder="Votre email"
          value={form.email}
          onChange={handleChange}
          required
          className="rounded-xl border border-green/20 bg-white px-4 py-3 text-sm outline-none focus:border-green"
        />
      </div>
      <input
        type="text"
        name="subject"
        placeholder="Sujet"
        value={form.subject}
        onChange={handleChange}
        required
        className="rounded-xl border border-green/20 bg-white px-4 py-3 text-sm outline-none focus:border-green"
      />
      <textarea
        name="message"
        placeholder="Votre message"
        value={form.message}
        onChange={handleChange}
        required
        rows={5}
        className="rounded-xl border border-green/20 bg-white px-4 py-3 text-sm outline-none focus:border-green"
      />
      <button
        type="submit"
        className="rounded-full bg-green px-6 py-3 text-sm uppercase tracking-widest text-cream transition-opacity hover:opacity-80"
      >
        Envoyer
      </button>
    </form>
  );
}

"use client";

import Link from "next/link";
import { useActionState } from "react";

import { sendContactMessage, type ContactState } from "@/app/contact/actions";

// État initial : rien n'a encore été soumis.
const initialState: ContactState = {};

export default function ContactForm() {
  // useActionState relie le <form> à la Server Action.
  // - state   : ce que l'action a renvoyé (ok / erreurs / message)
  // - action  : à passer au <form action={...}> ; il appelle la Server Action
  // - pending : true pendant l'envoi (pour désactiver le bouton)
  const [state, action, pending] = useActionState(
    sendContactMessage,
    initialState,
  );

  // Si le message est bien parti, on remplace le formulaire par une confirmation.
  if (state.ok) {
    return (
      <p className="rounded-2xl bg-pink-soft px-6 py-8 text-center text-green">
        Merci ! Votre message a bien été envoyé. 🍒
      </p>
    );
  }

  // Petite aide : le message d'erreur d'un champ donné, s'il existe.
  const fieldError = (name: string) => state.errors?.[name]?.[0];

  return (
    <form action={action} className="flex w-full flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <input
            type="text"
            name="name"
            placeholder="Votre nom"
            required
            className="rounded-xl border border-green/20 bg-white px-4 py-3 text-sm outline-none focus:border-green"
          />
          {fieldError("name") && (
            <p className="text-xs text-red-600">{fieldError("name")}</p>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <input
            type="email"
            name="email"
            placeholder="Votre email"
            required
            className="rounded-xl border border-green/20 bg-white px-4 py-3 text-sm outline-none focus:border-green"
          />
          {fieldError("email") && (
            <p className="text-xs text-red-600">{fieldError("email")}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <input
          type="text"
          name="subject"
          placeholder="Sujet"
          required
          className="rounded-xl border border-green/20 bg-white px-4 py-3 text-sm outline-none focus:border-green"
        />
        {fieldError("subject") && (
          <p className="text-xs text-red-600">{fieldError("subject")}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <textarea
          name="message"
          placeholder="Votre message"
          required
          rows={5}
          className="rounded-xl border border-green/20 bg-white px-4 py-3 text-sm outline-none focus:border-green"
        />
        {fieldError("message") && (
          <p className="text-xs text-red-600">{fieldError("message")}</p>
        )}
      </div>

      {/*
        Honeypot anti-spam : un champ que les humains ne voient pas
        (aria-hidden + tabIndex -1 pour ne pas l'atteindre au clavier, et
        caché visuellement). Les bots, eux, le remplissent → Django rejette.
        On NE met PAS `required` dessus, sinon on bloquerait les humains.
      */}
      <div className="hidden" aria-hidden="true">
        <label>
          Ne pas remplir ce champ
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {/* Erreur globale (panne réseau, honeypot déclenché, etc.). */}
      {state.message && (
        <p className="text-sm text-red-600">{state.message}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-green px-6 py-3 text-sm uppercase tracking-widest text-cream transition-opacity hover:opacity-80 disabled:opacity-50"
      >
        {pending ? "Envoi en cours…" : "Envoyer"}
      </button>

      {/*
        Mention RGPD : le visiteur est informé, au moment de l'envoi, de
        l'usage de ses données et du lien vers la politique complète.
        (Cookies techniques uniquement : pas de bandeau de consentement requis.)
      */}
      <p className="text-xs text-ink/60">
        En envoyant ce formulaire, vous acceptez que vos données soient
        utilisées pour traiter votre demande. Consultez notre{" "}
        <Link
          href="/confidentialite"
          className="underline underline-offset-2 hover:text-green"
        >
          politique de confidentialité
        </Link>
        .
      </p>
    </form>
  );
}

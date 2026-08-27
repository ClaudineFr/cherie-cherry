"use client";

import Link from "next/link";
import { useActionState } from "react";

import Loader from "@/components/Loader";
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
      <p className="contact-form-success rounded-2xl bg-pink-soft px-6 py-8 text-center text-green">
        Merci ! Votre message a bien été envoyé. 🍒
      </p>
    );
  }

  // Petite aide : le message d'erreur d'un champ donné, s'il existe.
  const fieldError = (name: string) => state.errors?.[name]?.[0];

  return (
    <form action={action} className="contact-form flex w-full flex-col gap-4">
      <div className="contact-form-row grid gap-4 sm:grid-cols-2">
        <div className="contact-form-field contact-form-field--name flex flex-col gap-1">
          <input
            type="text"
            name="name"
            placeholder="Votre nom"
            required
            className="contact-form-input contact-form-input--name rounded-xl border border-green/20 bg-white px-4 py-3 text-sm outline-none focus:border-green"
          />
          {fieldError("name") && (
            <p className="contact-form-error text-xs text-red-600">{fieldError("name")}</p>
          )}
        </div>
        <div className="contact-form-field contact-form-field--email flex flex-col gap-1">
          <input
            type="email"
            name="email"
            placeholder="Votre email"
            required
            className="contact-form-input contact-form-input--email rounded-xl border border-green/20 bg-white px-4 py-3 text-sm outline-none focus:border-green"
          />
          {fieldError("email") && (
            <p className="contact-form-error text-xs text-red-600">{fieldError("email")}</p>
          )}
        </div>
      </div>

      <div className="contact-form-field contact-form-field--subject flex flex-col gap-1">
        <input
          type="text"
          name="subject"
          placeholder="Sujet"
          required
          className="contact-form-input contact-form-input--subject rounded-xl border border-green/20 bg-white px-4 py-3 text-sm outline-none focus:border-green"
        />
        {fieldError("subject") && (
          <p className="contact-form-error text-xs text-red-600">{fieldError("subject")}</p>
        )}
      </div>

      <div className="contact-form-field contact-form-field--message flex flex-col gap-1">
        <textarea
          name="message"
          placeholder="Votre message"
          required
          rows={5}
          className="contact-form-input contact-form-input--message rounded-xl border border-green/20 bg-white px-4 py-3 text-sm outline-none focus:border-green"
        />
        {fieldError("message") && (
          <p className="contact-form-error text-xs text-red-600">{fieldError("message")}</p>
        )}
      </div>

      {/*
        Honeypot anti-spam : un champ que les humains ne voient pas
        (aria-hidden + tabIndex -1 pour ne pas l'atteindre au clavier, et
        caché visuellement). Les bots, eux, le remplissent → Django rejette.
        On NE met PAS `required` dessus, sinon on bloquerait les humains.
      */}
      <div className="contact-form-honeypot hidden" aria-hidden="true">
        <label>
          Ne pas remplir ce champ
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {/* Erreur globale (panne réseau, honeypot déclenché, etc.). */}
      {state.message && (
        <p className="contact-form-error contact-form-error--global text-sm text-red-600">{state.message}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="contact-form-submit inline-flex items-center justify-center gap-2 self-start rounded-full bg-green px-6 py-3 text-sm uppercase tracking-widest text-cream transition-opacity hover:opacity-80 disabled:opacity-50"
      >
        {/* Pendant l'envoi : petit anneau qui tourne à gauche du texte.
            label={null} → l'anneau seul, le texte du bouton suffit à dire
            ce qui se passe. */}
        {pending && <Loader size="sm" label={null} />}
        {pending ? "Envoi en cours…" : "Envoyer"}
      </button>

      {/*
        Mention RGPD : le visiteur est informé, au moment de l'envoi, de
        l'usage de ses données et du lien vers la politique complète.
        Base légale = intérêt légitime (répondre à une sollicitation), pas
        le consentement → on informe, on ne demande pas d'« accepter ».
        (Cookies techniques uniquement : pas de bandeau de consentement requis.)
      */}
      <p className="contact-form-rgpd text-xs text-ink/60">
        Les informations transmises via ce formulaire sont utilisées
        uniquement pour traiter votre demande. Consultez notre{" "}
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

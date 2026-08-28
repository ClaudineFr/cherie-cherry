"use client";

import { useActionState, useState } from "react";
import { useCart } from "@/components/CartContext";
import { createCheckout, type CheckoutState } from "./actions";

export default function CheckoutForm() {
  const { lines, total } = useCart();

  // Le mode de livraison pilote l'affichage du bloc adresse. On le garde en
  // état plutôt que de lire le formulaire, pour réagir au clic tout de suite.
  const [delivery, setDelivery] = useState<"pickup" | "home">("pickup");

  // On n'envoie que les identifiants et les quantités : les prix sont relus
  // par Django. bind fige ce premier argument, useActionState fournissant
  // les deux autres (état précédent + FormData).
  const items = lines.map((l) => ({ product_id: l.id, quantity: l.quantity }));

  const [state, action, pending] = useActionState<CheckoutState, FormData>(
    createCheckout.bind(null, items),
    {},
  );

  const champ =
    "w-full rounded-lg border border-green/20 bg-cream px-3 py-2 text-sm text-ink outline-none placeholder:text-ink/30 focus:border-green/50";
  const label =
    "mb-1 block text-[0.7rem] uppercase tracking-[0.08em] text-ink/50";

  // Affiche l'erreur renvoyée par Django pour un champ donné.
  const erreur = (nom: string) =>
    state.errors?.[nom]?.[0] ? (
      <p className="mt-1 text-[0.7rem] text-red-700">{state.errors[nom][0]}</p>
    ) : null;

  const choix = (actif: boolean) =>
    `flex-1 rounded-lg border px-4 py-3 text-left text-sm transition ${
      actif
        ? "border-green bg-green/5 text-green"
        : "border-green/20 text-ink/60 hover:border-green/40"
    }`;

  return (
    <form action={action} className="mt-8">
      <h2 className="font-serif text-2xl text-green">Vos coordonnées</h2>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor="first_name">
            Prénom
          </label>
          <input id="first_name" name="first_name" required className={champ} />
          {erreur("first_name")}
        </div>

        <div>
          <label className={label} htmlFor="last_name">
            Nom
          </label>
          <input id="last_name" name="last_name" required className={champ} />
          {erreur("last_name")}
        </div>
      </div>

      <div className="mt-4">
        <label className={label} htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className={champ}
          // Le reçu Stripe et la confirmation partent à cette adresse.
          aria-describedby="email-aide"
        />
        <p id="email-aide" className="mt-1 text-[0.7rem] text-ink/40">
          Pour recevoir la confirmation de votre commande.
        </p>
        {erreur("email")}
      </div>

      <div className="mt-4">
        <label className={label} htmlFor="phone">
          Téléphone <span className="normal-case">(facultatif)</span>
        </label>
        <input id="phone" name="phone" type="tel" className={champ} />
        {erreur("phone")}
      </div>

      <h2 className="mt-10 font-serif text-2xl text-green">Livraison</h2>

      {/* Deux boutons radio déguisés en cartes cliquables. On garde de vrais
          <input type="radio"> pour l'accessibilité et pour que le champ parte
          dans le FormData ; ils sont juste masqués visuellement. */}
      <fieldset className="mt-4">
        <legend className="sr-only">Mode de livraison</legend>
        <div className="flex flex-col gap-3 sm:flex-row">
          <label className={choix(delivery === "pickup")}>
            <input
              type="radio"
              name="delivery_method"
              value="pickup"
              checked={delivery === "pickup"}
              onChange={() => setDelivery("pickup")}
              className="sr-only"
            />
            <span className="block font-medium">Retrait en boutique</span>
            <span className="mt-1 block text-[0.7rem] text-ink/50">
              Gratuit — à récupérer sur place
            </span>
          </label>

          <label className={choix(delivery === "home")}>
            <input
              type="radio"
              name="delivery_method"
              value="home"
              checked={delivery === "home"}
              onChange={() => setDelivery("home")}
              className="sr-only"
            />
            <span className="block font-medium">Livraison à domicile</span>
            <span className="mt-1 block text-[0.7rem] text-ink/50">
              France métropolitaine
            </span>
          </label>
        </div>
      </fieldset>

      {/* L'adresse n'apparaît que si elle sert. Django revérifie de son côté :
          masquer un champ n'est jamais une validation. */}
      {delivery === "home" && (
        <div className="mt-6 rounded-xl border border-green/10 bg-cream/50 p-4">
          <div>
            <label className={label} htmlFor="address_line1">
              Adresse
            </label>
            <input
              id="address_line1"
              name="address_line1"
              required
              className={champ}
            />
            {erreur("address_line1")}
          </div>

          <div className="mt-4">
            <label className={label} htmlFor="address_line2">
              Complément <span className="normal-case">(facultatif)</span>
            </label>
            <input id="address_line2" name="address_line2" className={champ} />
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-[8rem_1fr]">
            <div>
              <label className={label} htmlFor="postal_code">
                Code postal
              </label>
              <input
                id="postal_code"
                name="postal_code"
                required
                inputMode="numeric"
                className={champ}
              />
              {erreur("postal_code")}
            </div>

            <div>
              <label className={label} htmlFor="city">
                Ville
              </label>
              <input id="city" name="city" required className={champ} />
              {erreur("city")}
            </div>
          </div>
        </div>
      )}

      {/* Erreur globale : stock épuisé, service indisponible… */}
      {state.message && (
        <p
          role="alert"
          className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending || lines.length === 0}
        className="mt-8 w-full rounded-full bg-green px-6 py-3 text-[0.7rem] uppercase tracking-[0.08em] text-cream transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {pending
          ? "Redirection vers le paiement…"
          : `Payer ${total.toFixed(2)} €`}
      </button>

      <p className="mt-3 text-center text-[0.7rem] text-ink/40">
        Paiement sécurisé par Stripe. Les frais de livraison éventuels sont
        ajoutés à l’étape suivante.
      </p>
    </form>
  );
}

"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/CartContext";
import { createCheckout, type CheckoutState } from "./actions";

// Un point relais tel que le widget Mondial Relay le renvoie. Ces valeurs
// partent telles quelles dans le formulaire : Django les recopie sur la
// commande pour garder une trace de l'endroit où le colis a été envoyé.
export type RelayPoint = {
  id: string;
  name: string;
  address: string;
  postalCode: string;
  city: string;
};

export default function CheckoutForm() {
  const { lines, total } = useCart();

  // Le mode de livraison pilote l'affichage du bloc adresse. On le garde en
  // état plutôt que de lire le formulaire, pour réagir au clic tout de suite.
  const [delivery, setDelivery] = useState<"pickup" | "home" | "relay">(
    "pickup",
  );

  // Le point relais choisi dans le widget Mondial Relay. `null` tant que le
  // client n'en a pas sélectionné : c'est ce qui distingue « pas encore
  // choisi » d'un relais aux champs vides.
  const [relay, setRelay] = useState<RelayPoint | null>(null);

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

          <label className={choix(delivery === "relay")}>
            <input
              type="radio"
              name="delivery_method"
              value="relay"
              checked={delivery === "relay"}
              onChange={() => setDelivery("relay")}
              className="sr-only"
            />
            <span className="block font-medium">Point relais</span>
            <span className="mt-1 block text-[0.7rem] text-ink/50">
              À retirer près de chez vous
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

      {/* Point relais. Le widget Mondial Relay viendra se greffer ici : il
          appellera setRelay() avec le point choisi. En attendant, le bloc
          affiche l'état de la sélection et transporte les valeurs. */}
      {delivery === "relay" && (
        <div className="mt-6 rounded-xl border border-green/10 bg-cream/50 p-4">
          {relay ? (
            <>
              <p className="text-[0.7rem] uppercase tracking-wide text-ink/50">
                Votre point relais
              </p>
              <p className="mt-2 font-medium text-green">{relay.name}</p>
              <p className="mt-0.5 text-sm text-ink/70">
                {relay.address}
                <br />
                {relay.postalCode} {relay.city}
              </p>
              <button
                type="button"
                onClick={() => setRelay(null)}
                className="mt-3 text-sm text-green underline underline-offset-4 hover:text-green/70"
              >
                Choisir un autre point relais
              </button>
            </>
          ) : (
            <p className="text-sm text-ink/70">
              Choisissez le point relais où vous souhaitez récupérer votre
              commande.
            </p>
          )}

          {/* Les champs cachés portent le point choisi jusqu'au Server Action.
              Ils ne sont rendus que si un relais est sélectionné : un champ
              vide et un champ absent se valent côté Django, mais l'absence
              rend le formulaire plus lisible dans les outils de debug. */}
          {relay && (
            <>
              <input type="hidden" name="relay_id" value={relay.id} />
              <input type="hidden" name="relay_name" value={relay.name} />
              <input type="hidden" name="relay_address" value={relay.address} />
              <input
                type="hidden"
                name="relay_postal_code"
                value={relay.postalCode}
              />
              <input type="hidden" name="relay_city" value={relay.city} />
            </>
          )}

          {erreur("relay_id")}
        </div>
      )}

      {/* Acceptation des CGV. Obligatoire pour la vente à distance : le
          Client doit avoir pris connaissance des conditions AVANT de payer.
          `required` bloque l'envoi côté navigateur, et la Server Action
          revérifie — une case cochée dans le navigateur ne prouve rien. */}
      <div className="mt-8 flex items-start gap-3 rounded-xl border border-green/10 bg-cream/50 p-4">
        <input
          id="accept_terms"
          name="accept_terms"
          type="checkbox"
          required
          className="mt-0.5 h-4 w-4 shrink-0 accent-green"
        />
        <label htmlFor="accept_terms" className="text-[0.8rem] text-ink/70">
          J’ai lu et j’accepte les{" "}
          <Link
            href="/cgv"
            target="_blank"
            className="text-green underline underline-offset-2"
          >
            conditions générales de vente
          </Link>
          . Je reconnais disposer d’un droit de rétractation de 14 jours à
          compter de la réception de ma commande.
        </label>
      </div>
      {erreur("accept_terms")}

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

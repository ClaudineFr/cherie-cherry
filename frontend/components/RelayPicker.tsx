"use client";

// Le sélecteur de point relais de Mondial Relay.
//
// C'est un plugin jQuery, pas un composant React : il écrit lui-même dans le
// DOM et charge Leaflet pour sa carte. On lui laisse donc un <div> à remplir,
// et React n'y touche plus — d'où le `ref` sans enfants côté React.
//
// jQuery et le plugin sont chargés depuis le CDN de Mondial Relay, et
// uniquement quand ce composant est monté : le client qui choisit le retrait
// en boutique ne télécharge rien.

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import type { RelayPoint } from "@/app/panier/CheckoutForm";

// Ce que le plugin renvoie à OnParcelShopSelected. Les noms de champs sont
// les siens (en français), d'où la conversion vers RelayPoint plus bas.
type MondialRelayShop = {
  ID: string;
  Nom: string;
  Adresse1: string;
  Adresse2?: string;
  CP: string;
  Ville: string;
  Pays?: string;
};

// jQuery s'installe sur window, et le plugin s'y greffe. TypeScript ignore
// tout de ces deux-là : on décrit le minimum dont on se sert.
type JQueryWithPlugin = ((selector: string | Element) => {
  MR_ParcelShopPicker: (options: Record<string, unknown>) => void;
}) & { fn?: unknown };

declare global {
  interface Window {
    $?: JQueryWithPlugin;
    jQuery?: JQueryWithPlugin;
  }
}

const JQUERY_SRC = "https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js";
const WIDGET_SRC =
  "https://widget.mondialrelay.com/parcelshop-picker/v4_0/scripts/jquery.plugin.mondialrelay.parcelshoppicker.min.js";

export default function RelayPicker({
  onSelect,
}: {
  onSelect: (point: RelayPoint) => void;
}) {
  const conteneur = useRef<HTMLDivElement>(null);

  // Le plugin ne s'initialise qu'une fois SES DEUX scripts chargés — jQuery
  // d'abord, le plugin ensuite. Deux drapeaux plutôt qu'un : Next peut les
  // charger dans le désordre, et appeler le plugin avant jQuery planterait.
  const [jqueryPret, setJqueryPret] = useState(false);
  const [widgetPret, setWidgetPret] = useState(false);

  // onSelect dans une ref : le plugin garde la fonction qu'on lui passe à
  // l'initialisation. Sans ça, un re-rendu du formulaire lui laisserait une
  // version périmée, qui écrirait dans un état qui n'existe plus.
  const rappel = useRef(onSelect);
  useEffect(() => {
    rappel.current = onSelect;
  }, [onSelect]);

  useEffect(() => {
    if (!jqueryPret || !widgetPret || !conteneur.current) return;

    const $ = window.$;
    if (!$) return;

    // Le code enseigne. BDTEST est le compte de démonstration public de
    // Mondial Relay : le widget bascule alors sur leur serveur de test. La
    // vraie enseigne de la boutique viendra de l'environnement, sans toucher
    // à ce fichier.
    const enseigne =
      process.env.NEXT_PUBLIC_MONDIAL_RELAY_BRAND || "BDTEST";

    $(conteneur.current).MR_ParcelShopPicker({
      Target: "", // pas de champ à remplir : on récupère par le callback
      Brand: enseigne,
      Country: "FR",
      ColLivMod: "24R", // 24R = livraison en point relais
      NbResults: "7",
      EnableGmap: false, // la carte Leaflet suffit, et évite une clé Google
      ShowResultsOnMap: true,
      OnParcelShopSelected: (point: MondialRelayShop) => {
        rappel.current({
          id: point.ID,
          name: point.Nom,
          // Adresse2 est souvent vide ; on ne veut pas d'espace en trop.
          address: [point.Adresse1, point.Adresse2]
            .filter(Boolean)
            .join(" ")
            .trim(),
          postalCode: point.CP,
          city: point.Ville,
        });
      },
    });
  }, [jqueryPret, widgetPret]);

  return (
    <>
      <Script
        src={JQUERY_SRC}
        strategy="afterInteractive"
        onReady={() => setJqueryPret(true)}
      />
      {/* Le plugin a besoin de jQuery : on n'insère son script qu'une fois
          jQuery prêt, plutôt que de compter sur l'ordre de chargement. */}
      {jqueryPret && (
        <Script
          src={WIDGET_SRC}
          strategy="afterInteractive"
          onReady={() => setWidgetPret(true)}
        />
      )}

      <div ref={conteneur} className="mr-widget" />

      {!widgetPret && (
        <p className="text-sm text-ink/60">Chargement de la carte…</p>
      )}
    </>
  );
}

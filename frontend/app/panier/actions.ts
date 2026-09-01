"use server";

// Server Action du formulaire de commande.
// Comme pour le contact, "use server" garde ce code sur le serveur : l'URL de
// l'API Django reste invisible côté navigateur.

import { redirect } from "next/navigation";

const API_URL = process.env.API_CHECKOUT_URL;

// L'état renvoyé au formulaire.
// - errors  : erreurs de validation par champ, telles que Django les renvoie
// - message : une erreur globale (stock épuisé, panne réseau…)
export type CheckoutState = {
  errors?: Record<string, string[]>;
  message?: string;
};

// Ce que le panier envoie : uniquement des identifiants et des quantités.
// Surtout PAS les prix — c'est Django qui les relit en base, sinon n'importe
// qui pourrait s'offrir un sac à 45 € pour un centime.
export type CheckoutItem = {
  product_id: number;
  quantity: number;
};

export async function createCheckout(
  items: CheckoutItem[],
  _prev: CheckoutState,
  formData: FormData,
): Promise<CheckoutState> {
  if (!API_URL) {
    return { message: "Configuration manquante (API_CHECKOUT_URL)." };
  }

  if (items.length === 0) {
    return { message: "Votre panier est vide." };
  }

  // L'acceptation des CGV conditionne la vente. L'attribut `required` du
  // formulaire bloque déjà l'envoi, mais il suffit de désactiver JavaScript
  // ou de poster la requête à la main pour le contourner : on revérifie ici,
  // là où le client n'a pas la main.
  if (!formData.get("accept_terms")) {
    return {
      errors: {
        accept_terms: [
          "Vous devez accepter les conditions générales de vente.",
        ],
      },
    };
  }

  const payload = {
    email: formData.get("email"),
    first_name: formData.get("first_name"),
    last_name: formData.get("last_name"),
    phone: formData.get("phone"),
    delivery_method: formData.get("delivery_method"),
    address_line1: formData.get("address_line1"),
    address_line2: formData.get("address_line2"),
    postal_code: formData.get("postal_code"),
    city: formData.get("city"),
    // Point relais : renseigné par le widget Mondial Relay via des champs
    // cachés. Comme pour l'adresse, Django revérifie leur présence selon le
    // mode choisi — masquer un champ n'est pas une validation.
    relay_id: formData.get("relay_id"),
    relay_name: formData.get("relay_name"),
    relay_address: formData.get("relay_address"),
    relay_postal_code: formData.get("relay_postal_code"),
    relay_city: formData.get("relay_city"),
    items,
  };

  let res: Response;
  try {
    res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    });
  } catch {
    return {
      message:
        "Impossible de joindre le service de paiement. Réessayez dans un instant.",
    };
  }

  if (!res.ok) {
    // 409 = un article n'est plus disponible en quantité suffisante. Django
    // renvoie alors un message précis, qu'on affiche tel quel.
    //
    // `detail` est une chaîne, les autres clés des listes d'erreurs par
    // champ : on type large et on trie ensuite.
    let data: Record<string, unknown> = {};
    try {
      data = await res.json();
    } catch {
      // Réponse illisible : on retombe sur le message générique ci-dessous.
    }

    if (typeof data.detail === "string") {
      return { message: data.detail };
    }

    // Sinon ce sont des erreurs par champ (email invalide, adresse manquante…),
    // chacune sous forme de liste de messages.
    const errors: Record<string, string[]> = {};
    for (const [champ, valeur] of Object.entries(data)) {
      if (champ !== "detail" && Array.isArray(valeur)) {
        errors[champ] = valeur.map(String);
      }
    }

    return Object.keys(errors).length > 0
      ? { errors }
      : { message: "La commande n'a pas pu être validée." };
  }

  const { url } = (await res.json()) as { url: string };

  // redirect() lève une exception interne que Next intercepte : rien de ce qui
  // suit ne s'exécute. Il doit donc rester HORS du try/catch, sinon le catch
  // l'attraperait et la redirection n'aurait pas lieu.
  redirect(url);
}

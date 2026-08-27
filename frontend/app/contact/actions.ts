"use server";

// Server Action du formulaire de contact.
// "use server" en haut du fichier => tout ce qui est exporté ici s'exécute
// SUR LE SERVEUR, jamais dans le navigateur. C'est ce qui nous permet de lire
// API_CONTACT_URL (une variable d'env serveur, sans NEXT_PUBLIC_) et de garder
// l'URL de l'API invisible côté client.
const API_URL = process.env.API_CONTACT_URL;

// La forme de l'état qu'on renvoie au formulaire.
// - ok      : true si le message est parti, false sinon (undefined = pas encore soumis)
// - errors  : erreurs de validation par champ, renvoyées par Django (ex. email invalide)
// - message : un texte d'erreur global à afficher (panne réseau, etc.)
export type ContactState = {
  ok?: boolean;
  errors?: Record<string, string[]>;
  message?: string;
};

// La Server Action. useActionState (côté client) l'appelle avec l'état
// précédent + le FormData du <form>. On renvoie le nouvel état.
export async function sendContactMessage(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  if (!API_URL) {
    return {
      ok: false,
      message: "Configuration manquante (API_CONTACT_URL).",
    };
  }

  // On récupère les champs du formulaire. `website` est le honeypot :
  // caché aux humains, on le transmet tel quel pour que Django le vérifie.
  const payload = {
    name: formData.get("name"),
    email: formData.get("email"),
    subject: formData.get("subject"),
    message: formData.get("message"),
    website: formData.get("website"),
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
    // fetch a échoué (API éteinte, réseau) : on ne prétend surtout pas
    // que le message est passé.
    return {
      ok: false,
      message:
        "Impossible d'envoyer le message pour le moment. Réessayez plus tard.",
    };
  }

  // 400 = Django a refusé (validation ou honeypot). On renvoie le détail
  // par champ pour l'afficher sous les inputs.
  if (res.status === 400) {
    const errors = await res.json().catch(() => ({}));
    return { ok: false, errors };
  }

  // Tout autre code non-2xx = souci côté serveur.
  if (!res.ok) {
    return {
      ok: false,
      message: "Une erreur est survenue. Réessayez plus tard.",
    };
  }
  return { ok: true };
}

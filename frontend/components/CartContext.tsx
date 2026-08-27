"use client";
// Le panier vit dans le navigateur : il réagit aux clics et se souvient
// de son contenu d'une visite à l'autre. C'est donc un composant client.

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

// Une ligne du panier : le produit choisi + combien d'exemplaires.
// On recopie le nom, le prix et l'image plutôt que de garder seulement l'id,
// pour pouvoir afficher le panier sans redemander l'API à chaque fois.
// (Au moment de payer, c'est le backend qui refera foi sur les prix.)
export type CartLine = {
  id: number;
  name: string;
  price: number;
  image?: string | null;
  stock: number;
  quantity: number;
};

// Ce que le panier met à disposition du reste du site.
type CartValue = {
  lines: CartLine[];
  // Nombre total d'articles (2 colliers + 1 carnet = 3).
  count: number;
  // Somme à payer, en euros.
  total: number;
  addLine: (line: Omit<CartLine, "quantity">, quantity?: number) => void;
  setQuantity: (id: number, quantity: number) => void;
  removeLine: (id: number) => void;
  clear: () => void;
  // Passe à true une fois le panier relu depuis le navigateur (voir plus bas).
  isReady: boolean;
};

// La clé sous laquelle on range le panier dans le navigateur.
const STORAGE_KEY = "cherie-cherry-panier";

// createContext = le « tuyau » qui transporte le panier à travers l'app,
// sans avoir à le passer en props de composant en composant.
const CartContext = createContext<CartValue | null>(null);

// Relit le panier stocké dans le navigateur. On se méfie de tout ici :
// le contenu peut avoir été bricolé à la main, ou venir d'une ancienne
// version du site. En cas de doute, on repart d'un panier vide.
function readStoredCart(): CartLine[] {
  // Un composant client est quand même rendu une fois sur le serveur, où
  // `window` n'existe pas. Là-bas, le panier est forcément vide.
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (line): line is CartLine =>
        typeof line === "object" &&
        line !== null &&
        typeof (line as CartLine).id === "number" &&
        typeof (line as CartLine).name === "string" &&
        typeof (line as CartLine).price === "number" &&
        typeof (line as CartLine).quantity === "number" &&
        (line as CartLine).quantity > 0,
    );
  } catch {
    // localStorage peut être indisponible (navigation privée, cookies bloqués)
    // ou le JSON illisible. Dans les deux cas : panier vide, pas de plantage.
    return [];
  }
}

// `useSyncExternalStore` a besoin de savoir quand la source change. Ici,
// personne ne modifie localStorage dans notre dos pendant le premier rendu :
// on rend donc un abonnement qui ne notifie jamais rien.
const subscribeToNothing = () => () => {};

export function CartProvider({ children }: { children: ReactNode }) {
  // Est-on déjà passé côté navigateur ? La page est d'abord rendue sur le
  // serveur, où `window` n'existe pas. Si le serveur affichait « 0 article »
  // et le navigateur « 3 articles », React signalerait une incohérence
  // (erreur d'hydratation). `useSyncExternalStore` est fait pour ça : il
  // prend deux lectures, une pour le client et une pour le serveur, et
  // gère lui-même le passage de l'une à l'autre.
  const isReady = useSyncExternalStore(
    subscribeToNothing,
    () => true, // côté navigateur
    () => false, // côté serveur (et pendant l'hydratation)
  );

  // On lit le panier stocké dès l'initialisation du state. La fonction
  // passée à useState n'est appelée qu'au tout premier rendu — et comme
  // ce provider est un composant client, elle s'exécute dans le navigateur.
  const [lines, setLines] = useState<CartLine[]>(readStoredCart);

  // À chaque modification, on réenregistre le panier.
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // Stockage plein ou refusé : le panier marche quand même pour
      // cette visite, il ne survivra simplement pas au rechargement.
    }
  }, [lines]);

  // Ajoute un produit. S'il est déjà dans le panier, on augmente sa quantité
  // au lieu de créer une deuxième ligne.
  const addLine: CartValue["addLine"] = (line, quantity = 1) => {
    setLines((current) => {
      const existing = current.find((l) => l.id === line.id);

      if (!existing) {
        // On ne dépasse jamais le stock disponible.
        return [
          ...current,
          { ...line, quantity: Math.min(quantity, line.stock) },
        ];
      }

      return current.map((l) =>
        l.id === line.id
          ? { ...l, quantity: Math.min(l.quantity + quantity, line.stock) }
          : l,
      );
    });
  };

  // Change la quantité d'une ligne. Tomber à 0 revient à la retirer.
  const setQuantity: CartValue["setQuantity"] = (id, quantity) => {
    setLines((current) =>
      current.flatMap((l) => {
        if (l.id !== id) return [l];
        const next = Math.min(quantity, l.stock);
        return next > 0 ? [{ ...l, quantity: next }] : [];
      }),
    );
  };

  const removeLine: CartValue["removeLine"] = (id) => {
    setLines((current) => current.filter((l) => l.id !== id));
  };

  const clear = () => setLines([]);

  // reduce : parcourt les lignes en cumulant un total au fil de l'eau.
  const count = lines.reduce((sum, l) => sum + l.quantity, 0);
  const total = lines.reduce((sum, l) => sum + l.price * l.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        lines,
        count,
        total,
        addLine,
        setQuantity,
        removeLine,
        clear,
        isReady,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// Le raccourci qu'utilisent les composants : `const { count } = useCart()`.
// L'erreur explicite évite de longues minutes de perplexité si on oublie
// d'envelopper l'app dans <CartProvider>.
export function useCart() {
  const value = useContext(CartContext);
  if (!value) {
    throw new Error(
      "useCart doit être utilisé à l'intérieur de <CartProvider>",
    );
  }
  return value;
}

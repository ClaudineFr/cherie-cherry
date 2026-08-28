// Pour modifier la boutique : on édite juste ce fichier, pas l'affichage.

// Les catégories disponibles. On les liste ici une seule fois pour que
// les filtres et les produits utilisent exactement les mêmes valeurs.
export const categories = ["Bijoux", "Papeterie", "Sacs", "Vêtements"] as const;

export type Category = (typeof categories)[number];

export type Product = {
  id?: number;
  name: string;
  category: Category;
  description?: string;
  price: number;
  // Nombre d'exemplaires disponibles. Sert à ne pas laisser commander
  // un article épuisé. Absent sur les produits d'exemple ci-dessous.
  stock?: number;
  featured?: boolean;
  image?: string | null;
};

export const products: Product[] = [
  {
    name: "Collier doré fin",
    category: "Bijoux",
    description: "Plaqué or, chaîne délicate",
    price: 24,
    featured: true,
  },
  {
    name: "Boucles d'oreilles perles",
    category: "Bijoux",
    description: "Perles d'eau douce",
    price: 18,
  },
  {
    name: "Bracelet jonc",
    category: "Bijoux",
    price: 15,
  },
  {
    name: "Carnet fleuri",
    category: "Papeterie",
    description: "Pages lignées, couverture rigide",
    price: 12,
  },
  {
    name: "Set de cartes postales",
    category: "Papeterie",
    description: "Lot de 6, illustrations maison",
    price: 9,
    featured: true,
  },
  {
    name: "Stylo plume laqué",
    category: "Papeterie",
    price: 28,
  },
  {
    name: "Sac en toile brodé",
    category: "Sacs",
    description: "Coton épais, anses cuir",
    price: 45,
  },
  {
    name: "Pochette velours",
    category: "Sacs",
    description: "Doublure satin",
    price: 32,
    featured: true,
  },
  {
    name: "Blouse en lin",
    category: "Vêtements",
    description: "Coupe fluide, col volanté",
    price: 58,
  },
  {
    name: "Foulard imprimé",
    category: "Vêtements",
    description: "Soie, motif cerises",
    price: 22,
  },
];

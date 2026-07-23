// Pour modifier la carte : on édite juste ce fichier, pas l'affichage.

export type Drink = {
  name: string;
  description?: string;
  price: string;
};

export type MenuCategory = {
  category: string;
  items: Drink[];
};

export const servingNote =
  "Toutes nos boissons sont disponibles chaudes ou glacées.";

export const supplements = [
  "Lait : avoine, amande, sans lactose + 0,50 €",
  "Sirop : vanille, caramel, noisette, coco + 0,50 €",
];

export const menu: MenuCategory[] = [
  {
    category: "Coffee",
    items: [
      { name: "Espresso", price: "2,20 €" },
      { name: "Latte / Cappuccino", price: "4,50 €" },
      { name: "Latte caramel beurre salé", price: "5,50 €" },
      {
        name: "Cold Brew",
        description: "Café infusé à froid",
        price: "4,50 €",
      },
      {
        name: "Spanish Latte",
        description: "Espresso, lait, vanille, lait concentré",
        price: "5,50 €",
      },
      {
        name: "Café du mois",
        description: "Création unique aux saveurs de saison à découvrir",
        price: "5,90 €",
      },
    ],
  },
  {
    category: "Matcha & more",
    items: [
      { name: "Matcha", price: "4,50 €" },
      { name: "Matcha Latte", price: "5,50 €" },
      { name: "Matcha Latte Fraise", price: "6,50 €" },
      {
        name: "Matcha du mois",
        description: "Création unique aux saveurs de saison à découvrir",
        price: "5,90 €",
      },
      { name: "Ube Latte", price: "4,90 €" },
      { name: "Eau 50cl", price: "1,50 €" },
    ],
  },
];

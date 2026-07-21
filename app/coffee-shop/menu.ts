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

export const menu: MenuCategory[] = [
  {
    category: "Cafés",
    items: [
      { name: "Espresso", description: "Simple ou double", price: "2,00 €" },
      { name: "Cappuccino", price: "3,80 €" },
      { name: "Latte macchiato", price: "4,20 €" },
      { name: "Flat white", price: "4,00 €" },
      { name: "Café latte", price: "4,00 €" },
      { name: "Mocha", description: "Café & chocolat", price: "4,50 €" },
    ],
  },
  {
    category: "Matcha & autres",
    items: [
      { name: "Matcha latte", description: "Chaud ou glacé", price: "4,80 €" },
      {
        name: "Bubble latte",
        description: "Perles de tapioca",
        price: "5,50 €",
      },
      { name: "Chocolat chaud maison", price: "4,00 €" },
      { name: "Chai latte", price: "4,50 €" },
    ],
  },
];

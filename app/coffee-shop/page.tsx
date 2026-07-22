import { menu, servingNote, supplements } from "./menu";

export default function CoffeeShopPage() {
  return (
    <main className="flex-1 bg-cream px-6 py-20">
      <div className="mx-auto max-w-3xl">
        {/* En-tête */}
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-green">
            Coffee &amp; Matcha Club
          </p>
          <h1 className="mt-3 font-serif text-4xl text-green">
            Le coffee shop
          </h1>
          <p className="mx-auto mt-4 max-w-md text-base text-ink/70">
            {servingNote}
          </p>
        </div>

        {/* Menu par catégories */}
        <div className="mt-16 flex flex-col gap-12 px-4 sm:px-8">
          {menu.map((section) => (
            <div key={section.category}>
              <h2 className="mb-6 font-serif text-2xl text-green">
                {section.category}
              </h2>
              <ul className="flex flex-col gap-4">
                {section.items.map((drink) => (
                  <li
                    key={drink.name}
                    className="flex items-baseline justify-between gap-4 border-b border-green/10 pb-3"
                  >
                    <span>
                      <span className="text-ink">{drink.name}</span>
                      {drink.description && (
                        <span className="ml-2 text-sm text-ink/50">
                          {drink.description}
                        </span>
                      )}
                    </span>
                    <span className="whitespace-nowrap text-green">
                      {drink.price}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Encart suppléments */}
        <div className="mt-16 rounded-2xl bg-pink-soft px-6 py-6 text-center text-sm text-ink/70">
          <p className="mb-2 uppercase tracking-widest text-green">
            Suppléments
          </p>
          <ul className="flex flex-col gap-1">
            {supplements.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}

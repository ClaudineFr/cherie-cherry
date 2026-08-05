import { fetchMenu, fetchSupplements, servingNote } from "./menu";
import { fetchDrinksOfMonth, fetchDrinksOfMonthNote } from "./drinksOfMonth";

// async : la page va chercher la carte sur l'API au rendu (Server Component),
// comme le Footer le fait pour les horaires.
export default async function CoffeeShopPage() {
  const menu = await fetchMenu();
  const supplements = await fetchSupplements();
  const drinksOfMonth = await fetchDrinksOfMonth();
  const drinksOfMonthNote = await fetchDrinksOfMonthNote();

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

        {/* Encart « Boissons du mois » : mis en avant, affiché seulement s'il
            y a au moins une création à montrer. */}
        {drinksOfMonth.length > 0 && (
          <div className="mt-16 rounded-2xl bg-pink-soft px-6 py-8 sm:px-10">
            <h2 className="text-center font-serif text-2xl text-green">
              Les boissons du mois
            </h2>
            {/* Phrase « durée limitée » : affichée seulement si une date de fin
                a été choisie dans l'admin. */}
            {drinksOfMonthNote && (
              <p className="mt-2 text-center text-xs italic text-green/70">
                {drinksOfMonthNote}
              </p>
            )}
            <ul className="mt-6 flex flex-col gap-4">
              {drinksOfMonth.map((drink) => (
                <li
                  key={drink.name}
                  className="flex items-baseline justify-between gap-4 border-b border-green/10 pb-3 last:border-none last:pb-0"
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
        )}

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

        {/* Encart suppléments : affiché seulement s'il y a au moins un
            supplément (géré depuis l'admin). */}
        {supplements.length > 0 && (
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
        )}

        {/* Note pâtisseries */}
        <p className="mt-6 rounded-2xl bg-pink-soft px-6 py-6 text-center text-sm text-ink/70">
          Nos pâtisseries et gâteaux sont{" "}
          <strong>faites maison </strong> et la carte change au fil des saisons
          et de l&apos;inspiration du jour.
        </p>
      </div>
    </main>
  );
}

import { fetchStories } from "@/app/stories";
import StoriesRow from "./StoriesRow";

// Composant SERVEUR : il va chercher les stories sur l'API au rendu, puis
// délègue l'affichage (et la détection du scroll) au composant client StoriesRow.
export default async function InstagramStories() {
  const stories = await fetchStories();

  // Aucune story créée dans l'admin → on n'affiche rien du tout (pas de bloc
  // vide sur la page).
  if (stories.length === 0) {
    return null;
  }

  return <StoriesRow stories={stories} />;
}

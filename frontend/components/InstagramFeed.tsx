import Image from "next/image";
import { FaInstagram } from "react-icons/fa6";
import { fetchPosts } from "@/app/posts";

// Feed des posts Instagram de la marque : une grille de vignettes carrées,
// chacune cliquable vers la vraie publication Instagram.
// async : le composant va chercher les posts sur l'API au rendu.
export default async function InstagramFeed() {
  const posts = await fetchPosts();

  // Aucun post créé dans l'admin → on n'affiche rien (pas de bloc vide).
  if (posts.length === 0) {
    return null;
  }

  return (
    // Grille : 2 colonnes sur mobile, 4 dès la tablette (md).
    <ul className="instagram-feed mx-auto grid max-w-5xl grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
      {posts.map((post) => (
        <li key={post.src} className="instagram-post">
          <a
            href={post.link}
            target="_blank"
            rel="noopener noreferrer"
            // group : permet d'animer l'overlay au survol de tout le lien.
            className="instagram-post-link group relative block aspect-square overflow-hidden rounded-xl"
          >
            <Image
              src={post.src}
              alt={post.caption || "Publication Instagram Chérie Cherry"}
              fill
              className="instagram-post-image object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(min-width: 768px) 25vw, 50vw"
            />

            {/* Au survol*/}
            <span className="instagram-post-overlay absolute inset-0 flex flex-col items-center justify-center gap-1 bg-green/0 opacity-0 transition-all duration-300 group-hover:bg-green/45 group-hover:opacity-100">
              <FaInstagram className="h-6 w-6 text-cream" />
              <span className="instagram-post-overlay-label text-xs uppercase tracking-widest text-cream">
                Voir
              </span>
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}

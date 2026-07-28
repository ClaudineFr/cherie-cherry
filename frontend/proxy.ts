import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// « Proxy » = ce que Next appelait « middleware » avant la v16 (même rôle) :
// du code exécuté sur le serveur AVANT le rendu d'une page.
//
// Ici : tant que COMING_SOON=true dans .env.local, on redirige TOUT le trafic
// vers /coming-soon. Le jour de l'ouverture, passe COMING_SOON à false (ou
// retire la ligne) et relance le serveur → le vrai site réapparaît, sans
// toucher au code.
export function proxy(request: NextRequest) {
  const comingSoon = process.env.COMING_SOON === "true";

  // Mode désactivé → on ne fait rien, le site s'affiche normalement.
  if (!comingSoon) {
    return NextResponse.next();
  }

  // Déjà sur la page coming soon → on laisse passer (sinon boucle infinie).
  if (request.nextUrl.pathname === "/coming-soon") {
    return NextResponse.next();
  }

  // Tout le reste → redirigé vers la page coming soon.
  return NextResponse.redirect(new URL("/coming-soon", request.url));
}

export const config = {
  // Sur quelles URLs le proxy s'exécute. On EXCLUT les assets, sinon la page
  // coming soon se retrouverait sans CSS, sans JS et sans logo :
  //   _next/static  → CSS et JS compilés
  //   _next/image   → images optimisées par next/image
  //   favicon.ico   → l'icône de l'onglet
  //   logo*.png     → les logos servis depuis public/
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|logo.png|logo-mark.png|logo-comingsoon.png).*)",
  ],
};

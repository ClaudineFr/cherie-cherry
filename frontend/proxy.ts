import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// « Proxy » = ce que Next appelait « middleware » avant la v16 (même rôle) :
// du code exécuté sur le serveur AVANT le rendu d'une page.
//
// Ici : tant que COMING_SOON=true dans .env.local, on redirige TOUT le trafic
// vers /coming-soon. Le jour de l'ouverture, passe COMING_SOON à false (ou
// retire la ligne) et relance le serveur → le vrai site réapparaît, sans
// toucher au code.
//
// EXCEPTION « aperçu » : la cliente doit pouvoir voir le VRAI site (pour se
// relire) alors que les visiteurs voient encore la page coming soon. Le bouton
// « Voir le site » de l'admin ouvre le front avec ?preview=<jeton>. Si le jeton
// correspond à PREVIEW_TOKEN, on pose un cookie de session (site_preview) et on
// laisse passer : elle voit le vrai site, y compris en naviguant ensuite
// (le cookie prend le relais). Le cookie disparaît à la fermeture du navigateur.
const PREVIEW_COOKIE = "site_preview";

export function proxy(request: NextRequest) {
  const comingSoon = process.env.COMING_SOON === "true";

  // Mode désactivé → on ne fait rien, le site s'affiche normalement.
  if (!comingSoon) {
    return NextResponse.next();
  }

  // Aperçu : un jeton valide dans l'URL ouvre le vrai site et pose le cookie.
  // On compare au jeton attendu (PREVIEW_TOKEN) ; s'il n'est pas défini côté
  // serveur, l'aperçu est simplement désactivé (aucun jeton ne peut matcher).
  const expected = process.env.PREVIEW_TOKEN;
  const provided = request.nextUrl.searchParams.get("preview");
  if (expected && provided && provided === expected) {
    // On retire ?preview de l'URL (pour ne pas le laisser traîner ni le
    // partager par mégarde) et on redirige vers l'URL propre, cookie posé.
    const cleanUrl = new URL(request.url);
    cleanUrl.searchParams.delete("preview");
    const response = NextResponse.redirect(cleanUrl);
    response.cookies.set(PREVIEW_COOKIE, "1", {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      // Pas de maxAge / expires → cookie de session : effacé à la fermeture
      // du navigateur (la cliente reclique sur « Voir le site » ensuite).
    });
    return response;
  }

  // Cookie d'aperçu déjà présent → on laisse voir le vrai site.
  if (request.cookies.get(PREVIEW_COOKIE)?.value === "1") {
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

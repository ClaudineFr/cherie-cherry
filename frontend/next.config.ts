import type { NextConfig } from "next";

// Hôte qui sert les images "media" (photos uploadées via l'admin Django).
// - En dev  : NEXT_PUBLIC_MEDIA_HOST n'est pas défini → on retombe sur le
//   Django local (http://127.0.0.1:8000).
// - En prod : on définit NEXT_PUBLIC_MEDIA_HOST sur Railway avec l'URL du
//   backend (ex: https://cherie-cherry-production.up.railway.app).
//
// Next refuse par défaut d'afficher les images d'un domaine non déclaré
// (protection anti-SSRF), d'où la nécessité de le lister ici.
const MEDIA_HOST =
  process.env.NEXT_PUBLIC_MEDIA_HOST ?? "http://127.0.0.1:8000";

const mediaUrl = new URL(MEDIA_HOST);
const isLocal =
  mediaUrl.hostname === "127.0.0.1" || mediaUrl.hostname === "localhost";

const nextConfig: NextConfig = {
  // Masque le badge de développement Next (bas de l'écran). Il n'apparaît de
  // toute façon qu'en `next dev`, jamais en production. Les erreurs de
  // compilation/exécution restent affichées.
  devIndicators: false,

  images: {
    // dangerouslyAllowLocalIP : Next 16 bloque par défaut les images sur IP
    // privée (127.0.0.1). On ne l'autorise QUE si l'hôte média est local (dev).
    dangerouslyAllowLocalIP: isLocal,
    remotePatterns: [
      {
        protocol: mediaUrl.protocol.replace(":", "") as "http" | "https",
        hostname: mediaUrl.hostname,
        // En https le port est vide ; en dev local c'est 8000.
        port: mediaUrl.port,
        pathname: "/media/**",
      },
    ],
  },
};

export default nextConfig;

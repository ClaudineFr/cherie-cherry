import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Autorise Next à afficher les images servies par l'API Django (en dev).
    // Sécurité : Next refuse par défaut les images de domaines non déclarés.
    // dangerouslyAllowLocalIP : Next 16 bloque par défaut les images sur IP
    // privée (127.0.0.1) — protection anti-SSRF. On l'autorise EN DEV seulement,
    // car notre Django local est sur 127.0.0.1. À retirer/remplacer en prod.
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
        pathname: "/media/**",
      },
    ],
  },
};

export default nextConfig;

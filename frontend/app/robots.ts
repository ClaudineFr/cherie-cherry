import type { MetadataRoute } from "next";

const BASE_URL = "https://www.cheriecherry.fr";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Page temporaire : on ne veut pas qu'elle soit indexée.
      disallow: "/coming-soon",
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}

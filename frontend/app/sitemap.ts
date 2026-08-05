import type { MetadataRoute } from "next";

const BASE_URL = "https://www.cheriecherry.fr";

// Pages publiques du site (on exclut /coming-soon, page temporaire).
// priority : importance relative des pages pour le référencement.
const routes: {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/concept-store", changeFrequency: "weekly", priority: 0.9 },
  { path: "/coffee-shop", changeFrequency: "weekly", priority: 0.9 },
  { path: "/a-propos", changeFrequency: "monthly", priority: 0.7 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.7 },
  { path: "/mentions-legales", changeFrequency: "yearly", priority: 0.2 },
  { path: "/confidentialite", changeFrequency: "yearly", priority: 0.2 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return routes.map(({ path, changeFrequency, priority }) => ({
    url: `${BASE_URL}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}

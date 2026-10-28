import type { MetadataRoute } from "next";
import { fixtures, players, site } from "@/content";

const routes = ["", "/matches", "/standings", "/team", "/jersey", "/news", "/videos", "/photos", "/club", "/partners", "/shop", "/contact", "/privacy", "/terms"];

export default function sitemap(): MetadataRoute.Sitemap {
  return [...routes, ...fixtures.map((f) => `/matches/${f.id}`), ...players.map((p) => `/team/${p.slug}`)].map((path) => ({
    url: `${site.baseUrl}${path}`,
    lastModified: site.contentLastReviewed,
  }));
}

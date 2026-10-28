import type { MetadataRoute } from "next";
import { site } from "@/content";

// Concept build: disallow crawling until the franchise approves launch.
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", disallow: "/" }, sitemap: `${site.baseUrl}/sitemap.xml` };
}

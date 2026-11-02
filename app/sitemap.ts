import type { MetadataRoute } from "next";
import { SERVICES } from "@/content/services";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, priority: 1 },
    { url: `${SITE_URL}/sobre`, priority: 0.8 },
    { url: `${SITE_URL}/servicos`, priority: 0.9 },
    ...SERVICES.map((service) => ({
      url: `${SITE_URL}/servicos/${service.slug}`,
      priority: 0.8,
    })),
    { url: `${SITE_URL}/cases`, priority: 0.7 },
    { url: `${SITE_URL}/blog`, priority: 0.7 },
  ];
}

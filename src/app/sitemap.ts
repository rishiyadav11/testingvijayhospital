import type { MetadataRoute } from "next";

const SITE_URL = "https://www.vijayhospitalnarnaul.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes: { path: string; priority: number; freq: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
    { path: "", priority: 1.0, freq: "weekly" },
    { path: "specialties", priority: 0.9, freq: "monthly" },
    { path: "doctors", priority: 0.9, freq: "monthly" },
    { path: "booking", priority: 0.8, freq: "monthly" },
    { path: "contact", priority: 0.8, freq: "yearly" },
    { path: "gallery", priority: 0.6, freq: "monthly" },
    { path: "testimonials", priority: 0.6, freq: "monthly" },
  ];

  return routes.map(({ path, priority, freq }) => ({
    url: `${SITE_URL}/${path}`,
    lastModified: now,
    changeFrequency: freq,
    priority,
  }));
}

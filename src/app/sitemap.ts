import { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { watches, blogPosts } from "@/lib/db/schema";
import { eq, ne } from "drizzle-orm";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://hmgwatches.pt";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [allWatches, publishedPosts] = await Promise.all([
    db
      .select({ slug: watches.slug, updatedAt: watches.updatedAt })
      .from(watches)
      .where(ne(watches.status, "archived")),
    db
      .select({ slug: blogPosts.slug, updatedAt: blogPosts.updatedAt })
      .from(blogPosts)
      .where(eq(blogPosts.status, "published")),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${BASE_URL}/catalogo`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/mercado`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/leiloes`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/sobre-nos`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/contacto`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];

  const watchRoutes: MetadataRoute.Sitemap = allWatches.map((w) => ({
    url: `${BASE_URL}/catalogo/${w.slug}`,
    lastModified: w.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const blogRoutes: MetadataRoute.Sitemap = publishedPosts.map((p) => ({
    url: `${BASE_URL}/blog/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...watchRoutes, ...blogRoutes];
}

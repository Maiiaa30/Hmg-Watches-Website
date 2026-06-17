import type { Metadata } from "next";
import { db } from "@/lib/db";
import { blogPosts } from "@/lib/db/schema";
import { eq, desc, lte, and } from "drizzle-orm";
import { BlogList, type BlogListItem } from "@/components/public/BlogList";

export const metadata: Metadata = {
  title: "Diário de Bordo",
  description: "Reflexões, guias e curiosidades sobre relojoaria.",
};

export const revalidate = 300;

export default async function BlogPage() {
  const now = new Date();
  const rows = await db
    .select()
    .from(blogPosts)
    .where(and(eq(blogPosts.status, "published"), lte(blogPosts.publishedAt, now)))
    .orderBy(desc(blogPosts.publishedAt));

  const posts: BlogListItem[] = rows.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    category: p.category,
    coverImage: p.coverImage,
    readingTimeMinutes: p.readingTimeMinutes,
    publishedAt: p.publishedAt,
  }));

  return (
    <div style={{ padding: "var(--section-y) 0" }}>
      <div className="hmg-container">
        <BlogList posts={posts} />
      </div>
    </div>
  );
}

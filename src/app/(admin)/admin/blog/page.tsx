import { db } from "@/lib/db";
import { blogPosts, watchLeads } from "@/lib/db/schema";
import { eq, desc, sql } from "drizzle-orm";
import { AdminShell } from "@/components/admin/AdminShell";
import { BlogManager, type BlogRow } from "@/components/admin/BlogManager";

export const revalidate = 0;

export default async function AdminBlogPage() {
  const [rows, unreadLeads] = await Promise.all([
    db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt)),
    db.select({ count: sql<number>`count(*)::int` }).from(watchLeads).where(eq(watchLeads.read, false)),
  ]);

  const posts: BlogRow[] = rows.map((p) => ({
    id: p.id,
    title: p.title,
    excerpt: p.excerpt,
    content: p.content,
    category: p.category,
    coverImage: p.coverImage,
    status: p.status,
    generatedByAi: p.generatedByAi,
    createdAt: p.createdAt,
  }));

  return (
    <AdminShell title="Blog" unreadLeads={unreadLeads[0]?.count ?? 0}>
      <BlogManager posts={posts} />
    </AdminShell>
  );
}

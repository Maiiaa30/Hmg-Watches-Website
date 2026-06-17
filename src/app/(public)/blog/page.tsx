import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { blogPosts } from "@/lib/db/schema";
import { eq, desc, lte, and } from "drizzle-orm";
import { SITE_NAME, BLOG_CATEGORY_LABELS } from "@/constants";

export const metadata: Metadata = {
  title: `Diário de Bordo — ${SITE_NAME}`,
  description: "Reflexões, guias e curiosidades sobre relojoaria.",
};

export const revalidate = 300;

export default async function BlogPage() {
  const now = new Date();
  const posts = await db
    .select()
    .from(blogPosts)
    .where(and(eq(blogPosts.status, "published"), lte(blogPosts.publishedAt, now)))
    .orderBy(desc(blogPosts.publishedAt));

  const categories = ["novidades", "curiosidades", "guias", "mercado"] as const;

  return (
    <div style={{ padding: "var(--section-y) 0" }}>
      <div className="hmg-container">
        <div style={{ marginBottom: 72 }}>
          <span className="hmg-overline">Diário de Bordo</span>
          <h1
            style={{
              fontSize: "var(--fs-display-l)",
              lineHeight: "var(--lh-tight)",
              marginTop: 16,
              marginBottom: 16,
            }}
          >
            Reflexões sobre relojoaria
          </h1>
        </div>

        {/* Category pills */}
        <div style={{ display: "flex", gap: 12, marginBottom: 56, flexWrap: "wrap" }}>
          {categories.map((cat) => (
            <span
              key={cat}
              style={{
                padding: "6px 18px",
                border: "1px solid var(--border-strong)",
                fontFamily: "var(--font-ui)",
                fontSize: 11,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--text-secondary)",
                cursor: "pointer",
              }}
            >
              {BLOG_CATEGORY_LABELS[cat]}
            </span>
          ))}
        </div>

        {posts.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "120px 0",
              color: "var(--text-tertiary)",
              fontFamily: "var(--font-display)",
              fontSize: "var(--fs-display-s)",
              fontStyle: "italic",
            }}
          >
            Em breve, novos artigos.
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 48,
            }}
          >
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                style={{ display: "block" }}
              >
                <article
                  style={{
                    borderTop: "1px solid var(--border-subtle)",
                    paddingTop: 28,
                  }}
                >
                  <span
                    style={{
                      display: "inline-block",
                      padding: "3px 10px",
                      border: "1px solid var(--border-strong)",
                      fontFamily: "var(--font-ui)",
                      fontSize: 10,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "var(--text-secondary)",
                      marginBottom: 16,
                    }}
                  >
                    {BLOG_CATEGORY_LABELS[post.category]}
                  </span>
                  <h2
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 22,
                      lineHeight: 1.25,
                      marginBottom: 12,
                    }}
                  >
                    {post.title}
                  </h2>
                  <p
                    style={{
                      fontSize: 15,
                      lineHeight: 1.7,
                      color: "var(--text-secondary)",
                      marginBottom: 20,
                    }}
                  >
                    {post.excerpt}
                  </p>
                  <div
                    style={{
                      fontSize: 12,
                      color: "var(--text-tertiary)",
                      display: "flex",
                      gap: 16,
                    }}
                  >
                    <span>
                      {post.publishedAt
                        ? new Intl.DateTimeFormat("pt-PT", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }).format(post.publishedAt)
                        : ""}
                    </span>
                    <span>{post.readingTimeMinutes} min</span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { blogPosts } from "@/lib/db/schema";
import { eq, and, ne, desc, lte } from "drizzle-orm";
import { BLOG_CATEGORY_LABELS } from "@/constants";
import { renderMarkdown } from "@/lib/markdown";
import { ShareButton } from "@/components/public/ShareButton";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const published = await db
    .select({ slug: blogPosts.slug })
    .from(blogPosts)
    .where(eq(blogPosts.status, "published"));
  return published.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const [post] = await db
    .select()
    .from(blogPosts)
    .where(eq(blogPosts.slug, slug))
    .limit(1);
  if (!post) return { title: "Não encontrado" };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      images: post.coverImage ? [{ url: post.coverImage }] : [],
    },
  };
}

const dateFmt = (d: Date) =>
  new Intl.DateTimeFormat("pt-PT", { day: "numeric", month: "long", year: "numeric" }).format(d);

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params;
  const [post] = await db
    .select()
    .from(blogPosts)
    .where(and(eq(blogPosts.slug, slug), eq(blogPosts.status, "published")))
    .limit(1);

  if (!post) notFound();

  const now = new Date();
  const related = await db
    .select()
    .from(blogPosts)
    .where(
      and(
        eq(blogPosts.status, "published"),
        ne(blogPosts.id, post.id),
        lte(blogPosts.publishedAt, now)
      )
    )
    .orderBy(desc(blogPosts.publishedAt))
    .limit(3);

  return (
    <div>
      {/* ── Immersive hero ── */}
      <section
        style={{
          position: "relative",
          minHeight: "clamp(340px, 54vh, 520px)",
          display: "flex",
          alignItems: "flex-end",
          overflow: "hidden",
        }}
      >
        {/* Cover (image or gradient fallback) */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: post.coverImage ? `url(${post.coverImage})` : undefined,
            background: post.coverImage ? undefined : "linear-gradient(140deg, #2b2519, #4b3f29)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        {/* Scrim for legibility */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(20,16,10,0.82) 0%, rgba(20,16,10,0.30) 50%, rgba(20,16,10,0.10) 100%)",
          }}
        />
        <div
          className="hmg-container"
          style={{ position: "relative", maxWidth: 820, paddingBottom: 48, paddingTop: 80 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20, flexWrap: "wrap" }}>
            <span
              style={{
                padding: "4px 12px",
                borderRadius: "var(--radius-pill)",
                background: "var(--accent)",
                color: "var(--hmg-ink)",
                fontFamily: "var(--font-ui)",
                fontSize: 10.5,
                fontWeight: 600,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              {BLOG_CATEGORY_LABELS[post.category]}
            </span>
            {post.publishedAt && (
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.85)" }}>{dateFmt(post.publishedAt)}</span>
            )}
            <span style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(255,255,255,0.6)" }} />
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.85)" }}>{post.readingTimeMinutes} min de leitura</span>
          </div>
          <h1
            style={{
              fontSize: "clamp(32px, 5.5vw, 56px)",
              lineHeight: 1.1,
              color: "#fff",
            }}
          >
            {post.title}
          </h1>
        </div>
      </section>

      {/* ── Article body ── */}
      <article
        className="hmg-container"
        style={{ maxWidth: 760, padding: "clamp(48px, 7vw, 72px) var(--gutter) 40px" }}
      >
        {/* Lead excerpt */}
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(19px, 2.4vw, 22px)",
            lineHeight: 1.6,
            color: "var(--text-primary)",
            marginBottom: 36,
          }}
        >
          {post.excerpt}
        </p>

        {/* Markdown content */}
        <div className="hmg-prose" dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }} />

        {/* Share / back */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            flexWrap: "wrap",
            marginTop: 48,
            paddingTop: 32,
            borderTop: "1px solid var(--border-subtle)",
          }}
        >
          <ShareButton />
          <Link href="/blog" className="hmg-ghost-btn hmg-ghost-btn--gold">
            <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Voltar ao Diário
          </Link>
        </div>
      </article>

      {/* ── Related ── */}
      {related.length > 0 && (
        <section
          className="hmg-container"
          style={{ padding: "80px var(--gutter) var(--section-y)", borderTop: "1px solid var(--border-subtle)", marginTop: 60 }}
        >
          <h2 style={{ fontSize: "clamp(26px, 3vw, 30px)", marginBottom: 40 }}>Continuar a ler</h2>
          <div className="hmg-stack" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 28, rowGap: 48 }}>
            {related.map((r) => (
              <Link key={r.id} href={`/blog/${r.slug}`} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div
                  style={{
                    aspectRatio: "16 / 10",
                    borderRadius: 6,
                    overflow: "hidden",
                    border: "1px solid var(--border-subtle)",
                    backgroundImage: r.coverImage ? `url(${r.coverImage})` : undefined,
                    background: r.coverImage ? undefined : "linear-gradient(140deg, hsl(40 26% 93%), hsl(40 20% 84%))",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--accent-press)" }}>
                    {BLOG_CATEGORY_LABELS[r.category]}
                  </span>
                  <span style={{ width: 3, height: 3, borderRadius: "50%", background: "var(--text-tertiary)" }} />
                  <span style={{ fontSize: 12, color: "var(--text-tertiary)" }}>{r.readingTimeMinutes} min</span>
                </div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 22, lineHeight: 1.25 }}>{r.title}</h3>
                <p style={{ fontSize: 15, lineHeight: 1.7, color: "var(--text-secondary)" }}>{r.excerpt}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

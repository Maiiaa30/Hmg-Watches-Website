import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { blogPosts } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { BLOG_CATEGORY_LABELS } from "@/constants";

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

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params;
  const [post] = await db
    .select()
    .from(blogPosts)
    .where(and(eq(blogPosts.slug, slug), eq(blogPosts.status, "published")))
    .limit(1);

  if (!post) notFound();

  return (
    <div style={{ padding: "60px 0 var(--section-y)" }}>
      <div className="hmg-container" style={{ maxWidth: "var(--container-narrow)" }}>
        {/* Breadcrumb */}
        <nav
          style={{
            marginBottom: 48,
            fontSize: 13,
            color: "var(--text-tertiary)",
            display: "flex",
            gap: 8,
          }}
        >
          <Link href="/" style={{ color: "var(--text-tertiary)" }}>Início</Link>
          <span>/</span>
          <Link href="/blog" style={{ color: "var(--text-tertiary)" }}>Diário de Bordo</Link>
          <span>/</span>
          <span style={{ color: "var(--text-secondary)" }}>{post.title}</span>
        </nav>

        {/* Category */}
        <span
          style={{
            display: "inline-block",
            padding: "4px 12px",
            border: "1px solid var(--border-strong)",
            fontFamily: "var(--font-ui)",
            fontSize: 10,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--text-secondary)",
            marginBottom: 24,
          }}
        >
          {BLOG_CATEGORY_LABELS[post.category]}
        </span>

        <h1
          style={{
            fontSize: "var(--fs-display-m)",
            lineHeight: "var(--lh-snug)",
            marginBottom: 20,
          }}
        >
          {post.title}
        </h1>

        <div
          style={{
            fontSize: 13,
            color: "var(--text-tertiary)",
            marginBottom: 48,
            paddingBottom: 32,
            borderBottom: "1px solid var(--border-subtle)",
            display: "flex",
            gap: 20,
          }}
        >
          {post.publishedAt && (
            <span>
              {new Intl.DateTimeFormat("pt-PT", {
                day: "numeric",
                month: "long",
                year: "numeric",
              }).format(post.publishedAt)}
            </span>
          )}
          <span>{post.readingTimeMinutes} min de leitura</span>
        </div>

        {/* Content — Markdown stored as plain text, render as prose */}
        <div
          style={{
            fontSize: "var(--fs-body-l)",
            lineHeight: "var(--lh-relaxed)",
            color: "var(--text-secondary)",
            whiteSpace: "pre-wrap",
          }}
        >
          {post.content}
        </div>

        {/* Back */}
        <div
          style={{
            marginTop: 64,
            paddingTop: 32,
            borderTop: "1px solid var(--border-subtle)",
          }}
        >
          <Link href="/blog" className="hmg-ghost-btn hmg-ghost-btn--dark">
            <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Voltar ao Diário
          </Link>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { TypingText } from "@/components/public/TypingText";
import { getDict, BLOG_CATEGORY_I18N, type Locale } from "@/lib/i18n";

export interface BlogListItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: "novidades" | "curiosidades" | "guias" | "mercado";
  coverImage: string | null;
  readingTimeMinutes: number;
  publishedAt: string | Date | null;
}

const CATEGORY_KEYS = ["novidades", "curiosidades", "guias", "mercado"] as const;

export function BlogList({ posts, locale = "en" }: { posts: BlogListItem[]; locale?: Locale }) {
  const [cat, setCat] = useState<string>("all");
  const list = cat === "all" ? posts : posts.filter((p) => p.category === cat);
  const t = getDict(locale);
  const cats = BLOG_CATEGORY_I18N[locale];
  const FILTERS = [
    { key: "all", label: t.blog.filterAll },
    ...CATEGORY_KEYS.map((k) => ({ key: k, label: cats[k] ?? k })),
  ];

  return (
    <div>
      {/* Centered hero */}
      <div className="hmg-fade-up" style={{ textAlign: "center", marginBottom: 44 }}>
        <span className="hmg-overline">{t.blog.overline}</span>
        <h1
          aria-label={t.blog.heroTitle}
          style={{ fontSize: "var(--fs-display-l)", lineHeight: "var(--lh-tight)", marginTop: 20, marginBottom: 18 }}
        >
          <TypingText segments={[{ text: t.blog.heroTitle }]} />
        </h1>
        <p
          style={{
            fontSize: "var(--fs-body-l)",
            lineHeight: 1.7,
            color: "var(--text-secondary)",
            maxWidth: 560,
            margin: "0 auto",
          }}
        >
          {t.blog.subtitle}
        </p>
      </div>

      {/* Category filter pills */}
      <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap", marginBottom: 56 }}>
        {FILTERS.map((f) => {
          const on = f.key === cat;
          return (
            <button
              key={f.key}
              onClick={() => setCat(f.key)}
              style={{
                cursor: "pointer",
                padding: "9px 20px",
                borderRadius: "var(--radius-pill)",
                background: "transparent",
                whiteSpace: "nowrap",
                border: `1px solid ${on ? "var(--accent)" : "var(--border-strong)"}`,
                color: on ? "var(--accent-press)" : "var(--text-secondary)",
                fontFamily: "var(--font-ui)",
                fontSize: 12,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                transition: "all var(--dur-base) var(--ease-out)",
              }}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Grid */}
      {list.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "100px 0",
            color: "var(--text-tertiary)",
            fontFamily: "var(--font-display)",
            fontSize: "var(--fs-display-s)",
            fontStyle: "italic",
          }}
        >
          {t.blog.empty}
        </div>
      ) : (
        <div className="hmg-blog-grid">
          {list.map((p) => (
            <Link key={p.id} href={`/blog/${p.slug}`} className="hmg-article-card">
              <div
                className="hmg-article-cover"
                style={{
                  aspectRatio: "16 / 10",
                  borderRadius: 6,
                  overflow: "hidden",
                  border: "1px solid var(--border-subtle)",
                  backgroundImage: p.coverImage ? `url(${p.coverImage})` : undefined,
                  background: p.coverImage ? undefined : "linear-gradient(140deg, hsl(40 26% 93%), hsl(40 20% 84%))",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--accent-press)" }}>
                  {cats[p.category] ?? p.category}
                </span>
                <span style={{ width: 3, height: 3, borderRadius: "50%", background: "var(--text-tertiary)" }} />
                <span style={{ fontSize: 12, color: "var(--text-tertiary)" }}>{p.readingTimeMinutes} {t.catalog.readingMins}</span>
              </div>
              <h3 className="hmg-article-title" style={{ fontFamily: "var(--font-display)", fontSize: 23, lineHeight: 1.25 }}>
                {p.title}
              </h3>
              <p style={{ fontSize: 15, lineHeight: 1.7, color: "var(--text-secondary)" }}>{p.excerpt}</p>
              {p.publishedAt && (
                <span style={{ fontSize: 12, color: "var(--text-tertiary)" }}>
                  {new Intl.DateTimeFormat("pt-PT", { day: "numeric", month: "short", year: "numeric" }).format(new Date(p.publishedAt))}
                </span>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

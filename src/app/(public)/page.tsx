import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import { watches, blogPosts } from "@/lib/db/schema";
import { eq, and, desc, lte } from "drizzle-orm";
import { WatchCard } from "@/components/public/WatchCard";
import { ContactForm } from "@/components/public/ContactForm";
import { TypingText } from "@/components/public/TypingText";
import { getTodaysAuctions } from "@/lib/leiloes";
import { getT } from "@/lib/i18n-server";
import { SITE_NAME, SITE_DESCRIPTION, BLOG_CATEGORY_LABELS } from "@/constants";

export const metadata: Metadata = {
  title: { absolute: `${SITE_NAME} — Relógios de Luxo` },
  description: SITE_DESCRIPTION,
};

export const revalidate = 300; // 5 min ISR

async function getFeaturedWatches() {
  return db
    .select()
    .from(watches)
    .where(eq(watches.status, "available"))
    .orderBy(desc(watches.createdAt))
    .limit(4);
}

async function getLatestPosts() {
  const now = new Date();
  return db
    .select()
    .from(blogPosts)
    .where(
      and(
        eq(blogPosts.status, "published"),
        lte(blogPosts.publishedAt, now)
      )
    )
    .orderBy(desc(blogPosts.publishedAt))
    .limit(3);
}

async function getHeroWatch() {
  const [hero] = await db
    .select()
    .from(watches)
    .where(and(eq(watches.status, "available"), eq(watches.featured, true)))
    .limit(1);
  return hero ?? null;
}

export default async function HomePage() {
  const { t } = await getT();
  const [featured, posts, featuredHero, todaysAuctions] = await Promise.all([
    getFeaturedWatches(),
    getLatestPosts(),
    getHeroWatch(),
    getTodaysAuctions(),
  ]);

  // Use the admin-chosen featured watch as the hero; fall back to the latest.
  const heroWatch = featuredHero ?? featured[0];

  return (
    <div>
      {/* ── Hero ── */}
      <section
        className="hmg-hero"
        style={{
          position: "relative",
          minHeight: "calc(100vh - 84px)",
          display: "flex",
          alignItems: "center",
          padding: "20px 0",
        }}
      >
        <div
          className="hmg-container hmg-stack"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 56,
            alignItems: "center",
            width: "100%",
          }}
        >
          <div className="hmg-fade-up" style={{ maxWidth: 560 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                marginBottom: 22,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontStyle: "italic",
                  fontSize: 17,
                  color: "var(--accent)",
                }}
              >
                Nº 01
              </span>
              <span
                style={{ height: 1, width: 46, background: "var(--accent)" }}
              />
              <span className="hmg-overline">{t.home.featured}</span>
            </div>
            <h1
              aria-label={`${t.home.heroA}${t.home.heroNot}${t.home.heroB}`.replace(/\n/g, " ").trim()}
              style={{
                fontSize: "clamp(46px, 6vw, 78px)",
                lineHeight: 1.02,
                letterSpacing: "-0.025em",
                minHeight: "1.02em",
              }}
            >
              <TypingText
                segments={[
                  { text: t.home.heroA },
                  { text: t.home.heroNot, style: { fontStyle: "italic", color: "var(--accent-press)" } },
                  { text: t.home.heroB },
                ]}
              />
            </h1>
            <p
              style={{
                fontSize: 19,
                lineHeight: 1.7,
                color: "var(--text-secondary)",
                marginTop: 26,
                maxWidth: 400,
              }}
            >
              {t.home.heroSubtitle}
            </p>
            <div
              style={{
                display: "flex",
                gap: 14,
                marginTop: 38,
                flexWrap: "wrap",
              }}
            >
              <Link href="/catalogo" className="hmg-ghost-btn hmg-ghost-btn--gold">
                {t.home.viewCollection}
                <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <Link href="/sobre-nos" className="hmg-ghost-btn hmg-ghost-btn--dark">
                {t.home.ourStory}
              </Link>
            </div>
          </div>

          {heroWatch && (
            <div
              className="hmg-hero-media"
              style={{
                position: "relative",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: 520,
              }}
            >
              <div style={{ position: "relative", width: "min(400px, 100%)" }}>
                <Link
                  href={`/catalogo/${heroWatch.slug}`}
                  className="hmg-img-in"
                  style={{
                    display: "block",
                    position: "relative",
                    width: "100%",
                    aspectRatio: "37 / 47",
                    borderRadius: 8,
                    overflow: "hidden",
                    border: "1px solid var(--border-strong)",
                    boxShadow: "var(--shadow-float)",
                  }}
                >
                  {heroWatch.images[0] && (
                    <Image
                      src={heroWatch.images[0]}
                      alt={`${heroWatch.brand} ${heroWatch.model}`}
                      fill
                      style={{ objectFit: "cover", objectPosition: "center 42%" }}
                      priority
                    />
                  )}
                </Link>
                {/* Floating label — overlaps the bottom-left corner of the image */}
                <div
                  className="hmg-fade-up hmg-hero-label"
                  style={{
                    position: "absolute",
                    left: -120,
                    bottom: 48,
                    background: "var(--surface-card)",
                    border: "1px solid var(--border-subtle)",
                    padding: "16px 20px",
                    boxShadow: "var(--shadow-card)",
                    maxWidth: 220,
                    animationDelay: "0.55s",
                  }}
                >
                <div
                  style={{
                    fontFamily: "var(--font-ui)",
                    fontSize: 10,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "var(--text-secondary)",
                  }}
                >
                  {heroWatch.brand}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 19,
                    marginTop: 4,
                    lineHeight: 1.15,
                  }}
                >
                  {heroWatch.model}
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                    marginTop: 8,
                  }}
                >
                  <span style={{ fontSize: 14, color: "var(--accent-press)" }}>
                    {new Intl.NumberFormat("pt-PT", {
                      style: "currency",
                      currency: "EUR",
                      maximumFractionDigits: 0,
                    }).format(Number(heroWatch.price))}
                  </span>
                  <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="var(--accent-press)" strokeWidth={1.5}>
                    <path d="M7 17L17 7M17 7H7M17 7v10" />
                  </svg>
                </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── Today's auction banner ── */}
      {todaysAuctions.length > 0 && (
        <section style={{ padding: "0 0 8px" }}>
          <div className="hmg-container" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {todaysAuctions.map((a) => (
              <a
                key={a.id}
                href={a.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hmg-auction-banner"
              >
                <span
                  style={{
                    fontFamily: "var(--font-ui)",
                    fontSize: 10,
                    fontWeight: 600,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "var(--text-on-gold)",
                    background: "var(--accent)",
                    padding: "4px 10px",
                    borderRadius: 100,
                    flexShrink: 0,
                  }}
                >
                  Hoje
                </span>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: 18 }}>
                    {t.home.auctionToday} {a.title}
                  </span>
                  {a.house && (
                    <span style={{ color: "var(--text-tertiary)", fontSize: 14 }}> · {a.house}</span>
                  )}
                  {a.startsTime && (
                    <span style={{ color: "var(--accent-press)", fontSize: 14 }}> · {a.startsTime}</span>
                  )}
                </span>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 7,
                    flexShrink: 0,
                    fontFamily: "var(--font-ui)",
                    fontSize: 12,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "var(--accent-press)",
                  }}
                  aria-hidden="true"
                >
                  {t.home.viewAuction}
                  <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                    <path d="M7 17L17 7M17 7H7M17 7v10" />
                  </svg>
                </span>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* ── Featured pieces ── */}
      {featured.length > 0 && (
        <section
          style={{
            borderTop: "1px solid var(--border-subtle)",
            padding: "120px 0",
          }}
        >
          <div className="hmg-container">
            <div style={{ marginBottom: 56 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  marginBottom: 20,
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 15,
                    color: "var(--accent)",
                    fontStyle: "italic",
                  }}
                >
                  01
                </span>
                <span
                  style={{
                    height: 1,
                    width: 44,
                    background: "var(--accent)",
                  }}
                />
                <span className="hmg-overline">{t.home.selectionOverline}</span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "space-between",
                  gap: 24,
                }}
              >
                <div>
                  <h2 style={{ fontSize: 44, lineHeight: 1.1 }}>
                    <TypingText startOnView segments={[{ text: t.home.selectionTitle }]} />
                  </h2>
                  <p
                    style={{
                      fontSize: 17,
                      lineHeight: 1.7,
                      color: "var(--text-secondary)",
                      marginTop: 16,
                      maxWidth: 520,
                    }}
                  >
                    {t.home.selectionText}
                  </p>
                </div>
                <Link
                  href="/catalogo"
                  className="hmg-ghost-btn hmg-ghost-btn--dark"
                  style={{ whiteSpace: "nowrap", flexShrink: 0 }}
                >
                  {t.home.viewAll}
                  <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
            <div
              className="hmg-stack"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 28,
              }}
            >
              {featured.map((w) => (
                <WatchCard key={w.id} watch={w} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── About teaser ── */}
      <section
        style={{
          background: "var(--bg-page-alt)",
          borderTop: "1px solid var(--border-subtle)",
          borderBottom: "1px solid var(--border-subtle)",
        }}
      >
        <div
          className="hmg-container hmg-stack"
          style={{
            padding: "130px var(--gutter)",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 90,
            alignItems: "center",
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                marginBottom: 20,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 15,
                  color: "var(--accent)",
                  fontStyle: "italic",
                }}
              >
                02
              </span>
              <span
                style={{ height: 1, width: 44, background: "var(--accent)" }}
              />
              <span className="hmg-overline">{t.home.aboutOverline}</span>
            </div>
            <h2 style={{ fontSize: 46, lineHeight: 1.12 }}>
              <TypingText startOnView segments={[{ text: t.home.aboutTitle }]} />
            </h2>
          </div>
          <div>
            <p
              style={{
                fontSize: 19,
                lineHeight: 1.85,
                color: "var(--text-secondary)",
              }}
            >
              {t.home.aboutText}
            </p>
            <div style={{ marginTop: 34 }}>
              <Link
                href="/sobre-nos"
                className="hmg-ghost-btn hmg-ghost-btn--gold"
              >
                {t.home.learnMore}
                <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Blog teaser ── */}
      {posts.length > 0 && (
        <section style={{ padding: "120px 0" }}>
          <div className="hmg-container">
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
                marginBottom: 56,
              }}
            >
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    marginBottom: 20,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 15,
                      color: "var(--accent)",
                      fontStyle: "italic",
                    }}
                  >
                    03
                  </span>
                  <span
                    style={{
                      height: 1,
                      width: 44,
                      background: "var(--accent)",
                    }}
                  />
                  <span className="hmg-overline">{t.home.journalOverline}</span>
                </div>
                <h2 style={{ fontSize: 44, lineHeight: 1.1 }}>
                  <TypingText startOnView segments={[{ text: t.home.journalTitle }]} />
                </h2>
              </div>
              <Link
                href="/blog"
                className="hmg-ghost-btn hmg-ghost-btn--dark"
                style={{ whiteSpace: "nowrap", flexShrink: 0 }}
              >
                {t.home.allArticles}
                <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="hmg-blog-grid">
              {posts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="hmg-article-card">
                  <div
                    className="hmg-article-cover"
                    style={{
                      aspectRatio: "16 / 10",
                      borderRadius: 6,
                      overflow: "hidden",
                      border: "1px solid var(--border-subtle)",
                      backgroundImage: post.coverImage ? `url(${post.coverImage})` : undefined,
                      background: post.coverImage ? undefined : "linear-gradient(140deg, hsl(40 26% 93%), hsl(40 20% 84%))",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--accent-press)" }}>
                      {BLOG_CATEGORY_LABELS[post.category]}
                    </span>
                    <span style={{ width: 3, height: 3, borderRadius: "50%", background: "var(--text-tertiary)" }} />
                    <span style={{ fontSize: 12, color: "var(--text-tertiary)" }}>{post.readingTimeMinutes} {t.catalog.readingMins}</span>
                  </div>
                  <h3 className="hmg-article-title" style={{ fontFamily: "var(--font-display)", fontSize: 23, lineHeight: 1.25 }}>
                    {post.title}
                  </h3>
                  <p style={{ fontSize: 15, lineHeight: 1.7, color: "var(--text-secondary)" }}>{post.excerpt}</p>
                  {post.publishedAt && (
                    <span style={{ fontSize: 12, color: "var(--text-tertiary)" }}>
                      {new Intl.DateTimeFormat("pt-PT", { day: "numeric", month: "short", year: "numeric" }).format(post.publishedAt)}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Contact CTA ── */}
      <section
        id="home-contact"
        style={{
          background: "var(--bg-page-alt)",
          borderTop: "1px solid var(--border-subtle)",
          padding: "120px 0",
          textAlign: "center",
        }}
      >
        <div className="hmg-container" style={{ maxWidth: 560 }}>
          <span className="hmg-overline">{t.home.contactOverline}</span>
          <h2
            style={{
              fontSize: "clamp(32px, 4vw, 52px)",
              lineHeight: 1.12,
              marginTop: 20,
              marginBottom: 20,
            }}
          >
            <TypingText startOnView segments={[{ text: t.home.contactTitle }]} />
          </h2>
          <p
            style={{
              fontSize: 19,
              lineHeight: 1.7,
              color: "var(--text-secondary)",
              marginBottom: 40,
            }}
          >
            {t.home.contactText}
          </p>
          <ContactForm />
        </div>
      </section>
    </div>
  );
}

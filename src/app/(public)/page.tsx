import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import { watches, blogPosts } from "@/lib/db/schema";
import { eq, and, desc, lte } from "drizzle-orm";
import { WatchCard } from "@/components/public/WatchCard";
import { ContactForm } from "@/components/public/ContactForm";
import { TypingText } from "@/components/public/TypingText";
import { SITE_NAME, SITE_DESCRIPTION } from "@/constants";

export const metadata: Metadata = {
  title: `${SITE_NAME} — Relógios de Luxo`,
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
  const [featured, posts, featuredHero] = await Promise.all([
    getFeaturedWatches(),
    getLatestPosts(),
    getHeroWatch(),
  ]);

  // Use the admin-chosen featured watch as the hero; fall back to the latest.
  const heroWatch = featuredHero ?? featured[0];

  return (
    <div>
      {/* ── Hero ── */}
      <section
        style={{
          position: "relative",
          minHeight: "calc(100vh - 84px)",
          display: "flex",
          alignItems: "center",
          padding: "20px 0",
        }}
      >
        <div
          className="hmg-container"
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
              <span className="hmg-overline">Em destaque</span>
            </div>
            <h1
              aria-label="Tempo que não se perde."
              style={{
                fontSize: "clamp(46px, 6vw, 78px)",
                lineHeight: 1.02,
                letterSpacing: "-0.025em",
                minHeight: "1.02em",
              }}
            >
              <TypingText
                segments={[
                  { text: "Tempo que\n" },
                  { text: "não", style: { fontStyle: "italic", color: "var(--accent-press)" } },
                  { text: " se perde." },
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
              Relógios de exceção. Curados, autenticados, prontos a usar.
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
                Ver Coleção
                <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <Link href="/sobre-nos" className="hmg-ghost-btn hmg-ghost-btn--dark">
                A nossa história
              </Link>
            </div>
          </div>

          {heroWatch && (
            <div
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
                  className="hmg-fade-up"
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
                <span className="hmg-overline">Coleção em destaque</span>
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
                    <TypingText startOnView segments={[{ text: "Peças selecionadas" }]} />
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
                    Uma curadoria breve do que está disponível agora — cada
                    relógio autenticado e pronto a usar.
                  </p>
                </div>
                <Link
                  href="/catalogo"
                  className="hmg-ghost-btn hmg-ghost-btn--dark"
                  style={{ whiteSpace: "nowrap", flexShrink: 0 }}
                >
                  Ver tudo
                  <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
            <div
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
          className="hmg-container"
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
              <span className="hmg-overline">Sobre nós</span>
            </div>
            <h2 style={{ fontSize: 46, lineHeight: 1.12 }}>
              <TypingText startOnView segments={[{ text: "Uma montra limpa\nque serve as peças." }]} />
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
              Não vendemos tempo — devolvemos-lhe valor. Cada relógio que chega
              à HMG é estudado, autenticado e avaliado com o mesmo rigor com que
              escolheríamos para nós próprios.
            </p>
            <div style={{ marginTop: 34 }}>
              <Link
                href="/sobre-nos"
                className="hmg-ghost-btn hmg-ghost-btn--gold"
              >
                Saber mais
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
                  <span className="hmg-overline">Diário de Bordo</span>
                </div>
                <h2 style={{ fontSize: 44, lineHeight: 1.1 }}>
                  <TypingText startOnView segments={[{ text: "Reflexões sobre relojoaria" }]} />
                </h2>
              </div>
              <Link
                href="/blog"
                className="hmg-ghost-btn hmg-ghost-btn--dark"
                style={{ whiteSpace: "nowrap", flexShrink: 0 }}
              >
                Ver todos
                <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 28,
              }}
            >
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  style={{
                    display: "block",
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
                    {post.category}
                  </span>
                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 22,
                      lineHeight: 1.25,
                      marginBottom: 12,
                    }}
                  >
                    {post.title}
                  </h3>
                  <p
                    style={{
                      fontSize: 15,
                      lineHeight: 1.7,
                      color: "var(--text-secondary)",
                    }}
                  >
                    {post.excerpt}
                  </p>
                  <div
                    style={{
                      marginTop: 20,
                      fontSize: 12,
                      color: "var(--text-tertiary)",
                    }}
                  >
                    {post.readingTimeMinutes} min de leitura
                  </div>
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
          <span className="hmg-overline">Contacto</span>
          <h2
            style={{
              fontSize: "clamp(32px, 4vw, 52px)",
              lineHeight: 1.12,
              marginTop: 20,
              marginBottom: 20,
            }}
          >
            <TypingText startOnView segments={[{ text: "Tem interesse num relógio?" }]} />
          </h2>
          <p
            style={{
              fontSize: 19,
              lineHeight: 1.7,
              color: "var(--text-secondary)",
              marginBottom: 40,
            }}
          >
            Fale connosco — gostamos de conversar sobre relojoaria tanto quanto
            de vender relógios.
          </p>
          <ContactForm />
        </div>
      </section>
    </div>
  );
}

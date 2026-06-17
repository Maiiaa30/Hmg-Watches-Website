import type { Metadata } from "next";
import { db } from "@/lib/db";
import { watches } from "@/lib/db/schema";
import { eq, or, desc, and } from "drizzle-orm";
import { WatchCard } from "@/components/public/WatchCard";
import { TypingText } from "@/components/public/TypingText";
import { SITE_NAME } from "@/constants";

export const metadata: Metadata = {
  title: `Catálogo — ${SITE_NAME}`,
  description: "Todos os relógios disponíveis e histórico de vendas da HMG Watches.",
};

export const revalidate = 120;

export default async function CatalogoPage() {
  const allWatches = await db
    .select()
    .from(watches)
    .where(or(eq(watches.status, "available"), eq(watches.status, "sold")))
    .orderBy(desc(watches.createdAt));

  const available = allWatches.filter((w) => w.status === "available");
  const sold = allWatches.filter((w) => w.status === "sold");

  return (
    <div style={{ padding: "var(--section-y) 0" }}>
      <div className="hmg-container">
        {/* Header */}
        <div className="hmg-fade-up" style={{ marginBottom: 72 }}>
          <span className="hmg-overline">Coleção</span>
          <h1
            aria-label="Catálogo"
            style={{
              fontSize: "var(--fs-display-l)",
              lineHeight: "var(--lh-tight)",
              marginTop: 16,
              marginBottom: 16,
            }}
          >
            <TypingText segments={[{ text: "Catálogo" }]} />
          </h1>
          <p
            style={{
              fontSize: "var(--fs-body-l)",
              color: "var(--text-secondary)",
              maxWidth: 520,
              lineHeight: "var(--lh-relaxed)",
            }}
          >
            Relógios disponíveis e histórico de vendas. Cada peça autenticada.
          </p>
        </div>

        {/* Available */}
        {available.length > 0 && (
          <section style={{ marginBottom: 80 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                marginBottom: 40,
                paddingBottom: 20,
                borderBottom: "1px solid var(--border-subtle)",
              }}
            >
              <h2
                style={{
                  fontFamily: "var(--font-ui)",
                  fontSize: 11,
                  fontWeight: 500,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "var(--status-available-fg)",
                }}
              >
                Disponíveis
              </h2>
              <span
                style={{
                  fontSize: 12,
                  color: "var(--text-tertiary)",
                }}
              >
                {available.length} {available.length === 1 ? "peça" : "peças"}
              </span>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                gap: "var(--gap-card)",
              }}
            >
              {available.map((w) => (
                <WatchCard key={w.id} watch={w} />
              ))}
            </div>
          </section>
        )}

        {/* Sold (portfolio) */}
        {sold.length > 0 && (
          <section>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                marginBottom: 40,
                paddingBottom: 20,
                borderBottom: "1px solid var(--border-subtle)",
              }}
            >
              <h2
                style={{
                  fontFamily: "var(--font-ui)",
                  fontSize: 11,
                  fontWeight: 500,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "var(--text-tertiary)",
                }}
              >
                Vendidos
              </h2>
              <span style={{ fontSize: 12, color: "var(--text-tertiary)" }}>
                {sold.length} {sold.length === 1 ? "peça" : "peças"}
              </span>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                gap: "var(--gap-card)",
              }}
            >
              {sold.map((w) => (
                <WatchCard key={w.id} watch={w} />
              ))}
            </div>
          </section>
        )}

        {allWatches.length === 0 && (
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
            Em breve, novos relógios.
          </div>
        )}
      </div>
    </div>
  );
}

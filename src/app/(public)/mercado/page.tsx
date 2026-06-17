import type { Metadata } from "next";
import { db } from "@/lib/db";
import { watchMarketHighlights } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";
import { SITE_NAME } from "@/constants";
import { MetalsChart } from "@/components/public/MetalsChart";

export const metadata: Metadata = {
  title: `Mercado — ${SITE_NAME}`,
  description: "Preços de metais preciosos e relógios em valorização.",
};

export const revalidate = 3600; // ISR 1 hora

// Each metal mapped to its Yahoo Finance futures symbol.
const METAL_SERIES = [
  { key: "XAU", name: "Ouro", yahoo: "GC=F" },
  { key: "XAG", name: "Prata", yahoo: "SI=F" },
  { key: "XPT", name: "Platina", yahoo: "PL=F" },
  { key: "XPD", name: "Paládio", yahoo: "PA=F" },
] as const;

export interface MetalSeries {
  key: string;
  name: string;
  current: number; // EUR/oz, latest close
  changePct: number; // % over the period
  points: { t: number; eur: number }[];
}

interface YahooChart {
  chart?: {
    result?: Array<{
      timestamp?: number[];
      indicators?: { quote?: Array<{ close?: (number | null)[] }> };
    }>;
  };
}

// Keyless historical prices: Yahoo Finance gives USD/oz daily closes,
// open.er-api.com gives the USD→EUR rate. Returns 3 months of EUR series.
async function getMetalSeries(): Promise<MetalSeries[] | null> {
  try {
    const [fxRes, ...metalResults] = await Promise.all([
      fetch("https://open.er-api.com/v6/latest/USD", { next: { revalidate: 3600 } }),
      ...METAL_SERIES.map((s) =>
        fetch(
          `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(s.yahoo)}?range=3mo&interval=1d`,
          { headers: { "User-Agent": "Mozilla/5.0" }, next: { revalidate: 3600 } }
        )
      ),
    ]);

    const fx = fxRes.ok ? ((await fxRes.json()) as { rates?: Record<string, number> }) : null;
    const usdToEur = fx?.rates?.EUR;
    if (!usdToEur) return null;

    const series = await Promise.all(
      metalResults.map(async (res, i) => {
        const meta = METAL_SERIES[i];
        if (!meta || !res.ok) return null;
        const json = (await res.json()) as YahooChart;
        const result = json.chart?.result?.[0];
        const ts = result?.timestamp ?? [];
        const closes = result?.indicators?.quote?.[0]?.close ?? [];

        const points = ts
          .map((t, idx) => ({ t, close: closes[idx] }))
          .filter((p): p is { t: number; close: number } => typeof p.close === "number")
          .map((p) => ({ t: p.t, eur: p.close * usdToEur }));

        if (points.length < 2) return null;

        const first = points[0]!.eur;
        const current = points[points.length - 1]!.eur;
        const changePct = first > 0 ? ((current - first) / first) * 100 : 0;

        const out: MetalSeries = { key: meta.key, name: meta.name, current, changePct, points };
        return out;
      })
    );

    const filtered = series.filter((s): s is MetalSeries => s !== null);
    return filtered.length > 0 ? filtered : null;
  } catch {
    return null;
  }
}

export default async function MercadoPage() {
  const [metalSeries, risers] = await Promise.all([
    getMetalSeries(),
    db
      .select()
      .from(watchMarketHighlights)
      .where(eq(watchMarketHighlights.active, true))
      .orderBy(asc(watchMarketHighlights.displayOrder))
      .limit(6),
  ]);

  return (
    <div style={{ padding: "var(--section-y) 0" }}>
      <div className="hmg-container">
        <div style={{ marginBottom: 72 }}>
          <span className="hmg-overline">Mercado</span>
          <h1
            style={{
              fontSize: "var(--fs-display-l)",
              lineHeight: "var(--lh-tight)",
              marginTop: 16,
              marginBottom: 16,
            }}
          >
            Pulso do mercado
          </h1>
          <p style={{ fontSize: "var(--fs-body-l)", color: "var(--text-secondary)", maxWidth: 520 }}>
            Metais preciosos e relógios em destaque no mercado secundário.
          </p>
        </div>

        {/* Metals */}
        <section style={{ marginBottom: 80 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginBottom: 36,
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
            <span style={{ height: 1, width: 44, background: "var(--accent)" }} />
            <span className="hmg-overline">Metais preciosos</span>
          </div>

          {metalSeries ? (
            <>
              <MetalsChart series={metalSeries} />
              <p
                style={{
                  marginTop: 16,
                  fontSize: 11,
                  color: "var(--text-tertiary)",
                }}
              >
                Preços por onça (oz) em EUR · últimos 3 meses · actualizado de hora em hora. Fonte: Yahoo Finance.
              </p>
            </>
          ) : (
            <div
              style={{
                padding: "40px 24px",
                border: "1px solid var(--border-subtle)",
                background: "var(--surface-card)",
                textAlign: "center",
                color: "var(--text-tertiary)",
                fontSize: 14,
              }}
            >
              Cotações de metais temporariamente indisponíveis.
            </div>
          )}
        </section>

        {/* Risers */}
        {risers.length > 0 && (
          <section>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                marginBottom: 36,
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
              <span style={{ height: 1, width: 44, background: "var(--accent)" }} />
              <span className="hmg-overline">Relógios em alta</span>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 28,
              }}
            >
              {risers.map((r) => (
                <div
                  key={r.id}
                  style={{
                    border: "1px solid var(--border-subtle)",
                    padding: "24px",
                    background: "var(--surface-card)",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--font-ui)",
                      fontSize: 10,
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: "var(--text-tertiary)",
                      marginBottom: 6,
                    }}
                  >
                    {r.brand}
                    {r.reference && <span> · {r.reference}</span>}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 20,
                      marginBottom: 12,
                    }}
                  >
                    {r.model}
                  </div>
                  <div
                    style={{
                      fontSize: 26,
                      fontWeight: 700,
                      color: "var(--trend-up)",
                      marginBottom: 4,
                    }}
                  >
                    +{r.appreciationPct}%
                  </div>
                  <div
                    style={{ fontSize: 12, color: "var(--text-tertiary)", marginBottom: 14 }}
                  >
                    em {r.period}
                  </div>
                  {r.editorialNote && (
                    <p
                      style={{
                        fontSize: 14,
                        lineHeight: 1.7,
                        color: "var(--text-secondary)",
                        borderTop: "1px solid var(--border-subtle)",
                        paddingTop: 14,
                      }}
                    >
                      {r.editorialNote}
                    </p>
                  )}
                  {r.source && (
                    <div
                      style={{
                        marginTop: 10,
                        fontSize: 11,
                        color: "var(--text-tertiary)",
                      }}
                    >
                      Fonte: {r.source}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

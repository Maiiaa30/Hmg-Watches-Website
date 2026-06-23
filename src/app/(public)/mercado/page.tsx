import type { Metadata } from "next";
import { db } from "@/lib/db";
import { watchMarketHighlights } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { MetalsChart } from "@/components/public/MetalsChart";
import { TypingText } from "@/components/public/TypingText";
import { MoversIndex, type MoverRow } from "@/components/public/MoversIndex";
import { getT } from "@/lib/i18n-server";

export const metadata: Metadata = {
  title: "Mercado",
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

// Best-effort movers query — a DB hiccup must not 500 the page (the metals
// fetch already degrades gracefully on its own).
async function getMovers() {
  try {
    return await db
      .select()
      .from(watchMarketHighlights)
      .where(eq(watchMarketHighlights.active, true))
      // Top movers: rank by value gained (highest appreciation first).
      .orderBy(desc(watchMarketHighlights.appreciationPct))
      .limit(10);
  } catch {
    return [];
  }
}

export default async function MercadoPage() {
  const { t } = await getT();
  const [metalSeries, riserRows] = await Promise.all([getMetalSeries(), getMovers()]);

  const movers: MoverRow[] = riserRows.map((r) => ({
    id: r.id,
    brand: r.brand,
    model: r.model,
    reference: r.reference,
    imageUrl: r.imageUrl,
    appreciationPct: r.appreciationPct,
    period: r.period,
    editorialNote: r.editorialNote,
    source: r.source,
  }));

  return (
    <div style={{ padding: "var(--section-y) 0" }}>
      <div className="hmg-container">
        <div className="hmg-fade-up" style={{ marginBottom: 72 }}>
          <span className="hmg-overline">{t.market.overline}</span>
          <h1
            aria-label={t.market.title}
            style={{
              fontSize: "var(--fs-display-l)",
              lineHeight: "var(--lh-tight)",
              marginTop: 16,
              marginBottom: 16,
            }}
          >
            <TypingText segments={[{ text: t.market.title }]} />
          </h1>
          <p style={{ fontSize: "var(--fs-body-l)", color: "var(--text-secondary)", maxWidth: 520 }}>
            {t.market.subtitle}
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
            <span className="hmg-overline">{t.market.metals}</span>
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
                {t.market.metalsNote}
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
              {t.market.metalsUnavailable}
            </div>
          )}
        </section>

        {/* Top movers — Chrono24-style ranked index of biggest gainers */}
        {movers.length > 0 && (
          <section>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                marginBottom: 14,
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
              <span className="hmg-overline">{t.market.risers}</span>
            </div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--fs-display-s)",
                lineHeight: "var(--lh-snug)",
                marginBottom: 28,
              }}
            >
              Top {movers.length} — {t.market.topN}
            </h2>

            <MoversIndex rows={movers} />
          </section>
        )}
      </div>
    </div>
  );
}

import type { CSSProperties } from "react";
import { getDict, type Locale } from "@/lib/i18n";

export interface MoverRow {
  id: string;
  brand: string;
  model: string;
  reference: string | null;
  imageUrl: string | null;
  appreciationPct: string; // decimal as string from the DB (can be negative)
  period: string;
  editorialNote: string | null;
  source: string | null;
}

// Deterministic pseudo-random in [0,1) from a numeric seed — keeps the
// sparkline stable across renders (no Math.random, SSR-safe) while making
// each watch's trend line look distinct.
function seededNoise(seed: number): number {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

function seedFromString(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/**
 * A small stylised trend line. The overall slope follows the sign of the
 * appreciation; the wiggle is deterministic noise so the shape is stable but
 * unique per watch. This is an indicative visual, not a precise price history.
 */
function Sparkline({ pct, seed, up }: { pct: number; seed: string; up: boolean }) {
  const W = 88;
  const H = 30;
  const N = 12;
  const base = seedFromString(seed);
  // Normalise magnitude into a 0..1 "strength" for the slope amplitude.
  const strength = Math.min(Math.abs(pct) / 40, 1);
  const points: { x: number; y: number }[] = [];
  for (let i = 0; i < N; i++) {
    const t = i / (N - 1);
    // Trend component: rises (or falls) across the width.
    const trend = up ? t : 1 - t;
    const noise = (seededNoise(base + i * 7.3) - 0.5) * 0.45;
    const v = trend * (0.4 + strength * 0.55) + noise * (0.35 + strength * 0.3);
    const clamped = Math.max(0.05, Math.min(0.95, v));
    points.push({ x: t * W, y: H - clamped * H });
  }
  const d = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(" ");
  const color = up ? "var(--trend-up)" : "var(--trend-down)";
  const last = points[points.length - 1]!;
  return (
    <svg
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      aria-hidden="true"
      focusable="false"
      style={{ overflow: "visible", flexShrink: 0 }}
    >
      <path d={d} fill="none" stroke={color} strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={last.x} cy={last.y} r={2.4} fill={color} />
    </svg>
  );
}

function rankStyle(rank: number): CSSProperties {
  return {
    fontFamily: "var(--font-display)",
    fontSize: 18,
    fontStyle: "italic",
    color: rank <= 3 ? "var(--accent-press)" : "var(--text-tertiary)",
    minWidth: 26,
    textAlign: "center",
    flexShrink: 0,
  };
}

export function MoversIndex({
  rows,
  period,
  locale = "en",
}: {
  rows: MoverRow[];
  period?: string;
  locale?: Locale;
}) {
  const t = getDict(locale);
  return (
    <div role="list" className="hmg-movers">
      {/* Header row (desktop only) */}
      <div className="hmg-movers-head" aria-hidden="true">
        <span style={{ minWidth: 26, textAlign: "center" }}>#</span>
        <span style={{ flex: 1 }}>{t.moversTable.watch}</span>
        <span className="hmg-movers-head-trend">{t.moversTable.trend}</span>
        <span style={{ minWidth: 96, textAlign: "right" }}>{t.moversTable.change}</span>
      </div>

      {rows.map((r, i) => {
        const pct = Number(r.appreciationPct);
        const up = pct >= 0;
        const rank = i + 1;
        const pctLabel = `${up ? "+" : "−"}${Math.abs(pct).toLocaleString(
          locale === "pt" ? "pt-PT" : "en-GB",
          { maximumFractionDigits: 2 }
        )}%`;
        return (
          <div role="listitem" key={r.id} className="hmg-mover-row">
            <span style={rankStyle(rank)} aria-hidden="true">
              {rank}
            </span>

            <div className="hmg-mover-thumb" aria-hidden={r.imageUrl ? undefined : "true"}>
              {r.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={r.imageUrl} alt={`${r.brand} ${r.model}`} loading="lazy" />
              ) : (
                <span className="hmg-mover-thumb-ph">{r.brand.charAt(0)}</span>
              )}
            </div>

            <div className="hmg-mover-id">
              <div className="hmg-mover-brand">
                {r.brand}
                {r.reference && <span className="hmg-mover-ref"> · Ref. {r.reference}</span>}
              </div>
              <div className="hmg-mover-model">{r.model}</div>
              {r.source && <div className="hmg-mover-source">{t.moversTable.source}: {r.source}</div>}
            </div>

            <div className="hmg-mover-spark">
              <Sparkline pct={pct} seed={r.id + r.model} up={up} />
            </div>

            <div className="hmg-mover-change">
              <span
                className="hmg-mover-pct"
                style={{ color: up ? "var(--trend-up)" : "var(--trend-down)" }}
              >
                <span aria-hidden="true">{up ? "▲" : "▼"}</span> {pctLabel}
              </span>
              <span className="hmg-mover-period">{r.period}</span>
            </div>
          </div>
        );
      })}

      <p className="hmg-mover-footnote">{t.moversTable.footnote}</p>
    </div>
  );
}

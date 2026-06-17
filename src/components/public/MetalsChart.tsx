"use client";

import { useState } from "react";

export interface MetalSeries {
  key: string;
  name: string;
  current: number;
  changePct: number;
  points: { t: number; eur: number }[];
}

// viewBox dimensions and plot padding
const W = 1000;
const H = 360;
const PAD = { left: 78, right: 28, top: 24, bottom: 40 };
const PLOT_W = W - PAD.left - PAD.right;
const PLOT_H = H - PAD.top - PAD.bottom;

function fmtEur(value: number) {
  return new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: value < 100 ? 2 : 0,
  }).format(value);
}

function fmtDate(t: number) {
  return new Intl.DateTimeFormat("pt-PT", { day: "2-digit", month: "short" }).format(new Date(t * 1000));
}

export function MetalsChart({ series }: { series: MetalSeries[] }) {
  const [selectedKey, setSelectedKey] = useState(series[0]?.key ?? "");
  const [hover, setHover] = useState<number | null>(null);

  const active = series.find((s) => s.key === selectedKey) ?? series[0];
  if (!active) return null;

  const pts = active.points;
  const n = pts.length;
  const values = pts.map((p) => p.eur);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  // Pad the y-domain slightly so the line doesn't touch the edges
  const yMin = min - range * 0.08;
  const yMax = max + range * 0.08;

  const x = (i: number) => PAD.left + (n <= 1 ? 0 : (i / (n - 1)) * PLOT_W);
  const y = (v: number) => PAD.top + (1 - (v - yMin) / (yMax - yMin)) * PLOT_H;

  const linePath = pts.map((p, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(p.eur).toFixed(1)}`).join(" ");
  const areaPath = `${linePath} L${x(n - 1).toFixed(1)},${(PAD.top + PLOT_H).toFixed(1)} L${x(0).toFixed(1)},${(PAD.top + PLOT_H).toFixed(1)} Z`;

  // Y-axis gridlines
  const gridLines = Array.from({ length: 5 }, (_, i) => {
    const v = yMin + ((yMax - yMin) * i) / 4;
    return { v, y: y(v) };
  });

  // X-axis labels (about 5, evenly spaced)
  const xLabelCount = Math.min(5, n);
  const xLabels = Array.from({ length: xLabelCount }, (_, i) => {
    const idx = Math.round((i / (xLabelCount - 1)) * (n - 1));
    return { idx, t: pts[idx]!.t };
  });

  const up = active.changePct >= 0;
  const lineColor = up ? "var(--trend-up)" : "var(--hmg-down)";

  function handleMove(e: React.MouseEvent<SVGSVGElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width; // 0..1 across full svg
    const dataRatio = (ratio * W - PAD.left) / PLOT_W;
    const idx = Math.round(dataRatio * (n - 1));
    setHover(Math.max(0, Math.min(n - 1, idx)));
  }

  const hoverPoint = hover !== null ? pts[hover] : null;

  return (
    <div>
      {/* Metal selector tabs */}
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${series.length}, 1fr)`, gap: 14, marginBottom: 28 }}>
        {series.map((s) => {
          const isActive = s.key === active.key;
          const sUp = s.changePct >= 0;
          return (
            <button
              key={s.key}
              onClick={() => { setSelectedKey(s.key); setHover(null); }}
              style={{
                textAlign: "left",
                padding: "18px 20px",
                border: "1px solid " + (isActive ? "var(--accent)" : "var(--border-subtle)"),
                background: isActive ? "var(--surface-card)" : "transparent",
                borderRadius: 6,
                cursor: "pointer",
                transition: "border-color var(--dur-base) var(--ease-out)",
              }}
            >
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.12em", color: "var(--text-tertiary)", marginBottom: 6 }}>
                {s.key}
              </div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 18, marginBottom: 4 }}>{s.name}</div>
              <div style={{ fontSize: 18, fontWeight: 600, color: "var(--accent-press)" }}>{fmtEur(s.current)}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: sUp ? "var(--trend-up)" : "var(--hmg-down)", marginTop: 2 }}>
                {sUp ? "▲" : "▼"} {Math.abs(s.changePct).toFixed(1)}% <span style={{ color: "var(--text-tertiary)", fontWeight: 400 }}>· 3M</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Chart */}
      <div style={{ position: "relative", border: "1px solid var(--border-subtle)", background: "var(--surface-card)", borderRadius: 6, padding: "20px 8px 8px" }}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          width="100%"
          style={{ display: "block", overflow: "visible" }}
          onMouseMove={handleMove}
          onMouseLeave={() => setHover(null)}
        >
          <defs>
            <linearGradient id={`grad-${active.key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={lineColor} stopOpacity={0.18} />
              <stop offset="100%" stopColor={lineColor} stopOpacity={0} />
            </linearGradient>
          </defs>

          {/* Gridlines + y labels */}
          {gridLines.map((g, i) => (
            <g key={i}>
              <line x1={PAD.left} y1={g.y} x2={W - PAD.right} y2={g.y} stroke="var(--border-subtle)" strokeWidth={1} />
              <text x={PAD.left - 10} y={g.y + 4} textAnchor="end" fontSize={12} fill="var(--text-tertiary)" fontFamily="var(--font-mono)">
                {fmtEur(g.v)}
              </text>
            </g>
          ))}

          {/* Area + line */}
          <path d={areaPath} fill={`url(#grad-${active.key})`} />
          <path d={linePath} fill="none" stroke={lineColor} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />

          {/* X labels */}
          {xLabels.map((l, i) => (
            <text key={i} x={x(l.idx)} y={H - 12} textAnchor="middle" fontSize={12} fill="var(--text-tertiary)" fontFamily="var(--font-mono)">
              {fmtDate(l.t)}
            </text>
          ))}

          {/* Hover indicator */}
          {hoverPoint && hover !== null && (
            <g>
              <line x1={x(hover)} y1={PAD.top} x2={x(hover)} y2={PAD.top + PLOT_H} stroke="var(--border-strong)" strokeWidth={1} strokeDasharray="4 4" />
              <circle cx={x(hover)} cy={y(hoverPoint.eur)} r={4.5} fill={lineColor} stroke="var(--surface-card)" strokeWidth={2} />
            </g>
          )}
        </svg>

        {/* Tooltip */}
        {hoverPoint && hover !== null && (
          <div
            style={{
              position: "absolute",
              top: 14,
              left: `${(x(hover) / W) * 100}%`,
              transform: x(hover) > W / 2 ? "translateX(-105%)" : "translateX(5%)",
              background: "var(--bg-page)",
              border: "1px solid var(--border-strong)",
              borderRadius: 4,
              padding: "8px 12px",
              pointerEvents: "none",
              boxShadow: "var(--shadow-card)",
              whiteSpace: "nowrap",
            }}
          >
            <div style={{ fontSize: 11, color: "var(--text-tertiary)", marginBottom: 2 }}>
              {new Intl.DateTimeFormat("pt-PT", { day: "2-digit", month: "long", year: "numeric" }).format(new Date(hoverPoint.t * 1000))}
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, color: "var(--accent-press)" }}>{fmtEur(hoverPoint.eur)}</div>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { MOVEMENT_TYPE_LABELS } from "@/constants";

export interface WatchRow {
  id: string;
  brand: string;
  model: string;
  reference: string | null;
  year: number | null;
  movementType: string;
  price: string;
  status: "available" | "sold" | "archived";
  featured: boolean;
  image: string | null;
  createdAt: string | Date;
}

type Filter = "all" | "available" | "sold" | "archived";

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "Todos" },
  { key: "available", label: "Disponíveis" },
  { key: "sold", label: "Vendidos" },
  { key: "archived", label: "Arquivados" },
];

const eur = (v: string) =>
  new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(Number(v));

export function RelogiosTable({ watches }: { watches: WatchRow[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const filtered = watches.filter((w) => {
    if (filter !== "all" && w.status !== filter) return false;
    if (query) {
      const q = query.toLowerCase();
      const hay = `${w.brand} ${w.model} ${w.reference ?? ""}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  async function setStatus(id: string, status: "available" | "sold" | "archived") {
    setBusy(id);
    setError(null);
    try {
      const res = await fetch(`/api/relogios/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!data.success) setError(data.error ?? "Erro ao alterar estado.");
      else router.refresh();
    } finally {
      setBusy(null);
    }
  }

  async function toggleFeatured(w: WatchRow) {
    setBusy(w.id);
    setError(null);
    try {
      const res = await fetch(`/api/relogios/${w.id}/featured`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: !w.featured }),
      });
      const data = await res.json();
      if (!data.success) setError(data.error ?? "Erro ao definir destaque.");
      else router.refresh();
    } finally {
      setBusy(null);
    }
  }

  async function remove(w: WatchRow) {
    if (!confirm(`Eliminar ${w.brand} ${w.model} permanentemente? As imagens também serão removidas.`)) return;
    setBusy(w.id);
    setError(null);
    try {
      const res = await fetch(`/api/relogios/${w.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!data.success) setError(data.error ?? "Erro ao eliminar.");
      else router.refresh();
    } finally {
      setBusy(null);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Filters + search */}
      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: 8 }}>
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              style={{
                padding: "7px 16px",
                borderRadius: "var(--radius-pill)",
                border: "1px solid " + (filter === f.key ? "var(--accent)" : "var(--border-strong)"),
                background: filter === f.key ? "var(--accent)" : "transparent",
                color: filter === f.key ? "var(--hmg-ink)" : "var(--text-secondary)",
                fontSize: 12.5,
                cursor: "pointer",
                fontFamily: "var(--font-ui)",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Pesquisar marca, modelo, referência…"
          style={{
            flex: 1,
            minWidth: 200,
            padding: "8px 14px",
            background: "var(--bg-page)",
            border: "1px solid var(--border-strong)",
            borderRadius: "var(--radius-sm)",
            fontSize: 13,
            outline: "none",
            color: "var(--text-primary)",
          }}
        />
      </div>

      {error && <p style={{ color: "var(--hmg-down)", fontSize: 14, margin: 0 }}>{error}</p>}

      <div style={{ background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: 6, overflow: "hidden" }}>
        {/* Header */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "52px 2fr 1fr 110px 110px 300px",
            padding: "14px 22px",
            borderBottom: "1px solid var(--border-subtle)",
            background: "var(--bg-page-alt)",
            fontSize: 11,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--text-tertiary)",
          }}
        >
          <div />
          <div>Relógio</div>
          <div>Referência</div>
          <div style={{ textAlign: "right" }}>Preço</div>
          <div style={{ textAlign: "center" }}>Estado</div>
          <div style={{ textAlign: "right" }}>Ações</div>
        </div>

        {filtered.length === 0 && (
          <div style={{ padding: "60px 24px", textAlign: "center", color: "var(--text-tertiary)", fontSize: 14 }}>
            Nenhum relógio nesta vista.
          </div>
        )}

        {filtered.map((w) => (
          <div
            key={w.id}
            style={{
              display: "grid",
              gridTemplateColumns: "52px 2fr 1fr 110px 110px 300px",
              padding: "14px 22px",
              borderBottom: "1px solid var(--border-subtle)",
              alignItems: "center",
              fontSize: 13,
              background: w.featured ? "rgba(182,138,46,0.06)" : "transparent",
            }}
          >
            {/* Thumb */}
            <div style={{ width: 44, height: 44, background: "var(--bg-page-alt)", border: "1px solid var(--border-subtle)", overflow: "hidden", flexShrink: 0 }}>
              {w.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={w.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              )}
            </div>

            {/* Name */}
            <div>
              <div style={{ fontWeight: 500, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: 8 }}>
                {w.featured && <span title="Em destaque na homepage" style={{ color: "var(--accent)" }}>★</span>}
                {w.brand} {w.model}
              </div>
              <div style={{ fontSize: 11, color: "var(--text-tertiary)", marginTop: 2 }}>
                {w.year && `${w.year} · `}
                {w.movementType ? MOVEMENT_TYPE_LABELS[w.movementType] : ""}
              </div>
            </div>

            {/* Ref */}
            <div style={{ color: "var(--text-secondary)", fontFamily: "var(--font-mono)", fontSize: 12 }}>{w.reference ?? "—"}</div>

            {/* Price */}
            <div style={{ textAlign: "right", fontWeight: 500 }}>{eur(w.price)}</div>

            {/* Status */}
            <div style={{ textAlign: "center" }}><Badge status={w.status} /></div>

            {/* Actions */}
            <div style={{ display: "flex", gap: 6, justifyContent: "flex-end", flexWrap: "wrap" }}>
              <button
                onClick={() => toggleFeatured(w)}
                disabled={busy === w.id}
                title={w.featured ? "Remover destaque" : "Definir como destaque na homepage"}
                style={miniBtn(w.featured ? "gold" : undefined)}
              >
                {w.featured ? "★ Destaque" : "☆ Destacar"}
              </button>
              {w.status !== "sold" ? (
                <button onClick={() => setStatus(w.id, "sold")} disabled={busy === w.id} style={miniBtn()}>Vendido</button>
              ) : (
                <button onClick={() => setStatus(w.id, "available")} disabled={busy === w.id} style={miniBtn()}>Reverter</button>
              )}
              <Link href={`/admin/relogios/${w.id}/editar`} style={{ ...miniBtn(), textDecoration: "none", display: "inline-flex", alignItems: "center" }}>Editar</Link>
              <button onClick={() => remove(w)} disabled={busy === w.id} style={miniBtn("danger")}>Eliminar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function miniBtn(variant?: "gold" | "danger"): React.CSSProperties {
  return {
    padding: "5px 11px",
    borderRadius: 4,
    border: "1px solid " + (variant === "gold" ? "var(--accent)" : variant === "danger" ? "var(--hmg-down)" : "var(--border-strong)"),
    background: variant === "gold" ? "var(--accent)" : "transparent",
    color: variant === "gold" ? "var(--hmg-ink)" : variant === "danger" ? "var(--hmg-down)" : "var(--text-secondary)",
    fontSize: 12,
    cursor: "pointer",
    fontFamily: "var(--font-ui)",
  };
}

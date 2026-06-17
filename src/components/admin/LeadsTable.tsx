"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";

export interface LeadRow {
  id: string;
  watchStatusAtTime: "available" | "sold";
  name: string | null;
  email: string | null;
  phone: string | null;
  message: string;
  read: boolean;
  createdAt: string | Date;
  watch: { brand: string; model: string; slug: string };
}

type Filter = "all" | "unread" | "available" | "sold";

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "Todos" },
  { key: "unread", label: "Não lidos" },
  { key: "available", label: "Disponíveis" },
  { key: "sold", label: "Vendidos" },
];

export function LeadsTable({ leads }: { leads: LeadRow[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const filtered = leads.filter((l) => {
    if (filter === "unread") return !l.read;
    if (filter === "available") return l.watchStatusAtTime === "available";
    if (filter === "sold") return l.watchStatusAtTime === "sold";
    return true;
  });

  async function markRead(id: string) {
    setBusy(id);
    try {
      await fetch(`/api/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: true }),
      });
      router.refresh();
    } finally {
      setBusy(null);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      {/* Filters */}
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

      <div
        style={{
          background: "var(--surface-card)",
          border: "1px solid var(--border-subtle)",
          borderRadius: 6,
          overflow: "hidden",
        }}
      >
        {filtered.length === 0 && (
          <div style={{ padding: "60px 24px", textAlign: "center", color: "var(--text-tertiary)", fontSize: 14 }}>
            Nenhum contacto nesta vista.
          </div>
        )}

        {filtered.map((lead) => {
          const isOpen = expanded === lead.id;
          return (
            <div key={lead.id} style={{ borderBottom: "1px solid var(--border-subtle)", background: !lead.read ? "rgba(182,138,46,0.04)" : "transparent" }}>
              <div
                onClick={() => setExpanded(isOpen ? null : lead.id)}
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr 1.4fr 1fr 120px 70px",
                  padding: "16px 22px",
                  alignItems: "center",
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                <div>
                  <div style={{ fontWeight: 500 }}>{lead.watch.brand} {lead.watch.model}</div>
                  <div style={{ fontSize: 11, color: "var(--text-tertiary)", marginTop: 2 }}>/catalogo/{lead.watch.slug}</div>
                </div>
                <div style={{ color: "var(--text-secondary)" }}>{lead.name ?? "Anónimo"}</div>
                <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                  {lead.email && <div>{lead.email}</div>}
                  {lead.phone && <div>{lead.phone}</div>}
                  {!lead.email && !lead.phone && "—"}
                </div>
                <div><Badge status={lead.watchStatusAtTime} /></div>
                <div style={{ textAlign: "center", fontSize: 11, color: "var(--text-tertiary)" }}>
                  {new Intl.DateTimeFormat("pt-PT", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }).format(new Date(lead.createdAt))}
                </div>
                <div style={{ textAlign: "center" }}>
                  <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: "50%", background: lead.read ? "var(--border-strong)" : "var(--accent)" }} />
                </div>
              </div>

              {isOpen && (
                <div style={{ padding: "0 22px 20px", borderTop: "1px solid var(--border-subtle)" }}>
                  <div style={{ paddingTop: 16, fontSize: 14, lineHeight: 1.7, color: "var(--text-secondary)", whiteSpace: "pre-wrap" }}>
                    {lead.message}
                  </div>
                  <div style={{ display: "flex", gap: 10, marginTop: 18, flexWrap: "wrap" }}>
                    <Link href={`/catalogo/${lead.watch.slug}`} target="_blank" style={actionBtn}>Ver relógio</Link>
                    {lead.email && (
                      <a href={`mailto:${lead.email}?subject=${encodeURIComponent(`${lead.watch.brand} ${lead.watch.model}`)}`} style={actionBtn}>
                        Responder por email
                      </a>
                    )}
                    {!lead.read && (
                      <button onClick={() => markRead(lead.id)} disabled={busy === lead.id} style={{ ...actionBtn, background: "var(--accent)", color: "var(--hmg-ink)", border: "none" }}>
                        {busy === lead.id ? "A marcar…" : "Marcar como lido"}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const actionBtn: React.CSSProperties = {
  padding: "8px 16px",
  border: "1px solid var(--border-strong)",
  borderRadius: 4,
  background: "transparent",
  color: "var(--text-secondary)",
  fontSize: 12.5,
  cursor: "pointer",
  textDecoration: "none",
  fontFamily: "var(--font-ui)",
};

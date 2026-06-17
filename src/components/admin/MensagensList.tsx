"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export interface MessageRow {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string | Date;
}

export function MensagensList({ messages }: { messages: MessageRow[] }) {
  const router = useRouter();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  async function markRead(id: string) {
    setBusy(id);
    try {
      await fetch(`/api/mensagens/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: true }),
      });
      router.refresh();
    } finally {
      setBusy(null);
    }
  }

  async function remove(id: string) {
    if (!confirm("Eliminar esta mensagem?")) return;
    setBusy(id);
    try {
      await fetch(`/api/mensagens/${id}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setBusy(null);
    }
  }

  return (
    <div
      style={{
        background: "var(--surface-card)",
        border: "1px solid var(--border-subtle)",
        borderRadius: 6,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1.5fr 1.5fr 120px 80px",
          padding: "14px 22px",
          borderBottom: "1px solid var(--border-subtle)",
          background: "var(--bg-page-alt)",
          fontSize: 11,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "var(--text-tertiary)",
        }}
      >
        <div>Assunto</div>
        <div>Nome</div>
        <div>Email</div>
        <div style={{ textAlign: "center" }}>Data</div>
        <div style={{ textAlign: "center" }}>Lido</div>
      </div>

      {messages.length === 0 && (
        <div style={{ padding: "60px 24px", textAlign: "center", color: "var(--text-tertiary)", fontSize: 14 }}>
          Nenhuma mensagem recebida.
        </div>
      )}

      {messages.map((msg) => {
        const isOpen = expanded === msg.id;
        return (
          <div key={msg.id} style={{ borderBottom: "1px solid var(--border-subtle)", background: !msg.read ? "rgba(182,138,46,0.04)" : "transparent" }}>
            <div
              onClick={() => setExpanded(isOpen ? null : msg.id)}
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1.5fr 1.5fr 120px 80px",
                padding: "16px 22px",
                alignItems: "center",
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              <div style={{ fontWeight: 500, color: "var(--text-primary)" }}>{msg.subject}</div>
              <div style={{ color: "var(--text-secondary)" }}>{msg.name}</div>
              <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>{msg.email}</div>
              <div style={{ textAlign: "center", fontSize: 11, color: "var(--text-tertiary)" }}>
                {new Intl.DateTimeFormat("pt-PT", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }).format(new Date(msg.createdAt))}
              </div>
              <div style={{ textAlign: "center" }}>
                <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: "50%", background: msg.read ? "var(--border-strong)" : "var(--accent)" }} />
              </div>
            </div>

            {isOpen && (
              <div style={{ padding: "0 22px 20px", borderTop: "1px solid var(--border-subtle)" }}>
                <div style={{ paddingTop: 16, fontSize: 14, lineHeight: 1.7, color: "var(--text-secondary)", whiteSpace: "pre-wrap" }}>
                  {msg.message}
                </div>
                <div style={{ display: "flex", gap: 10, marginTop: 18, flexWrap: "wrap" }}>
                  <a href={`mailto:${msg.email}?subject=${encodeURIComponent("Re: " + msg.subject)}`} style={actionBtn}>Responder por email</a>
                  {!msg.read && (
                    <button onClick={() => markRead(msg.id)} disabled={busy === msg.id} style={{ ...actionBtn, background: "var(--accent)", color: "var(--hmg-ink)", border: "none" }}>
                      {busy === msg.id ? "A marcar…" : "Marcar como lido"}
                    </button>
                  )}
                  <button onClick={() => remove(msg.id)} disabled={busy === msg.id} style={{ ...actionBtn, color: "var(--hmg-down)" }}>
                    Eliminar
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
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

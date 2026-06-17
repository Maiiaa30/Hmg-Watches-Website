"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export interface HighlightRow {
  id: string;
  brand: string;
  model: string;
  reference: string | null;
  imageUrl: string | null;
  appreciationPct: string;
  period: string;
  editorialNote: string | null;
  source: string | null;
  displayOrder: number;
  active: boolean;
}

interface FormState {
  brand: string;
  model: string;
  reference: string;
  imageUrl: string;
  appreciationPct: string;
  period: string;
  editorialNote: string;
  source: string;
  active: boolean;
}

const EMPTY_FORM: FormState = {
  brand: "", model: "", reference: "", imageUrl: "",
  appreciationPct: "", period: "", editorialNote: "", source: "", active: true,
};

export function MercadoManager({ highlights }: { highlights: HighlightRow[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null); // null = closed, "new" = create
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  function openNew() {
    setForm(EMPTY_FORM);
    setEditingId("new");
    setError(null);
  }

  function openEdit(h: HighlightRow) {
    setForm({
      brand: h.brand,
      model: h.model,
      reference: h.reference ?? "",
      imageUrl: h.imageUrl ?? "",
      appreciationPct: h.appreciationPct,
      period: h.period,
      editorialNote: h.editorialNote ?? "",
      source: h.source ?? "",
      active: h.active,
    });
    setEditingId(h.id);
    setError(null);
  }

  async function save() {
    setSaving(true);
    setError(null);
    const payload = {
      brand: form.brand,
      model: form.model,
      reference: form.reference || undefined,
      imageUrl: form.imageUrl || undefined,
      appreciationPct: Number(form.appreciationPct),
      period: form.period,
      editorialNote: form.editorialNote || undefined,
      source: form.source || undefined,
      active: form.active,
    };
    try {
      const isNew = editingId === "new";
      const res = await fetch(isNew ? "/api/mercado/relogios-alta" : `/api/mercado/relogios-alta/${editingId}`, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.error ?? "Erro ao guardar.");
      } else {
        setEditingId(null);
        router.refresh();
      }
    } catch {
      setError("Erro de rede.");
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(h: HighlightRow) {
    setBusy(h.id);
    try {
      await fetch(`/api/mercado/relogios-alta/${h.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !h.active }),
      });
      router.refresh();
    } finally {
      setBusy(null);
    }
  }

  async function remove(h: HighlightRow) {
    if (!confirm(`Remover ${h.brand} ${h.model}?`)) return;
    setBusy(h.id);
    try {
      await fetch(`/api/mercado/relogios-alta/${h.id}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setBusy(null);
    }
  }

  // Swap display order with the neighbour in the given direction
  async function move(index: number, dir: -1 | 1) {
    const a = highlights[index];
    const b = highlights[index + dir];
    if (!a || !b) return;
    setBusy(a.id);
    try {
      await Promise.all([
        fetch(`/api/mercado/relogios-alta/${a.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ displayOrder: b.displayOrder }),
        }),
        fetch(`/api/mercado/relogios-alta/${b.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ displayOrder: a.displayOrder }),
        }),
      ]);
      router.refresh();
    } finally {
      setBusy(null);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <p style={{ fontSize: 13, color: "var(--text-tertiary)", margin: 0 }}>
          Máximo recomendado: 6 entradas ativas em simultâneo.
        </p>
        <button onClick={openNew} style={primaryBtn}>+ Adicionar entrada</button>
      </div>

      {error && !editingId && <p style={{ color: "var(--hmg-down)", fontSize: 14, margin: 0 }}>{error}</p>}

      {highlights.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 0", color: "var(--text-tertiary)", fontSize: 15 }}>
          Nenhuma entrada de mercado configurada.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {highlights.map((h, i) => (
            <div
              key={h.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                padding: "16px 20px",
                background: "var(--surface-card)",
                border: "1px solid var(--border-subtle)",
                borderRadius: 6,
                opacity: h.active ? 1 : 0.5,
              }}
            >
              {/* Reorder */}
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <button onClick={() => move(i, -1)} disabled={i === 0 || busy === h.id} style={arrowBtn(i === 0)}>▲</button>
                <button onClick={() => move(i, 1)} disabled={i === highlights.length - 1 || busy === h.id} style={arrowBtn(i === highlights.length - 1)}>▼</button>
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500, fontSize: 15 }}>
                  {h.brand} {h.model}
                  {h.reference && <span style={{ color: "var(--text-tertiary)", fontSize: 12, marginLeft: 8 }}>Ref. {h.reference}</span>}
                </div>
                {h.editorialNote && <div style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 4 }}>{h.editorialNote}</div>}
                {h.source && <div style={{ fontSize: 11, color: "var(--text-tertiary)", marginTop: 4 }}>Fonte: {h.source}</div>}
              </div>

              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: "var(--trend-up)" }}>+{h.appreciationPct}%</div>
                <div style={{ fontSize: 11, color: "var(--text-tertiary)" }}>{h.period}</div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 100 }}>
                <button onClick={() => toggleActive(h)} disabled={busy === h.id} style={miniBtn(h.active ? undefined : "gold")}>
                  {h.active ? "Desativar" : "Ativar"}
                </button>
                <button onClick={() => openEdit(h)} style={miniBtn()}>Editar</button>
                <button onClick={() => remove(h)} disabled={busy === h.id} style={miniBtn("danger")}>Remover</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit modal */}
      {editingId && (
        <div
          onClick={() => !saving && setEditingId(null)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "flex-start", justifyContent: "center", zIndex: 1000, padding: "60px 20px", overflowY: "auto" }}
        >
          <div onClick={(e) => e.stopPropagation()} style={{ background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: 8, padding: "28px 30px", width: "100%", maxWidth: 560, boxShadow: "var(--shadow-float)" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, marginBottom: 20 }}>
              {editingId === "new" ? "Nova entrada" : "Editar entrada"}
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <Field label="Marca *"><input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} style={inputStyle} /></Field>
              <Field label="Modelo *"><input value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} style={inputStyle} /></Field>
              <Field label="Referência"><input value={form.reference} onChange={(e) => setForm({ ...form, reference: e.target.value })} style={inputStyle} /></Field>
              <Field label="Valorização % *"><input type="number" step="0.01" value={form.appreciationPct} onChange={(e) => setForm({ ...form, appreciationPct: e.target.value })} style={inputStyle} placeholder="23" /></Field>
              <Field label="Período *"><input value={form.period} onChange={(e) => setForm({ ...form, period: e.target.value })} style={inputStyle} placeholder="6 meses" /></Field>
              <Field label="Fonte"><input value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} style={inputStyle} placeholder="WatchCharts" /></Field>
            </div>
            <div style={{ marginTop: 14 }}>
              <Field label="URL da imagem"><input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} style={inputStyle} placeholder="https://…" /></Field>
            </div>
            <div style={{ marginTop: 14 }}>
              <Field label="Nota editorial"><textarea value={form.editorialNote} onChange={(e) => setForm({ ...form, editorialNote: e.target.value })} style={{ ...inputStyle, height: 70, resize: "vertical" }} maxLength={500} /></Field>
            </div>
            <label style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 14, fontSize: 14, cursor: "pointer" }}>
              <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
              Ativo (visível no site público)
            </label>

            {error && <p style={{ color: "var(--hmg-down)", fontSize: 13, marginTop: 14 }}>{error}</p>}

            <div style={{ display: "flex", gap: 10, marginTop: 24, justifyContent: "flex-end" }}>
              <button onClick={() => setEditingId(null)} disabled={saving} style={miniBtn()}>Cancelar</button>
              <button onClick={save} disabled={saving} style={primaryBtn}>{saving ? "A guardar…" : "Guardar"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

const primaryBtn: React.CSSProperties = {
  padding: "10px 20px",
  background: "var(--accent)",
  color: "var(--hmg-ink)",
  fontFamily: "var(--font-ui)",
  fontSize: 13,
  fontWeight: 600,
  borderRadius: 4,
  border: "none",
  cursor: "pointer",
};

function miniBtn(variant?: "gold" | "danger"): React.CSSProperties {
  return {
    padding: "6px 12px",
    borderRadius: 4,
    border: "1px solid " + (variant === "gold" ? "var(--accent)" : variant === "danger" ? "var(--hmg-down)" : "var(--border-strong)"),
    background: variant === "gold" ? "var(--accent)" : "transparent",
    color: variant === "gold" ? "var(--hmg-ink)" : variant === "danger" ? "var(--hmg-down)" : "var(--text-secondary)",
    fontSize: 12,
    cursor: "pointer",
    fontFamily: "var(--font-ui)",
  };
}

function arrowBtn(disabled: boolean): React.CSSProperties {
  return {
    background: "transparent",
    border: "1px solid var(--border-strong)",
    borderRadius: 3,
    cursor: disabled ? "default" : "pointer",
    color: disabled ? "var(--border-strong)" : "var(--text-secondary)",
    fontSize: 9,
    padding: "2px 5px",
    lineHeight: 1,
  };
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontFamily: "var(--font-ui)",
  fontSize: 11,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "var(--text-secondary)",
  marginBottom: 6,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  background: "var(--bg-page)",
  border: "1px solid var(--border-strong)",
  color: "var(--text-primary)",
  fontFamily: "var(--font-body)",
  fontSize: 14,
  outline: "none",
  borderRadius: "var(--radius-sm)",
};

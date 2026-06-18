"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export interface AuctionRow {
  id: string;
  title: string;
  house: string | null;
  url: string;
  description: string | null;
  imageUrl: string | null;
  startsAt: string;
  startsTime: string | null;
  location: string | null;
  active: boolean;
}

interface FormState {
  title: string;
  house: string;
  url: string;
  description: string;
  imageUrl: string;
  startsAt: string;
  startsTime: string;
  location: string;
  active: boolean;
}

const EMPTY_FORM: FormState = {
  title: "", house: "", url: "", description: "",
  imageUrl: "", startsAt: "", startsTime: "", location: "", active: true,
};

function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return new Intl.DateTimeFormat("pt-PT", { day: "numeric", month: "short", year: "numeric" }).format(
    new Date(Date.UTC(y, m - 1, d))
  );
}

export function LeiloesManager({ auctions }: { auctions: AuctionRow[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null); // null=closed, "new"=create
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  // Which entry the current `form` is a draft of ("new" or a row id). Lets a
  // click-outside keep the draft so re-opening the same entry restores the text.
  const [draftId, setDraftId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Lisbon", year: "numeric", month: "2-digit", day: "2-digit",
  }).format(new Date());

  function openNew() {
    setError(null);
    // Restore a kept draft instead of wiping it.
    if (draftId !== "new") {
      setForm(EMPTY_FORM);
      setDraftId("new");
    }
    setEditingId("new");
  }

  function openEdit(a: AuctionRow) {
    setError(null);
    if (draftId !== a.id) {
      setForm({
        title: a.title,
        house: a.house ?? "",
        url: a.url,
        description: a.description ?? "",
        imageUrl: a.imageUrl ?? "",
        startsAt: a.startsAt,
        startsTime: a.startsTime ?? "",
        location: a.location ?? "",
        active: a.active,
      });
      setDraftId(a.id);
    }
    setEditingId(a.id);
  }

  // Click outside: hide the modal but KEEP the draft (re-open restores it).
  function closeKeepingDraft() {
    if (!saving) setEditingId(null);
  }

  // X / Cancelar / after save: close AND discard the draft.
  function discardAndClose() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setDraftId(null);
    setError(null);
  }

  async function save() {
    setSaving(true);
    setError(null);
    const payload = {
      title: form.title,
      house: form.house || undefined,
      url: form.url,
      description: form.description || undefined,
      imageUrl: form.imageUrl || undefined,
      startsAt: form.startsAt,
      startsTime: form.startsTime || undefined,
      location: form.location || undefined,
      active: form.active,
    };
    try {
      const isNew = editingId === "new";
      const res = await fetch(isNew ? "/api/leiloes" : `/api/leiloes/${editingId}`, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.error ?? "Erro ao guardar.");
      } else {
        discardAndClose();
        router.refresh();
      }
    } catch {
      setError("Erro de rede.");
    } finally {
      setSaving(false);
    }
  }

  async function uploadImage(file: File) {
    setUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("watchId", "auctions"); // storage folder
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.success && data.data?.url) {
        setForm((f) => ({ ...f, imageUrl: data.data.url }));
      } else {
        setError(data.error ?? "Falha no upload da imagem.");
      }
    } catch {
      setError("Erro de rede no upload.");
    } finally {
      setUploading(false);
    }
  }

  async function toggleActive(a: AuctionRow) {
    setBusy(a.id);
    try {
      await fetch(`/api/leiloes/${a.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !a.active }),
      });
      router.refresh();
    } finally {
      setBusy(null);
    }
  }

  async function remove(a: AuctionRow) {
    if (!confirm(`Remover o leilão "${a.title}"?`)) return;
    setBusy(a.id);
    try {
      await fetch(`/api/leiloes/${a.id}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setBusy(null);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
        <p style={{ fontSize: 13, color: "var(--text-tertiary)", margin: 0, maxWidth: 480 }}>
          Os leilões agendados (data igual ou futura) aparecem em <code>/leiloes</code>.
          No dia do leilão, é também destacado na página inicial. Cada entrada liga a um site externo.
        </p>
        <button onClick={openNew} style={primaryBtn}>+ Adicionar leilão</button>
      </div>

      {error && !editingId && <p style={{ color: "var(--hmg-down)", fontSize: 14, margin: 0 }}>{error}</p>}

      {auctions.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 0", color: "var(--text-tertiary)", fontSize: 15 }}>
          Nenhum leilão configurado.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {auctions.map((a) => {
            const past = a.startsAt < today;
            return (
              <div
                key={a.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  padding: "16px 20px",
                  background: "var(--surface-card)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: 6,
                  opacity: a.active ? 1 : 0.5,
                  flexWrap: "wrap",
                }}
              >
                <div style={{ minWidth: 96 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: a.startsAt === today ? "var(--accent-press)" : "var(--text-primary)" }}>
                    {formatDate(a.startsAt)}
                  </div>
                  {past && <div style={{ fontSize: 11, color: "var(--text-tertiary)" }}>passado</div>}
                  {a.startsAt === today && <div style={{ fontSize: 11, color: "var(--accent-press)" }}>hoje</div>}
                </div>
                <div style={{ flex: 1, minWidth: 180 }}>
                  <div style={{ fontWeight: 500, fontSize: 15 }}>{a.title}</div>
                  {(a.house || a.location) && (
                    <div style={{ fontSize: 12, color: "var(--text-tertiary)", marginTop: 2 }}>
                      {[a.house, a.location].filter(Boolean).join(" · ")}
                    </div>
                  )}
                  <a href={a.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: "var(--accent-press)", wordBreak: "break-all" }}>
                    {a.url}
                  </a>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 100 }}>
                  <button onClick={() => toggleActive(a)} disabled={busy === a.id} style={miniBtn(a.active ? undefined : "gold")}>
                    {a.active ? "Desativar" : "Ativar"}
                  </button>
                  <button onClick={() => openEdit(a)} style={miniBtn()}>Editar</button>
                  <button onClick={() => remove(a)} disabled={busy === a.id} style={miniBtn("danger")}>Remover</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {editingId && (
        <div
          onClick={closeKeepingDraft}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "flex-start", justifyContent: "center", zIndex: 1000, padding: "60px 20px", overflowY: "auto" }}
        >
          <div onClick={(e) => e.stopPropagation()} style={{ background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: 8, padding: "28px 30px", width: "100%", maxWidth: 560, boxShadow: "var(--shadow-float)" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 20 }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, margin: 0 }}>
                {editingId === "new" ? "Novo leilão" : "Editar leilão"}
              </h2>
              <button
                type="button"
                onClick={discardAndClose}
                disabled={saving}
                aria-label="Fechar e limpar"
                title="Fechar e limpar"
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-tertiary)", padding: 2, lineHeight: 0, flexShrink: 0 }}
              >
                <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p style={{ fontSize: 12, color: "var(--text-tertiary)", margin: "0 0 18px" }}>
              Clicar fora fecha mas mantém o que escreveu. Use o × para descartar.
            </p>
            <div className="hmg-settings-fields">
              <Field label="Título *"><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} style={inputStyle} placeholder="Important Watches" /></Field>
              <Field label="Casa leiloeira"><input value={form.house} onChange={(e) => setForm({ ...form, house: e.target.value })} style={inputStyle} placeholder="Christie's" /></Field>
              <Field label="Data *"><input type="date" value={form.startsAt} onChange={(e) => setForm({ ...form, startsAt: e.target.value })} style={inputStyle} /></Field>
              <Field label="Hora"><input type="time" value={form.startsTime} onChange={(e) => setForm({ ...form, startsTime: e.target.value })} style={inputStyle} /></Field>
              <Field label="Local"><input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} style={inputStyle} placeholder="Genebra / Online" /></Field>
            </div>
            <div style={{ marginTop: 14 }}>
              <Field label="Ligação (URL) *"><input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} style={inputStyle} placeholder="https://www.christies.com/..." /></Field>
            </div>
            <div style={{ marginTop: 14 }}>
              <Field label="Imagem">
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start", flexWrap: "wrap" }}>
                  {form.imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={form.imageUrl}
                      alt="Pré-visualização"
                      style={{ width: 64, height: 64, objectFit: "cover", borderRadius: 6, border: "1px solid var(--border-subtle)", flexShrink: 0 }}
                    />
                  )}
                  <div style={{ flex: 1, minWidth: 180, display: "flex", flexDirection: "column", gap: 8 }}>
                    <input
                      value={form.imageUrl}
                      onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                      style={inputStyle}
                      placeholder="https://…  (ou carregar abaixo)"
                    />
                    <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                      <label style={uploadBtn}>
                        {uploading ? "A carregar…" : "Carregar imagem"}
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          disabled={uploading}
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) uploadImage(f);
                            e.target.value = "";
                          }}
                          style={{ display: "none" }}
                        />
                      </label>
                      {form.imageUrl && (
                        <button type="button" onClick={() => setForm({ ...form, imageUrl: "" })} style={miniBtn()}>
                          Remover imagem
                        </button>
                      )}
                    </div>
                    <span style={{ fontSize: 11, color: "var(--text-tertiary)" }}>JPEG, PNG ou WebP · máx. 5MB</span>
                  </div>
                </div>
              </Field>
            </div>
            <div style={{ marginTop: 14 }}>
              <Field label="Nota (opcional)"><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} style={{ ...inputStyle, height: 70, resize: "vertical" }} maxLength={600} /></Field>
            </div>
            <label style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 14, fontSize: 14, cursor: "pointer" }}>
              <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
              Ativo (visível no site)
            </label>

            {error && <p style={{ color: "var(--hmg-down)", fontSize: 13, marginTop: 14 }}>{error}</p>}

            <div style={{ display: "flex", gap: 10, marginTop: 24, justifyContent: "flex-end" }}>
              <button onClick={discardAndClose} disabled={saving} style={miniBtn()}>Cancelar</button>
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

const uploadBtn: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  padding: "8px 14px",
  borderRadius: 4,
  border: "1px solid var(--border-strong)",
  background: "transparent",
  color: "var(--text-secondary)",
  fontFamily: "var(--font-ui)",
  fontSize: 12,
  cursor: "pointer",
};

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

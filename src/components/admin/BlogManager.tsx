"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { BLOG_CATEGORY_LABELS } from "@/constants";

type Category = "novidades" | "curiosidades" | "guias" | "mercado";
type Status = "draft" | "pending_approval" | "published";

export interface BlogRow {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: Category;
  coverImage: string | null;
  status: Status;
  generatedByAi: boolean;
  createdAt: string | Date;
}

const CATEGORIES: Category[] = ["novidades", "curiosidades", "guias", "mercado"];

export function BlogManager({ posts }: { posts: BlogRow[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Generate modal
  const [genOpen, setGenOpen] = useState(false);
  const [genCategory, setGenCategory] = useState<Category>("novidades");
  const [genTopic, setGenTopic] = useState("");
  const [generating, setGenerating] = useState(false);

  // Edit modal
  const [editing, setEditing] = useState<BlogRow | null>(null);
  const [saving, setSaving] = useState(false);

  async function changeStatus(id: string, status: Status) {
    setBusy(id);
    setError(null);
    try {
      const res = await fetch(`/api/blog/${id}`, {
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

  async function remove(id: string) {
    if (!confirm("Eliminar este artigo? Esta ação é permanente.")) return;
    setBusy(id);
    setError(null);
    try {
      const res = await fetch(`/api/blog/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!data.success) setError(data.error ?? "Erro ao eliminar.");
      else router.refresh();
    } finally {
      setBusy(null);
    }
  }

  async function generate() {
    setGenerating(true);
    setError(null);
    try {
      const res = await fetch("/api/blog/gerar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category: genCategory, topic: genTopic || undefined }),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.error ?? "Erro ao gerar artigo.");
      } else {
        setGenOpen(false);
        setGenTopic("");
        router.refresh();
      }
    } catch {
      setError("Erro de rede ao gerar artigo.");
    } finally {
      setGenerating(false);
    }
  }

  async function saveEdit() {
    if (!editing) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/blog/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editing.title,
          excerpt: editing.excerpt,
          content: editing.content,
          category: editing.category,
          coverImage: editing.coverImage || undefined,
        }),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.error ?? "Erro ao guardar.");
      } else {
        setEditing(null);
        router.refresh();
      }
    } catch {
      setError("Erro de rede ao guardar.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button onClick={() => setGenOpen(true)} style={primaryBtn}>✨ Gerar Artigo com IA</button>
      </div>

      {error && <p style={{ color: "var(--hmg-down)", fontSize: 14, margin: 0 }}>{error}</p>}

      <div style={{ background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: 6, overflow: "hidden" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "3fr 1fr 1fr 60px 110px 220px",
            padding: "14px 22px",
            borderBottom: "1px solid var(--border-subtle)",
            background: "var(--bg-page-alt)",
            fontSize: 11,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--text-tertiary)",
          }}
        >
          <div>Título</div>
          <div>Categoria</div>
          <div>Estado</div>
          <div style={{ textAlign: "center" }}>IA</div>
          <div style={{ textAlign: "center" }}>Criado</div>
          <div style={{ textAlign: "right" }}>Ações</div>
        </div>

        {posts.length === 0 && (
          <div style={{ padding: "60px 24px", textAlign: "center", color: "var(--text-tertiary)", fontSize: 14 }}>
            Nenhum artigo ainda.
          </div>
        )}

        {posts.map((post) => (
          <div
            key={post.id}
            style={{
              display: "grid",
              gridTemplateColumns: "3fr 1fr 1fr 60px 110px 220px",
              padding: "16px 22px",
              borderBottom: "1px solid var(--border-subtle)",
              alignItems: "center",
              fontSize: 13,
              background: post.status === "pending_approval" ? "rgba(254,243,199,0.4)" : "transparent",
            }}
          >
            <div>
              <div style={{ fontWeight: 500 }}>{post.title}</div>
              <div style={{ fontSize: 11, color: "var(--text-tertiary)", marginTop: 2 }}>{post.excerpt?.slice(0, 80)}…</div>
            </div>
            <div style={{ fontSize: 12 }}>{BLOG_CATEGORY_LABELS[post.category]}</div>
            <div><Badge status={post.status} /></div>
            <div style={{ textAlign: "center", fontSize: 16 }}>{post.generatedByAi ? "🤖" : ""}</div>
            <div style={{ textAlign: "center", fontSize: 11, color: "var(--text-tertiary)" }}>
              {new Intl.DateTimeFormat("pt-PT", { day: "2-digit", month: "2-digit", year: "2-digit" }).format(new Date(post.createdAt))}
            </div>
            <div style={{ display: "flex", gap: 6, justifyContent: "flex-end", flexWrap: "wrap" }}>
              {post.status !== "published" ? (
                <button onClick={() => changeStatus(post.id, "published")} disabled={busy === post.id} style={miniBtn("gold")}>Publicar</button>
              ) : (
                <button onClick={() => changeStatus(post.id, "draft")} disabled={busy === post.id} style={miniBtn()}>Despublicar</button>
              )}
              <button onClick={() => setEditing(post)} style={miniBtn()}>Editar</button>
              <button onClick={() => remove(post.id)} disabled={busy === post.id} style={miniBtn("danger")}>Eliminar</button>
            </div>
          </div>
        ))}
      </div>

      {/* Generate modal */}
      {genOpen && (
        <Modal title="Gerar Artigo com IA" onClose={() => !generating && setGenOpen(false)}>
          <label style={labelStyle}>Categoria</label>
          <select value={genCategory} onChange={(e) => setGenCategory(e.target.value as Category)} style={inputStyle}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{BLOG_CATEGORY_LABELS[c]}</option>)}
          </select>
          <label style={{ ...labelStyle, marginTop: 16 }}>Tema (opcional)</label>
          <input value={genTopic} onChange={(e) => setGenTopic(e.target.value)} placeholder="ex: A história do Rolex Submariner" style={inputStyle} maxLength={300} />
          <div style={{ display: "flex", gap: 10, marginTop: 24, justifyContent: "flex-end" }}>
            <button onClick={() => setGenOpen(false)} disabled={generating} style={miniBtn()}>Cancelar</button>
            <button onClick={generate} disabled={generating} style={primaryBtn}>{generating ? "A gerar…" : "Gerar"}</button>
          </div>
        </Modal>
      )}

      {/* Edit modal */}
      {editing && (
        <Modal title="Editar Artigo" onClose={() => !saving && setEditing(null)} wide>
          <label style={labelStyle}>Título</label>
          <input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} style={inputStyle} maxLength={300} />
          <label style={{ ...labelStyle, marginTop: 16 }}>Categoria</label>
          <select value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value as Category })} style={inputStyle}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{BLOG_CATEGORY_LABELS[c]}</option>)}
          </select>
          <label style={{ ...labelStyle, marginTop: 16 }}>Imagem de capa (URL, opcional)</label>
          <input value={editing.coverImage ?? ""} onChange={(e) => setEditing({ ...editing, coverImage: e.target.value })} style={inputStyle} placeholder="https://…" />
          <label style={{ ...labelStyle, marginTop: 16 }}>Excerpt</label>
          <textarea value={editing.excerpt} onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })} style={{ ...inputStyle, height: 70, resize: "vertical" }} maxLength={500} />
          <label style={{ ...labelStyle, marginTop: 16 }}>Conteúdo (Markdown)</label>
          <textarea value={editing.content} onChange={(e) => setEditing({ ...editing, content: e.target.value })} style={{ ...inputStyle, height: 280, resize: "vertical", fontFamily: "var(--font-mono)", fontSize: 13 }} />
          <div style={{ display: "flex", gap: 10, marginTop: 24, justifyContent: "flex-end" }}>
            <button onClick={() => setEditing(null)} disabled={saving} style={miniBtn()}>Cancelar</button>
            <button onClick={saveEdit} disabled={saving} style={primaryBtn}>{saving ? "A guardar…" : "Guardar"}</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Modal({ title, children, onClose, wide }: { title: string; children: React.ReactNode; onClose: () => void; wide?: boolean }) {
  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "flex-start", justifyContent: "center", zIndex: 1000, padding: "60px 20px", overflowY: "auto" }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: 8, padding: "28px 30px", width: "100%", maxWidth: wide ? 720 : 460, boxShadow: "var(--shadow-float)" }}
      >
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, marginBottom: 20 }}>{title}</h2>
        {children}
      </div>
    </div>
  );
}

const primaryBtn: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  padding: "10px 20px",
  background: "var(--accent)",
  color: "var(--hmg-ink)",
  fontFamily: "var(--font-ui)",
  fontSize: 13,
  fontWeight: 600,
  letterSpacing: "0.06em",
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

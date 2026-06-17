"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import type { WatchInput } from "@/lib/validations/relogio";
import type { Watch } from "@/types";

const MOVEMENT_OPTIONS = [
  { value: "automatic", label: "Automático" },
  { value: "manual", label: "Manual" },
  { value: "quartz", label: "Quartzo" },
];
const CONDITION_OPTIONS = [
  { value: "excellent", label: "Excelente" },
  { value: "very_good", label: "Muito bom" },
  { value: "good", label: "Bom" },
];
const STATUS_OPTIONS = [
  { value: "available", label: "Disponível" },
  { value: "sold", label: "Vendido" },
  { value: "archived", label: "Arquivado" },
];

interface Props {
  params: Promise<{ id: string }>;
}

export default function EditarRelogioPage({ params }: Props) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<WatchInput>>({});
  const [status, setStatus] = useState<string>("available");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/relogios/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          const w = data.data as Watch;
          setForm({
            brand: w.brand,
            model: w.model,
            reference: w.reference ?? undefined,
            year: w.year ?? undefined,
            movementType: w.movementType,
            caseMaterial: w.caseMaterial ?? undefined,
            caseDiameterMm: w.caseDiameterMm ? Number(w.caseDiameterMm) : undefined,
            braceletMaterial: w.braceletMaterial ?? undefined,
            condition: w.condition,
            hasBox: w.hasBox,
            hasPapers: w.hasPapers,
            description: w.description ?? undefined,
            price: Number(w.price),
            externalLink: w.externalLink ?? undefined,
          });
          setStatus(w.status);
          setImages(w.images);
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  function set(key: keyof WatchInput, value: unknown) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      // Update fields
      const res = await fetch(`/api/relogios/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json() as { success: boolean; error?: string };
      if (!data.success) { setError(data.error ?? "Erro ao guardar."); return; }

      // Update status if changed
      const statusRes = await fetch(`/api/relogios/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const statusData = await statusRes.json() as { success: boolean; error?: string };
      if (!statusData.success) { setError(statusData.error ?? "Erro ao alterar estado."); return; }

      router.push("/admin/relogios");
    } catch {
      setError("Erro de rede.");
    } finally {
      setSaving(false);
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("watchId", id);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json() as { success: boolean; data?: { url: string }; error?: string };
      if (data.success && data.data) {
        const newImages = [...images, data.data.url];
        setImages(newImages);
        await fetch(`/api/relogios/${id}/imagens`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ images: newImages }),
        });
      } else {
        setError(data.error ?? "Erro no upload.");
      }
    } catch {
      setError("Erro de rede no upload.");
    } finally {
      setUploadingImage(false);
      e.target.value = "";
    }
  }

  async function handleDeleteImage(url: string) {
    const newImages = images.filter((img) => img !== url);
    setImages(newImages);
    await fetch(`/api/relogios/${id}/imagens`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
  }

  if (loading) {
    return (
      <AdminShell title="Editar Relógio">
        <div style={{ color: "var(--text-tertiary)", padding: 40 }}>A carregar…</div>
      </AdminShell>
    );
  }

  return (
    <AdminShell title="Editar Relógio">
      <form
        onSubmit={handleSubmit}
        style={{ maxWidth: 720, display: "flex", flexDirection: "column", gap: 32 }}
      >
        {/* Informações Básicas */}
        <Section title="Informações Básicas">
          <Grid2>
            <Field label="Marca *">
              <input style={inp} required value={form.brand ?? ""} onChange={(e) => set("brand", e.target.value)} maxLength={100} />
            </Field>
            <Field label="Modelo *">
              <input style={inp} required value={form.model ?? ""} onChange={(e) => set("model", e.target.value)} maxLength={200} />
            </Field>
            <Field label="Referência">
              <input style={inp} value={form.reference ?? ""} onChange={(e) => set("reference", e.target.value)} maxLength={100} />
            </Field>
            <Field label="Ano">
              <input style={inp} type="number" min={1900} max={new Date().getFullYear()} value={form.year ?? ""} onChange={(e) => set("year", Number(e.target.value) || undefined)} />
            </Field>
            <Field label="Preço (EUR) *">
              <input style={inp} type="number" required min={0} step={0.01} value={form.price ?? ""} onChange={(e) => set("price", Number(e.target.value))} />
            </Field>
            <Field label="Estado da listagem">
              <select style={inp} value={status} onChange={(e) => setStatus(e.target.value)}>
                {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </Field>
          </Grid2>
        </Section>

        {/* Especificações */}
        <Section title="Especificações Técnicas">
          <Grid2>
            <Field label="Movimento *">
              <select style={inp} value={form.movementType} onChange={(e) => set("movementType", e.target.value as WatchInput["movementType"])}>
                {MOVEMENT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </Field>
            <Field label="Material da caixa">
              <input style={inp} value={form.caseMaterial ?? ""} onChange={(e) => set("caseMaterial", e.target.value)} maxLength={200} />
            </Field>
            <Field label="Diâmetro (mm)">
              <input style={inp} type="number" step={0.1} value={form.caseDiameterMm ?? ""} onChange={(e) => set("caseDiameterMm", Number(e.target.value) || undefined)} />
            </Field>
            <Field label="Material da bracelete">
              <input style={inp} value={form.braceletMaterial ?? ""} onChange={(e) => set("braceletMaterial", e.target.value)} maxLength={200} />
            </Field>
          </Grid2>
        </Section>

        {/* Estado */}
        <Section title="Estado e Documentação">
          <Grid2>
            <Field label="Condição *">
              <select style={inp} value={form.condition} onChange={(e) => set("condition", e.target.value as WatchInput["condition"])}>
                {CONDITION_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </Field>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, justifyContent: "flex-end" }}>
              <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: 14 }}>
                <input type="checkbox" checked={form.hasBox ?? false} onChange={(e) => set("hasBox", e.target.checked)} />
                Inclui caixa original
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: 14 }}>
                <input type="checkbox" checked={form.hasPapers ?? false} onChange={(e) => set("hasPapers", e.target.checked)} />
                Inclui papéis / documentação
              </label>
            </div>
          </Grid2>
        </Section>

        {/* Descrição */}
        <Section title="Descrição">
          <textarea
            style={{ ...inp, height: 120, resize: "vertical" }}
            value={form.description ?? ""}
            onChange={(e) => set("description", e.target.value)}
            maxLength={5000}
            placeholder="Descrição livre do relógio..."
          />
        </Section>

        {/* Link Externo */}
        <Section title="Link Externo (opcional)">
          <input
            style={inp}
            type="url"
            value={form.externalLink ?? ""}
            onChange={(e) => set("externalLink", e.target.value)}
            placeholder="https://vinted.pt/items/..."
            maxLength={500}
          />
        </Section>

        {/* Imagens */}
        <Section title="Imagens">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
            {images.map((url) => (
              <div key={url} style={{ position: "relative", width: 100, height: 100 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", border: "1px solid var(--border-subtle)" }} />
                <button
                  type="button"
                  onClick={() => handleDeleteImage(url)}
                  style={{
                    position: "absolute",
                    top: 4,
                    right: 4,
                    background: "rgba(0,0,0,0.6)",
                    color: "#fff",
                    border: "none",
                    borderRadius: 3,
                    cursor: "pointer",
                    fontSize: 12,
                    padding: "2px 6px",
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <label
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 18px",
              border: "1px dashed var(--border-strong)",
              cursor: uploadingImage ? "default" : "pointer",
              fontSize: 13,
              color: "var(--text-secondary)",
              borderRadius: 4,
            }}
          >
            {uploadingImage ? "A carregar…" : "+ Adicionar imagem"}
            <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageUpload} style={{ display: "none" }} disabled={uploadingImage} />
          </label>
        </Section>

        {error && <p style={{ color: "var(--hmg-down)", fontSize: 14 }}>{error}</p>}

        <div style={{ display: "flex", gap: 12 }}>
          <button
            type="submit"
            disabled={saving}
            style={{
              padding: "11px 28px",
              background: "var(--accent)",
              color: "var(--hmg-ink)",
              border: "none",
              cursor: "pointer",
              fontFamily: "var(--font-ui)",
              fontSize: 13,
              fontWeight: 600,
              borderRadius: 4,
            }}
          >
            {saving ? "A guardar…" : "Guardar Alterações"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            style={{
              padding: "11px 28px",
              background: "transparent",
              border: "1px solid var(--border-strong)",
              cursor: "pointer",
              fontFamily: "var(--font-ui)",
              fontSize: 13,
              borderRadius: 4,
              color: "var(--text-secondary)",
            }}
          >
            Cancelar
          </button>
        </div>
      </form>
    </AdminShell>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        background: "var(--surface-card)",
        border: "1px solid var(--border-subtle)",
        borderRadius: 6,
        overflow: "hidden",
      }}
    >
      <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--border-subtle)", fontFamily: "var(--font-display)", fontSize: 18 }}>
        {title}
      </div>
      <div style={{ padding: "24px" }}>{children}</div>
    </div>
  );
}

function Grid2({ children }: { children: React.ReactNode }) {
  return <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>{children}</div>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: "block", fontFamily: "var(--font-ui)", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 6 }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const inp: React.CSSProperties = {
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

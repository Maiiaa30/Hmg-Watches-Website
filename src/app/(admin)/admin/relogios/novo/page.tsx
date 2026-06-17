"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import type { WatchInput } from "@/lib/validations/relogio";
import { MAX_IMAGES_PER_WATCH } from "@/constants";

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

export default function NovoRelogioPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [form, setForm] = useState<Partial<WatchInput>>({
    brand: "",
    model: "",
    reference: "",
    movementType: "automatic",
    condition: "excellent",
    hasBox: false,
    hasPapers: false,
  });

  // Generate/revoke local object URLs for staged image previews
  useEffect(() => {
    const urls = images.map((f) => URL.createObjectURL(f));
    setPreviews(urls);
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [images]);

  function set(key: keyof WatchInput, value: unknown) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function addImages(fileList: FileList | null) {
    if (!fileList) return;
    const incoming = Array.from(fileList);
    setImages((prev) => [...prev, ...incoming].slice(0, MAX_IMAGES_PER_WATCH));
  }

  function removeImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/relogios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json() as { success: boolean; error?: string; data?: { id: string } };
      if (!res.ok || !data.success || !data.data) {
        setError(data.error ?? "Erro ao guardar.");
        return;
      }

      const watchId = data.data.id;

      // Upload staged images under the new watch's ID, then save the array
      if (images.length > 0) {
        const uploadedUrls: string[] = [];
        for (const file of images) {
          const fd = new FormData();
          fd.append("file", file);
          fd.append("watchId", watchId);
          const upRes = await fetch("/api/upload", { method: "POST", body: fd });
          const upData = await upRes.json() as { success: boolean; data?: { url: string }; error?: string };
          if (upData.success && upData.data) {
            uploadedUrls.push(upData.data.url);
          } else {
            setError(upData.error ?? "Relógio criado, mas falhou o upload de uma imagem.");
          }
        }
        if (uploadedUrls.length > 0) {
          await fetch(`/api/relogios/${watchId}/imagens`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ images: uploadedUrls }),
          });
        }
      }

      router.push("/admin/relogios");
    } catch {
      setError("Erro de rede.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AdminShell title="Novo Relógio">
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
            <Field label="Estado *">
              <select style={inp} value={form.condition} onChange={(e) => set("condition", e.target.value as WatchInput["condition"])}>
                {CONDITION_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </Field>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, justifyContent: "flex-end" }}>
              <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: 14 }}>
                <input type="checkbox" checked={form.hasBox} onChange={(e) => set("hasBox", e.target.checked)} />
                Inclui caixa original
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: 14 }}>
                <input type="checkbox" checked={form.hasPapers} onChange={(e) => set("hasPapers", e.target.checked)} />
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
          <p style={{ marginTop: 6, fontSize: 11, color: "var(--text-tertiary)" }}>
            Apenas domínios permitidos: vinted.pt, chrono24.com, ebay.com e similares.
          </p>
        </Section>

        {/* Imagens */}
        <Section title="Imagens">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
            {previews.map((url, i) => (
              <div key={url} style={{ position: "relative", width: 100, height: 100 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", border: "1px solid var(--border-subtle)" }} />
                {i === 0 && (
                  <span style={{ position: "absolute", bottom: 4, left: 4, background: "var(--accent)", color: "var(--hmg-ink)", fontSize: 9, fontWeight: 600, padding: "1px 5px", borderRadius: 3 }}>
                    Principal
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(i)}
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
          {images.length < MAX_IMAGES_PER_WATCH && (
            <label
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 18px",
                border: "1px dashed var(--border-strong)",
                cursor: "pointer",
                fontSize: 13,
                color: "var(--text-secondary)",
                borderRadius: 4,
              }}
            >
              + Adicionar imagens
              <input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={(e) => { addImages(e.target.files); e.target.value = ""; }} style={{ display: "none" }} />
            </label>
          )}
          <p style={{ marginTop: 8, fontSize: 11, color: "var(--text-tertiary)" }}>
            A primeira imagem é a principal no catálogo. Máximo {MAX_IMAGES_PER_WATCH} imagens. As imagens são enviadas ao guardar o relógio.
          </p>
        </Section>

        {error && <p style={{ color: "var(--hmg-down)", fontSize: 14 }}>{error}</p>}

        <div style={{ display: "flex", gap: 12 }}>
          <button
            type="submit"
            disabled={loading}
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
            {loading ? "A guardar…" : "Guardar Relógio"}
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

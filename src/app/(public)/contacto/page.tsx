"use client";

import { useState } from "react";
import type { Metadata } from "next";

const SUBJECTS = [
  "Questão sobre um relógio",
  "Proposta de venda",
  "Informação geral",
  "Outro",
];

export default function ContactoPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: SUBJECTS[0] ?? "",
    message: "",
    website: "", // honeypot
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = (await res.json()) as { success: boolean; error?: string };
      if (!res.ok || !data.success) {
        setError(data.error ?? "Erro ao enviar mensagem.");
      } else {
        setSuccess(true);
      }
    } catch {
      setError("Erro de rede. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: "var(--section-y) 0" }}>
      <div
        className="hmg-container"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 90,
          alignItems: "start",
        }}
      >
        {/* Left */}
        <div>
          <span className="hmg-overline">Contacto</span>
          <h1
            style={{
              fontSize: "var(--fs-display-l)",
              lineHeight: "var(--lh-tight)",
              marginTop: 20,
              marginBottom: 24,
            }}
          >
            Fale connosco.
          </h1>
          <p
            style={{
              fontSize: "var(--fs-body-l)",
              lineHeight: "var(--lh-relaxed)",
              color: "var(--text-secondary)",
              maxWidth: 400,
            }}
          >
            Gostamos de conversar sobre relojoaria tanto quanto de vender
            relógios. Seja para comprar, vender ou simplesmente perguntar.
          </p>
        </div>

        {/* Form */}
        <div>
          {success ? (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "var(--fs-display-s)",
                  marginBottom: 16,
                }}
              >
                Mensagem recebida.
              </h2>
              <p style={{ color: "var(--text-secondary)", fontSize: 17 }}>
                Entraremos em contacto em breve.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              noValidate
              style={{ display: "flex", flexDirection: "column", gap: 20 }}
            >
              {/* Honeypot */}
              <input
                name="website"
                type="text"
                value={form.website}
                onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
                style={{ position: "absolute", left: -9999 }}
                tabIndex={-1}
                autoComplete="off"
              />

              <FormField label="Nome *">
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  style={inputStyle}
                  maxLength={200}
                />
              </FormField>

              <FormField label="Email *">
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  style={inputStyle}
                  maxLength={300}
                />
              </FormField>

              <FormField label="Assunto">
                <select
                  value={form.subject}
                  onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                  style={inputStyle}
                >
                  {SUBJECTS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField label="Mensagem *">
                <textarea
                  required
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  style={{ ...inputStyle, height: 140, resize: "vertical" }}
                  maxLength={5000}
                />
              </FormField>

              {error && (
                <p style={{ color: "var(--hmg-down)", fontSize: 14 }}>{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="hmg-ghost-btn hmg-ghost-btn--gold"
              >
                {loading ? "A enviar…" : "Enviar mensagem"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label
        style={{
          display: "block",
          fontFamily: "var(--font-ui)",
          fontSize: 11,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "var(--text-secondary)",
          marginBottom: 8,
        }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 16px",
  background: "var(--surface-card)",
  border: "1px solid var(--border-strong)",
  color: "var(--text-primary)",
  fontFamily: "var(--font-body)",
  fontSize: 15,
  outline: "none",
  borderRadius: "var(--radius-sm)",
};

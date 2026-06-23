"use client";

import { useId, useState } from "react";
import { getDict, type Locale } from "@/lib/i18n";

export function ContactForm({ locale = "en" }: { locale?: Locale }) {
  const t = getDict(locale);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    website: "", // honeypot
  });

  const nameId = useId();
  const emailId = useId();
  const subjectId = useId();
  const messageId = useId();

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
        setError(data.error ?? t.contactForm.errSend);
      } else {
        setSuccess(true);
      }
    } catch {
      setError(t.contactForm.errNetwork);
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div role="status" aria-live="polite" style={{ textAlign: "center", padding: "60px 0" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "var(--fs-display-s)", marginBottom: 16 }}>
          {t.contactForm.success}
        </h2>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: 20, textAlign: "left" }}>
      {/* Honeypot */}
      <input
        name="website"
        type="text"
        value={form.website}
        onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
        style={{ position: "absolute", left: -9999 }}
        tabIndex={-1}
        aria-hidden="true"
        autoComplete="off"
      />

      <FormField label={`${t.contactForm.name} *`} id={nameId}>
        <input id={nameId} type="text" required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} style={inputStyle} maxLength={200} />
      </FormField>

      <FormField label={`${t.contactForm.email} *`} id={emailId}>
        <input id={emailId} type="email" required value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} style={inputStyle} maxLength={300} />
      </FormField>

      <FormField label={t.contactForm.subject} id={subjectId}>
        <select id={subjectId} required value={form.subject} onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))} style={inputStyle}>
          <option value="" disabled>{t.contactForm.selectSubject}</option>
          {t.contactForm.subjects.map((s, idx) => (
            <option key={idx} value={s}>{s}</option>
          ))}
        </select>
      </FormField>

      <FormField label={`${t.contactForm.message} *`} id={messageId}>
        <textarea id={messageId} required value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} style={{ ...inputStyle, height: 140, resize: "vertical" }} maxLength={5000} />
      </FormField>

      {error && <p role="alert" style={{ color: "var(--hmg-down)", fontSize: 14 }}>{error}</p>}

      <button type="submit" disabled={loading} className="hmg-ghost-btn hmg-ghost-btn--gold">
        {loading ? t.contactForm.sending : t.contactForm.submit}
      </button>
    </form>
  );
}

function FormField({ label, id, children }: { label: string; id: string; children: React.ReactNode }) {
  return (
    <div>
      <label
        htmlFor={id}
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

"use client";

import { useEffect, useId, useState } from "react";
import type { WatchStatus } from "@/types";
import { getDict, type Locale } from "@/lib/i18n";

interface LeadFormProps {
  watchId: string;
  watchStatus: WatchStatus;
  watchName: string;
  locale?: Locale;
}

export function LeadForm({ watchId, watchStatus, watchName, locale = "en" }: LeadFormProps) {
  const t = getDict(locale);
  const defaultMessage =
    watchStatus === "available" ? t.lead.defaultAvailable : t.lead.defaultSold;

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: defaultMessage,
    website: "", // honeypot
  });

  const btnLabel =
    watchStatus === "available" ? t.lead.ctaAvailable : t.lead.ctaSold;
  const title =
    watchStatus === "available" ? t.lead.titleAvailable : t.lead.titleSold;

  const titleId = useId();
  const nameId = useId();
  const emailId = useId();
  const phoneId = useId();
  const messageId = useId();

  // Close the modal when Escape is pressed while it is open.
  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/relogios/${watchId}/contacto`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = (await res.json()) as { success: boolean; error?: string };
      if (!res.ok || !data.success) {
        setError(data.error ?? t.lead.errSend);
      } else {
        setSuccess(true);
      }
    } catch {
      setError(t.lead.errNetwork);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        onClick={() => setOpen(true)}
        className="hmg-ghost-btn hmg-ghost-btn--gold"
        style={{ width: "100%" }}
      >
        {btnLabel}
      </button>

      {open && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(26,24,20,0.6)",
            backdropFilter: "blur(6px)",
            zIndex: "var(--z-modal)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            style={{
              background: "var(--surface-card)",
              width: "100%",
              maxWidth: 480,
              padding: "44px 40px",
              boxShadow: "var(--shadow-float)",
              position: "relative",
            }}
          >
            <button
              onClick={() => setOpen(false)}
              aria-label={t.lead.close}
              style={{
                position: "absolute",
                top: 16,
                right: 16,
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--text-tertiary)",
                padding: 8,
              }}
            >
              <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>

            {success ? (
              <div role="status" aria-live="polite" style={{ textAlign: "center", padding: "20px 0" }}>
                <div
                  aria-hidden="true"
                  style={{
                    fontSize: 32,
                    marginBottom: 16,
                  }}
                >
                  ✓
                </div>
                <h3
                  id={titleId}
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 24,
                    marginBottom: 12,
                  }}
                >
                  {t.lead.success}
                </h3>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <h3
                  id={titleId}
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 24,
                    lineHeight: 1.2,
                    marginBottom: 8,
                  }}
                >
                  {title}
                </h3>
                <p
                  style={{
                    fontSize: 14,
                    color: "var(--text-secondary)",
                    marginBottom: 32,
                  }}
                >
                  {watchName}
                </p>

                {/* Honeypot — hidden from real users */}
                <input
                  name="website"
                  type="text"
                  value={form.website}
                  onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
                  style={{ position: "absolute", left: -9999, width: 1, height: 1 }}
                  tabIndex={-1}
                  aria-hidden="true"
                  autoComplete="off"
                />

                <Field label={t.lead.name} id={nameId}>
                  <input
                    id={nameId}
                    type="text"
                    placeholder={t.lead.namePlaceholder}
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    style={inputStyle}
                    maxLength={200}
                  />
                </Field>

                <Field label={t.lead.email} id={emailId}>
                  <input
                    id={emailId}
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    style={inputStyle}
                    maxLength={300}
                  />
                </Field>

                <Field label={t.lead.phone} id={phoneId}>
                  <input
                    id={phoneId}
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    style={inputStyle}
                    maxLength={30}
                  />
                </Field>

                <Field label={`${t.lead.message} *`} id={messageId}>
                  <textarea
                    id={messageId}
                    value={form.message}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    style={{ ...inputStyle, height: 100, resize: "vertical" }}
                    maxLength={2000}
                    required
                  />
                </Field>

                <p style={{ fontSize: 11, color: "var(--text-tertiary)", marginBottom: 24 }}>
                  * {t.lead.errContact}
                </p>

                {error && (
                  <p
                    role="alert"
                    style={{
                      color: "var(--hmg-down)",
                      fontSize: 14,
                      marginBottom: 16,
                    }}
                  >
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="hmg-ghost-btn hmg-ghost-btn--gold"
                  style={{ width: "100%" }}
                >
                  {loading ? t.lead.sending : t.lead.submit}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  id,
  children,
}: {
  label: string;
  id: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label
        htmlFor={id}
        style={{
          display: "block",
          fontFamily: "var(--font-ui)",
          fontSize: 11,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "var(--text-secondary)",
          marginBottom: 6,
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
  padding: "10px 14px",
  background: "var(--bg-page)",
  border: "1px solid var(--border-strong)",
  color: "var(--text-primary)",
  fontFamily: "var(--font-body)",
  fontSize: 15,
  outline: "none",
  borderRadius: "var(--radius-sm)",
  transition: "border-color var(--dur-base) var(--ease-out)",
};

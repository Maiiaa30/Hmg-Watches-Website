"use client";

import { useState } from "react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Server-side login: rate-limited by IP + audit-logged.
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!data.success) {
        setError(
          res.status === 429
            ? "Demasiadas tentativas. Tente novamente dentro de alguns minutos."
            : "Credenciais inválidas."
        );
        setLoading(false);
        return;
      }

      // Full navigation so middleware + layout pick up the new session cookie
      const redirectTo =
        new URLSearchParams(window.location.search).get("redirect") ?? "/admin";
      window.location.href = redirectTo;
    } catch {
      setError("Erro de rede. Tente novamente.");
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg-page)",
        padding: "24px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 380,
          background: "var(--surface-card)",
          border: "1px solid var(--border-subtle)",
          borderRadius: 8,
          padding: "40px 36px",
          boxShadow: "var(--shadow-card)",
        }}
      >
        {/* Wordmark */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 9,
            justifyContent: "center",
            marginBottom: 8,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 28,
              fontWeight: 600,
              letterSpacing: "0.01em",
              color: "var(--text-primary)",
            }}
          >
            HMG
          </span>
          <span
            style={{
              fontFamily: "var(--font-ui)",
              fontSize: 9,
              letterSpacing: "0.36em",
              textTransform: "uppercase",
              color: "var(--accent-press)",
            }}
          >
            Watches
          </span>
        </div>
        <p
          style={{
            textAlign: "center",
            fontFamily: "var(--font-ui)",
            fontSize: 11,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "var(--text-secondary)",
            marginBottom: 32,
          }}
        >
          Painel de Administração
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Password</label>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
            />
          </div>

          {error && (
            <p style={{ color: "var(--hmg-down)", fontSize: 13, margin: 0 }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: 8,
              padding: "12px 20px",
              background: "var(--accent)",
              color: "var(--hmg-ink)",
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              fontFamily: "var(--font-ui)",
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: "0.04em",
              borderRadius: 4,
            }}
          >
            {loading ? "A entrar…" : "Entrar"}
          </button>
        </form>
      </div>
    </main>
  );
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

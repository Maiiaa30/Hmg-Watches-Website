"use client";

import { useState, useEffect } from "react";
import { AdminShell } from "@/components/admin/AdminShell";

interface SettingsState {
  weekly_report_enabled: string;
  weekly_report_day: string;
  weekly_report_hour_utc: string;
  site_name: string;
  site_contact_email: string;
  instagram_url: string;
}

const DEFAULT_SETTINGS: SettingsState = {
  weekly_report_enabled: "false",
  weekly_report_day: "saturday",
  weekly_report_hour_utc: "20",
  site_name: "HMG Watches",
  site_contact_email: "",
  instagram_url: "",
};

export default function AdminDefinicoesPage() {
  const [pwForm, setPwForm] = useState({ current: "", new: "", confirm: "" });
  const [pwStatus, setPwStatus] = useState<"idle" | "success" | "error">("idle");

  const [settings, setSettings] = useState<SettingsState>(DEFAULT_SETTINGS);
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsMsg, setSettingsMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [testStatus, setTestStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [testing, setTesting] = useState(false);
  const [reportStatus, setReportStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [sendingReport, setSendingReport] = useState(false);

  // Load current settings
  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.data) {
          setSettings((s) => ({ ...s, ...data.data }));
        }
      })
      .catch(() => {});
  }, []);

  async function saveSettings() {
    setSavingSettings(true);
    setSettingsMsg(null);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      setSettingsMsg(data.success
        ? { type: "success", text: "Definições guardadas." }
        : { type: "error", text: data.error ?? "Erro ao guardar." });
    } catch {
      setSettingsMsg({ type: "error", text: "Erro de rede." });
    } finally {
      setSavingSettings(false);
    }
  }

  async function testTelegram() {
    setTesting(true);
    setTestStatus(null);
    try {
      const res = await fetch("/api/telegram/test", { method: "POST" });
      const data = await res.json();
      setTestStatus(data.success
        ? { type: "success", text: "Mensagem de teste enviada! Verifique o Telegram." }
        : { type: "error", text: data.error ?? "Falha ao enviar." });
    } catch {
      setTestStatus({ type: "error", text: "Erro de rede." });
    } finally {
      setTesting(false);
    }
  }

  async function sendReportNow() {
    setSendingReport(true);
    setReportStatus(null);
    try {
      const res = await fetch("/api/cron/weekly-report", { method: "POST" });
      const data = await res.json();
      setReportStatus(data.success
        ? { type: "success", text: "Relatório enviado para o Telegram." }
        : { type: "error", text: data.error ?? "Falha ao enviar relatório." });
    } catch {
      setReportStatus({ type: "error", text: "Erro de rede." });
    } finally {
      setSendingReport(false);
    }
  }

  return (
    <AdminShell title="Definições">
      <div style={{ maxWidth: 620, display: "flex", flexDirection: "column", gap: 32 }}>
        {/* Change password */}
        <Card title="Alterar password">
          <form
            style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 16 }}
            onSubmit={async (e) => {
              e.preventDefault();
              if (pwForm.new !== pwForm.confirm) {
                setPwStatus("error");
                return;
              }
              const { createBrowserClient } = await import("@supabase/ssr");
              const supabase = createBrowserClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
              );
              const { error } = await supabase.auth.updateUser({ password: pwForm.new });
              setPwStatus(error ? "error" : "success");
              if (!error) setPwForm({ current: "", new: "", confirm: "" });
            }}
          >
            {(["current", "new", "confirm"] as const).map((field) => (
              <div key={field}>
                <label style={labelStyle}>
                  {field === "current" ? "Password atual" : field === "new" ? "Nova password" : "Confirmar nova password"}
                </label>
                <input
                  type="password"
                  required
                  value={pwForm[field]}
                  onChange={(e) => setPwForm((f) => ({ ...f, [field]: e.target.value }))}
                  style={inputStyle}
                />
              </div>
            ))}
            {pwStatus === "success" && <p style={{ color: "var(--trend-up)", fontSize: 13 }}>Password alterada com sucesso.</p>}
            {pwStatus === "error" && <p style={{ color: "var(--hmg-down)", fontSize: 13 }}>As passwords não coincidem ou ocorreu um erro.</p>}
            <button type="submit" style={primaryBtn}>Guardar password</button>
          </form>
        </Card>

        {/* Site info + weekly report */}
        <Card title="Informações do site & Relatório Semanal">
          <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 18 }}>
            <div>
              <label style={labelStyle}>Nome do site</label>
              <input style={inputStyle} value={settings.site_name} onChange={(e) => setSettings({ ...settings, site_name: e.target.value })} />
            </div>
            <div>
              <label style={labelStyle}>Email de contacto</label>
              <input style={inputStyle} type="email" value={settings.site_contact_email} onChange={(e) => setSettings({ ...settings, site_contact_email: e.target.value })} placeholder="geral@hmgwatches.com" />
            </div>
            <div>
              <label style={labelStyle}>Instagram (URL)</label>
              <input style={inputStyle} value={settings.instagram_url} onChange={(e) => setSettings({ ...settings, instagram_url: e.target.value })} placeholder="https://instagram.com/…" />
            </div>

            <hr style={{ border: "none", borderTop: "1px solid var(--border-subtle)", margin: "4px 0" }} />

            <label style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={settings.weekly_report_enabled === "true"}
                onChange={(e) => setSettings({ ...settings, weekly_report_enabled: e.target.checked ? "true" : "false" })}
              />
              Ativar relatório semanal via Telegram
            </label>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label style={labelStyle}>Dia de envio</label>
                <select style={inputStyle} value={settings.weekly_report_day} onChange={(e) => setSettings({ ...settings, weekly_report_day: e.target.value })}>
                  <option value="friday">Sexta-feira</option>
                  <option value="saturday">Sábado</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Hora de envio (UTC)</label>
                <select style={inputStyle} value={settings.weekly_report_hour_utc} onChange={(e) => setSettings({ ...settings, weekly_report_hour_utc: e.target.value })}>
                  {["19", "20", "21", "22", "23"].map((h) => (
                    <option key={h} value={h}>{h}:00 UTC</option>
                  ))}
                </select>
              </div>
            </div>

            {settingsMsg && (
              <p style={{ color: settingsMsg.type === "success" ? "var(--trend-up)" : "var(--hmg-down)", fontSize: 13, margin: 0 }}>
                {settingsMsg.text}
              </p>
            )}

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
              <button onClick={saveSettings} disabled={savingSettings} style={primaryBtn}>
                {savingSettings ? "A guardar…" : "Guardar definições"}
              </button>
              <button onClick={sendReportNow} disabled={sendingReport} style={ghostBtn}>
                {sendingReport ? "A enviar…" : "Enviar relatório agora"}
              </button>
            </div>
            {reportStatus && (
              <p style={{ color: reportStatus.type === "success" ? "var(--trend-up)" : "var(--hmg-down)", fontSize: 13, margin: 0 }}>
                {reportStatus.text}
              </p>
            )}
          </div>
        </Card>

        {/* Telegram bot test */}
        <Card title="Bot do Telegram">
          <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 14 }}>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7, margin: 0 }}>
              Envie uma mensagem de teste para confirmar que o bot está configurado corretamente
              (usa <code style={codeStyle}>TELEGRAM_BOT_TOKEN</code> e <code style={codeStyle}>TELEGRAM_CHAT_ID</code>).
            </p>
            <div>
              <button onClick={testTelegram} disabled={testing} style={primaryBtn}>
                {testing ? "A enviar…" : "Testar bot Telegram"}
              </button>
            </div>
            {testStatus && (
              <p style={{ color: testStatus.type === "success" ? "var(--trend-up)" : "var(--hmg-down)", fontSize: 13, margin: 0 }}>
                {testStatus.text}
              </p>
            )}
          </div>
        </Card>
      </div>
    </AdminShell>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: 6, overflow: "hidden" }}>
      <div style={{ padding: "18px 24px", borderBottom: "1px solid var(--border-subtle)", fontFamily: "var(--font-display)", fontSize: 18 }}>
        {title}
      </div>
      {children}
    </section>
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

const primaryBtn: React.CSSProperties = {
  padding: "10px 20px",
  background: "var(--accent)",
  color: "var(--hmg-ink)",
  border: "none",
  cursor: "pointer",
  fontFamily: "var(--font-ui)",
  fontSize: 13,
  fontWeight: 600,
  borderRadius: 4,
  alignSelf: "flex-start",
};

const ghostBtn: React.CSSProperties = {
  padding: "10px 20px",
  background: "transparent",
  color: "var(--text-secondary)",
  border: "1px solid var(--border-strong)",
  cursor: "pointer",
  fontFamily: "var(--font-ui)",
  fontSize: 13,
  borderRadius: 4,
};

const codeStyle: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 12,
  background: "var(--bg-page-alt)",
  padding: "1px 5px",
  borderRadius: 3,
};

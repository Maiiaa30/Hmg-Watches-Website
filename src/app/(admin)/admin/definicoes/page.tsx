"use client";

import { useState, useEffect } from "react";
import { AdminShell } from "@/components/admin/AdminShell";

interface SettingsState {
  weekly_report_enabled: string;
  weekly_report_day: string;
  weekly_report_hour_utc: string;
  blog_auto_enabled: string;
  blog_auto_day: string;
  blog_auto_category: string;
  movers_auto_enabled: string;
  maintenance_mode: string;
  site_name: string;
  site_contact_email: string;
  instagram_url: string;
  whatsapp_number: string;
}

const DEFAULT_SETTINGS: SettingsState = {
  weekly_report_enabled: "false",
  weekly_report_day: "saturday",
  weekly_report_hour_utc: "20",
  blog_auto_enabled: "false",
  blog_auto_day: "random",
  blog_auto_category: "random",
  movers_auto_enabled: "false",
  maintenance_mode: "false",
  site_name: "HMG Watches",
  site_contact_email: "",
  instagram_url: "",
  whatsapp_number: "",
};

const WEEKDAYS = [
  { value: "random", label: "Aleatório (dia diferente cada semana)" },
  { value: "monday", label: "Segunda-feira" },
  { value: "tuesday", label: "Terça-feira" },
  { value: "wednesday", label: "Quarta-feira" },
  { value: "thursday", label: "Quinta-feira" },
  { value: "friday", label: "Sexta-feira" },
  { value: "saturday", label: "Sábado" },
  { value: "sunday", label: "Domingo" },
];

const BLOG_CATS = [
  { value: "random", label: "Aleatória" },
  { value: "novidades", label: "Novidades" },
  { value: "curiosidades", label: "Curiosidades" },
  { value: "guias", label: "Guias" },
  { value: "mercado", label: "Mercado" },
];

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
  const [blogStatus, setBlogStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [generatingBlog, setGeneratingBlog] = useState(false);
  const [moversStatus, setMoversStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [generatingMovers, setGeneratingMovers] = useState(false);
  const [maintMsg, setMaintMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [previewCode, setPreviewCode] = useState("");
  const [copied, setCopied] = useState(false);

  // Load current settings
  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.data) {
          setSettings((s) => ({ ...s, ...data.data }));
          if (data.data.maintenance_preview_code) setPreviewCode(data.data.maintenance_preview_code);
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

  async function generateBlogNow() {
    setGeneratingBlog(true);
    setBlogStatus(null);
    try {
      const res = await fetch("/api/cron/weekly-blog", { method: "POST" });
      const data = await res.json();
      setBlogStatus(data.success
        ? { type: "success", text: "Artigo gerado e enviado para aprovação no Telegram." }
        : { type: "error", text: data.error ?? "Falha ao gerar o artigo." });
    } catch {
      setBlogStatus({ type: "error", text: "Erro de rede." });
    } finally {
      setGeneratingBlog(false);
    }
  }

  async function generateMoversNow() {
    setGeneratingMovers(true);
    setMoversStatus(null);
    try {
      const res = await fetch("/api/cron/weekly-movers", { method: "POST" });
      const data = await res.json();
      setMoversStatus(data.success
        ? { type: "success", text: `Top 10 atualizado pela IA (${data.data?.generated ?? 0} relógios). Já está visível em /mercado.` }
        : { type: "error", text: data.error ?? "Falha ao gerar o Top 10." });
    } catch {
      setMoversStatus({ type: "error", text: "Erro de rede." });
    } finally {
      setGeneratingMovers(false);
    }
  }

  async function toggleMaintenance(on: boolean) {
    // Apply immediately (this is a critical switch), optimistic state first.
    setSettings((s) => ({ ...s, maintenance_mode: on ? "true" : "false" }));
    setMaintMsg(null);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ maintenance_mode: on ? "true" : "false" }),
      });
      const data = await res.json();
      if (!data.success) {
        setMaintMsg({ type: "error", text: data.error ?? "Falha ao guardar." });
        setSettings((s) => ({ ...s, maintenance_mode: on ? "false" : "true" })); // revert
      } else {
        setMaintMsg({
          type: "success",
          text: on ? "Site em manutenção — visível apenas para si." : "Site novamente público.",
        });
      }
    } catch {
      setMaintMsg({ type: "error", text: "Erro de rede." });
      setSettings((s) => ({ ...s, maintenance_mode: on ? "false" : "true" }));
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
      <div className="hmg-settings-grid">
        {/* Maintenance mode */}
        <Card title="Modo de manutenção" wide>
          <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 16 }}>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7, margin: 0 }}>
              Quando ativo, o site público mostra uma página <em>“Em manutenção”</em> a todos os
              visitantes. O painel de administração continua acessível. Para pré-visualizar o
              site durante a manutenção, abra-o com <code style={codeStyle}>?preview=SEGREDO</code>{" "}
              (o valor de <code style={codeStyle}>MAINTENANCE_SECRET</code>).
            </p>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                fontSize: 15,
                fontWeight: 500,
                cursor: "pointer",
                color: settings.maintenance_mode === "true" ? "var(--hmg-down)" : "var(--text-primary)",
              }}
            >
              <input
                type="checkbox"
                checked={settings.maintenance_mode === "true"}
                onChange={(e) => toggleMaintenance(e.target.checked)}
              />
              {settings.maintenance_mode === "true"
                ? "Site em manutenção (oculto ao público)"
                : "Colocar o site em manutenção"}
            </label>
            {maintMsg && (
              <p style={{ color: maintMsg.type === "success" ? "var(--trend-up)" : "var(--hmg-down)", fontSize: 13, margin: 0 }}>
                {maintMsg.text}
              </p>
            )}

            {/* Preview link — so the owner never has to remember the code */}
            {previewCode ? (
              (() => {
                const base = (process.env.NEXT_PUBLIC_APP_URL ?? "").replace(/\/+$/, "");
                const link = `${base || ""}/?preview=${previewCode}`;
                return (
                  <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
                    <label style={labelStyle}>Link de pré-visualização (guarde este link)</label>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <input readOnly value={link} onFocus={(e) => e.currentTarget.select()} style={{ ...inputStyle, flex: 1, minWidth: 220, fontFamily: "var(--font-mono)", fontSize: 12 }} />
                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            await navigator.clipboard.writeText(link);
                            setCopied(true);
                            setTimeout(() => setCopied(false), 1800);
                          } catch {}
                        }}
                        style={ghostBtn}
                      >
                        {copied ? "Copiado ✓" : "Copiar"}
                      </button>
                    </div>
                    <p style={{ fontSize: 12, color: "var(--text-tertiary)", margin: 0 }}>
                      Abra este link no navegador para ver o site enquanto está em manutenção. O código é o
                      seu <code style={codeStyle}>MAINTENANCE_SECRET</code>.
                    </p>
                  </div>
                );
              })()
            ) : (
              <p style={{ fontSize: 12, color: "var(--text-tertiary)", margin: 0 }}>
                Defina <code style={codeStyle}>MAINTENANCE_SECRET</code> nas variáveis de ambiente para poder
                pré-visualizar o site durante a manutenção.
              </p>
            )}
          </div>
        </Card>

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
        <Card title="Informações do site & Relatório Semanal" wide>
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
            <div>
              <label style={labelStyle}>WhatsApp (número internacional, só dígitos)</label>
              <input style={inputStyle} value={settings.whatsapp_number} onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })} placeholder="351912345678" />
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

            <div className="hmg-settings-fields">
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

        {/* Auto blog generation */}
        <Card title="Geração Automática de Artigos">
          <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 18 }}>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7, margin: 0 }}>
              Uma vez por semana, a IA gera automaticamente um artigo sobre um tema à escolha
              e envia-o para aprovação no Telegram (fica como <em>pendente</em> até aprovares).
            </p>

            <label style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={settings.blog_auto_enabled === "true"}
                onChange={(e) => setSettings({ ...settings, blog_auto_enabled: e.target.checked ? "true" : "false" })}
              />
              Ativar geração automática semanal
            </label>

            <div className="hmg-settings-fields">
              <div>
                <label style={labelStyle}>Dia da semana</label>
                <select style={inputStyle} value={settings.blog_auto_day} onChange={(e) => setSettings({ ...settings, blog_auto_day: e.target.value })}>
                  {WEEKDAYS.map((d) => (
                    <option key={d.value} value={d.value}>{d.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Categoria</label>
                <select style={inputStyle} value={settings.blog_auto_category} onChange={(e) => setSettings({ ...settings, blog_auto_category: e.target.value })}>
                  {BLOG_CATS.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <p style={{ fontSize: 12, color: "var(--text-tertiary)", margin: 0 }}>
              A verificação corre diariamente (~10:00 UTC) e só gera no dia escolhido, uma vez por semana.
            </p>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
              <button onClick={saveSettings} disabled={savingSettings} style={primaryBtn}>
                {savingSettings ? "A guardar…" : "Guardar definições"}
              </button>
              <button onClick={generateBlogNow} disabled={generatingBlog} style={ghostBtn}>
                {generatingBlog ? "A gerar…" : "Gerar artigo agora"}
              </button>
            </div>
            {blogStatus && (
              <p style={{ color: blogStatus.type === "success" ? "var(--trend-up)" : "var(--hmg-down)", fontSize: 13, margin: 0 }}>
                {blogStatus.text}
              </p>
            )}
          </div>
        </Card>

        {/* Auto Top 10 movers generation */}
        <Card title="Top 10 Mercado — Geração Automática">
          <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 18 }}>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7, margin: 0 }}>
              Uma vez por semana, a IA gera automaticamente o ranking de relógios que
              mais valorizaram (a secção <em>Maiores valorizações</em> em <code style={codeStyle}>/mercado</code>).
              Não precisas de criar nada à mão — os valores são <strong>estimativas indicativas</strong> geradas por IA.
            </p>

            <label style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={settings.movers_auto_enabled === "true"}
                onChange={(e) => setSettings({ ...settings, movers_auto_enabled: e.target.checked ? "true" : "false" })}
              />
              Ativar atualização automática semanal do Top 10
            </label>

            <p style={{ fontSize: 12, color: "var(--text-tertiary)", margin: 0 }}>
              A verificação corre diariamente (~10:00 UTC) e só atualiza uma vez por semana.
              Carrega em “Gerar agora” para preencher já o Top 10.
            </p>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
              <button onClick={saveSettings} disabled={savingSettings} style={primaryBtn}>
                {savingSettings ? "A guardar…" : "Guardar definições"}
              </button>
              <button onClick={generateMoversNow} disabled={generatingMovers} style={ghostBtn}>
                {generatingMovers ? "A gerar…" : "Gerar Top 10 agora"}
              </button>
            </div>
            {moversStatus && (
              <p style={{ color: moversStatus.type === "success" ? "var(--trend-up)" : "var(--hmg-down)", fontSize: 13, margin: 0 }}>
                {moversStatus.text}
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

function Card({ title, children, wide }: { title: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <section className={wide ? "hmg-settings-wide" : undefined} style={{ background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: 6, overflow: "hidden" }}>
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

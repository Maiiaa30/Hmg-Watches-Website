// Shared notification helpers: branded transactional emails (Resend) + Telegram.

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Low-level Resend send. Returns true on success. */
export async function sendEmail(opts: {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!key || !from) return false;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: `HMG Watches <${from}>`,
        to: opts.to,
        subject: opts.subject,
        html: opts.html,
        ...(opts.replyTo ? { reply_to: opts.replyTo } : {}),
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/** Low-level Telegram send (Markdown). Returns true on success. */
export async function sendTelegram(text: string): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return false;
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: "Markdown" }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

interface EmailBlock {
  heading: string;
  paragraphs: string[];
  details?: { label: string; value: string }[];
  quote?: string;
  cta?: { url: string; label: string };
  footerNote?: string;
}

/** Render a branded, email-client-safe HTML document (cream/gold theme). */
export function renderEmail(b: EmailBlock): string {
  const paras = b.paragraphs
    .map(
      (p) =>
        `<p style="margin:0 0 14px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.7;color:#6f6757;">${p}</p>`
    )
    .join("");

  const details = b.details?.length
    ? `<table cellpadding="0" cellspacing="0" style="width:100%;margin:6px 0 18px;border-collapse:collapse;">${b.details
        .map(
          (d) =>
            `<tr><td style="padding:7px 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;letter-spacing:0.04em;text-transform:uppercase;color:#9a9486;width:38%;border-bottom:1px solid #efe9da;">${escapeHtml(
              d.label
            )}</td><td style="padding:7px 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#2a2418;border-bottom:1px solid #efe9da;">${escapeHtml(
              d.value
            )}</td></tr>`
        )
        .join("")}</table>`
    : "";

  const quote = b.quote
    ? `<div style="border-left:3px solid #b68a2e;background:#f3eede;padding:14px 18px;margin:18px 0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#4a4435;font-style:italic;white-space:pre-wrap;">${escapeHtml(
        b.quote
      )}</div>`
    : "";

  const cta = b.cta
    ? `<div style="margin:24px 0 4px;"><a href="${b.cta.url}" style="display:inline-block;padding:12px 26px;border:1px solid #b68a2e;color:#8a6a1f;text-decoration:none;font-family:Arial,Helvetica,sans-serif;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;border-radius:4px;">${escapeHtml(
        b.cta.label
      )}</a></div>`
    : "";

  const footer = b.footerNote
    ? `${escapeHtml(b.footerNote)}<br/>`
    : "";

  return `<!doctype html>
<html lang="pt"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;background:#ece6d8;padding:32px 12px;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation"><tr><td align="center">
    <table width="540" cellpadding="0" cellspacing="0" role="presentation" style="max-width:540px;width:100%;background:#fbf8f1;border:1px solid #e4dccb;border-radius:10px;overflow:hidden;">
      <tr><td style="padding:34px 40px 0;text-align:center;">
        <div style="font-family:Georgia,'Times New Roman',serif;font-size:26px;font-weight:bold;color:#2a2418;">HMG <span style="font-size:11px;letter-spacing:0.34em;color:#8a6a1f;font-family:Arial,Helvetica,sans-serif;">WATCHES</span></div>
        <div style="height:1px;background:#e4dccb;margin:24px 0 0;"></div>
      </td></tr>
      <tr><td style="padding:30px 40px 34px;">
        <h1 style="margin:0 0 16px;font-family:Georgia,'Times New Roman',serif;font-size:24px;font-weight:normal;color:#2a2418;">${escapeHtml(
          b.heading
        )}</h1>
        ${paras}
        ${details}
        ${quote}
        ${cta}
      </td></tr>
      <tr><td style="padding:22px 40px 32px;border-top:1px solid #e4dccb;text-align:center;">
        <div style="font-size:12px;color:#9a9486;font-family:Arial,Helvetica,sans-serif;line-height:1.7;">
          ${footer}HMG Watches · Lisboa · Portugal
        </div>
      </td></tr>
    </table>
  </td></tr></table>
</body></html>`;
}

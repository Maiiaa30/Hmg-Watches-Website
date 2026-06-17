import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { watches, watchLeads, auditLogs } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { watchLeadSchema } from "@/lib/validations/contacto";
import { sanitizeText } from "@/lib/security/sanitize";
import { contactRatelimit, getClientIp } from "@/lib/security/rate-limit";
import type { ApiResponse } from "@/types";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const ip = getClientIp(request);

  // Rate limit: 3 per 10 min per IP
  if (contactRatelimit) {
    const { success } = await contactRatelimit.limit(ip);
    if (!success) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Demasiados pedidos. Tente novamente em breve." },
        { status: 429 }
      );
    }
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Pedido inválido." },
      { status: 400 }
    );
  }

  const parsed = watchLeadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: parsed.error.errors[0]?.message ?? "Dados inválidos." },
      { status: 400 }
    );
  }

  const { name, email, phone, message, website } = parsed.data;

  if (website && website.length > 0) {
    return NextResponse.json<ApiResponse>({ success: true });
  }

  const [watch] = await db
    .select()
    .from(watches)
    .where(eq(watches.id, id))
    .limit(1);

  if (!watch || watch.status === "archived") {
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Relógio não encontrado." },
      { status: 404 }
    );
  }

  const cleanName = name ? sanitizeText(name) : null;
  const cleanMessage = sanitizeText(message);

  // Save lead
  const [lead] = await db
    .insert(watchLeads)
    .values({
      watchId: watch.id,
      watchStatusAtTime: watch.status === "sold" ? "sold" : "available",
      name: cleanName || null,
      email: email || null,
      phone: phone || null,
      message: cleanMessage,
    })
    .returning({ id: watchLeads.id });

  // Audit log
  await db.insert(auditLogs).values({
    action: "watch_lead.created",
    entity: "watch_leads",
    entityId: lead?.id ?? null,
    adminEmail: "public",
    ipAddress: ip,
    userAgent: request.headers.get("user-agent") ?? "unknown",
  });

  // Telegram + Email notifications (async, non-blocking)
  void notifyAdmin(watch, { name: cleanName, email, phone, message: cleanMessage }, lead?.id ?? "");

  return NextResponse.json<ApiResponse>({ success: true });
}

async function notifyAdmin(
  watch: { id: string; brand: string; model: string; reference: string | null; price: string; status: string; slug: string },
  lead: { name: string | null; email?: string | null; phone?: string | null; message: string },
  leadId: string
) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://hmgwatches.pt";
  const watchUrl = `${appUrl}/catalogo/${watch.slug}`;
  const dateStr = new Intl.DateTimeFormat("pt-PT", {
    timeZone: "Europe/Lisbon",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());

  const isSold = watch.status === "sold";
  const emoji = isSold ? "👀" : "🔔";
  const titleLine = isSold
    ? `${emoji} *Interesse em relógio similar — ${watch.brand} ${watch.model}*\n_Este relógio já foi vendido — o contacto quer algo parecido_`
    : `${emoji} *Novo contacto — ${watch.brand} ${watch.model}*\n_${watch.reference ? `${watch.reference} · ` : ""}€${watch.price}_ ✅ Disponível`;

  const tgMessage = `${titleLine}

👤 *Quem contactou:*
Nome: ${lead.name ?? "Não indicado"}
Email: ${lead.email || "—"}
Telemóvel: ${lead.phone || "—"}

💬 *Mensagem:*
"${lead.message}"

🔗 Ver anúncio: ${watchUrl}
⏰ ${dateStr}`;

  let notifiedTelegram = false;
  let notifiedEmail = false;

  // Telegram
  if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
    try {
      const res = await fetch(
        `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: process.env.TELEGRAM_CHAT_ID,
            text: tgMessage,
            parse_mode: "Markdown",
          }),
        }
      );
      notifiedTelegram = res.ok;
    } catch {}
  }

  // Email via Resend
  if (process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL) {
    try {
      const subject = isSold
        ? `[Relógio Vendido] Interesse em algo similar — ${watch.brand} ${watch.model}`
        : `[Relógio Disponível] Novo contacto — ${watch.brand} ${watch.model}`;

      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM_EMAIL,
          to: process.env.RESEND_FROM_EMAIL,
          subject,
          html: `<pre style="font-family:sans-serif;white-space:pre-wrap">${tgMessage.replace(/\*/g, "").replace(/_/g, "")}</pre>`,
        }),
      });
      notifiedEmail = res.ok;
    } catch {}
  }

  // Update notification flags
  if (notifiedTelegram || notifiedEmail) {
    await db
      .update(watchLeads)
      .set({ notifiedTelegram, notifiedEmail })
      .where(eq(watchLeads.id, leadId));
  }
}

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { watches, watchLeads, auditLogs } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { watchLeadSchema } from "@/lib/validations/contacto";
import { sanitizeText } from "@/lib/security/sanitize";
import { contactRatelimit, getClientIp } from "@/lib/security/rate-limit";
import { sendEmail, sendTelegram, renderEmail } from "@/lib/notify";
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

  // Telegram + email to admin, and confirmation to the sender.
  // Awaited so it completes before the serverless function returns.
  await notifyAdmin(watch, { name: cleanName, email: email ?? null, phone: phone ?? null, message: cleanMessage }, lead?.id ?? "");

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

  // 1. Telegram to admin
  const notifiedTelegram = await sendTelegram(tgMessage);

  // 2. Branded email to admin (reply goes to the sender if they left an email)
  const adminFrom = process.env.RESEND_FROM_EMAIL;
  let notifiedEmail = false;
  if (adminFrom) {
    notifiedEmail = await sendEmail({
      to: adminFrom,
      replyTo: lead.email ?? undefined,
      subject: isSold
        ? `[Relógio Vendido] Interesse em algo similar — ${watch.brand} ${watch.model}`
        : `[Relógio Disponível] Novo contacto — ${watch.brand} ${watch.model}`,
      html: renderEmail({
        heading: isSold ? "Interesse em relógio similar" : "Novo contacto sobre um relógio",
        paragraphs: [
          isSold
            ? "Este relógio já foi vendido — o contacto procura algo parecido."
            : "Recebeste um novo contacto sobre um relógio disponível.",
        ],
        details: [
          { label: "Relógio", value: `${watch.brand} ${watch.model}` },
          ...(watch.reference ? [{ label: "Referência", value: watch.reference }] : []),
          { label: "Nome", value: lead.name ?? "Não indicado" },
          { label: "Email", value: lead.email || "—" },
          { label: "Telemóvel", value: lead.phone || "—" },
          { label: "Data", value: dateStr },
        ],
        quote: lead.message,
        cta: { url: watchUrl, label: "Ver anúncio" },
        footerNote: "Responde diretamente a este email para contactar a pessoa.",
      }),
    });
  }

  // 3. Confirmation email to the sender (only if they left an email)
  if (lead.email) {
    await sendEmail({
      to: lead.email,
      replyTo: adminFrom,
      subject: "Recebemos o seu contacto — HMG Watches",
      html: renderEmail({
        heading: "Pedido recebido",
        paragraphs: [
          `Olá ${lead.name ?? ""},`.trim(),
          isSold
            ? `Obrigado pelo seu interesse. Embora o ${watch.brand} ${watch.model} já tenha sido vendido, vamos avisá-lo assim que tivermos algo semelhante.`
            : `Obrigado pelo seu interesse no ${watch.brand} ${watch.model}. A nossa equipa entrará em contacto consigo o mais brevemente possível.`,
          "Para sua referência, deixamos abaixo uma cópia da sua mensagem:",
        ],
        quote: lead.message,
        cta: { url: watchUrl, label: "Ver o relógio" },
        footerNote: "Esta é uma confirmação automática — não precisa de responder.",
      }),
    });
  }

  // Update notification flags
  if (notifiedTelegram || notifiedEmail) {
    await db
      .update(watchLeads)
      .set({ notifiedTelegram, notifiedEmail })
      .where(eq(watchLeads.id, leadId));
  }
}

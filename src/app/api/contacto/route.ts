import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { contactMessages } from "@/lib/db/schema";
import { contactSchema } from "@/lib/validations/contacto";
import { sanitizeText } from "@/lib/security/sanitize";
import { contactRatelimit, getClientIp } from "@/lib/security/rate-limit";
import { sendEmail, sendTelegram, renderEmail } from "@/lib/notify";
import type { ApiResponse } from "@/types";

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);

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

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: parsed.error.errors[0]?.message ?? "Dados inválidos." },
      { status: 400 }
    );
  }

  const { name, email, subject, message, website } = parsed.data;

  // Honeypot
  if (website && website.length > 0) {
    return NextResponse.json<ApiResponse>({ success: true });
  }

  if (!name || !email) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Nome e email são obrigatórios." },
      { status: 400 }
    );
  }

  const cleanName = sanitizeText(name);
  const cleanEmail = email.toLowerCase().trim();
  const cleanSubject = sanitizeText(subject);
  const cleanMessage = sanitizeText(message);

  await db.insert(contactMessages).values({
    name: cleanName,
    email: cleanEmail,
    subject: cleanSubject,
    message: cleanMessage,
  });

  // Notify admin (Telegram + email) and confirm to the sender — awaited so it
  // completes before the serverless function returns.
  await notify({ name: cleanName, email: cleanEmail, subject: cleanSubject, message: cleanMessage });

  return NextResponse.json<ApiResponse>({ success: true });
}

async function notify(c: { name: string; email: string; subject: string; message: string }) {
  const adminFrom = process.env.RESEND_FROM_EMAIL;
  const when = new Intl.DateTimeFormat("pt-PT", {
    timeZone: "Europe/Lisbon",
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date());

  // 1. Telegram to admin
  await sendTelegram(
    `✉️ *Nova mensagem de contacto*\n_${c.subject}_\n\n👤 *De:* ${c.name}\n📧 ${c.email}\n\n💬 *Mensagem:*\n"${c.message}"\n\n⏰ ${when}`
  );

  // 2. Branded email to admin (reply goes straight to the sender)
  if (adminFrom) {
    await sendEmail({
      to: adminFrom,
      replyTo: c.email,
      subject: `[Contacto] ${c.subject}`,
      html: renderEmail({
        heading: "Nova mensagem de contacto",
        paragraphs: ["Recebeste uma nova mensagem através do formulário de contacto."],
        details: [
          { label: "Nome", value: c.name },
          { label: "Email", value: c.email },
          { label: "Assunto", value: c.subject },
          { label: "Data", value: when },
        ],
        quote: c.message,
        footerNote: "Responde diretamente a este email para contactar a pessoa.",
      }),
    });
  }

  // 3. Confirmation email to the sender
  await sendEmail({
    to: c.email,
    replyTo: adminFrom,
    subject: "Recebemos a sua mensagem — HMG Watches",
    html: renderEmail({
      heading: "Mensagem recebida",
      paragraphs: [
        `Olá ${c.name},`,
        "Obrigado pelo seu contacto. Recebemos a sua mensagem e a nossa equipa entrará em contacto consigo o mais brevemente possível.",
        "Para sua referência, deixamos abaixo uma cópia do que nos enviou:",
      ],
      quote: c.message,
      footerNote: "Esta é uma confirmação automática — não precisa de responder.",
    }),
  });
}

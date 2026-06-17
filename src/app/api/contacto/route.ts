import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { contactMessages } from "@/lib/db/schema";
import { contactSchema } from "@/lib/validations/contacto";
import { sanitizeText } from "@/lib/security/sanitize";
import { contactRatelimit, getClientIp } from "@/lib/security/rate-limit";
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

  await db.insert(contactMessages).values({
    name: sanitizeText(name),
    email: email.toLowerCase().trim(),
    subject: sanitizeText(subject),
    message: sanitizeText(message),
  });

  // Email to admin
  if (process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL) {
    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM_EMAIL,
          to: process.env.RESEND_FROM_EMAIL,
          subject: `[Contacto] ${subject}`,
          html: `<p><strong>De:</strong> ${name} &lt;${email}&gt;</p><p><strong>Mensagem:</strong></p><p>${message.replace(/\n/g, "<br>")}</p>`,
        }),
      });
    } catch {}
  }

  return NextResponse.json<ApiResponse>({ success: true });
}

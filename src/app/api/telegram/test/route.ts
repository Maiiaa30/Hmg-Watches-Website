import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, logAudit } from "@/lib/auth/utils";
import type { ApiResponse } from "@/types";

// POST — send a test message to the configured Telegram chat (admin only)
export async function POST(request: NextRequest) {
  let session;
  try {
    session = await requireAdmin();
  } catch {
    return NextResponse.json<ApiResponse>({ success: false, error: "Não autorizado." }, { status: 401 });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: "TELEGRAM_BOT_TOKEN ou TELEGRAM_CHAT_ID não configurados no .env.local." },
      { status: 400 }
    );
  }

  const when = new Intl.DateTimeFormat("pt-PT", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "Europe/Lisbon",
  }).format(new Date());

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: `✅ *Mensagem de teste — HMG Watches*\n\nO bot do Telegram está a funcionar corretamente.\n⏰ ${when}`,
        parse_mode: "Markdown",
      }),
    });

    const data = (await res.json()) as { ok: boolean; description?: string };

    if (!data.ok) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: `Telegram recusou: ${data.description ?? "erro desconhecido"}` },
        { status: 502 }
      );
    }

    await logAudit({
      action: "telegram.test_sent",
      entity: "admin",
      adminEmail: session.user.email ?? "admin",
      request,
    });

    return NextResponse.json<ApiResponse>({ success: true });
  } catch {
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Falha de rede ao contactar o Telegram." },
      { status: 502 }
    );
  }
}

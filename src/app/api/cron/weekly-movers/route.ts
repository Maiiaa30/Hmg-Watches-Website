import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, logAudit } from "@/lib/auth/utils";
import {
  maybeRefreshWeeklyMovers,
  refreshAndSaveMovers,
  isoWeekKey,
} from "@/lib/ai/movers";
import type { ApiResponse } from "@/types";

function friendlyError(err: unknown): string {
  const message = err instanceof Error ? err.message : "Erro desconhecido.";
  return /quota|rate limit|resource.*exhausted|429/i.test(message)
    ? "Limite gratuito do Gemini atingido. Tente novamente mais tarde."
    : `Falha ao gerar o Top 10: ${message}`;
}

// GET — invoked by the Vercel cron (it runs daily via the shared weekly-blog
// schedule, which also calls maybeRefreshWeeklyMovers). Exposed standalone too
// so the job can be triggered/monitored directly. Respects enabled + once/week.
export async function GET(request: NextRequest) {
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json<ApiResponse>({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await maybeRefreshWeeklyMovers(isoWeekKey(new Date()));
    if (result.status === "skipped") {
      return NextResponse.json<ApiResponse>({ success: true, data: { skipped: result.reason } });
    }
    await logAudit({
      action: "market_highlight.ai_refreshed",
      entity: "watch_market_highlights",
      adminEmail: "cron",
      request,
    });
    return NextResponse.json<ApiResponse>({ success: true, data: { generated: result.count } });
  } catch (err) {
    return NextResponse.json<ApiResponse>({ success: false, error: friendlyError(err) }, { status: 502 });
  }
}

// POST — admin "Gerar Top 10 agora" button (forces an immediate refresh).
export async function POST(request: NextRequest) {
  let session;
  try {
    session = await requireAdmin();
  } catch {
    return NextResponse.json<ApiResponse>({ success: false, error: "Não autorizado." }, { status: 401 });
  }

  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: "GEMINI_API_KEY não configurado." },
      { status: 400 }
    );
  }

  try {
    const count = await refreshAndSaveMovers(10);
    await logAudit({
      action: "market_highlight.ai_refreshed",
      entity: "watch_market_highlights",
      adminEmail: session.user.email ?? "admin",
      request,
    });
    return NextResponse.json<ApiResponse>({ success: true, data: { generated: count } });
  } catch (err) {
    return NextResponse.json<ApiResponse>({ success: false, error: friendlyError(err) }, { status: 502 });
  }
}

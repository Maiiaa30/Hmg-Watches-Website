import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { pageViews, siteSettings } from "@/lib/db/schema";
import { eq, gte, lt, sql, and, desc } from "drizzle-orm";
import { startOfWeek, endOfWeek, subWeeks, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { requireAdmin, logAudit } from "@/lib/auth/utils";
import type { ApiResponse } from "@/types";

// GET — invoked by Vercel Cron with the CRON_SECRET. Respects enabled/day config.
export async function GET(request: NextRequest) {
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json<ApiResponse>({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  // Check if enabled
  const [enabledSetting] = await db
    .select()
    .from(siteSettings)
    .where(eq(siteSettings.key, "weekly_report_enabled"))
    .limit(1);

  if (enabledSetting?.value !== "true") {
    return NextResponse.json<ApiResponse>({ success: true, data: { skipped: true } });
  }

  // Check day
  const [daySetting] = await db
    .select()
    .from(siteSettings)
    .where(eq(siteSettings.key, "weekly_report_day"))
    .limit(1);

  const dayOfWeek = new Date().getDay(); // 0=Sun, 5=Fri, 6=Sat
  const configuredDay = daySetting?.value === "friday" ? 5 : 6;
  if (dayOfWeek !== configuredDay) {
    return NextResponse.json<ApiResponse>({ success: true, data: { skipped: true, reason: "wrong day" } });
  }

  const result = await buildAndSendReport();
  return NextResponse.json<ApiResponse>({ success: true, data: result });
}

// POST — manual "send now" from the admin settings page (admin authed, ignores day).
export async function POST(request: NextRequest) {
  let session;
  try {
    session = await requireAdmin();
  } catch {
    return NextResponse.json<ApiResponse>({ success: false, error: "Não autorizado." }, { status: 401 });
  }

  if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.TELEGRAM_CHAT_ID) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: "TELEGRAM_BOT_TOKEN ou TELEGRAM_CHAT_ID não configurados." },
      { status: 400 }
    );
  }

  const result = await buildAndSendReport();

  await logAudit({
    action: "cron.weekly_report_sent",
    entity: "admin",
    adminEmail: session.user.email ?? "admin",
    request,
  });

  return NextResponse.json<ApiResponse>({ success: true, data: result });
}

// Shared: aggregate the week's analytics and push the formatted message to Telegram.
async function buildAndSendReport() {
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(today, { weekStartsOn: 1 });
  const prevWeekStart = startOfWeek(subWeeks(today, 1), { weekStartsOn: 1 });
  const prevWeekEnd = endOfWeek(subWeeks(today, 1), { weekStartsOn: 1 });

  const [totalRows, prevTotalRows, topPagesRows, deviceRows] = await Promise.all([
    db.select({ count: sql<number>`count(*)::int` }).from(pageViews)
      .where(and(gte(pageViews.createdAt, weekStart), lt(pageViews.createdAt, weekEnd))),
    db.select({ count: sql<number>`count(*)::int` }).from(pageViews)
      .where(and(gte(pageViews.createdAt, prevWeekStart), lt(pageViews.createdAt, prevWeekEnd))),
    db.select({ page: pageViews.page, count: sql<number>`count(*)::int` }).from(pageViews)
      .where(and(gte(pageViews.createdAt, weekStart), lt(pageViews.createdAt, weekEnd)))
      .groupBy(pageViews.page).orderBy(desc(sql`count(*)`)).limit(5),
    db.select({ deviceType: pageViews.deviceType, count: sql<number>`count(*)::int` }).from(pageViews)
      .where(and(gte(pageViews.createdAt, weekStart), lt(pageViews.createdAt, weekEnd)))
      .groupBy(pageViews.deviceType),
  ]);

  const total = totalRows[0]?.count ?? 0;
  const prevTotal = prevTotalRows[0]?.count ?? 0;
  const changePercent = prevTotal > 0 ? Math.round(((total - prevTotal) / prevTotal) * 100) : null;

  const [siteName] = await db.select().from(siteSettings).where(eq(siteSettings.key, "site_name")).limit(1);

  if (total === 0) {
    await sendTelegram(`📊 *Relatório Semanal*\nSem visitas registadas esta semana. 🔇`);
    return { sent: true, total: 0 };
  }

  const weekLabel = `${format(weekStart, "EEEE, dd/MM", { locale: ptBR })} — ${format(weekEnd, "EEEE, dd/MM", { locale: ptBR })}`;
  const changeStr = changePercent !== null
    ? ` _(${changePercent > 0 ? "+" : ""}${changePercent}% vs semana anterior)_`
    : "";

  const pagesStr = topPagesRows
    .map((r, i) => `${i + 1}. ${r.page} — ${r.count} visitas`)
    .join("\n");

  const deviceMap: Record<string, number> = {};
  for (const d of deviceRows) {
    if (d.deviceType) deviceMap[d.deviceType] = d.count;
  }
  const deviceStr = [
    deviceMap["desktop"] ? `Desktop: ${Math.round((deviceMap["desktop"] / total) * 100)}%` : null,
    deviceMap["mobile"] ? `Mobile: ${Math.round((deviceMap["mobile"] / total) * 100)}%` : null,
    deviceMap["tablet"] ? `Tablet: ${Math.round((deviceMap["tablet"] / total) * 100)}%` : null,
  ].filter(Boolean).join(" · ");

  const message = `📊 *Relatório Semanal*
_${weekLabel}_

👁️ *Visitas totais:* ${total}${changeStr}

📄 *Páginas mais visitadas:*
${pagesStr}

📱 *Dispositivos:*
${deviceStr}

_Relatório gerado automaticamente · ${siteName?.value ?? "HMG Watches"}_`;

  await sendTelegram(message);
  return { sent: true, total };
}

async function sendTelegram(text: string) {
  if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.TELEGRAM_CHAT_ID) return;
  await fetch(
    `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text,
        parse_mode: "Markdown",
      }),
    }
  );
}

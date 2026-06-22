import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, logAudit } from "@/lib/auth/utils";
import { generateAndSaveBlogPost, friendlyGenError, BLOG_CATEGORIES } from "@/lib/ai/create-post";
import { maybeRefreshWeeklyMovers, isoWeekKey, isoWeekNumber } from "@/lib/ai/movers";
import { getSetting, setSetting } from "@/lib/db/settings";
import type { ApiResponse, BlogCategory } from "@/types";

const DAY_INDEX: Record<string, number> = {
  sunday: 0, monday: 1, tuesday: 2, wednesday: 3, thursday: 4, friday: 5, saturday: 6,
};

function pickCategory(pref: string | null, week: number): BlogCategory {
  if (pref && BLOG_CATEGORIES.includes(pref as BlogCategory)) return pref as BlogCategory;
  return BLOG_CATEGORIES[week % BLOG_CATEGORIES.length]!; // "random" → deterministic per week
}

// GET — invoked by Vercel Cron (daily). Respects enabled/day/once-per-week.
export async function GET(request: NextRequest) {
  // CRON_SECRET bearer (if set) OR Vercel's cron header — so the job still runs
  // when CRON_SECRET isn't configured. Generation self-throttles to once/week.
  const secret = process.env.CRON_SECRET;
  const authed = secret && request.headers.get("authorization") === `Bearer ${secret}`;
  const isVercelCron = request.headers.get("x-vercel-cron") === "1";
  if (!authed && !isVercelCron) {
    return NextResponse.json<ApiResponse>({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  // Piggyback the weekly AI "Top 10 movers" refresh on this daily cron so we stay
  // within the Vercel Hobby 2-cron limit. It self-throttles to once per ISO week
  // and is independent of the blog settings below. Best-effort: never let a
  // movers failure abort the blog job.
  try {
    const moversResult = await maybeRefreshWeeklyMovers(isoWeekKey(new Date()));
    if (moversResult.status === "generated") {
      await logAudit({
        action: "market_highlight.ai_refreshed",
        entity: "watch_market_highlights",
        adminEmail: "cron",
        request,
      });
    }
  } catch (err) {
    console.error("[weekly-movers] refresh failed:", err);
  }

  if ((await getSetting("blog_auto_enabled")) !== "true") {
    return NextResponse.json<ApiResponse>({ success: true, data: { skipped: "disabled" } });
  }

  const now = new Date();
  const week = isoWeekNumber(now);
  const weekKey = isoWeekKey(now);

  // Which day should it run?
  const dayPref = (await getSetting("blog_auto_day")) ?? "random";
  const targetDay = dayPref === "random" ? week % 7 : DAY_INDEX[dayPref] ?? 1;
  if (now.getUTCDay() !== targetDay) {
    return NextResponse.json<ApiResponse>({ success: true, data: { skipped: "wrong-day" } });
  }

  // Only once per ISO week
  if ((await getSetting("blog_auto_last_week")) === weekKey) {
    return NextResponse.json<ApiResponse>({ success: true, data: { skipped: "already-done" } });
  }

  const category = pickCategory(await getSetting("blog_auto_category"), week);

  try {
    const created = await generateAndSaveBlogPost(category);
    await setSetting("blog_auto_last_week", weekKey);
    await logAudit({
      action: "blog.created",
      entity: "blog_posts",
      entityId: created?.id,
      adminEmail: "cron",
      request,
    });
    return NextResponse.json<ApiResponse>({ success: true, data: { generated: created?.id, category } });
  } catch (err) {
    return NextResponse.json<ApiResponse>({ success: false, error: friendlyGenError(err) }, { status: 502 });
  }
}

// POST — admin "Gerar agora" test from the settings page (forces generation).
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

  const week = isoWeekNumber(new Date());
  const category = pickCategory(await getSetting("blog_auto_category"), week);

  try {
    const created = await generateAndSaveBlogPost(category);
    await logAudit({
      action: "blog.created",
      entity: "blog_posts",
      entityId: created?.id,
      adminEmail: session.user.email ?? "admin",
      request,
    });
    return NextResponse.json<ApiResponse>({ success: true, data: { generated: created?.id, category } });
  } catch (err) {
    return NextResponse.json<ApiResponse>({ success: false, error: friendlyGenError(err) }, { status: 502 });
  }
}

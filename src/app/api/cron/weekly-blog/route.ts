import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { siteSettings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { requireAdmin, logAudit } from "@/lib/auth/utils";
import { generateAndSaveBlogPost, friendlyGenError, BLOG_CATEGORIES } from "@/lib/ai/create-post";
import type { ApiResponse, BlogCategory } from "@/types";

const DAY_INDEX: Record<string, number> = {
  sunday: 0, monday: 1, tuesday: 2, wednesday: 3, thursday: 4, friday: 5, saturday: 6,
};

async function getSetting(key: string): Promise<string | null> {
  const [row] = await db.select().from(siteSettings).where(eq(siteSettings.key, key)).limit(1);
  return row?.value ?? null;
}

async function setSetting(key: string, value: string) {
  await db
    .insert(siteSettings)
    .values({ key, value, updatedAt: new Date() })
    .onConflictDoUpdate({ target: siteSettings.key, set: { value, updatedAt: new Date() } });
}

// ISO week number — used to pick a deterministic "random" day/category per week
function isoWeek(d: Date): number {
  const date = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const dayNum = (date.getUTCDay() + 6) % 7;
  date.setUTCDate(date.getUTCDate() - dayNum + 3);
  const firstThursday = date.getTime();
  date.setUTCMonth(0, 1);
  if (date.getUTCDay() !== 4) {
    date.setUTCMonth(0, 1 + ((4 - date.getUTCDay()) + 7) % 7);
  }
  return 1 + Math.ceil((firstThursday - date.getTime()) / 604800000);
}

function pickCategory(pref: string | null, week: number): BlogCategory {
  if (pref && BLOG_CATEGORIES.includes(pref as BlogCategory)) return pref as BlogCategory;
  return BLOG_CATEGORIES[week % BLOG_CATEGORIES.length]!; // "random" → deterministic per week
}

// GET — invoked by Vercel Cron (daily). Respects enabled/day/once-per-week.
export async function GET(request: NextRequest) {
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json<ApiResponse>({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  if ((await getSetting("blog_auto_enabled")) !== "true") {
    return NextResponse.json<ApiResponse>({ success: true, data: { skipped: "disabled" } });
  }

  const now = new Date();
  const week = isoWeek(now);
  const weekKey = `${now.getUTCFullYear()}-W${week}`;

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

  const week = isoWeek(new Date());
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

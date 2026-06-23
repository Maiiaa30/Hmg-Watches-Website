import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { pageViews } from "@/lib/db/schema";
import { z } from "zod";
import { analyticsRatelimit, getClientIp } from "@/lib/security/rate-limit";
import type { ApiResponse } from "@/types";

const trackSchema = z.object({
  page: z.string().max(500),
  watchId: z.string().uuid().optional(),
  blogPostId: z.string().uuid().optional(),
  sessionId: z.string().max(64),
  deviceType: z.enum(["desktop", "mobile", "tablet"]).default("desktop"),
});

export async function POST(request: NextRequest) {
  // Throttle the public beacon so it can't be used to flood page_views.
  if (analyticsRatelimit) {
    const { success } = await analyticsRatelimit.limit(getClientIp(request));
    if (!success) {
      return NextResponse.json<ApiResponse>({ success: true, data: { throttled: true } });
    }
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json<ApiResponse>({ success: false, error: "Invalid." }, { status: 400 });
  }

  const parsed = trackSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json<ApiResponse>({ success: false, error: "Invalid data." }, { status: 400 });
  }

  const { page, watchId, blogPostId, sessionId, deviceType } = parsed.data;

  // Country via Vercel edge header (GDPR-safe — not storing IP)
  const country = request.headers.get("x-vercel-ip-country") ?? null;

  await db.insert(pageViews).values({
    page,
    watchId: watchId ?? null,
    blogPostId: blogPostId ?? null,
    country,
    deviceType,
    sessionId,
  });

  return NextResponse.json<ApiResponse>({ success: true });
}

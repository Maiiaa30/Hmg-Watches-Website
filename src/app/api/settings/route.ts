import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { siteSettings } from "@/lib/db/schema";
import { requireAdmin, logAudit } from "@/lib/auth/utils";
import { sanitizeText } from "@/lib/security/sanitize";
import type { ApiResponse } from "@/types";

// Keys the admin is allowed to read/write through this endpoint
const ALLOWED_KEYS = [
  "weekly_report_enabled",
  "weekly_report_day",
  "weekly_report_hour_utc",
  "site_name",
  "site_contact_email",
  "instagram_url",
] as const;

type SettingKey = (typeof ALLOWED_KEYS)[number];

function isAllowedKey(key: string): key is SettingKey {
  return (ALLOWED_KEYS as readonly string[]).includes(key);
}

// GET — return all known settings as a key/value map
export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json<ApiResponse>({ success: false, error: "Não autorizado." }, { status: 401 });
  }

  const rows = await db.select().from(siteSettings);
  const map: Record<string, string> = {};
  for (const row of rows) {
    if (isAllowedKey(row.key)) map[row.key] = row.value;
  }

  return NextResponse.json<ApiResponse>({ success: true, data: map });
}

// PUT — upsert one or more settings
export async function PUT(request: NextRequest) {
  let session;
  try {
    session = await requireAdmin();
  } catch {
    return NextResponse.json<ApiResponse>({ success: false, error: "Não autorizado." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json<ApiResponse>({ success: false, error: "Pedido inválido." }, { status: 400 });
  }

  if (typeof body !== "object" || body === null) {
    return NextResponse.json<ApiResponse>({ success: false, error: "Dados inválidos." }, { status: 400 });
  }

  const entries = Object.entries(body as Record<string, unknown>).filter(([key]) => isAllowedKey(key));
  if (entries.length === 0) {
    return NextResponse.json<ApiResponse>({ success: false, error: "Nenhuma definição válida." }, { status: 400 });
  }

  for (const [key, rawValue] of entries) {
    const value = sanitizeText(String(rawValue));
    await db
      .insert(siteSettings)
      .values({ key, value, updatedAt: new Date() })
      .onConflictDoUpdate({ target: siteSettings.key, set: { value, updatedAt: new Date() } });
  }

  await logAudit({
    action: "settings.updated",
    entity: "site_settings",
    entityId: entries.map(([k]) => k).join(","),
    adminEmail: session.user.email ?? "admin",
    request,
  });

  return NextResponse.json<ApiResponse>({ success: true });
}

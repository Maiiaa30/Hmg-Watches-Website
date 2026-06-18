import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { watchMarketHighlights } from "@/lib/db/schema";
import { eq, asc, sql } from "drizzle-orm";
import { requireAdmin, logAudit } from "@/lib/auth/utils";
import { marketHighlightSchema } from "@/lib/validations/mercado";
import { sanitizeText } from "@/lib/security/sanitize";
import type { ApiResponse } from "@/types";

export const revalidate = 0;

// GET — public consumers want only active; admin (?all=1) wants everything
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const includeInactive = searchParams.get("all") === "1";

  const rows = await db
    .select()
    .from(watchMarketHighlights)
    .where(includeInactive ? undefined : eq(watchMarketHighlights.active, true))
    .orderBy(asc(watchMarketHighlights.displayOrder));

  return NextResponse.json<ApiResponse>({ success: true, data: rows });
}

// POST — create a new highlight (admin)
export async function POST(request: NextRequest) {
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

  const parsed = marketHighlightSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: parsed.error.errors[0]?.message ?? "Dados inválidos." },
      { status: 400 }
    );
  }

  const data = parsed.data;

  // Append to the end of the current order
  const [maxRow] = await db
    .select({ max: sql<number>`coalesce(max(${watchMarketHighlights.displayOrder}), -1)::int` })
    .from(watchMarketHighlights);
  const nextOrder = (maxRow?.max ?? -1) + 1;

  const [created] = await db
    .insert(watchMarketHighlights)
    .values({
      brand: sanitizeText(data.brand),
      model: sanitizeText(data.model),
      reference: data.reference ? sanitizeText(data.reference) : null,
      imageUrl: data.imageUrl ? data.imageUrl : null,
      appreciationPct: data.appreciationPct.toString(),
      period: sanitizeText(data.period),
      editorialNote: data.editorialNote ? sanitizeText(data.editorialNote) : null,
      source: data.source ? sanitizeText(data.source) : null,
      active: data.active,
      displayOrder: data.displayOrder ?? nextOrder,
    })
    .returning();

  await logAudit({
    action: "market_highlight.created",
    entity: "watch_market_highlights",
    entityId: created?.id,
    adminEmail: session.user.email ?? "admin",
    request,
  });

  revalidatePath("/mercado");
  return NextResponse.json<ApiResponse>({ success: true, data: created }, { status: 201 });
}

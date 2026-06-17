import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { watchMarketHighlights } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { requireAdmin, logAudit } from "@/lib/auth/utils";
import { marketHighlightSchema } from "@/lib/validations/mercado";
import { sanitizeText } from "@/lib/security/sanitize";
import type { ApiResponse } from "@/types";

// PUT — full edit of a highlight
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

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
  const [updated] = await db
    .update(watchMarketHighlights)
    .set({
      brand: sanitizeText(data.brand),
      model: sanitizeText(data.model),
      reference: data.reference ? sanitizeText(data.reference) : null,
      imageUrl: data.imageUrl ? data.imageUrl : null,
      appreciationPct: data.appreciationPct.toString(),
      period: sanitizeText(data.period),
      editorialNote: data.editorialNote ? sanitizeText(data.editorialNote) : null,
      source: data.source ? sanitizeText(data.source) : null,
      active: data.active,
      updatedAt: new Date(),
    })
    .where(eq(watchMarketHighlights.id, id))
    .returning();

  if (!updated) {
    return NextResponse.json<ApiResponse>({ success: false, error: "Não encontrado." }, { status: 404 });
  }

  await logAudit({
    action: "market_highlight.updated",
    entity: "watch_market_highlights",
    entityId: id,
    adminEmail: session.user.email ?? "admin",
    request,
  });

  return NextResponse.json<ApiResponse>({ success: true, data: updated });
}

// PATCH — partial update: toggle active and/or change display order
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

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

  const { active, displayOrder } = body as { active?: unknown; displayOrder?: unknown };
  const updates: Partial<typeof watchMarketHighlights.$inferInsert> = { updatedAt: new Date() };
  if (typeof active === "boolean") updates.active = active;
  if (typeof displayOrder === "number" && Number.isInteger(displayOrder)) updates.displayOrder = displayOrder;

  const [updated] = await db
    .update(watchMarketHighlights)
    .set(updates)
    .where(eq(watchMarketHighlights.id, id))
    .returning();

  if (!updated) {
    return NextResponse.json<ApiResponse>({ success: false, error: "Não encontrado." }, { status: 404 });
  }

  await logAudit({
    action: "market_highlight.updated",
    entity: "watch_market_highlights",
    entityId: id,
    adminEmail: session.user.email ?? "admin",
    request,
  });

  return NextResponse.json<ApiResponse>({ success: true, data: updated });
}

// DELETE — remove a highlight
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  let session;
  try {
    session = await requireAdmin();
  } catch {
    return NextResponse.json<ApiResponse>({ success: false, error: "Não autorizado." }, { status: 401 });
  }

  const [deleted] = await db.delete(watchMarketHighlights).where(eq(watchMarketHighlights.id, id)).returning();
  if (!deleted) {
    return NextResponse.json<ApiResponse>({ success: false, error: "Não encontrado." }, { status: 404 });
  }

  await logAudit({
    action: "market_highlight.deleted",
    entity: "watch_market_highlights",
    entityId: id,
    adminEmail: session.user.email ?? "admin",
    request,
  });

  return NextResponse.json<ApiResponse>({ success: true });
}

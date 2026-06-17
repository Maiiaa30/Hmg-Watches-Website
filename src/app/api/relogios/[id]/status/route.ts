import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { watches } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { requireAdmin, logAudit } from "@/lib/auth/utils";
import { watchStatusSchema } from "@/lib/validations/relogio";
import type { ApiResponse } from "@/types";

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

  const parsed = watchStatusSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Estado inválido." },
      { status: 400 }
    );
  }

  const { status } = parsed.data;

  const [existing] = await db
    .select()
    .from(watches)
    .where(eq(watches.id, id))
    .limit(1);

  if (!existing) {
    return NextResponse.json<ApiResponse>({ success: false, error: "Não encontrado." }, { status: 404 });
  }

  const updates: Partial<typeof watches.$inferInsert> = {
    status,
    updatedAt: new Date(),
  };

  if (status === "sold" && existing.status !== "sold") {
    updates.soldAt = new Date();
  } else if (status !== "sold" && existing.status === "sold") {
    updates.soldAt = null;
  }

  const [updated] = await db
    .update(watches)
    .set(updates)
    .where(eq(watches.id, id))
    .returning();

  await logAudit({
    action: "watch.status_changed",
    entity: "watches",
    entityId: id,
    adminEmail: session.user.email ?? "admin",
    request,
  });

  return NextResponse.json<ApiResponse>({ success: true, data: updated });
}

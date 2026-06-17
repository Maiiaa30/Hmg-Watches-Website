import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { watches } from "@/lib/db/schema";
import { eq, ne } from "drizzle-orm";
import { requireAdmin, logAudit } from "@/lib/auth/utils";
import type { ApiResponse } from "@/types";

// PATCH — set/unset a watch as the featured (front-page hero) piece.
// Only one watch can be featured at a time, so setting one clears the others.
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

  const { featured } = body as { featured?: unknown };
  if (typeof featured !== "boolean") {
    return NextResponse.json<ApiResponse>({ success: false, error: "Campo 'featured' inválido." }, { status: 400 });
  }

  const [existing] = await db.select({ id: watches.id }).from(watches).where(eq(watches.id, id)).limit(1);
  if (!existing) {
    return NextResponse.json<ApiResponse>({ success: false, error: "Não encontrado." }, { status: 404 });
  }

  if (featured) {
    // Clear any other featured watch first, then mark this one
    await db.update(watches).set({ featured: false }).where(ne(watches.id, id));
  }

  const [updated] = await db
    .update(watches)
    .set({ featured, updatedAt: new Date() })
    .where(eq(watches.id, id))
    .returning();

  await logAudit({
    action: "watch.featured_changed",
    entity: "watches",
    entityId: id,
    adminEmail: session.user.email ?? "admin",
    request,
  });

  return NextResponse.json<ApiResponse>({ success: true, data: updated });
}

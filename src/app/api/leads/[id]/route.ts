import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { watchLeads } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { requireAdmin, logAudit } from "@/lib/auth/utils";
import type { ApiResponse } from "@/types";

// PATCH — mark a lead as read / unread
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

  const { read } = body as { read?: unknown };
  if (typeof read !== "boolean") {
    return NextResponse.json<ApiResponse>({ success: false, error: "Campo 'read' inválido." }, { status: 400 });
  }

  const [updated] = await db
    .update(watchLeads)
    .set({ read })
    .where(eq(watchLeads.id, id))
    .returning();

  if (!updated) {
    return NextResponse.json<ApiResponse>({ success: false, error: "Não encontrado." }, { status: 404 });
  }

  if (read) {
    await logAudit({
      action: "watch_lead.read",
      entity: "watch_leads",
      entityId: id,
      adminEmail: session.user.email ?? "admin",
      request,
    });
  }

  return NextResponse.json<ApiResponse>({ success: true, data: updated });
}

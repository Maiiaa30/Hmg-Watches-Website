import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { contactMessages } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { requireAdmin, logAudit } from "@/lib/auth/utils";
import type { ApiResponse } from "@/types";

// PATCH — mark a contact message as read / unread
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
    .update(contactMessages)
    .set({ read })
    .where(eq(contactMessages.id, id))
    .returning();

  if (!updated) {
    return NextResponse.json<ApiResponse>({ success: false, error: "Não encontrado." }, { status: 404 });
  }

  if (read) {
    await logAudit({
      action: "contact_message.read",
      entity: "contact_messages",
      entityId: id,
      adminEmail: session.user.email ?? "admin",
      request,
    });
  }

  return NextResponse.json<ApiResponse>({ success: true, data: updated });
}

// DELETE — remove a contact message
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

  const [deleted] = await db.delete(contactMessages).where(eq(contactMessages.id, id)).returning();
  if (!deleted) {
    return NextResponse.json<ApiResponse>({ success: false, error: "Não encontrado." }, { status: 404 });
  }

  await logAudit({
    action: "contact_message.deleted",
    entity: "contact_messages",
    entityId: id,
    adminEmail: session.user.email ?? "admin",
    request,
  });

  return NextResponse.json<ApiResponse>({ success: true });
}

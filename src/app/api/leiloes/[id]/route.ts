import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin, logAudit } from "@/lib/auth/utils";
import { getAuctions, saveAuctions } from "@/lib/leiloes";
import { auctionSchema } from "@/lib/validations/leilao";
import { sanitizeText } from "@/lib/security/sanitize";
import type { ApiResponse } from "@/types";

function revalidate() {
  revalidatePath("/leiloes");
  revalidatePath("/");
}

// PUT — full edit of an auction.
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

  const parsed = auctionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: parsed.error.errors[0]?.message ?? "Dados inválidos." },
      { status: 400 }
    );
  }
  const d = parsed.data;

  const list = await getAuctions();
  const idx = list.findIndex((a) => a.id === id);
  if (idx === -1) {
    return NextResponse.json<ApiResponse>({ success: false, error: "Não encontrado." }, { status: 404 });
  }

  list[idx] = {
    id,
    title: sanitizeText(d.title),
    house: d.house ? sanitizeText(d.house) : null,
    url: d.url,
    description: d.description ? sanitizeText(d.description) : null,
    imageUrl: d.imageUrl ? d.imageUrl : null,
    startsAt: d.startsAt,
    startsTime: d.startsTime ? d.startsTime : null,
    location: d.location ? sanitizeText(d.location) : null,
    active: d.active,
  };
  await saveAuctions(list);

  await logAudit({
    action: "auction.updated",
    entity: "auctions",
    entityId: id,
    adminEmail: session.user.email ?? "admin",
    request,
  });

  revalidate();
  return NextResponse.json<ApiResponse>({ success: true, data: list[idx] });
}

// PATCH — partial: toggle active.
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

  const { active } = body as { active?: unknown };
  const list = await getAuctions();
  const idx = list.findIndex((a) => a.id === id);
  if (idx === -1) {
    return NextResponse.json<ApiResponse>({ success: false, error: "Não encontrado." }, { status: 404 });
  }
  if (typeof active === "boolean") list[idx]!.active = active;
  await saveAuctions(list);

  await logAudit({
    action: "auction.updated",
    entity: "auctions",
    entityId: id,
    adminEmail: session.user.email ?? "admin",
    request,
  });

  revalidate();
  return NextResponse.json<ApiResponse>({ success: true, data: list[idx] });
}

// DELETE — remove an auction.
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let session;
  try {
    session = await requireAdmin();
  } catch {
    return NextResponse.json<ApiResponse>({ success: false, error: "Não autorizado." }, { status: 401 });
  }

  const list = await getAuctions();
  const next = list.filter((a) => a.id !== id);
  if (next.length === list.length) {
    return NextResponse.json<ApiResponse>({ success: false, error: "Não encontrado." }, { status: 404 });
  }
  await saveAuctions(next);

  await logAudit({
    action: "auction.deleted",
    entity: "auctions",
    entityId: id,
    adminEmail: session.user.email ?? "admin",
    request,
  });

  revalidate();
  return NextResponse.json<ApiResponse>({ success: true });
}

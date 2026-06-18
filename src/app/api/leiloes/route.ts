import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin, logAudit } from "@/lib/auth/utils";
import { getAuctions, saveAuctions, getUpcomingAuctions, type Auction } from "@/lib/leiloes";
import { auctionSchema } from "@/lib/validations/leilao";
import { sanitizeText } from "@/lib/security/sanitize";
import type { ApiResponse } from "@/types";

export const revalidate = 0;

// GET — admin (?all=1) gets everything; the public gets only upcoming active.
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  if (searchParams.get("all") === "1") {
    try {
      await requireAdmin();
    } catch {
      return NextResponse.json<ApiResponse>({ success: false, error: "Não autorizado." }, { status: 401 });
    }
    return NextResponse.json<ApiResponse>({ success: true, data: await getAuctions() });
  }
  return NextResponse.json<ApiResponse>({ success: true, data: await getUpcomingAuctions() });
}

// POST — create a new auction (admin).
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

  const parsed = auctionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: parsed.error.errors[0]?.message ?? "Dados inválidos." },
      { status: 400 }
    );
  }
  const d = parsed.data;

  const auction: Auction = {
    id: crypto.randomUUID(),
    title: sanitizeText(d.title),
    house: d.house ? sanitizeText(d.house) : null,
    url: d.url, // validated http(s) URL; not rendered as HTML
    description: d.description ? sanitizeText(d.description) : null,
    imageUrl: d.imageUrl ? d.imageUrl : null,
    startsAt: d.startsAt,
    startsTime: d.startsTime ? d.startsTime : null,
    location: d.location ? sanitizeText(d.location) : null,
    active: d.active,
  };

  const list = await getAuctions();
  list.push(auction);
  await saveAuctions(list);

  await logAudit({
    action: "auction.created",
    entity: "auctions",
    entityId: auction.id,
    adminEmail: session.user.email ?? "admin",
    request,
  });

  revalidatePath("/leiloes");
  revalidatePath("/");
  return NextResponse.json<ApiResponse>({ success: true, data: auction }, { status: 201 });
}

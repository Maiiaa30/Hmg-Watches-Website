import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { watches } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { requireAdmin, logAudit } from "@/lib/auth/utils";
import { watchSchema } from "@/lib/validations/relogio";
import { sanitizeText } from "@/lib/security/sanitize";
import type { ApiResponse } from "@/types";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const [watch] = await db
    .select()
    .from(watches)
    .where(eq(watches.id, id))
    .limit(1);

  if (!watch) {
    return NextResponse.json<ApiResponse>({ success: false, error: "Não encontrado." }, { status: 404 });
  }

  // Archived watches are admin-only: hide them from the public as a 404 unless
  // the caller is an authenticated admin. Available/sold stay public.
  if (watch.status === "archived") {
    let isAdmin = false;
    try {
      await requireAdmin();
      isAdmin = true;
    } catch {
      isAdmin = false;
    }
    if (!isAdmin) {
      return NextResponse.json<ApiResponse>({ success: false, error: "Não encontrado." }, { status: 404 });
    }
  }

  return NextResponse.json<ApiResponse>({ success: true, data: watch });
}

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

  const parsed = watchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: parsed.error.errors[0]?.message ?? "Dados inválidos." },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const [updated] = await db
    .update(watches)
    .set({
      brand: sanitizeText(data.brand),
      model: sanitizeText(data.model),
      reference: data.reference ? sanitizeText(data.reference) : null,
      year: data.year ?? null,
      movementType: data.movementType,
      caseMaterial: data.caseMaterial ? sanitizeText(data.caseMaterial) : null,
      caseDiameterMm: data.caseDiameterMm?.toString() ?? null,
      braceletMaterial: data.braceletMaterial ? sanitizeText(data.braceletMaterial) : null,
      condition: data.condition,
      hasBox: data.hasBox,
      hasPapers: data.hasPapers,
      description: data.description ? sanitizeText(data.description) : null,
      price: data.price.toString(),
      externalLink: data.externalLink ?? null,
      updatedAt: new Date(),
    })
    .where(eq(watches.id, id))
    .returning();

  if (!updated) {
    return NextResponse.json<ApiResponse>({ success: false, error: "Não encontrado." }, { status: 404 });
  }

  await logAudit({
    action: "watch.updated",
    entity: "watches",
    entityId: id,
    adminEmail: session.user.email ?? "admin",
    request,
  });

  return NextResponse.json<ApiResponse>({ success: true, data: updated });
}

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

  const [watch] = await db
    .select()
    .from(watches)
    .where(eq(watches.id, id))
    .limit(1);

  if (!watch) {
    return NextResponse.json<ApiResponse>({ success: false, error: "Não encontrado." }, { status: 404 });
  }

  if (watch.images.length > 0) {
    await deleteWatchImages(watch.images);
  }

  await db.delete(watches).where(eq(watches.id, id));

  await logAudit({
    action: "watch.deleted",
    entity: "watches",
    entityId: id,
    adminEmail: session.user.email ?? "admin",
    request,
  });

  return NextResponse.json<ApiResponse>({ success: true });
}

async function deleteWatchImages(imageUrls: string[]) {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY || !process.env.NEXT_PUBLIC_SUPABASE_URL) return;

  const paths = imageUrls
    .map((url) => {
      try {
        const u = new URL(url);
        const match = u.pathname.match(/\/storage\/v1\/object\/public\/watch-images\/(.+)/);
        return match?.[1] ?? null;
      } catch {
        return null;
      }
    })
    .filter(Boolean) as string[];

  if (paths.length === 0) return;

  await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prefixes: paths }),
    }
  );
}

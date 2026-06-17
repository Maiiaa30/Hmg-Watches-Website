import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { watches } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { requireAdmin, logAudit } from "@/lib/auth/utils";
import { MAX_IMAGES_PER_WATCH } from "@/constants";
import type { ApiResponse } from "@/types";

// PATCH — replace images array / reorder
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

  const { images } = body as { images?: unknown };
  if (!Array.isArray(images) || images.some((img) => typeof img !== "string")) {
    return NextResponse.json<ApiResponse>({ success: false, error: "Array de imagens inválido." }, { status: 400 });
  }

  if (images.length > MAX_IMAGES_PER_WATCH) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: `Máximo de ${MAX_IMAGES_PER_WATCH} imagens por relógio.` },
      { status: 400 }
    );
  }

  const [watch] = await db.select().from(watches).where(eq(watches.id, id)).limit(1);
  if (!watch) {
    return NextResponse.json<ApiResponse>({ success: false, error: "Não encontrado." }, { status: 404 });
  }

  const [updated] = await db
    .update(watches)
    .set({ images: images as string[], imageOrder: images as string[], updatedAt: new Date() })
    .where(eq(watches.id, id))
    .returning();

  await logAudit({
    action: "watch.images_updated",
    entity: "watches",
    entityId: id,
    adminEmail: session.user.email ?? "admin",
    request,
  });

  return NextResponse.json<ApiResponse>({ success: true, data: updated });
}

// DELETE — remove one image by URL, delete from storage
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

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json<ApiResponse>({ success: false, error: "Pedido inválido." }, { status: 400 });
  }

  const { url } = body as { url?: unknown };
  if (typeof url !== "string") {
    return NextResponse.json<ApiResponse>({ success: false, error: "URL em falta." }, { status: 400 });
  }

  const [watch] = await db.select().from(watches).where(eq(watches.id, id)).limit(1);
  if (!watch) {
    return NextResponse.json<ApiResponse>({ success: false, error: "Não encontrado." }, { status: 404 });
  }

  const newImages = watch.images.filter((img) => img !== url);

  // Delete from Supabase Storage
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const u = new URL(url);
      const match = u.pathname.match(/\/storage\/v1\/object\/public\/watch-images\/(.+)/);
      if (match?.[1]) {
        await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
            apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prefixes: [match[1]] }),
        });
      }
    } catch {}
  }

  const [updated] = await db
    .update(watches)
    .set({ images: newImages, imageOrder: newImages, updatedAt: new Date() })
    .where(eq(watches.id, id))
    .returning();

  await logAudit({
    action: "watch.image_deleted",
    entity: "watches",
    entityId: id,
    adminEmail: session.user.email ?? "admin",
    request,
  });

  return NextResponse.json<ApiResponse>({ success: true, data: updated });
}

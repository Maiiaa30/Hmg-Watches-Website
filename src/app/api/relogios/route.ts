import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { watches } from "@/lib/db/schema";
import { eq, ne, desc, and, or, ilike, sql } from "drizzle-orm";
import { requireAdmin, logAudit } from "@/lib/auth/utils";
import { watchSchema } from "@/lib/validations/relogio";
import { sanitizeText } from "@/lib/security/sanitize";
import type { ApiResponse } from "@/types";
import slugify from "slugify";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const page = Math.max(1, Number(searchParams.get("page") ?? 1));
  const limit = 20;
  const offset = (page - 1) * limit;
  const q = searchParams.get("q");

  const conditions = [ne(watches.status, "archived")];
  if (status && ["available", "sold", "archived"].includes(status)) {
    conditions.push(eq(watches.status, status as "available" | "sold" | "archived"));
  }
  if (q) {
    conditions.push(
      or(
        ilike(watches.brand, `%${q}%`),
        ilike(watches.model, `%${q}%`),
        ilike(watches.reference, `%${q}%`)
      )!
    );
  }

  const [rows, countRows] = await Promise.all([
    db.select().from(watches).where(and(...conditions)).orderBy(desc(watches.createdAt)).limit(limit).offset(offset),
    db.select({ count: sql<number>`count(*)::int` }).from(watches).where(and(...conditions)),
  ]);

  const count = countRows[0]?.count ?? 0;

  return NextResponse.json<ApiResponse>({
    success: true,
    data: { watches: rows, total: count, page, pages: Math.ceil(count / limit) },
  });
}

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

  const parsed = watchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: parsed.error.errors[0]?.message ?? "Dados inválidos." },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const base = slugify(`${data.brand}-${data.model}${data.reference ? `-${data.reference}` : ""}`, { lower: true, strict: true });

  // Ensure unique slug
  let slug = base;
  let n = 1;
  while (true) {
    const [existing] = await db.select({ id: watches.id }).from(watches).where(eq(watches.slug, slug)).limit(1);
    if (!existing) break;
    slug = `${base}-${n++}`;
  }

  const [created] = await db
    .insert(watches)
    .values({
      slug,
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
    })
    .returning();

  await logAudit({
    action: "watch.created",
    entity: "watches",
    entityId: created?.id,
    adminEmail: session.user.email ?? "admin",
    request,
  });

  return NextResponse.json<ApiResponse>({ success: true, data: created }, { status: 201 });
}

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { blogPosts } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth/utils";
import { blogPostSchema } from "@/lib/validations/blog";
import { sanitizeText } from "@/lib/security/sanitize";
import slugify from "slugify";
import type { ApiResponse } from "@/types";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const statusFilter = searchParams.get("status");

  const rows = await db
    .select()
    .from(blogPosts)
    .where(statusFilter ? eq(blogPosts.status, statusFilter as "draft" | "pending_approval" | "published") : undefined)
    .orderBy(desc(blogPosts.createdAt));

  return NextResponse.json<ApiResponse>({ success: true, data: rows });
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json<ApiResponse>({ success: false, error: "Não autorizado." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json<ApiResponse>({ success: false, error: "Pedido inválido." }, { status: 400 });
  }

  const parsed = blogPostSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: parsed.error.errors[0]?.message ?? "Dados inválidos." },
      { status: 400 }
    );
  }

  const { title, content, excerpt, category, coverImage } = parsed.data;

  const baseSlug = slugify(title, { lower: true, strict: true });
  const slug = `${baseSlug}-${Date.now()}`;

  const words = content.split(/\s+/).length;
  const readingTimeMinutes = Math.max(1, Math.round(words / 200));

  const [post] = await db
    .insert(blogPosts)
    .values({
      slug,
      title: sanitizeText(title),
      content: sanitizeText(content),
      excerpt: sanitizeText(excerpt),
      category,
      coverImage: coverImage ?? null,
      status: "draft",
      readingTimeMinutes,
    })
    .returning();

  return NextResponse.json<ApiResponse>({ success: true, data: post }, { status: 201 });
}

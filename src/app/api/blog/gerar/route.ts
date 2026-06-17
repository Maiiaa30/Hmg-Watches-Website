import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { blogPosts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { requireAdmin, logAudit } from "@/lib/auth/utils";
import { generateBlogSchema } from "@/lib/validations/blog";
import { generateBlogPost } from "@/lib/ai/blog-generator";
import { blogGenerateRatelimit, getClientIp } from "@/lib/security/rate-limit";
import type { ApiResponse } from "@/types";
import slugify from "slugify";

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);

  // Cost-protection rate limit
  if (blogGenerateRatelimit) {
    const { success } = await blogGenerateRatelimit.limit(ip);
    if (!success) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Limite de geração atingido. Aguarde antes de gerar outro artigo." },
        { status: 429 }
      );
    }
  }

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

  const parsed = generateBlogSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: parsed.error.errors[0]?.message ?? "Dados inválidos." },
      { status: 400 }
    );
  }

  const { category, topic } = parsed.data;

  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: "GEMINI_API_KEY não configurado. Crie uma chave gratuita em aistudio.google.com." },
      { status: 400 }
    );
  }

  // Generate with Gemini — surface a clean message on API/quota errors
  let article;
  try {
    article = await generateBlogPost(category, topic);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro desconhecido.";
    const friendly = /quota|rate limit|resource.*exhausted|429/i.test(message)
      ? "Limite gratuito do Gemini atingido. Tente novamente mais tarde."
      : `Falha ao gerar o artigo: ${message}`;
    return NextResponse.json<ApiResponse>({ success: false, error: friendly }, { status: 502 });
  }

  // Unique slug
  const base = slugify(article.title, { lower: true, strict: true }).slice(0, 80);
  let slug = base;
  let n = 1;
  while (true) {
    const [existing] = await db.select({ id: blogPosts.id }).from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1);
    if (!existing) break;
    slug = `${base}-${n++}`;
  }

  const [created] = await db
    .insert(blogPosts)
    .values({
      slug,
      title: article.title,
      content: article.content,
      excerpt: article.excerpt,
      category: article.category,
      status: "pending_approval",
      generatedByAi: true,
      readingTimeMinutes: article.readingTimeMinutes,
    })
    .returning();

  // Notify Telegram with approve/reject buttons
  let telegramMessageId: number | null = null;
  if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID && created) {
    try {
      const res = await fetch(
        `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: process.env.TELEGRAM_CHAT_ID,
            text: `📝 *Novo artigo gerado por IA — aprovação pendente*\n\n*${article.title}*\n\n${article.excerpt}\n\nCategoria: ${category}`,
            parse_mode: "Markdown",
            reply_markup: {
              inline_keyboard: [[
                { text: "✅ Publicar", callback_data: `publish_post:${created.id}` },
                { text: "🗑️ Eliminar", callback_data: `delete_post:${created.id}` },
              ]],
            },
          }),
        }
      );
      const tgData = await res.json() as { ok: boolean; result?: { message_id: number } };
      if (tgData.ok) telegramMessageId = tgData.result?.message_id ?? null;
    } catch {}

    if (telegramMessageId && created) {
      await db.update(blogPosts).set({ telegramMessageId }).where(eq(blogPosts.id, created.id));
    }
  }

  await logAudit({
    action: "blog.created",
    entity: "blog_posts",
    entityId: created?.id,
    adminEmail: session.user.email ?? "admin",
    request,
  });

  return NextResponse.json<ApiResponse>({ success: true, data: created }, { status: 201 });
}

import { db } from "@/lib/db";
import { blogPosts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { generateBlogPost } from "@/lib/ai/blog-generator";
import type { BlogCategory } from "@/types";
import slugify from "slugify";

export const BLOG_CATEGORIES: BlogCategory[] = ["novidades", "curiosidades", "guias", "mercado"];

/** Search Openverse (free, no API key) for a themed, CC-licensed cover image. */
async function findCoverImage(title: string): Promise<string | null> {
  const queries = [title, `${title} relógio`, "luxury watch"];
  for (const q of queries) {
    try {
      const res = await fetch(
        `https://api.openverse.org/v1/images/?q=${encodeURIComponent(q)}&page_size=1&mature=false`,
        { headers: { Accept: "application/json" } }
      );
      if (!res.ok) continue;
      const data = (await res.json()) as { results?: Array<{ url?: string }> };
      const url = data.results?.[0]?.url;
      if (typeof url === "string" && url.startsWith("https://")) return url;
    } catch {
      // try next query
    }
  }
  return null;
}

/**
 * Generate an article with Gemini, find a cover image, save it as
 * pending_approval, and send the Telegram approval message.
 * Throws on generation failure (callers map to a friendly error).
 */
export async function generateAndSaveBlogPost(category: BlogCategory, topic?: string) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY não configurado.");
  }

  const article = await generateBlogPost(category, topic);
  const coverImage = await findCoverImage(article.title);

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
      coverImage,
      status: "pending_approval",
      generatedByAi: true,
      readingTimeMinutes: article.readingTimeMinutes,
    })
    .returning();

  // Telegram approval message with inline buttons
  if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID && created) {
    try {
      const res = await fetch(
        `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: process.env.TELEGRAM_CHAT_ID,
            text: `📝 *Novo artigo gerado por IA — aprovação pendente*\n\n*${article.title}*\n\n${article.excerpt}\n\nCategoria: ${article.category}`,
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
      const tgData = (await res.json()) as { ok: boolean; result?: { message_id: number } };
      if (tgData.ok && tgData.result?.message_id) {
        await db.update(blogPosts).set({ telegramMessageId: tgData.result.message_id }).where(eq(blogPosts.id, created.id));
      }
    } catch {
      // Telegram is best-effort
    }
  }

  return created;
}

/** Map a Gemini error to a user-friendly message. */
export function friendlyGenError(err: unknown): string {
  const message = err instanceof Error ? err.message : "Erro desconhecido.";
  return /quota|rate limit|resource.*exhausted|429/i.test(message)
    ? "Limite gratuito do Gemini atingido. Tente novamente mais tarde."
    : `Falha ao gerar o artigo: ${message}`;
}

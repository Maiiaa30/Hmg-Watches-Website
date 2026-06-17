import Anthropic from "@anthropic-ai/sdk";
import type { BlogCategory } from "@/types";
import { BLOG_CATEGORY_LABELS } from "@/constants";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

interface GeneratedArticle {
  title: string;
  excerpt: string;
  content: string;
  category: BlogCategory;
  readingTimeMinutes: number;
}

export async function generateBlogPost(
  category: BlogCategory,
  topic?: string
): Promise<GeneratedArticle> {
  const categoryLabel = BLOG_CATEGORY_LABELS[category];
  const topicLine = topic
    ? `\nTema sugerido pelo editor: "${topic}"`
    : "";

  const prompt = `És um editor especializado em relojoaria de luxo para a HMG Watches, uma montra portuguesa de revenda de relógios de exceção. Escreve em Português de Portugal, com um tom editorial sofisticado, honesto e próximo — como quem conhece profundamente o mundo dos relógios e respeita o leitor.

Categoria pedida: ${categoryLabel}${topicLine}

Gera um artigo completo com:
1. Um título apelativo (máximo 80 caracteres)
2. Um excerpt de 2-3 linhas (máximo 200 caracteres)
3. Conteúdo completo em Markdown (entre 600 e 1000 palavras)
4. A categoria confirmada: ${category}

Responde APENAS em JSON válido, sem texto adicional, com este formato exacto:
{
  "title": "...",
  "excerpt": "...",
  "content": "...",
  "category": "${category}"
}`;

  const message = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 2000,
    messages: [{ role: "user", content: prompt }],
  });

  const text =
    message.content[0]?.type === "text" ? message.content[0].text : "";

  let parsed: { title: string; excerpt: string; content: string; category: string };
  try {
    parsed = JSON.parse(text) as typeof parsed;
  } catch {
    // Try to extract JSON from the response
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("Resposta inválida da IA");
    parsed = JSON.parse(match[0]) as typeof parsed;
  }

  const wordCount = parsed.content.split(/\s+/).length;
  const readingTimeMinutes = Math.max(1, Math.round(wordCount / 200));

  return {
    title: parsed.title,
    excerpt: parsed.excerpt,
    content: parsed.content,
    category: (parsed.category as BlogCategory) ?? category,
    readingTimeMinutes,
  };
}

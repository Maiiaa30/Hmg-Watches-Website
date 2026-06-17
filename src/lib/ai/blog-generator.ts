import type { BlogCategory } from "@/types";
import { BLOG_CATEGORY_LABELS } from "@/constants";

interface GeneratedArticle {
  title: string;
  excerpt: string;
  content: string;
  category: BlogCategory;
  readingTimeMinutes: number;
}

// Google Gemini free-tier model. Override via GEMINI_MODEL if needed.
const GEMINI_MODEL = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";

interface GeminiResponse {
  candidates?: Array<{
    content?: { parts?: Array<{ text?: string }> };
    finishReason?: string;
  }>;
  error?: { message?: string };
  promptFeedback?: { blockReason?: string };
  usageMetadata?: Record<string, number>;
}

export async function generateBlogPost(
  category: BlogCategory,
  topic?: string
): Promise<GeneratedArticle> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY não configurado.");
  }

  const categoryLabel = BLOG_CATEGORY_LABELS[category];
  const topicLine = topic ? `\nTema sugerido pelo editor: "${topic}"` : "";

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

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          // Enforce a strict JSON schema so the long Markdown content is
          // always properly escaped — plain responseMimeType alone lets the
          // model emit unescaped newlines that break JSON.parse.
          responseSchema: {
            type: "OBJECT",
            properties: {
              title: { type: "STRING" },
              excerpt: { type: "STRING" },
              content: { type: "STRING" },
              category: { type: "STRING" },
            },
            required: ["title", "excerpt", "content", "category"],
          },
          // Gemini 2.5 models "think" before answering and that consumes the
          // output budget. Disable thinking and give ample room for a full
          // 600-1000 word article, otherwise the JSON gets truncated.
          thinkingConfig: { thinkingBudget: 0 },
          maxOutputTokens: 8192,
          temperature: 0.9,
        },
      }),
    }
  );

  const data = (await res.json()) as GeminiResponse;

  if (!res.ok) {
    throw new Error(data.error?.message ?? `Gemini respondeu ${res.status}.`);
  }
  if (data.promptFeedback?.blockReason) {
    throw new Error(`Conteúdo bloqueado pelo Gemini (${data.promptFeedback.blockReason}).`);
  }

  const candidate = data.candidates?.[0];
  const finishReason = candidate?.finishReason;
  const text = candidate?.content?.parts?.[0]?.text ?? "";

  if (finishReason === "MAX_TOKENS") {
    console.error("[blog-generator] MAX_TOKENS — output truncated.", data.usageMetadata);
    throw new Error("Resposta cortada (MAX_TOKENS). O modelo gastou o orçamento de tokens.");
  }
  if (!text) {
    console.error("[blog-generator] empty text.", { finishReason, usage: data.usageMetadata });
    throw new Error("Resposta vazia da IA.");
  }

  let parsed: { title: string; excerpt: string; content: string; category: string };
  try {
    parsed = JSON.parse(text) as typeof parsed;
  } catch {
    // Try to extract JSON from the response
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) {
      console.error("[blog-generator] no JSON found. finishReason:", finishReason, "raw:", text.slice(0, 400));
      throw new Error("Resposta inválida da IA.");
    }
    try {
      parsed = JSON.parse(match[0]) as typeof parsed;
    } catch {
      console.error("[blog-generator] JSON parse failed. finishReason:", finishReason, "raw:", text.slice(0, 400));
      throw new Error("Resposta inválida da IA.");
    }
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

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { watchMarketHighlights } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getSetting, setSetting } from "@/lib/db/settings";

// Google Gemini free-tier model (same one the blog generator uses).
const GEMINI_MODEL = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";

// Marks rows in watch_market_highlights that were produced by the AI job, so a
// refresh only replaces AI rows and never clobbers an entry the admin added by
// hand. Stored in the existing `source` column (no schema change needed).
export const AI_MOVERS_SOURCE = "Estimativa IA";

export interface GeneratedMover {
  brand: string;
  model: string;
  reference: string | null;
  appreciationPct: number; // can be negative (a faller)
  period: string; // e.g. "3 meses", "1 ano"
  editorialNote: string | null;
}

interface GeminiResponse {
  candidates?: Array<{
    content?: { parts?: Array<{ text?: string }> };
    finishReason?: string;
  }>;
  error?: { message?: string };
  promptFeedback?: { blockReason?: string };
  usageMetadata?: Record<string, number>;
}

/**
 * Ask Gemini for a ranked list of luxury watches that have moved in value on the
 * secondary market, with an estimated % change. These are AI estimates (clearly
 * labelled as such on the site), not live market data.
 */
export async function generateMovers(count = 10): Promise<GeneratedMover[]> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY não configurado.");
  }

  const prompt = `És um analista do mercado secundário de relógios de luxo para a HMG Watches (Portugal).
Indica os ${count} relógios de luxo mais relevantes em termos de variação de valor recente no mercado secundário internacional (estilo Chrono24 / WatchCharts).

Regras:
- Usa modelos reais e conhecidos (Rolex, Patek Philippe, Audemars Piguet, Omega, Tudor, Cartier, Vacheron Constantin, etc.).
- A maioria deve ter valorização positiva, mas inclui 1 ou 2 em queda (percentagem negativa) para realismo.
- Percentagens realistas entre -20 e +40.
- "period" curto em Português: "3 meses", "6 meses" ou "1 ano".
- "editorialNote": uma frase curta (máx. 110 caracteres) em Português de Portugal a explicar o movimento.
- Ordena do que mais valorizou para o que menos valorizou.
- Não repitas o mesmo modelo.

Responde APENAS em JSON válido com este formato exacto:
{
  "movers": [
    { "brand": "...", "model": "...", "reference": "...", "appreciationPct": 0, "period": "...", "editorialNote": "..." }
  ]
}`;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          // Strict schema so the array is always valid JSON (see blog-generator).
          responseSchema: {
            type: "OBJECT",
            properties: {
              movers: {
                type: "ARRAY",
                items: {
                  type: "OBJECT",
                  properties: {
                    brand: { type: "STRING" },
                    model: { type: "STRING" },
                    reference: { type: "STRING" },
                    appreciationPct: { type: "NUMBER" },
                    period: { type: "STRING" },
                    editorialNote: { type: "STRING" },
                  },
                  required: ["brand", "model", "appreciationPct", "period"],
                },
              },
            },
            required: ["movers"],
          },
          // 2.5 models "think" and eat the output budget — disable it.
          thinkingConfig: { thinkingBudget: 0 },
          maxOutputTokens: 4096,
          temperature: 0.85,
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
  if (candidate?.finishReason === "MAX_TOKENS") {
    throw new Error("Resposta cortada (MAX_TOKENS).");
  }
  const text = candidate?.content?.parts?.[0]?.text ?? "";
  if (!text) {
    throw new Error("Resposta vazia da IA.");
  }

  let parsed: { movers?: unknown };
  try {
    parsed = JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("Resposta inválida da IA.");
    parsed = JSON.parse(match[0]);
  }

  const rawList = Array.isArray(parsed.movers) ? parsed.movers : [];
  const movers: GeneratedMover[] = [];
  for (const raw of rawList) {
    if (typeof raw !== "object" || raw === null) continue;
    const r = raw as Record<string, unknown>;
    const brand = typeof r.brand === "string" ? r.brand.trim() : "";
    const model = typeof r.model === "string" ? r.model.trim() : "";
    const pct = typeof r.appreciationPct === "number" ? r.appreciationPct : Number(r.appreciationPct);
    if (!brand || !model || !Number.isFinite(pct)) continue;
    movers.push({
      brand: brand.slice(0, 100),
      model: model.slice(0, 200),
      reference: typeof r.reference === "string" && r.reference.trim() ? r.reference.trim().slice(0, 100) : null,
      // Clamp to a sane range so a hallucinated outlier can't break the layout.
      appreciationPct: Math.max(-90, Math.min(500, Math.round(pct * 100) / 100)),
      period: typeof r.period === "string" && r.period.trim() ? r.period.trim().slice(0, 100) : "recentemente",
      editorialNote:
        typeof r.editorialNote === "string" && r.editorialNote.trim()
          ? r.editorialNote.trim().slice(0, 500)
          : null,
    });
  }

  if (movers.length === 0) {
    throw new Error("A IA não devolveu nenhum relógio.");
  }
  // Highest appreciation first.
  movers.sort((a, b) => b.appreciationPct - a.appreciationPct);
  return movers.slice(0, count);
}

/**
 * Generate a fresh Top-N and atomically replace the AI-managed rows in
 * watch_market_highlights. Manually-added rows (source !== AI sentinel) are
 * left untouched.
 */
export async function refreshAndSaveMovers(count = 10): Promise<number> {
  const movers = await generateMovers(count);

  await db.transaction(async (tx) => {
    // Remove the previous AI batch only.
    await tx.delete(watchMarketHighlights).where(eq(watchMarketHighlights.source, AI_MOVERS_SOURCE));
    await tx.insert(watchMarketHighlights).values(
      movers.map((m, i) => ({
        brand: m.brand,
        model: m.model,
        reference: m.reference,
        imageUrl: null,
        appreciationPct: m.appreciationPct.toString(),
        period: m.period,
        editorialNote: m.editorialNote,
        source: AI_MOVERS_SOURCE,
        displayOrder: i,
        active: true,
        updatedAt: new Date(),
      }))
    );
  });

  // The public /mercado page is ISR-cached (revalidate=3600); without this it
  // would keep serving the stale Top 10 for up to an hour after a refresh.
  revalidatePath("/mercado");

  return movers.length;
}

// ISO-week number — the deterministic "week of year" used for throttling and to
// pick a per-week day/category.
export function isoWeekNumber(d: Date): number {
  const date = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const dayNum = (date.getUTCDay() + 6) % 7;
  date.setUTCDate(date.getUTCDate() - dayNum + 3);
  const firstThursday = date.getTime();
  date.setUTCMonth(0, 1);
  if (date.getUTCDay() !== 4) {
    date.setUTCMonth(0, 1 + ((4 - date.getUTCDay()) + 7) % 7);
  }
  return 1 + Math.ceil((firstThursday - date.getTime()) / 604800000);
}

// ISO-week key like "2026-W25" — used to throttle the job to once per week.
// The year component is the ISO year (year of that week's Thursday), preserving
// the original behaviour.
export function isoWeekKey(d: Date): string {
  const date = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const dayNum = (date.getUTCDay() + 6) % 7;
  date.setUTCDate(date.getUTCDate() - dayNum + 3);
  return `${date.getUTCFullYear()}-W${isoWeekNumber(d)}`;
}

export type MoversRefreshResult =
  | { status: "skipped"; reason: string }
  | { status: "generated"; count: number };

/**
 * Weekly guard used by the daily cron: only refreshes once per ISO week, and
 * only when the feature is enabled. `weekKey` is passed in so the caller controls
 * the calendar (keeps this testable / deterministic).
 */
export async function maybeRefreshWeeklyMovers(weekKey: string): Promise<MoversRefreshResult> {
  if ((await getSetting("movers_auto_enabled")) !== "true") {
    return { status: "skipped", reason: "disabled" };
  }
  if ((await getSetting("movers_auto_last_week")) === weekKey) {
    return { status: "skipped", reason: "already-done" };
  }
  const count = await refreshAndSaveMovers(10);
  await setSetting("movers_auto_last_week", weekKey);
  return { status: "generated", count };
}

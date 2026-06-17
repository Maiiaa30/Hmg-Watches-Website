import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, logAudit } from "@/lib/auth/utils";
import { generateBlogSchema } from "@/lib/validations/blog";
import { generateAndSaveBlogPost, friendlyGenError } from "@/lib/ai/create-post";
import { blogGenerateRatelimit, getClientIp } from "@/lib/security/rate-limit";
import type { ApiResponse } from "@/types";

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);

  // Cost-protection rate limit (production only — in dev there's no real IP,
  // so all requests share one bucket and block local testing)
  if (process.env.NODE_ENV === "production" && blogGenerateRatelimit) {
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

  let created;
  try {
    created = await generateAndSaveBlogPost(category, topic);
  } catch (err) {
    return NextResponse.json<ApiResponse>({ success: false, error: friendlyGenError(err) }, { status: 502 });
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

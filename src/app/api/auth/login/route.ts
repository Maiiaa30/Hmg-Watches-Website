import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { loginRatelimit, getClientIp } from "@/lib/security/rate-limit";
import { logAudit } from "@/lib/auth/utils";
import type { ApiResponse } from "@/types";

// Server-side admin login so we can rate-limit by IP (OWASP A07 / brute force)
// and audit-log attempts. The browser posts here instead of calling Supabase
// directly. Sign-in cookies are written onto the response (Supabase SSR pattern,
// same as the middleware).
export async function POST(request: NextRequest) {
  const ip = getClientIp(request);

  // 5 attempts / 15 min per IP (no-op if Upstash isn't configured).
  if (loginRatelimit) {
    const { success } = await loginRatelimit.limit(ip);
    if (!success) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Demasiadas tentativas. Tente novamente dentro de alguns minutos." },
        { status: 429 }
      );
    }
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json<ApiResponse>({ success: false, error: "Pedido inválido." }, { status: 400 });
  }
  const email = typeof (body as { email?: unknown })?.email === "string" ? (body as { email: string }).email : "";
  const password = typeof (body as { password?: unknown })?.password === "string" ? (body as { password: string }).password : "";
  if (!email || !password) {
    return NextResponse.json<ApiResponse>({ success: false, error: "Credenciais inválidas." }, { status: 400 });
  }

  // Response that carries the auth cookies Supabase sets on success.
  let response = NextResponse.json<ApiResponse>({ success: true });
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    }
  );

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    // Audit the failed attempt (email only — never the password).
    try {
      await logAudit({ action: "auth.login_failed", entity: "admin", adminEmail: email.slice(0, 120), request });
    } catch {
      // best-effort
    }
    // Generic message — never reveal whether the email exists (OWASP A07).
    return NextResponse.json<ApiResponse>({ success: false, error: "Credenciais inválidas." }, { status: 401 });
  }

  try {
    await logAudit({ action: "auth.login", entity: "admin", adminEmail: email.slice(0, 120), request });
  } catch {
    // best-effort
  }

  return response;
}

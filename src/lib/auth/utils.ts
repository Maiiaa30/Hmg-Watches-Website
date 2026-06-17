import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { auditLogs } from "@/lib/db/schema";

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {}
        },
      },
    }
  );
}

/**
 * Returns the authenticated user, verified against the Supabase Auth server.
 * Use this server-side instead of getSession(), whose data comes straight
 * from cookies and may not be authentic (OWASP A01).
 */
export async function getUser() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function requireAdmin() {
  const user = await getUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return { user };
}

export async function logAudit({
  action,
  entity,
  entityId,
  adminEmail,
  request,
}: {
  action: string;
  entity: string;
  entityId?: string;
  adminEmail: string;
  request: Request;
}) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const userAgent = request.headers.get("user-agent") ?? "unknown";

  await db.insert(auditLogs).values({
    action,
    entity,
    entityId: entityId ?? null,
    adminEmail,
    ipAddress: ip,
    userAgent,
  });
}

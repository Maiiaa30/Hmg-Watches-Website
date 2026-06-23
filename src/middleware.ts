import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Vercel routes through a proxy, so the public host is in x-forwarded-host.
  const host = (
    request.headers.get("x-forwarded-host") ??
    request.headers.get("host") ??
    ""
  ).toLowerCase();
  const { pathname } = request.nextUrl;

  // Optional dedicated admin subdomain, e.g. ADMIN_HOST="admin.hmgwatches.com".
  // Unset in local dev → admin stays at /admin as usual.
  const adminHost = process.env.ADMIN_HOST?.trim().toLowerCase();

  // ---- Owner preview unlock ----
  // Visiting any page with ?preview=<MAINTENANCE_SECRET> arms the hmg_preview
  // cookie. Works for BOTH the env-var maintenance (below) and the admin-toggled
  // maintenance (checked in the public layout).
  const maintSecret = process.env.MAINTENANCE_SECRET;
  if (maintSecret && request.nextUrl.searchParams.get("preview") === maintSecret) {
    const clean = request.nextUrl.clone();
    clean.searchParams.delete("preview");
    const res = NextResponse.redirect(clean);
    res.cookies.set("hmg_preview", maintSecret, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
    return res;
  }

  // ---- Maintenance gate via env var (hard override, returns 503) ----
  // MAINTENANCE_MODE="true" hides the public site from everyone except an
  // unlocked preview. The admin-toggle equivalent is handled in the public
  // layout (Edge middleware can't read the database).
  if (process.env.MAINTENANCE_MODE === "true") {
    const isAdminArea =
      pathname.startsWith("/admin") ||
      pathname.startsWith("/api") ||
      (!!adminHost && host === adminHost);

    if (!isAdminArea) {
      const unlocked = !!maintSecret && request.cookies.get("hmg_preview")?.value === maintSecret;
      if (!unlocked) {
        return new NextResponse(maintenanceHtml(), {
          status: 503,
          headers: { "content-type": "text/html; charset=utf-8", "retry-after": "3600" },
        });
      }
    }
  }

  if (adminHost) {
    // On the admin subdomain, the bare root serves the dashboard.
    if (host === adminHost && pathname === "/") {
      const url = request.nextUrl.clone();
      url.pathname = "/admin";
      return NextResponse.rewrite(url);
    }
    // The admin lives ONLY on the subdomain: /admin on the main domain 404s
    // (no redirect — it's hidden, not advertised).
    if (host !== adminHost && pathname.startsWith("/admin")) {
      const url = request.nextUrl.clone();
      url.pathname = "/_not-found";
      return NextResponse.rewrite(url);
    }
  }

  // Only the admin area and protected APIs need the auth round-trip.
  const needsAuth =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api/relogios") ||
    pathname.startsWith("/api/blog") ||
    pathname.startsWith("/api/upload") ||
    pathname.startsWith("/api/mercado/relogios-alta") ||
    pathname.startsWith("/api/analytics");
  if (!needsAuth) {
    return NextResponse.next();
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Validate the user against the Supabase Auth server (not just cookies)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Optional email allowlist: when ADMIN_EMAILS is set, an authenticated user
  // whose email isn't listed is treated as unauthenticated (no access), so the
  // existing no-user redirect/deny logic below applies. Unset → any user passes.
  const allowlistRaw = process.env.ADMIN_EMAILS;
  let effectiveUser = user;
  if (user && allowlistRaw && allowlistRaw.trim() !== "") {
    const allowed = allowlistRaw
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);
    if (!allowed.includes(user.email?.toLowerCase() ?? "")) {
      effectiveUser = null;
    }
  }

  // Protect all /admin routes (except /admin/login)
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    if (!effectiveUser) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/admin/login";
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Redirect logged-in admin away from login page
  if (pathname === "/admin/login" && effectiveUser) {
    const adminUrl = request.nextUrl.clone();
    adminUrl.pathname = "/admin";
    return NextResponse.redirect(adminUrl);
  }

  return response;
}

function maintenanceHtml(): string {
  return `<!doctype html>
<html lang="pt"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Em manutenção — HMG Watches</title></head>
<body style="margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#ece6d8;font-family:Georgia,'Times New Roman',serif;color:#2a2418;text-align:center;padding:24px;">
  <div style="max-width:480px;">
    <div style="font-size:30px;font-weight:bold;">HMG <span style="font-size:12px;letter-spacing:0.34em;color:#8a6a1f;font-family:Arial,Helvetica,sans-serif;">WATCHES</span></div>
    <h1 style="font-size:28px;font-weight:normal;margin:28px 0 14px;">Em manutenção</h1>
    <p style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.7;color:#6f6757;margin:0;">
      Estamos a preparar algo especial. Voltamos em breve.
    </p>
  </div>
</body></html>`;
}

export const config = {
  // Run on everything except static assets (so maintenance/admin/auth logic
  // can gate any public page).
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.png|apple-icon.png|robots.txt|sitemap.xml|.*\\.(?:png|jpe?g|gif|svg|webp|ico|css|js|woff2?)$).*)",
  ],
};

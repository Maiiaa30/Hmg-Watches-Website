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

  if (adminHost) {
    // On the admin subdomain, the bare root serves the dashboard.
    if (host === adminHost && pathname === "/") {
      const url = request.nextUrl.clone();
      url.pathname = "/admin";
      return NextResponse.rewrite(url);
    }
    // The admin lives ONLY on the subdomain: send any /admin on the main
    // domain over to admin.<domain>.
    if (host !== adminHost && pathname.startsWith("/admin")) {
      return NextResponse.redirect(`https://${adminHost}${pathname}${request.nextUrl.search}`);
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

  // Protect all /admin routes (except /admin/login)
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    if (!user) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/admin/login";
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Redirect logged-in admin away from login page
  if (pathname === "/admin/login" && user) {
    const adminUrl = request.nextUrl.clone();
    adminUrl.pathname = "/admin";
    return NextResponse.redirect(adminUrl);
  }

  return response;
}

export const config = {
  matcher: [
    "/",
    "/admin/:path*",
    "/api/relogios/:path*",
    "/api/blog/:path*",
    "/api/upload/:path*",
    "/api/mercado/relogios-alta/:path*",
    "/api/analytics/:path*",
  ],
};

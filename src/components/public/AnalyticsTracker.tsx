"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackView } from "@/lib/analytics/client";

// Watch and blog detail pages report their own view (with watchId/blogPostId)
// via <DetailAnalytics>, so the global tracker skips them to avoid double counts.
const DETAIL_ROUTE = /^\/(catalogo|blog)\/[^/]+$/;

/** Records an anonymous page view on every public route change. */
export function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin") || DETAIL_ROUTE.test(pathname)) return;
    trackView({ page: pathname });
  }, [pathname]);

  return null;
}

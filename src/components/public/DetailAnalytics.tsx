"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackView } from "@/lib/analytics/client";

/**
 * Reports a page view for a watch or blog detail page, including the entity id
 * so the admin dashboard's "most viewed" rankings can populate. Mounted on the
 * detail pages; the global AnalyticsTracker skips these routes.
 */
export function DetailAnalytics({
  watchId,
  blogPostId,
}: {
  watchId?: string;
  blogPostId?: string;
}) {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;
    trackView({ page: pathname, watchId, blogPostId });
  }, [pathname, watchId, blogPostId]);

  return null;
}

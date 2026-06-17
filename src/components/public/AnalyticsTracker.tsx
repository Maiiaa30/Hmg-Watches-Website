"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

function getSessionId(): string {
  try {
    let id = localStorage.getItem("hmg_sid");
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("hmg_sid", id);
    }
    return id;
  } catch {
    // Storage blocked — fall back to a per-load id
    return crypto.randomUUID();
  }
}

function getDeviceType(): "desktop" | "mobile" | "tablet" {
  const ua = navigator.userAgent;
  if (/iPad|Tablet/i.test(ua) || (window.innerWidth >= 640 && window.innerWidth < 1024)) return "tablet";
  if (/Mobi|Android|iPhone/i.test(ua) || window.innerWidth < 640) return "mobile";
  return "desktop";
}

/** Records an anonymous page view on every public route change. */
export function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;
    fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        page: pathname,
        sessionId: getSessionId(),
        deviceType: getDeviceType(),
      }),
      keepalive: true,
    }).catch(() => {});
  }, [pathname]);

  return null;
}

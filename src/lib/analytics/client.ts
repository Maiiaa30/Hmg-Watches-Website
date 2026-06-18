// Client-side analytics helpers (browser-only: use localStorage / navigator).
// Shared by the global AnalyticsTracker and the detail-page tracker so the
// session id + device detection logic lives in one place.

export function getSessionId(): string {
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

export function getDeviceType(): "desktop" | "mobile" | "tablet" {
  const ua = navigator.userAgent;
  if (/iPad|Tablet/i.test(ua) || (window.innerWidth >= 640 && window.innerWidth < 1024)) return "tablet";
  if (/Mobi|Android|iPhone/i.test(ua) || window.innerWidth < 640) return "mobile";
  return "desktop";
}

interface TrackPayload {
  page: string;
  watchId?: string;
  blogPostId?: string;
}

/** Fire-and-forget anonymous page-view beacon. */
export function trackView({ page, watchId, blogPostId }: TrackPayload): void {
  fetch("/api/analytics/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      page,
      watchId,
      blogPostId,
      sessionId: getSessionId(),
      deviceType: getDeviceType(),
    }),
    keepalive: true,
  }).catch(() => {});
}

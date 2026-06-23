"use client";

import { useEffect, useState } from "react";
import { getRecentWatches, type RecentWatch } from "@/lib/recently-viewed";
import { WatchCard } from "@/components/public/WatchCard";
import { getDict, type Locale } from "@/lib/i18n";

/**
 * A discreet "recently viewed" strip rendered from localStorage. Renders nothing
 * until mounted (avoids SSR/client mismatch) and nothing when the list is empty.
 */
export function RecentlyViewed({
  excludeSlug,
  title,
  locale = "en",
}: {
  excludeSlug?: string;
  title?: string;
  locale?: Locale;
}) {
  const t = getDict(locale);
  const resolvedTitle = title ?? t.catalog.recentlyViewed;
  const [items, setItems] = useState<RecentWatch[] | null>(null);

  useEffect(() => {
    setItems(getRecentWatches().filter((w) => w.slug !== excludeSlug).slice(0, 4));
  }, [excludeSlug]);

  if (!items || items.length === 0) return null;

  return (
    <section style={{ marginTop: 96 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginBottom: 40,
          paddingBottom: 20,
          borderBottom: "1px solid var(--border-subtle)",
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-ui)",
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--text-tertiary)",
          }}
        >
          {resolvedTitle}
        </h2>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: "var(--gap-card)",
        }}
      >
        {items.map((w) => (
          <WatchCard key={w.slug} watch={w} locale={locale} />
        ))}
      </div>
    </section>
  );
}

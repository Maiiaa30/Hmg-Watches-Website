import type { WatchStatus, BlogStatus } from "@/types";
import { STATUS_I18N, type Locale } from "@/lib/i18n";

interface BadgeProps {
  status: WatchStatus | BlogStatus | "archived";
  children?: React.ReactNode;
  locale?: Locale;
}

const statusStyles: Record<string, React.CSSProperties> = {
  available: {
    background: "var(--status-available-bg)",
    color: "var(--status-available-fg)",
  },
  sold: {
    background: "var(--status-sold-bg)",
    color: "var(--status-sold-fg)",
  },
  archived: {
    background: "#f0f0ee",
    color: "#888",
  },
  draft: {
    background: "#f0f0ee",
    color: "#888",
  },
  pending_approval: {
    background: "#FEF3C7",
    color: "#92400E",
  },
  published: {
    background: "var(--status-available-bg)",
    color: "var(--status-available-fg)",
  },
};

export function Badge({ status, children, locale = "pt" }: BadgeProps) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "3px 10px",
        borderRadius: "var(--radius-pill)",
        fontFamily: "var(--font-ui)",
        fontSize: 11,
        fontWeight: "var(--fw-medium)" as React.CSSProperties["fontWeight"],
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        ...(statusStyles[status] ?? statusStyles.archived),
      }}
    >
      {children ?? STATUS_I18N[locale][status] ?? status}
    </span>
  );
}

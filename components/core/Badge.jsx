import React from "react";

/**
 * HMG Watches — Badge
 * Discreet status pills: availability and market trend.
 */
export function Badge({ variant = "available", children, style = {}, ...rest }) {
  const variants = {
    available: {
      background: "var(--status-available-bg)",
      color: "var(--status-available-fg)",
      label: "Disponível",
    },
    sold: {
      background: "var(--status-sold-bg)",
      color: "var(--status-sold-fg)",
      label: "Vendido",
    },
    gold: {
      background: "transparent",
      color: "var(--accent)",
      border: "1px solid var(--accent)",
      label: "",
    },
    up: {
      background: "rgba(125, 184, 125, 0.12)",
      color: "var(--trend-up)",
      label: "",
    },
    down: {
      background: "rgba(201, 122, 106, 0.12)",
      color: "var(--trend-down)",
      label: "",
    },
  };

  const v = variants[variant] || variants.available;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "5px 11px",
        fontFamily: "var(--font-ui)",
        fontSize: "11px",
        fontWeight: "var(--fw-medium)",
        letterSpacing: "var(--ls-wide)",
        textTransform: "uppercase",
        borderRadius: "var(--radius-pill)",
        background: v.background,
        color: v.color,
        border: v.border || "none",
        whiteSpace: "nowrap",
        ...style,
      }}
      {...rest}
    >
      {variant === "available" && <Dot color="var(--status-available-fg)" />}
      {children || v.label}
    </span>
  );
}

function Dot({ color }) {
  return (
    <span
      style={{
        width: "6px",
        height: "6px",
        borderRadius: "50%",
        background: color,
        display: "inline-block",
      }}
    />
  );
}

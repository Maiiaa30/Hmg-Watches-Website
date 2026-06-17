import React from "react";

/**
 * HMG Watches — Overline / eyebrow label.
 * Small uppercase gold label with generous tracking. Used above headings.
 */
export function Overline({ children, color = "var(--accent)", style = {}, ...rest }) {
  return (
    <span
      style={{
        display: "inline-block",
        fontFamily: "var(--font-ui)",
        fontSize: "var(--fs-overline)",
        fontWeight: "var(--fw-medium)",
        letterSpacing: "var(--ls-wider)",
        textTransform: "uppercase",
        color,
        ...style,
      }}
      {...rest}
    >
      {children}
    </span>
  );
}

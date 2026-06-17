import React from "react";

/**
 * HMG Watches — Button
 * Public site uses GHOST buttons only: thin border, transparent fill,
 * fills with the border colour on hover. Solid variant is reserved for
 * the admin panel where operational clarity matters.
 */
export function Button({
  children,
  variant = "ghost-gold",
  size = "md",
  as = "button",
  href,
  fullWidth = false,
  disabled = false,
  iconLeft = null,
  iconRight = null,
  style = {},
  ...rest
}) {
  const sizes = {
    sm: { padding: "10px 20px", fontSize: "12px" },
    md: { padding: "15px 32px", fontSize: "13px" },
    lg: { padding: "19px 44px", fontSize: "14px" },
  };

  const variants = {
    "ghost-gold": {
      color: "var(--accent)",
      border: "1px solid var(--accent)",
      background: "transparent",
      "--hover-bg": "var(--accent)",
      "--hover-fg": "var(--text-on-gold)",
    },
    "ghost-light": {
      color: "var(--text-primary)",
      border: "1px solid var(--border-on-dark)",
      background: "transparent",
      "--hover-bg": "var(--text-primary)",
      "--hover-fg": "var(--bg-page)",
    },
    // Admin only — solid fill for operational clarity
    solid: {
      color: "var(--text-on-gold)",
      border: "1px solid var(--accent)",
      background: "var(--accent)",
      "--hover-bg": "var(--accent-hover)",
      "--hover-fg": "var(--text-on-gold)",
    },
  };

  const base = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    width: fullWidth ? "100%" : "auto",
    fontFamily: "var(--font-ui)",
    fontWeight: "var(--fw-medium)",
    letterSpacing: "var(--ls-wide)",
    textTransform: "uppercase",
    borderRadius: "var(--radius-sm)",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.4 : 1,
    transition: "background var(--dur-base) var(--ease-out), color var(--dur-base) var(--ease-out), border-color var(--dur-base) var(--ease-out)",
    whiteSpace: "nowrap",
    ...sizes[size],
    ...variants[variant],
    ...style,
  };

  const onEnter = (e) => {
    if (disabled) return;
    const v = variants[variant];
    e.currentTarget.style.background = v["--hover-bg"];
    e.currentTarget.style.color = v["--hover-fg"];
    e.currentTarget.style.borderColor = v["--hover-bg"];
  };
  const onLeave = (e) => {
    if (disabled) return;
    const v = variants[variant];
    e.currentTarget.style.background = v.background;
    e.currentTarget.style.color = v.color;
    e.currentTarget.style.borderColor = v.border.split(" ").pop();
  };

  const Tag = href ? "a" : as;
  return (
    <Tag
      href={href}
      style={base}
      disabled={disabled && !href ? true : undefined}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      {...rest}
    >
      {iconLeft}
      {children}
      {iconRight}
    </Tag>
  );
}

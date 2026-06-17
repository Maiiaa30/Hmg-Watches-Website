import React from "react";

/**
 * HMG Watches — Card surface.
 * A quiet charcoal surface with a hairline border. The showcase, not the show.
 */
export function Card({ children, padding = "var(--pad-card)", interactive = false, style = {}, ...rest }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div
      onMouseEnter={() => interactive && setHover(true)}
      onMouseLeave={() => interactive && setHover(false)}
      style={{
        background: "var(--surface-card)",
        border: "1px solid var(--border-subtle)",
        borderColor: hover ? "var(--accent)" : "var(--border-subtle)",
        borderRadius: "var(--radius-md)",
        padding,
        transition: "border-color var(--dur-base) var(--ease-out), transform var(--dur-base) var(--ease-out)",
        transform: hover ? "translateY(-4px)" : "none",
        cursor: interactive ? "pointer" : "default",
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}

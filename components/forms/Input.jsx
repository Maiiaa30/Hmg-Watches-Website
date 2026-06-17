import React from "react";

/**
 * HMG Watches — Input (text field).
 * Quiet underline-on-dark field with a gold focus state.
 */
export function Input({ label, hint, type = "text", style = {}, id, ...rest }) {
  const [focus, setFocus] = React.useState(false);
  const inputId = id || `in-${Math.random().toString(36).slice(2, 8)}`;
  return (
    <label htmlFor={inputId} style={{ display: "block", ...style }}>
      {label && (
        <span
          style={{
            display: "block",
            marginBottom: "8px",
            fontFamily: "var(--font-ui)",
            fontSize: "11px",
            fontWeight: "var(--fw-medium)",
            letterSpacing: "var(--ls-wider)",
            textTransform: "uppercase",
            color: "var(--text-secondary)",
          }}
        >
          {label}
        </span>
      )}
      <input
        id={inputId}
        type={type}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        style={{
          width: "100%",
          padding: "13px 0",
          background: "transparent",
          border: "none",
          borderBottom: `1px solid ${focus ? "var(--accent)" : "var(--border-strong)"}`,
          color: "var(--text-primary)",
          fontFamily: "var(--font-ui)",
          fontSize: "16px",
          outline: "none",
          transition: "border-color var(--dur-base) var(--ease-out)",
        }}
        {...rest}
      />
      {hint && (
        <span style={{ display: "block", marginTop: "6px", fontSize: "12px", color: "var(--text-tertiary)" }}>
          {hint}
        </span>
      )}
    </label>
  );
}

import React from "react";

/**
 * HMG Watches — Checkbox.
 * Square hairline box that fills gold when checked. Used in catalogue filters.
 */
export function Checkbox({ label, checked, onChange, style = {}, ...rest }) {
  return (
    <label
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "12px",
        cursor: "pointer",
        fontFamily: "var(--font-ui)",
        fontSize: "14px",
        color: "var(--text-secondary)",
        ...style,
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        style={{ position: "absolute", opacity: 0, width: 0, height: 0 }}
        {...rest}
      />
      <span
        style={{
          width: "16px",
          height: "16px",
          flexShrink: 0,
          border: `1px solid ${checked ? "var(--accent)" : "var(--border-strong)"}`,
          background: checked ? "var(--accent)" : "transparent",
          borderRadius: "var(--radius-sm)",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all var(--dur-fast) var(--ease-out)",
          color: "var(--text-on-gold)",
          fontSize: "11px",
        }}
      >
        {checked && "✓"}
      </span>
      {label}
    </label>
  );
}

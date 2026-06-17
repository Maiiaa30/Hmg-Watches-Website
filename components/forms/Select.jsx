import React from "react";

/**
 * HMG Watches — Select.
 * Matches the underline field aesthetic.
 */
export function Select({ label, options = [], style = {}, id, ...rest }) {
  const [focus, setFocus] = React.useState(false);
  const selId = id || `sel-${Math.random().toString(36).slice(2, 8)}`;
  return (
    <label htmlFor={selId} style={{ display: "block", ...style }}>
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
      <div style={{ position: "relative" }}>
        <select
          id={selId}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          style={{
            width: "100%",
            padding: "13px 28px 13px 0",
            background: "transparent",
            border: "none",
            borderBottom: `1px solid ${focus ? "var(--accent)" : "var(--border-strong)"}`,
            color: "var(--text-primary)",
            fontFamily: "var(--font-ui)",
            fontSize: "16px",
            outline: "none",
            appearance: "none",
            cursor: "pointer",
            transition: "border-color var(--dur-base) var(--ease-out)",
          }}
          {...rest}
        >
          {options.map((o) => (
            <option key={o.value ?? o} value={o.value ?? o} style={{ background: "var(--surface-raised)" }}>
              {o.label ?? o}
            </option>
          ))}
        </select>
        <span
          style={{
            position: "absolute",
            right: "2px",
            top: "50%",
            transform: "translateY(-50%)",
            pointerEvents: "none",
            color: "var(--accent)",
            fontSize: "12px",
          }}
        >
          ▾
        </span>
      </div>
    </label>
  );
}

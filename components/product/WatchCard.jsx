import React from "react";
import { Badge } from "../core/Badge.jsx";
/**
 * HMG Watches — WatchCard
 * The signature product card. The watch floats on a quiet surface with
 * generous space around it. Brand + model in clear hierarchy, reference in
 * smaller text, price in EUR, discreet availability badge.
 */
export function WatchCard({
  image,
  brand = "Marca",
  model = "Modelo",
  reference = "",
  price = "",
  status = "available",       // "available" | "sold"
  appreciation = "",           // e.g. "+23% em 6 meses" — shows a gold trend badge
  visual = null,               // optional ReactNode rendered in the image bay (placeholder art)
  onClick,
  style = {},
}) {
  const [hover, setHover] = React.useState(false);
  const sold = status === "sold";

  return (
    <article
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: "var(--surface-card)",
        border: "1px solid",
        borderColor: hover ? "var(--accent)" : "var(--border-subtle)",
        borderRadius: "var(--radius-md)",
        overflow: "hidden",
        cursor: onClick ? "pointer" : "default",
        transition: "border-color var(--dur-base) var(--ease-out), transform var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out)",
        transform: hover ? "translateY(-6px)" : "none",
        boxShadow: hover ? "var(--shadow-card)" : "var(--shadow-soft)",
        display: "flex",
        flexDirection: "column",
        ...style,
      }}
    >
      {/* Image bay */}
      {image ? (
        /* Real photo — clean full-bleed image */
        <div style={{ position: "relative", aspectRatio: "4 / 5", overflow: "hidden", background: "var(--surface-sunken)" }}>
          {appreciation && (
            <span style={{ position: "absolute", top: "16px", left: "16px", zIndex: 3 }}>
              <Badge variant="gold">{appreciation}</Badge>
            </span>
          )}
          <span style={{ position: "absolute", top: "16px", right: "16px", zIndex: 3 }}>
            <Badge variant={sold ? "sold" : "available"} />
          </span>
          <img src={image} alt={`${brand} ${model}`} style={{
            width: "100%", height: "100%", objectFit: "cover", objectPosition: "center",
            filter: sold ? "grayscale(0.55) opacity(0.82)" : "none",
            transform: hover ? "scale(1.04)" : "scale(1)",
            transition: "transform var(--dur-slow) var(--ease-out)",
          }} />
        </div>
      ) : (
        /* No photo yet — watch sits inside a gold-lined display arch */
        <div
          style={{
            position: "relative",
            aspectRatio: "4 / 5",
            background: "var(--surface-raised)",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            padding: "12% 14% 0",
            overflow: "hidden",
          }}
        >
          <div style={{
            position: "absolute", left: "14%", right: "14%", bottom: 0, top: "10%",
            background: "linear-gradient(180deg, #FFFFFF 0%, #F6F0E4 100%)",
            borderRadius: "999px 999px 6px 6px",
            border: "1px solid var(--border-subtle)",
            borderBottom: "none",
            boxShadow: "inset 0 2px 14px rgba(40,33,20,0.04)",
          }} />
          <div style={{
            position: "absolute", left: "17%", right: "17%", bottom: 0, top: "14%",
            borderRadius: "999px 999px 4px 4px",
            border: "1px solid",
            borderColor: hover ? "var(--accent)" : "rgba(182,138,46,0.28)",
            borderBottom: "none",
            transition: "border-color var(--dur-base) var(--ease-out)",
            pointerEvents: "none",
          }} />
          <span style={{ position: "absolute", top: "16px", right: "16px", zIndex: 3 }}>
            <Badge variant={sold ? "sold" : "available"} />
          </span>
          <div style={{ position: "relative", zIndex: 2, width: "100%", display: "flex", justifyContent: "center", alignItems: "center", paddingBottom: "16%", transform: hover ? "translateY(-6px)" : "none", transition: "transform var(--dur-slow) var(--ease-out)" }}>
            {visual ? (
              <div style={{ width: "70%", display: "flex", justifyContent: "center" }}>{visual}</div>
            ) : (
              <div style={{ color: "var(--text-tertiary)", fontSize: "12px", letterSpacing: "var(--ls-wide)", textTransform: "uppercase", paddingBottom: "30%" }}>
                Fotografia
              </div>
            )}
          </div>
        </div>
      )}

      {/* Meta */}
      <div style={{ padding: "var(--sp-5) var(--sp-5) var(--sp-6)", display: "flex", flexDirection: "column", gap: "6px" }}>
        <div style={{ fontFamily: "var(--font-ui)", fontSize: "11px", letterSpacing: "var(--ls-wider)", textTransform: "uppercase", color: "var(--text-secondary)" }}>
          {brand}
        </div>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: "21px", fontWeight: "var(--fw-regular)", color: "var(--text-primary)", lineHeight: 1.2 }}>
          {model}
        </h3>
        {reference && (
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--text-tertiary)" }}>
            Ref. {reference}
          </div>
        )}
        <div style={{ marginTop: "12px", fontFamily: "var(--font-ui)", fontSize: "18px", color: sold ? "var(--text-tertiary)" : "var(--text-primary)" }}>
          {price}
        </div>
      </div>
    </article>
  );
}

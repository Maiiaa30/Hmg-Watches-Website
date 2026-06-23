// Reusable shimmer skeleton pieces (server components — no client JS).
// Use the .hmg-skeleton class from globals.css (respects prefers-reduced-motion).

export function SkelLine({
  w = "100%",
  h = 14,
  mb = 0,
  radius = 4,
}: {
  w?: string | number;
  h?: number;
  mb?: number;
  radius?: number;
}) {
  return <div className="hmg-skeleton" style={{ width: w, height: h, marginBottom: mb, borderRadius: radius }} />;
}

export function SkelBlock({
  aspect,
  h,
  radius = 8,
}: {
  aspect?: string;
  h?: number;
  radius?: number;
}) {
  return <div className="hmg-skeleton" style={{ width: "100%", aspectRatio: aspect, height: h, borderRadius: radius }} />;
}

/** Page header placeholder: overline + big title + subtitle line. */
export function SkelPageHeader({ center = false }: { center?: boolean }) {
  return (
    <div style={{ marginBottom: 56, textAlign: center ? "center" : "left" }}>
      <SkelLine w={90} h={12} mb={18} />
      <SkelLine w={center ? 320 : 280} h={44} mb={18} radius={6} />
      <SkelLine w={center ? 460 : 420} h={16} />
    </div>
  );
}

/** A grid of blog-article-card placeholders (cover + lines). */
export function SkelArticleGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="hmg-blog-grid">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="hmg-article-card">
          <div className="hmg-skeleton" style={{ aspectRatio: "16 / 10", borderRadius: 6 }} />
          <SkelLine w="40%" h={11} />
          <SkelLine w="90%" h={22} />
          <SkelLine w="100%" h={14} />
          <SkelLine w="75%" h={14} />
        </div>
      ))}
    </div>
  );
}

/** A responsive grid of watch-card placeholders (image + 3 text lines). */
export function SkelCardGrid({ count = 8 }: { count?: number }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
        gap: "var(--gap-card)",
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>
          <div className="hmg-skeleton" style={{ aspectRatio: "4 / 5", borderRadius: 0 }} />
          <div style={{ padding: "18px 4px 0" }}>
            <SkelLine w="55%" h={11} mb={12} />
            <SkelLine w="80%" h={18} mb={14} />
            <SkelLine w="35%" h={14} />
          </div>
        </div>
      ))}
    </div>
  );
}

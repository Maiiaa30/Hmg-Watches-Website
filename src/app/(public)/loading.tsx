import { SkelLine, SkelCardGrid } from "@/components/public/Skeletons";

// Homepage skeleton (hero + featured grid).
export default function HomeLoading() {
  return (
    <div>
      <section style={{ minHeight: "calc(100vh - 84px)", display: "flex", alignItems: "center", padding: "20px 0" }}>
        <div
          className="hmg-container hmg-stack"
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "center", width: "100%" }}
        >
          <div style={{ maxWidth: 560 }}>
            <SkelLine w={120} h={12} mb={26} />
            <SkelLine w="90%" h={54} mb={16} radius={6} />
            <SkelLine w="65%" h={54} mb={28} radius={6} />
            <SkelLine w={360} h={16} mb={38} />
            <div style={{ display: "flex", gap: 14 }}>
              <SkelLine w={150} h={46} radius={4} />
              <SkelLine w={150} h={46} radius={4} />
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div className="hmg-skeleton" style={{ width: "min(400px, 100%)", aspectRatio: "37 / 47", borderRadius: 8 }} />
          </div>
        </div>
      </section>
      <section style={{ borderTop: "1px solid var(--border-subtle)", padding: "120px 0" }}>
        <div className="hmg-container">
          <SkelLine w={220} h={36} mb={40} radius={6} />
          <SkelCardGrid count={4} />
        </div>
      </section>
    </div>
  );
}

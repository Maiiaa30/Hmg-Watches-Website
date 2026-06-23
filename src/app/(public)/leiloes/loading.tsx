import { SkelLine } from "@/components/public/Skeletons";

export default function LeiloesLoading() {
  return (
    <div style={{ padding: "var(--section-y) 0" }}>
      <div className="hmg-container" style={{ maxWidth: "var(--container-narrow)" }}>
        <div style={{ marginBottom: 64 }}>
          <SkelLine w={90} h={12} mb={18} />
          <SkelLine w={320} h={44} mb={18} radius={6} />
          <SkelLine w={500} h={16} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 22,
                padding: "22px 26px",
                border: "1px solid var(--border-subtle)",
                borderRadius: 8,
              }}
            >
              <div className="hmg-skeleton" style={{ width: 92, height: 92, borderRadius: 6, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <SkelLine w={140} h={11} mb={10} />
                <SkelLine w="70%" h={22} mb={10} />
                <SkelLine w="90%" h={14} />
              </div>
              <SkelLine w={100} h={14} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

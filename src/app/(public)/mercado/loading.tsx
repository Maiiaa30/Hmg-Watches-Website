import { SkelLine } from "@/components/public/Skeletons";

export default function MercadoLoading() {
  return (
    <div style={{ padding: "var(--section-y) 0" }}>
      <div className="hmg-container">
        <div style={{ marginBottom: 72 }}>
          <SkelLine w={90} h={12} mb={18} />
          <SkelLine w={300} h={44} mb={18} radius={6} />
          <SkelLine w={460} h={16} />
        </div>
        {/* metals chart block */}
        <div style={{ marginBottom: 80 }}>
          <SkelLine w={160} h={12} mb={36} />
          <div className="hmg-skeleton" style={{ width: "100%", height: 320, borderRadius: 8 }} />
        </div>
        {/* movers rows */}
        <div>
          <SkelLine w={180} h={12} mb={28} />
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 18,
                  padding: "16px 22px",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: 8,
                }}
              >
                <SkelLine w={20} h={18} />
                <div className="hmg-skeleton" style={{ width: 48, height: 48, borderRadius: 6, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <SkelLine w="40%" h={12} mb={8} />
                  <SkelLine w="60%" h={16} />
                </div>
                <SkelLine w={80} h={20} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

import { SkelLine } from "@/components/public/Skeletons";

export default function WatchDetailLoading() {
  return (
    <div style={{ padding: "60px 0 120px" }}>
      <div className="hmg-container">
        <SkelLine w={150} h={13} mb={20} />
        <SkelLine w={260} h={13} mb={48} />
        <div
          className="hmg-stack"
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--sp-10)", alignItems: "start" }}
        >
          {/* gallery */}
          <div className="hmg-skeleton" style={{ width: "100%", aspectRatio: "4 / 5", borderRadius: 8 }} />
          {/* info */}
          <div>
            <SkelLine w={120} h={12} mb={16} />
            <SkelLine w="80%" h={34} mb={16} radius={6} />
            <SkelLine w={160} h={22} mb={32} />
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: 24 }}>
                  <SkelLine w={120} h={14} />
                  <SkelLine w={120} h={14} />
                </div>
              ))}
            </div>
            <SkelLine w="100%" h={48} mb={0} radius={4} />
          </div>
        </div>
      </div>
    </div>
  );
}

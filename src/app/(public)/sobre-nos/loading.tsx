import { SkelLine } from "@/components/public/Skeletons";

export default function SobreLoading() {
  return (
    <div style={{ padding: "var(--section-y) 0" }}>
      <div className="hmg-container" style={{ maxWidth: "var(--container-narrow)" }}>
        <SkelLine w={90} h={12} mb={20} />
        <SkelLine w="80%" h={44} mb={12} radius={6} />
        <SkelLine w="55%" h={44} mb={36} radius={6} />
        {Array.from({ length: 6 }).map((_, i) => (
          <SkelLine key={i} w={i % 3 === 2 ? "60%" : "100%"} h={16} mb={14} />
        ))}
        <div
          className="hmg-stack"
          style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 40, marginTop: 80, paddingTop: 60, borderTop: "1px solid var(--border-subtle)" }}
        >
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i}>
              <SkelLine w={30} h={14} mb={12} />
              <SkelLine w="70%" h={20} mb={12} />
              <SkelLine w="100%" h={13} mb={8} />
              <SkelLine w="85%" h={13} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

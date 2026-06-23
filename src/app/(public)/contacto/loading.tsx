import { SkelLine } from "@/components/public/Skeletons";

export default function ContactoLoading() {
  return (
    <div style={{ padding: "var(--section-y) 0" }}>
      <div
        className="hmg-container hmg-stack"
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 90, alignItems: "start" }}
      >
        <div>
          <SkelLine w={90} h={12} mb={20} />
          <SkelLine w="70%" h={44} mb={24} radius={6} />
          <SkelLine w="100%" h={16} mb={10} />
          <SkelLine w="80%" h={16} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <SkelLine key={i} w="100%" h={i === 3 ? 120 : 46} radius={6} />
          ))}
          <SkelLine w={160} h={46} radius={4} />
        </div>
      </div>
    </div>
  );
}

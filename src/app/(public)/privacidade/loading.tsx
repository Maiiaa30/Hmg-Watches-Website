import { SkelLine } from "@/components/public/Skeletons";

export default function LegalLoading() {
  return (
    <div style={{ padding: "var(--section-y) 0" }}>
      <div className="hmg-container" style={{ maxWidth: 720 }}>
        <SkelLine w={70} h={12} mb={18} />
        <SkelLine w="60%" h={40} mb={36} radius={6} />
        {Array.from({ length: 10 }).map((_, i) => (
          <SkelLine key={i} w={i % 5 === 4 ? "55%" : "100%"} h={15} mb={14} />
        ))}
      </div>
    </div>
  );
}

import { SkelLine, SkelArticleGrid } from "@/components/public/Skeletons";

export default function BlogLoading() {
  return (
    <div style={{ padding: "var(--section-y) 0" }}>
      <div className="hmg-container">
        {/* centered hero */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 44 }}>
          <SkelLine w={120} h={12} mb={20} />
          <SkelLine w={320} h={44} mb={18} radius={6} />
          <SkelLine w={460} h={16} />
        </div>
        {/* filter pills */}
        <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap", marginBottom: 56 }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <SkelLine key={i} w={90} h={36} radius={100} />
          ))}
        </div>
        <SkelArticleGrid count={6} />
      </div>
    </div>
  );
}

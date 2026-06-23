import { SkelLine } from "@/components/public/Skeletons";

export default function BlogArticleLoading() {
  return (
    <div>
      {/* hero cover */}
      <div className="hmg-skeleton" style={{ width: "100%", height: "min(46vh, 420px)", borderRadius: 0 }} />
      <div className="hmg-container" style={{ maxWidth: 760, padding: "48px var(--gutter) var(--section-y)" }}>
        <SkelLine w={140} h={12} mb={20} />
        <SkelLine w="90%" h={34} mb={14} radius={6} />
        <SkelLine w="70%" h={34} mb={36} radius={6} />
        {Array.from({ length: 10 }).map((_, i) => (
          <SkelLine key={i} w={i % 4 === 3 ? "60%" : "100%"} h={15} mb={14} />
        ))}
      </div>
    </div>
  );
}

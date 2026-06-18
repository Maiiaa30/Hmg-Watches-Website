// Shown while the catalogue streams in. Mirrors the card grid so there's no
// blank flash — ivory shimmer placeholders matching the 4/5 card ratio.
export default function CatalogoLoading() {
  return (
    <div style={{ padding: "var(--section-y) 0" }}>
      <div className="hmg-container">
        <div style={{ marginBottom: 64 }}>
          <span className="hmg-overline">Coleção</span>
          <div
            className="hmg-skeleton"
            style={{ height: 44, width: 280, marginTop: 16, borderRadius: 4 }}
          />
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: "var(--gap-card)",
          }}
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i}>
              <div className="hmg-skeleton" style={{ aspectRatio: "4 / 5" }} />
              <div style={{ padding: "18px 4px 0" }}>
                <div className="hmg-skeleton" style={{ height: 11, width: "55%", marginBottom: 12 }} />
                <div className="hmg-skeleton" style={{ height: 18, width: "80%", marginBottom: 14 }} />
                <div className="hmg-skeleton" style={{ height: 14, width: "35%" }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

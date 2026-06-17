/* HMG Watches — WatchVisual: a tasteful CSS placeholder standing in for real
   product photography (none supplied). Renders a floating watch face.
   Exposes window.WatchVisual. Replace with real PNGs via WatchCard's `image`. */
(function () {
  function WatchVisual({ hue = 210, size = "72%", sold = false }) {
    const metal = "linear-gradient(145deg, #d9d4c8 0%, #8c887e 30%, #f2eee4 52%, #6f6c64 74%, #cfcabd 100%)";
    const dial = `radial-gradient(120% 120% at 35% 25%, hsl(${hue} 16% 20%) 0%, hsl(${hue} 18% 11%) 60%, #0c0c0c 100%)`;
    const ring = (d) => ({
      position: "absolute", borderRadius: "50%", left: "50%", top: "50%",
      transform: "translate(-50%,-50%)", width: d, height: d,
    });
    return (
      <div style={{
        position: "relative", width: size, aspectRatio: "1 / 1",
        filter: sold ? "grayscale(0.7) brightness(0.85)" : "none",
      }}>
        {/* lugs */}
        <div style={{ position: "absolute", left: "50%", top: "-7%", transform: "translateX(-50%)", width: "30%", height: "22%", background: metal, borderRadius: "14% 14% 40% 40%" }} />
        <div style={{ position: "absolute", left: "50%", bottom: "-7%", transform: "translateX(-50%)", width: "30%", height: "22%", background: metal, borderRadius: "40% 40% 14% 14%" }} />
        {/* crown */}
        <div style={{ position: "absolute", right: "-4%", top: "50%", transform: "translateY(-50%)", width: "8%", height: "12%", background: metal, borderRadius: "30%" }} />
        {/* case */}
        <div style={{ ...ring("100%"), background: metal, boxShadow: "0 22px 46px rgba(40,33,20,0.28)" }} />
        {/* bezel */}
        <div style={{ ...ring("90%"), background: `conic-gradient(from 45deg, #6f6c64, #cfcabd, #8c887e, #f2eee4, #6f6c64)` }} />
        {/* dial */}
        <div style={{ ...ring("78%"), background: dial, boxShadow: "inset 0 2px 18px rgba(0,0,0,0.7)" }} />
        {/* markers */}
        {[0, 90, 180, 270].map((deg) => (
          <div key={deg} style={{ ...ring("78%"), transform: `translate(-50%,-50%) rotate(${deg}deg)`, pointerEvents: "none" }}>
            <div style={{ position: "absolute", left: "50%", top: "8%", transform: "translateX(-50%)", width: "5%", height: "9%", background: "var(--accent)", borderRadius: "2px", opacity: 0.9 }} />
          </div>
        ))}
        {/* hands */}
        <div style={{ ...ring("3%"), background: "var(--accent)", zIndex: 3 }} />
        <div style={{ position: "absolute", left: "50%", top: "50%", width: "2.5%", height: "30%", background: "#f5f5f0", transformOrigin: "bottom center", transform: "translate(-50%,-100%) rotate(38deg)", borderRadius: "3px", zIndex: 2 }} />
        <div style={{ position: "absolute", left: "50%", top: "50%", width: "2%", height: "38%", background: "#d9d4c8", transformOrigin: "bottom center", transform: "translate(-50%,-100%) rotate(-95deg)", borderRadius: "3px", zIndex: 2 }} />
      </div>
    );
  }
  window.WatchVisual = WatchVisual;
})();

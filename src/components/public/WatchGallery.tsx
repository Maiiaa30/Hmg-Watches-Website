"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

export function WatchGallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [zoomed, setZoomed] = useState(false);

  const count = images.length;
  const go = useCallback(
    (dir: number) => setActive((i) => (i + dir + count) % count),
    [count]
  );

  // Keyboard controls while the lightbox is open
  useEffect(() => {
    if (!lightbox) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setLightbox(false);
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    }
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox, go]);

  if (count === 0) {
    return (
      <div
        style={{
          position: "relative",
          aspectRatio: "4 / 5",
          background: "var(--bg-page-alt)",
          border: "1px solid var(--border-subtle)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--text-tertiary)",
          fontFamily: "var(--font-display)",
          fontStyle: "italic",
        }}
      >
        Sem imagem
      </div>
    );
  }

  return (
    <div>
      {/* Main image — click to open lightbox */}
      <div
        onClick={() => { setZoomed(false); setLightbox(true); }}
        style={{
          position: "relative",
          aspectRatio: "4 / 5",
          background: "var(--bg-page-alt)",
          marginBottom: 16,
          border: "1px solid var(--border-subtle)",
          overflow: "hidden",
          cursor: "zoom-in",
        }}
      >
        <Image
          src={images[active]!}
          alt={alt}
          fill
          style={{ objectFit: "cover", objectPosition: "center 42%" }}
          priority
          sizes="(max-width: 1200px) 50vw, 600px"
        />
        {/* Zoom hint */}
        <div
          style={{
            position: "absolute",
            bottom: 12,
            right: 12,
            background: "rgba(0,0,0,0.55)",
            color: "#fff",
            borderRadius: 999,
            padding: "6px 12px",
            fontSize: 11,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3M11 8v6M8 11h6" />
          </svg>
          Ampliar
        </div>
      </div>

      {/* Thumbnails */}
      {count > 1 && (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {images.slice(0, 6).map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`Ver imagem ${i + 1}`}
              style={{
                width: 72,
                height: 72,
                padding: 0,
                border: i === active ? "1px solid var(--accent)" : "1px solid var(--border-subtle)",
                overflow: "hidden",
                position: "relative",
                flexShrink: 0,
                cursor: "pointer",
                background: "none",
              }}
            >
              <Image src={img} alt={`Vista ${i + 1}`} fill style={{ objectFit: "cover" }} sizes="72px" />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          onClick={() => setLightbox(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.92)",
            zIndex: 2000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
          }}
        >
          {/* Close */}
          <button
            onClick={(e) => { e.stopPropagation(); setLightbox(false); }}
            aria-label="Fechar"
            style={{ position: "absolute", top: 18, right: 22, background: "none", border: "none", color: "#fff", cursor: "pointer", fontSize: 30, lineHeight: 1 }}
          >
            ×
          </button>

          {/* Prev / Next */}
          {count > 1 && (
            <>
              <button onClick={(e) => { e.stopPropagation(); setZoomed(false); go(-1); }} aria-label="Anterior" style={navBtn("left")}>‹</button>
              <button onClick={(e) => { e.stopPropagation(); setZoomed(false); go(1); }} aria-label="Seguinte" style={navBtn("right")}>›</button>
            </>
          )}

          {/* Image — click toggles zoom */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[active]!}
            alt={alt}
            onClick={(e) => { e.stopPropagation(); setZoomed((z) => !z); }}
            style={{
              maxWidth: zoomed ? "none" : "92vw",
              maxHeight: zoomed ? "none" : "88vh",
              width: zoomed ? "auto" : undefined,
              height: zoomed ? "150vh" : undefined,
              objectFit: "contain",
              cursor: zoomed ? "zoom-out" : "zoom-in",
              transition: "transform var(--dur-base) var(--ease-out)",
              borderRadius: 4,
            }}
          />

          {count > 1 && (
            <div style={{ position: "absolute", bottom: 20, left: 0, right: 0, textAlign: "center", color: "rgba(255,255,255,0.7)", fontSize: 13 }}>
              {active + 1} / {count}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function navBtn(side: "left" | "right"): React.CSSProperties {
  return {
    position: "absolute",
    [side]: 16,
    top: "50%",
    transform: "translateY(-50%)",
    background: "rgba(255,255,255,0.12)",
    border: "none",
    color: "#fff",
    width: 48,
    height: 48,
    borderRadius: "50%",
    cursor: "pointer",
    fontSize: 28,
    lineHeight: 1,
  };
}

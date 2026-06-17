"use client";

import { useEffect, useRef, useState } from "react";

export interface TypeSegment {
  text: string;
  style?: React.CSSProperties;
}

function toChars(segments: TypeSegment[]) {
  const chars: { ch: string; style?: React.CSSProperties }[] = [];
  for (const seg of segments) {
    for (const ch of seg.text) chars.push({ ch, style: seg.style });
  }
  return chars;
}

function renderChars(
  chars: { ch: string; style?: React.CSSProperties }[],
  withCursor: boolean
) {
  return (
    <>
      {chars.map((c, i) =>
        c.ch === "\n" ? <br key={i} /> : <span key={i} style={c.style}>{c.ch}</span>
      )}
      {withCursor && <span className="hmg-cursor">|</span>}
    </>
  );
}

/**
 * Types out styled segments character by character. `\n` becomes a line break.
 * With `startOnView`, typing begins when the element scrolls into view. A
 * hidden full-size placeholder reserves the final layout so there is no jump,
 * and the full text is exposed to screen readers.
 */
export function TypingText({
  segments,
  speed = 55,
  startDelay = 250,
  startOnView = false,
}: {
  segments: TypeSegment[];
  speed?: number;
  startDelay?: number;
  startOnView?: boolean;
}) {
  const chars = toChars(segments);
  const total = chars.length;
  const fullText = chars.map((c) => (c.ch === "\n" ? " " : c.ch)).join("");

  const [started, setStarted] = useState(!startOnView);
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  // Begin typing once scrolled into view (when startOnView)
  useEffect(() => {
    if (!startOnView || started) return;
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setStarted(true);
          obs.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [startOnView, started]);

  // Advance the typed character count
  useEffect(() => {
    if (!started || count >= total) return;
    const delay = count === 0 ? startDelay : speed;
    const id = setTimeout(() => setCount((c) => c + 1), delay);
    return () => clearTimeout(id);
  }, [started, count, total, speed, startDelay]);

  const done = count >= total;

  return (
    <span ref={ref} style={{ position: "relative", display: "inline-block" }}>
      {/* Invisible placeholder reserves the final size (no layout shift) */}
      <span aria-hidden="true" style={{ visibility: "hidden" }}>
        {renderChars(chars, false)}
      </span>
      {/* Animated typed text overlaid on top */}
      <span aria-hidden="true" style={{ position: "absolute", left: 0, top: 0, width: "100%" }}>
        {renderChars(chars.slice(0, count), started && !done)}
      </span>
      {/* Full text for screen readers / SEO */}
      <span style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>
        {fullText}
      </span>
    </span>
  );
}

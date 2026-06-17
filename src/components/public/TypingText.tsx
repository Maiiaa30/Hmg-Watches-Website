"use client";

import { useEffect, useState } from "react";

export interface TypeSegment {
  text: string;
  style?: React.CSSProperties;
}

/**
 * Types out a sequence of styled segments character by character on mount.
 * `\n` inside a segment renders as a line break. A blinking caret follows
 * the text while typing and disappears when finished.
 */
export function TypingText({
  segments,
  speed = 55,
  startDelay = 250,
}: {
  segments: TypeSegment[];
  speed?: number;
  startDelay?: number;
}) {
  // Flatten segments into a list of styled characters
  const chars: { ch: string; style?: React.CSSProperties }[] = [];
  for (const seg of segments) {
    for (const ch of seg.text) chars.push({ ch, style: seg.style });
  }
  const total = chars.length;

  const [count, setCount] = useState(0);

  useEffect(() => {
    if (count >= total) return;
    const delay = count === 0 ? startDelay : speed;
    const id = setTimeout(() => setCount((c) => c + 1), delay);
    return () => clearTimeout(id);
  }, [count, total, speed, startDelay]);

  const done = count >= total;
  const fullText = chars.map((c) => (c.ch === "\n" ? " " : c.ch)).join("");

  return (
    <>
      {/* Visible animated text (hidden from screen readers) */}
      <span aria-hidden="true">
        {chars.slice(0, count).map((c, i) =>
          c.ch === "\n" ? <br key={i} /> : <span key={i} style={c.style}>{c.ch}</span>
        )}
        {!done && <span className="hmg-cursor">|</span>}
      </span>
      {/* Full text for screen readers / SEO */}
      <span style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>
        {fullText}
      </span>
    </>
  );
}

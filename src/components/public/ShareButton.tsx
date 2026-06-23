"use client";

import { useState } from "react";
import { getDict, type Locale } from "@/lib/i18n";

export function ShareButton({ locale = "en" }: { locale?: Locale }) {
  const t = getDict(locale);
  const [copied, setCopied] = useState(false);

  async function share() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable — ignore
    }
  }

  return (
    <button onClick={share} className="hmg-ghost-btn hmg-ghost-btn--dark">
      <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}>
        {copied ? (
          <path d="M20 6L9 17l-5-5" />
        ) : (
          <>
            <path d="M10 13a5 5 0 007.5.5l3-3a5 5 0 00-7-7l-1.5 1.5" />
            <path d="M14 11a5 5 0 00-7.5-.5l-3 3a5 5 0 007 7l1.5-1.5" />
          </>
        )}
      </svg>
      {copied ? t.share.copied : t.share.label}
    </button>
  );
}

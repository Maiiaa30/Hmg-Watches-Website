"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { LOCALE_COOKIE, type Locale } from "@/lib/i18n";

/**
 * Switches the site language: sets the locale cookie and refreshes so the
 * server re-renders. Shows the language it will switch TO. The label flips
 * optimistically (instant feedback) while the refresh runs in a transition.
 */
export function LanguageToggle({
  locale,
  aria,
  block,
}: {
  locale: Locale;
  label?: string; // kept for compatibility; label is derived from locale
  aria: string;
  block?: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  // The code shown is the OTHER language. Optimistic value flips on click.
  const [shown, setShown] = useState<Locale>(locale);
  const code = shown === "en" ? "PT" : "EN";

  function toggle() {
    const next: Locale = shown === "en" ? "pt" : "en";
    setShown(next); // instant label flip
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
    startTransition(() => router.refresh());
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={aria}
      data-pending={isPending ? "true" : undefined}
      className={`hmg-lang-toggle${block ? " hmg-lang-toggle--block" : ""}`}
    >
      {code}
    </button>
  );
}

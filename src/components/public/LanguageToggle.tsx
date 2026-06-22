"use client";

import { useRouter } from "next/navigation";
import { LOCALE_COOKIE, type Locale } from "@/lib/i18n";

/**
 * Switches the site language by setting the locale cookie and refreshing so the
 * server re-renders in the new language. Shows the language it will switch TO.
 */
export function LanguageToggle({
  locale,
  label,
  aria,
  block,
}: {
  locale: Locale;
  label: string;
  aria: string;
  block?: boolean;
}) {
  const router = useRouter();

  function toggle() {
    const next: Locale = locale === "en" ? "pt" : "en";
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={aria}
      style={{
        background: "none",
        border: "1px solid var(--border-strong)",
        borderRadius: 100,
        cursor: "pointer",
        color: "var(--text-secondary)",
        fontFamily: "var(--font-ui)",
        fontSize: 11,
        letterSpacing: "0.1em",
        padding: "6px 12px",
        width: block ? "100%" : undefined,
        transition: "color var(--dur-base) var(--ease-out), border-color var(--dur-base) var(--ease-out)",
      }}
    >
      {label}
    </button>
  );
}

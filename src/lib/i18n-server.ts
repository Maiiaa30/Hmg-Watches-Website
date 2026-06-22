import { cookies } from "next/headers";
import { DEFAULT_LOCALE, LOCALE_COOKIE, isLocale, getDict, type Locale } from "@/lib/i18n";

// Server-only: read the active locale from the cookie (defaults to English).
export async function getLocale(): Promise<Locale> {
  try {
    const store = await cookies();
    const v = store.get(LOCALE_COOKIE)?.value;
    return isLocale(v) ? v : DEFAULT_LOCALE;
  } catch {
    return DEFAULT_LOCALE;
  }
}

/** Convenience: active locale + its dictionary in one call. */
export async function getT() {
  const locale = await getLocale();
  return { locale, t: getDict(locale) };
}

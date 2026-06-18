import { getSetting, setSetting } from "@/lib/db/settings";

// Auctions are stored as a JSON array in the existing site_settings table
// (key "auctions"), so the feature needs no DB migration. Volume is tiny
// (a handful of upcoming auctions), so a JSON blob is perfectly adequate.

export interface Auction {
  id: string;
  title: string;
  house: string | null; // auction house, e.g. "Christie's"
  url: string; // external link to the auction
  description: string | null;
  imageUrl: string | null;
  startsAt: string; // "YYYY-MM-DD" (the day it happens)
  startsTime: string | null; // "HH:MM" (optional time of day)
  location: string | null;
  active: boolean;
}

const KEY = "auctions";

export async function getAuctions(): Promise<Auction[]> {
  const raw = await getSetting(KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Auction[]) : [];
  } catch {
    return [];
  }
}

export async function saveAuctions(list: Auction[]): Promise<void> {
  await setSetting(KEY, JSON.stringify(list));
}

/** Today's date as "YYYY-MM-DD" in Europe/Lisbon (the business timezone). */
export function todayLisbon(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Lisbon",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function byDateAsc(a: Auction, b: Auction): number {
  return a.startsAt.localeCompare(b.startsAt);
}

/** Active auctions happening today or in the future, soonest first. */
export async function getUpcomingAuctions(): Promise<Auction[]> {
  const today = todayLisbon();
  return (await getAuctions())
    .filter((a) => a.active && a.startsAt >= today)
    .sort(byDateAsc);
}

/** Active auctions happening today (drives the homepage banner). */
export async function getTodaysAuctions(): Promise<Auction[]> {
  const today = todayLisbon();
  return (await getAuctions())
    .filter((a) => a.active && a.startsAt === today)
    .sort(byDateAsc);
}

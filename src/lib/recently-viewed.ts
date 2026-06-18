// Client-side "recently viewed" watches, stored in localStorage (no backend,
// no cookies). Keeps the most recent few watches a visitor opened.

export interface RecentWatch {
  slug: string;
  brand: string;
  model: string;
  reference: string | null;
  price: string;
  status: "available" | "sold" | "archived";
  images: string[];
}

const KEY = "hmg_recent";
const MAX = 6;

export function recordWatch(watch: RecentWatch): void {
  try {
    const list = getRecentWatches().filter((w) => w.slug !== watch.slug);
    list.unshift({ ...watch, images: watch.images.slice(0, 1) });
    localStorage.setItem(KEY, JSON.stringify(list.slice(0, MAX)));
  } catch {
    // storage blocked — ignore
  }
}

export function getRecentWatches(): RecentWatch[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as RecentWatch[]) : [];
  } catch {
    return [];
  }
}

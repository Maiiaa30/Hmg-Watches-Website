import { db } from "@/lib/db";
import { watchLeads } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import { AdminShell } from "@/components/admin/AdminShell";
import { LeiloesManager, type AuctionRow } from "@/components/admin/LeiloesManager";
import { getAuctions } from "@/lib/leiloes";

export const revalidate = 0;

export default async function AdminLeiloesPage() {
  const [auctions, unreadLeads] = await Promise.all([
    getAuctions(),
    db.select({ count: sql<number>`count(*)::int` }).from(watchLeads).where(eq(watchLeads.read, false)),
  ]);

  // Soonest first in the admin list (string dates sort correctly).
  const rows: AuctionRow[] = [...auctions].sort((a, b) => a.startsAt.localeCompare(b.startsAt));

  return (
    <AdminShell title="Leilões" unreadLeads={unreadLeads[0]?.count ?? 0}>
      <LeiloesManager auctions={rows} />
    </AdminShell>
  );
}

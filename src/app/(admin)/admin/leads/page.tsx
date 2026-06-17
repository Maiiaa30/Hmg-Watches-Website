import { db } from "@/lib/db";
import { watchLeads, watches } from "@/lib/db/schema";
import { eq, desc, sql } from "drizzle-orm";
import { AdminShell } from "@/components/admin/AdminShell";
import { LeadsTable, type LeadRow } from "@/components/admin/LeadsTable";

export const revalidate = 0;

export default async function AdminLeadsPage() {
  const [rows, unreadCount] = await Promise.all([
    db
      .select({
        lead: watchLeads,
        watch: { brand: watches.brand, model: watches.model, slug: watches.slug },
      })
      .from(watchLeads)
      .innerJoin(watches, eq(watchLeads.watchId, watches.id))
      .orderBy(desc(watchLeads.createdAt)),
    db.select({ count: sql<number>`count(*)::int` }).from(watchLeads).where(eq(watchLeads.read, false)),
  ]);

  const leads: LeadRow[] = rows.map(({ lead, watch }) => ({
    id: lead.id,
    watchStatusAtTime: lead.watchStatusAtTime,
    name: lead.name,
    email: lead.email,
    phone: lead.phone,
    message: lead.message,
    read: lead.read,
    createdAt: lead.createdAt,
    watch,
  }));

  return (
    <AdminShell title="Leads" unreadLeads={unreadCount[0]?.count ?? 0}>
      <LeadsTable leads={leads} />
    </AdminShell>
  );
}

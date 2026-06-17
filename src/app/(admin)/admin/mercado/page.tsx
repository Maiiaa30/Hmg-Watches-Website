import { db } from "@/lib/db";
import { watchMarketHighlights, watchLeads } from "@/lib/db/schema";
import { eq, asc, sql } from "drizzle-orm";
import { AdminShell } from "@/components/admin/AdminShell";
import { MercadoManager, type HighlightRow } from "@/components/admin/MercadoManager";

export const revalidate = 0;

export default async function AdminMercadoPage() {
  const [rows, unreadLeads] = await Promise.all([
    db.select().from(watchMarketHighlights).orderBy(asc(watchMarketHighlights.displayOrder)),
    db.select({ count: sql<number>`count(*)::int` }).from(watchLeads).where(eq(watchLeads.read, false)),
  ]);

  const highlights: HighlightRow[] = rows.map((h) => ({
    id: h.id,
    brand: h.brand,
    model: h.model,
    reference: h.reference,
    imageUrl: h.imageUrl,
    appreciationPct: h.appreciationPct,
    period: h.period,
    editorialNote: h.editorialNote,
    source: h.source,
    displayOrder: h.displayOrder,
    active: h.active,
  }));

  return (
    <AdminShell title="Mercado — Relógios em Alta" unreadLeads={unreadLeads[0]?.count ?? 0}>
      <MercadoManager highlights={highlights} />
    </AdminShell>
  );
}

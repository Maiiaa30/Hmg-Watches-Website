import Link from "next/link";
import { db } from "@/lib/db";
import { watches, watchLeads } from "@/lib/db/schema";
import { eq, desc, sql } from "drizzle-orm";
import { AdminShell } from "@/components/admin/AdminShell";
import { RelogiosTable, type WatchRow } from "@/components/admin/RelogiosTable";

export const revalidate = 0;

export default async function AdminRelogiosPage() {
  const [allWatches, unreadLeads] = await Promise.all([
    db.select().from(watches).orderBy(desc(watches.createdAt)),
    db.select({ count: sql<number>`count(*)::int` }).from(watchLeads).where(eq(watchLeads.read, false)),
  ]);

  const rows: WatchRow[] = allWatches.map((w) => ({
    id: w.id,
    brand: w.brand,
    model: w.model,
    reference: w.reference,
    year: w.year,
    movementType: w.movementType,
    price: w.price,
    status: w.status,
    featured: w.featured,
    image: w.images[0] ?? null,
    createdAt: w.createdAt,
  }));

  return (
    <AdminShell
      title="Relógios"
      unreadLeads={unreadLeads[0]?.count ?? 0}
      action={
        <Link
          href="/admin/relogios/novo"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 20px",
            background: "var(--accent)",
            color: "var(--hmg-ink)",
            fontFamily: "var(--font-ui)",
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: "0.06em",
            borderRadius: 4,
            textDecoration: "none",
          }}
        >
          + Adicionar Relógio
        </Link>
      }
    >
      <RelogiosTable watches={rows} />
    </AdminShell>
  );
}

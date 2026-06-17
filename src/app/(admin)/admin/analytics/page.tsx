import { db } from "@/lib/db";
import { pageViews, watchLeads } from "@/lib/db/schema";
import { eq, desc, gte, sql, and } from "drizzle-orm";
import { AdminShell } from "@/components/admin/AdminShell";
import { subDays } from "date-fns";

export const revalidate = 300;

export default async function AdminAnalyticsPage() {
  const since = subDays(new Date(), 30);

  const [topPages, deviceSplit, unreadLeads] = await Promise.all([
    db
      .select({ page: pageViews.page, count: sql<number>`count(*)::int` })
      .from(pageViews)
      .where(gte(pageViews.createdAt, since))
      .groupBy(pageViews.page)
      .orderBy(desc(sql`count(*)`))
      .limit(10),
    db
      .select({ deviceType: pageViews.deviceType, count: sql<number>`count(*)::int` })
      .from(pageViews)
      .where(gte(pageViews.createdAt, since))
      .groupBy(pageViews.deviceType),
    db.select({ count: sql<number>`count(*)::int` }).from(watchLeads).where(eq(watchLeads.read, false)),
  ]);

  const totalViews = topPages.reduce((s, r) => s + r.count, 0);

  return (
    <AdminShell title="Analytics" unreadLeads={unreadLeads[0]?.count ?? 0}>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>
        {/* Top pages */}
        <div
          style={{
            background: "var(--surface-card)",
            border: "1px solid var(--border-subtle)",
            borderRadius: 6,
            overflow: "hidden",
          }}
        >
          <div style={{ padding: "18px 24px", borderBottom: "1px solid var(--border-subtle)", fontFamily: "var(--font-display)", fontSize: 18 }}>
            Páginas mais visitadas (30 dias)
          </div>
          {topPages.map((row) => (
            <div
              key={row.page}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                padding: "14px 24px",
                borderBottom: "1px solid var(--border-subtle)",
                fontSize: 13,
              }}
            >
              <div style={{ flex: 1, fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-secondary)" }}>
                {row.page}
              </div>
              <div style={{ fontWeight: 600 }}>{row.count}</div>
            </div>
          ))}
          {topPages.length === 0 && (
            <div style={{ padding: "40px 24px", textAlign: "center", color: "var(--text-tertiary)", fontSize: 14 }}>
              Sem dados ainda.
            </div>
          )}
        </div>

        {/* Device split */}
        <div
          style={{
            background: "var(--surface-card)",
            border: "1px solid var(--border-subtle)",
            borderRadius: 6,
            overflow: "hidden",
          }}
        >
          <div style={{ padding: "18px 24px", borderBottom: "1px solid var(--border-subtle)", fontFamily: "var(--font-display)", fontSize: 18 }}>
            Dispositivos
          </div>
          {deviceSplit.map((row) => {
            const pct = totalViews > 0 ? Math.round((row.count / totalViews) * 100) : 0;
            return (
              <div
                key={row.deviceType}
                style={{
                  padding: "16px 24px",
                  borderBottom: "1px solid var(--border-subtle)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 13 }}>
                  <span style={{ textTransform: "capitalize" }}>{row.deviceType}</span>
                  <span style={{ fontWeight: 600 }}>{pct}%</span>
                </div>
                <div style={{ height: 4, background: "var(--border-subtle)", borderRadius: 2 }}>
                  <div
                    style={{
                      height: "100%",
                      width: `${pct}%`,
                      background: "var(--accent)",
                      borderRadius: 2,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AdminShell>
  );
}

import { db } from "@/lib/db";
import { watches, blogPosts, pageViews, contactMessages, watchLeads, auditLogs } from "@/lib/db/schema";
import { eq, sql, gte, desc } from "drizzle-orm";
import { AdminShell } from "@/components/admin/AdminShell";
import { AUDIT_ACTION_LABELS, AUDIT_ENTITY_LABELS } from "@/constants";
import Link from "next/link";

export const revalidate = 300;

async function getDashboardData() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [
    viewsToday,
    stockCount,
    soldCount,
    publishedCount,
    unreadLeads,
    unreadMessages,
    recentActivity,
  ] = await Promise.all([
    db.select({ count: sql<number>`count(*)::int` }).from(pageViews).where(gte(pageViews.createdAt, today)),
    db.select({ count: sql<number>`count(*)::int` }).from(watches).where(eq(watches.status, "available")),
    db.select({ count: sql<number>`count(*)::int` }).from(watches).where(eq(watches.status, "sold")),
    db.select({ count: sql<number>`count(*)::int` }).from(blogPosts).where(eq(blogPosts.status, "published")),
    db.select({ count: sql<number>`count(*)::int` }).from(watchLeads).where(eq(watchLeads.read, false)),
    db.select({ count: sql<number>`count(*)::int` }).from(contactMessages).where(eq(contactMessages.read, false)),
    db.select().from(auditLogs).orderBy(desc(auditLogs.createdAt)).limit(10),
  ]);

  return {
    viewsToday: viewsToday[0]?.count ?? 0,
    stockCount: stockCount[0]?.count ?? 0,
    soldCount: soldCount[0]?.count ?? 0,
    publishedCount: publishedCount[0]?.count ?? 0,
    unreadLeads: unreadLeads[0]?.count ?? 0,
    unreadMessages: unreadMessages[0]?.count ?? 0,
    recentActivity,
  };
}

export default async function AdminDashboardPage() {
  const data = await getDashboardData();

  const metrics = [
    { label: "Visitas hoje", value: data.viewsToday, icon: "👁️" },
    { label: "Em stock", value: data.stockCount, icon: "⌚" },
    { label: "Vendidos", value: data.soldCount, icon: "✅" },
    { label: "Artigos", value: data.publishedCount, icon: "📝" },
    { label: "Leads não lidas", value: data.unreadLeads, icon: "🔔", href: "/admin/leads" },
  ];

  return (
    <AdminShell title="Dashboard" unreadLeads={data.unreadLeads}>
      {/* Metric cards */}
      <div className="hmg-admin-metrics" style={{ marginBottom: 40 }}>
        {metrics.map((m) => (
          <div
            key={m.label}
            style={{
              background: "var(--surface-card)",
              border: "1px solid var(--border-subtle)",
              borderRadius: 6,
              padding: "22px 24px",
            }}
          >
            <div style={{ fontSize: 24, marginBottom: 8 }}>{m.icon}</div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 36,
                fontWeight: 600,
                lineHeight: 1,
                marginBottom: 6,
              }}
            >
              {m.value}
            </div>
            <div style={{ fontSize: 12, color: "var(--text-tertiary)", letterSpacing: "0.06em" }}>
              {m.label}
            </div>
            {m.href && (
              <Link
                href={m.href}
                style={{
                  display: "block",
                  marginTop: 10,
                  fontSize: 11,
                  color: "var(--accent-press)",
                  letterSpacing: "0.06em",
                }}
              >
                Ver →
              </Link>
            )}
          </div>
        ))}
      </div>

      {/* Recent activity */}
      <div
        style={{
          background: "var(--surface-card)",
          border: "1px solid var(--border-subtle)",
          borderRadius: 6,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "18px 24px",
            borderBottom: "1px solid var(--border-subtle)",
            fontFamily: "var(--font-display)",
            fontSize: 18,
          }}
        >
          Atividade Recente
        </div>
        {data.recentActivity.length === 0 ? (
          <div
            style={{
              padding: "40px 24px",
              textAlign: "center",
              color: "var(--text-tertiary)",
              fontSize: 14,
            }}
          >
            Nenhuma atividade registada.
          </div>
        ) : (
          data.recentActivity.map((log) => (
            <div
              key={log.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                padding: "14px 24px",
                borderBottom: "1px solid var(--border-subtle)",
                fontSize: 13,
              }}
            >
              <div
                style={{
                  flex: 1,
                  color: "var(--text-primary)",
                }}
              >
                {AUDIT_ACTION_LABELS[log.action] ?? log.action}
              </div>
              <div style={{ color: "var(--text-secondary)" }}>
                {AUDIT_ENTITY_LABELS[log.entity] ?? log.entity}
              </div>
              <div style={{ color: "var(--text-tertiary)", whiteSpace: "nowrap" }}>
                {new Intl.DateTimeFormat("pt-PT", {
                  day: "2-digit",
                  month: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                }).format(log.createdAt)}
              </div>
            </div>
          ))
        )}
      </div>
    </AdminShell>
  );
}

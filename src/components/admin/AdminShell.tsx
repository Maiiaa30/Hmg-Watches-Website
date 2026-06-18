"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: "grid" },
  { href: "/admin/relogios", label: "Relógios", icon: "watch" },
  { href: "/admin/blog", label: "Blog", icon: "file-text" },
  { href: "/admin/leads", label: "Leads", icon: "users" },
  { href: "/admin/mensagens", label: "Mensagens", icon: "mail" },
  { href: "/admin/mercado", label: "Mercado", icon: "trending-up" },
  { href: "/admin/leiloes", label: "Leilões", icon: "gavel" },
  { href: "/admin/analytics", label: "Analytics", icon: "bar-chart" },
  { href: "/admin/definicoes", label: "Definições", icon: "settings" },
] as const;

const ICONS: Record<string, React.ReactNode> = {
  grid: <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  watch: <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><circle cx="12" cy="12" r="7"/><path d="M12 9v3l2 2M9 3.5h6M9 20.5h6"/></svg>,
  "file-text": <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  users: <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
  "trending-up": <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  gavel: <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M14 13l-7.5 7.5a2.1 2.1 0 01-3-3L11 10"/><path d="M9.5 8.5l6 6M12.5 5.5l6 6M16 3l5 5M3 21h8"/></svg>,
  "bar-chart": <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  mail: <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  settings: <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
  "log-out": <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>,
};

interface AdminShellProps {
  children: React.ReactNode;
  title: string;
  action?: React.ReactNode;
  unreadLeads?: number;
}

export function AdminShell({ children, title, action, unreadLeads = 0 }: AdminShellProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  // Close the mobile drawer whenever the route changes
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  }

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "var(--bg-page)" }}>
      {/* Backdrop (mobile, when drawer open) */}
      {menuOpen && (
        <div className="hmg-admin-backdrop" onClick={() => setMenuOpen(false)} />
      )}
      {/* Sidebar */}
      <aside
        className={`hmg-admin-sidebar${menuOpen ? " open" : ""}`}
        style={{
          width: 248,
          flexShrink: 0,
          background: "var(--bg-page-alt)",
          borderRight: "1px solid var(--border-subtle)",
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          position: "sticky",
          top: 0,
        }}
      >
        {/* Logo */}
        <div
          style={{
            padding: "22px 22px 24px",
            borderBottom: "1px solid var(--border-subtle)",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
            <span style={{ fontFamily: "var(--font-display)", fontSize: 19, fontWeight: 600 }}>HMG</span>
            <span style={{ fontFamily: "var(--font-ui)", fontSize: 9, letterSpacing: "0.34em", textTransform: "uppercase", color: "var(--text-secondary)", marginTop: 3 }}>Admin</span>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ padding: "18px 14px", display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
          {NAV.map((n) => {
            const on = isActive(n.href);
            const badge = n.href === "/admin/leads" && unreadLeads > 0 ? unreadLeads : null;
            return (
              <Link
                key={n.href}
                href={n.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 13,
                  padding: "11px 14px",
                  borderRadius: 4,
                  color: on ? "var(--text-primary)" : "var(--text-secondary)",
                  background: on ? "var(--surface-card)" : "transparent",
                  borderLeft: `2px solid ${on ? "var(--accent)" : "transparent"}`,
                  fontSize: 14,
                  transition: "all var(--dur-fast) var(--ease-out)",
                  textDecoration: "none",
                }}
              >
                <span style={{ color: on ? "var(--accent)" : "currentColor" }}>
                  {ICONS[n.icon]}
                </span>
                <span style={{ flex: 1 }}>{n.label}</span>
                {badge && (
                  <span
                    style={{
                      background: "var(--accent)",
                      color: "var(--text-on-gold)",
                      fontSize: 11,
                      fontWeight: 600,
                      minWidth: 18,
                      height: 18,
                      borderRadius: 999,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "0 5px",
                    }}
                  >
                    {badge > 99 ? "99+" : badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div
          style={{
            padding: "16px 22px",
            borderTop: "1px solid var(--border-subtle)",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: "var(--surface-raised)",
              border: "1px solid var(--border-strong)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--font-display)",
              fontSize: 14,
              color: "var(--accent)",
            }}
          >
            A
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, color: "var(--text-primary)" }}>Admin</div>
          </div>
          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              title="Sair"
              style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-tertiary)", display: "flex" }}
            >
              {ICONS["log-out"]}
            </button>
          </form>
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column" }}>
        {/* Topbar */}
        <div
          className="hmg-admin-topbar"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            padding: "26px 40px",
            borderBottom: "1px solid var(--border-subtle)",
            position: "sticky",
            top: 0,
            background: "rgba(247,242,232,0.92)",
            backdropFilter: "blur(12px)",
            zIndex: 10,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14, minWidth: 0 }}>
            <button
              className="hmg-admin-hamburger"
              onClick={() => setMenuOpen(true)}
              aria-label="Abrir menu"
              style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-primary)", padding: 0 }}
            >
              <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path d="M3 12h18M3 6h18M3 18h18" />
              </svg>
            </button>
            <h1
              className="hmg-admin-title"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 28,
                fontWeight: 500,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {title}
            </h1>
          </div>
          {action && (
            <div style={{ display: "flex", alignItems: "center", gap: 18, flexShrink: 0 }}>
              {action}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="hmg-admin-content" style={{ padding: "32px 40px", flex: 1 }}>
          {children}
        </div>
      </div>
    </div>
  );
}

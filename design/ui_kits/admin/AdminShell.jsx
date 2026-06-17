/* HMG Watches — Admin shell (sidebar + topbar) and shared admin UI. */
(function () {
  const Icon = window.Icon;
  const NAV = [
    { key: "dashboard", label: "Dashboard", icon: "layout-dashboard" },
    { key: "watches", label: "Relógios", icon: "watch" },
    { key: "blog", label: "Blog", icon: "file-text" },
    { key: "leads", label: "Leads", icon: "users" },
    { key: "market", label: "Mercado", icon: "trending-up" },
    { key: "analytics", label: "Analytics", icon: "bar-chart" },
    { key: "settings", label: "Definições", icon: "settings" },
  ];

  function Sidebar({ route, go }) {
    return (
      <aside style={{ width: 248, flexShrink: 0, background: "var(--bg-page-alt)", borderRight: "1px solid var(--border-subtle)", display: "flex", flexDirection: "column", height: "100vh", position: "sticky", top: 0 }}>
        <div style={{ padding: "22px 22px 24px", borderBottom: "1px solid var(--border-subtle)", display: "flex", alignItems: "center", gap: 12 }}>
          <img src="../../assets/logo.png" alt="HMG" style={{ height: 40, width: "auto", mixBlendMode: "multiply" }} />
          <span style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
            <span style={{ fontFamily: "var(--font-display)", fontSize: 19, fontWeight: 600 }}>HMG</span>
            <span style={{ fontFamily: "var(--font-ui)", fontSize: 9, letterSpacing: "0.34em", textTransform: "uppercase", color: "var(--text-secondary)", marginTop: 3 }}>Admin</span>
          </span>
        </div>
        <nav style={{ padding: "18px 14px", display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
          {NAV.map((n) => {
            const on = route === n.key;
            const badge = n.key === "leads" ? 9 : null;
            return (
              <a key={n.key} onClick={() => go(n.key)} style={{
                cursor: "pointer", display: "flex", alignItems: "center", gap: 13, padding: "11px 14px", borderRadius: 4,
                color: on ? "var(--text-primary)" : "var(--text-secondary)",
                background: on ? "var(--surface-card)" : "transparent",
                borderLeft: `2px solid ${on ? "var(--accent)" : "transparent"}`,
                fontSize: 14, transition: "all var(--dur-fast) var(--ease-out)",
              }}
              onMouseEnter={(e) => { if (!on) e.currentTarget.style.background = "rgba(26,24,20,0.04)"; }}
              onMouseLeave={(e) => { if (!on) e.currentTarget.style.background = "transparent"; }}>
                <Icon name={n.icon} size={18} color={on ? "var(--accent)" : "currentColor"} />
                <span style={{ flex: 1 }}>{n.label}</span>
                {badge && <span style={{ background: "var(--accent)", color: "var(--text-on-gold)", fontSize: 11, fontWeight: 600, minWidth: 18, height: 18, borderRadius: 999, display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "0 5px" }}>{badge}</span>}
              </a>
            );
          })}
        </nav>
        <div style={{ padding: "16px 22px", borderTop: "1px solid var(--border-subtle)", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 34, height: 34, borderRadius: "50%", background: "var(--surface-raised)", border: "1px solid var(--border-strong)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontSize: 14, color: "var(--accent)" }}>M</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, color: "var(--text-primary)" }}>Maia</div>
            <div style={{ fontSize: 11, color: "var(--text-tertiary)" }}>Administradora</div>
          </div>
          <a style={{ cursor: "pointer", color: "var(--text-tertiary)" }} title="Sair"><Icon name="log-out" size={16} /></a>
        </div>
      </aside>
    );
  }

  function Topbar({ title, action }) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "26px 40px", borderBottom: "1px solid var(--border-subtle)", position: "sticky", top: 0, background: "rgba(242,234,219,0.88)", backdropFilter: "blur(12px)", zIndex: 10 }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 500, letterSpacing: 0 }}>{title}</h1>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <span style={{ position: "relative", color: "var(--text-secondary)", cursor: "pointer" }}>
            <Icon name="bell" size={20} />
            <span style={{ position: "absolute", top: -2, right: -2, width: 7, height: 7, borderRadius: "50%", background: "var(--accent)" }} />
          </span>
          {action}
        </div>
      </div>
    );
  }

  // Lightweight admin table
  function Table({ columns, children }) {
    return (
      <div style={{ border: "1px solid var(--border-subtle)", borderRadius: 6, overflow: "hidden", background: "var(--surface-card)" }}>
        <div style={{ display: "grid", gridTemplateColumns: columns.map((c) => c.w).join(" "), padding: "14px 22px", borderBottom: "1px solid var(--border-subtle)", background: "var(--bg-page-alt)" }}>
          {columns.map((c) => <div key={c.label} style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-tertiary)", textAlign: c.align || "left" }}>{c.label}</div>)}
        </div>
        {children}
      </div>
    );
  }
  function Row({ columns, cells, last }) {
    const [h, setH] = React.useState(false);
    return (
      <div onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
        style={{ display: "grid", gridTemplateColumns: columns.map((c) => c.w).join(" "), padding: "16px 22px", borderBottom: last ? "none" : "1px solid var(--border-subtle)", alignItems: "center", background: h ? "rgba(26,24,20,0.025)" : "transparent", transition: "background var(--dur-fast)" }}>
        {cells.map((cell, i) => <div key={i} style={{ textAlign: columns[i].align || "left", fontSize: 14, color: "var(--text-secondary)", minWidth: 0 }}>{cell}</div>)}
      </div>
    );
  }

  function StatusPill({ status }) {
    const map = {
      Publicado: { bg: "var(--status-available-bg)", fg: "var(--status-available-fg)" },
      Pendente: { bg: "rgba(184,152,106,0.15)", fg: "var(--accent)" },
      Rascunho: { bg: "var(--status-sold-bg)", fg: "var(--status-sold-fg)" },
    };
    const c = map[status] || map.Rascunho;
    return <span style={{ display: "inline-flex", padding: "5px 11px", borderRadius: 999, fontSize: 11, fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase", background: c.bg, color: c.fg }}>{status}</span>;
  }

  // Line chart
  function LineChart({ data, height = 240, label }) {
    const w = 760, pad = 28;
    const max = Math.max(...data), min = Math.min(...data);
    const x = (i) => pad + (i / (data.length - 1)) * (w - pad * 2);
    const y = (v) => pad + (1 - (v - min) / (max - min || 1)) * (height - pad * 2);
    const line = data.map((v, i) => `${x(i)},${y(v)}`).join(" ");
    const area = `${pad},${height - pad} ${line} ${w - pad},${height - pad}`;
    return (
      <svg viewBox={`0 0 ${w} ${height}`} style={{ width: "100%", height: "auto", display: "block" }}>
        <defs>
          <linearGradient id="aFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(184,152,106,0.22)" />
            <stop offset="100%" stopColor="rgba(184,152,106,0)" />
          </linearGradient>
        </defs>
        {[0, 0.25, 0.5, 0.75, 1].map((g) => (
          <line key={g} x1={pad} x2={w - pad} y1={pad + g * (height - pad * 2)} y2={pad + g * (height - pad * 2)} stroke="var(--border-subtle)" strokeWidth="1" />
        ))}
        <polygon points={area} fill="url(#aFill)" />
        <polyline points={line} fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {data.map((v, i) => (i % 4 === 0 || i === data.length - 1) && <circle key={i} cx={x(i)} cy={y(v)} r="2.5" fill="var(--accent)" />)}
      </svg>
    );
  }

  window.AdminSidebar = Sidebar;
  window.AdminTopbar = Topbar;
  window.AdminTable = Table;
  window.AdminRow = Row;
  window.AdminStatusPill = StatusPill;
  window.AdminLineChart = LineChart;
})();

// Branded "under maintenance" screen shown to public visitors when the admin
// has toggled maintenance mode on (site_settings.maintenance_mode === "true").
// Rendered by the public layout in place of the whole site.
export function MaintenanceScreen() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg-page)",
        textAlign: "center",
        padding: 24,
      }}
    >
      <div style={{ maxWidth: 480 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 9, justifyContent: "center" }}>
          <span style={{ fontFamily: "var(--font-display)", fontSize: 30, fontWeight: 600, color: "var(--text-primary)" }}>
            HMG
          </span>
          <span
            style={{
              fontFamily: "var(--font-ui)",
              fontSize: 11,
              letterSpacing: "0.34em",
              textTransform: "uppercase",
              color: "var(--accent-press)",
            }}
          >
            Watches
          </span>
        </div>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--fs-display-s)",
            fontWeight: 400,
            margin: "28px 0 14px",
          }}
        >
          Em manutenção
        </h1>
        <p style={{ fontSize: 15, lineHeight: 1.7, color: "var(--text-secondary)", margin: 0 }}>
          Estamos a preparar algo especial. Voltamos em breve.
          <br />
          <span style={{ color: "var(--text-tertiary)" }}>We&rsquo;re polishing things up — back shortly.</span>
        </p>
      </div>
    </div>
  );
}

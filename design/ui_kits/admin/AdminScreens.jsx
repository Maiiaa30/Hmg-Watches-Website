/* HMG Watches — Admin screens. */
(function () {
  const { Button, Badge, Card, Input, Select } = window.HMGWatchesDesignSystem_1cb2d0;
  const Icon = window.Icon, A = window.ADMINDATA, WatchVisual = window.WatchVisual;
  const PAD = { padding: "32px 40px 64px" };

  function Dashboard() {
    const Table = window.AdminTable, Row = window.AdminRow;
    const cols = [{ label: "Relógio", w: "1.6fr" }, { label: "Referência", w: "1fr" }, { label: "Visualizações", w: "0.7fr", align: "right" }];
    return (
      <div style={PAD}>
        {/* metrics */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 18, marginBottom: 32 }}>
          {A.metrics.map((m) => (
            <Card key={m.label} padding="22px 24px" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "var(--accent)" }}><Icon name={m.icon} size={20} /></span>
                <span style={{ fontSize: 11, color: m.up ? "var(--trend-up)" : "var(--accent)" }}>{m.delta}</span>
              </div>
              <div>
                <div style={{ fontSize: 32, fontFamily: "var(--font-display)", color: "var(--text-primary)", lineHeight: 1 }}>{m.value}</div>
                <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 8 }}>{m.label}</div>
              </div>
            </Card>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 24 }}>
          <Card padding="26px 28px">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
              <h3 style={{ fontSize: 18 }}>Visitas · últimos 30 dias</h3>
              <span style={{ fontSize: 12, color: "var(--text-tertiary)" }}>Total 6.214</span>
            </div>
            <window.AdminLineChart data={A.visits30} height={230} />
          </Card>
          <Card padding="26px 28px">
            <h3 style={{ fontSize: 18, marginBottom: 20 }}>Atividade recente</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {A.activity.map((a, i) => (
                <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <span style={{ marginTop: 2, color: "var(--accent)" }}><Icon name={a.icon} size={16} /></span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>{a.text}</div>
                    <div style={{ fontSize: 11, color: "var(--text-tertiary)", marginTop: 3 }}>{a.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div style={{ marginTop: 24 }}>
          <h3 style={{ fontSize: 18, marginBottom: 18 }}>Relógios mais vistos</h3>
          <Table columns={cols}>
            {A.topWatches.map((w, i) => (
              <Row key={i} columns={cols} last={i === A.topWatches.length - 1}
                cells={[
                  <span style={{ color: "var(--text-primary)" }}>{w.brand} · {w.model}</span>,
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--text-tertiary)" }}>{w.ref}</span>,
                  <span style={{ color: "var(--text-primary)" }}>{w.views.toLocaleString("pt-PT")}</span>,
                ]} />
            ))}
          </Table>
        </div>
      </div>
    );
  }

  function Thumb({ hue, sold }) {
    return <div style={{ width: 46, height: 46, borderRadius: 4, background: "linear-gradient(180deg, #FFFFFF, #F4EEE1)", border: "1px solid var(--border-subtle)", display: "flex", alignItems: "center", justifyContent: "center", padding: 5, flexShrink: 0 }}><div style={{ width: "100%" }}><WatchVisual hue={hue} sold={sold} size="100%" /></div></div>;
  }

  function WatchesScreen() {
    const Table = window.AdminTable, Row = window.AdminRow;
    const cols = [{ label: "", w: "60px" }, { label: "Marca / Modelo", w: "1.6fr" }, { label: "Referência", w: "1fr" }, { label: "Preço", w: "0.8fr" }, { label: "Estado", w: "0.8fr" }, { label: "Adicionado", w: "0.9fr" }, { label: "Ações", w: "120px", align: "right" }];
    return (
      <div style={PAD}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24, gap: 20 }}>
          <div style={{ position: "relative", flex: 1, maxWidth: 340 }}>
            <span style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", color: "var(--text-tertiary)" }}><Icon name="search" size={17} /></span>
            <input placeholder="Pesquisar no stock…" style={{ width: "100%", padding: "10px 0 10px 28px", background: "transparent", border: "none", borderBottom: "1px solid var(--border-strong)", color: "var(--text-primary)", fontFamily: "var(--font-ui)", fontSize: 14, outline: "none" }} />
          </div>
          <Button variant="solid" size="sm" iconLeft={<Icon name="plus" size={15} />}>Adicionar Relógio</Button>
        </div>
        <Table columns={cols}>
          {A.stock.map((w, i) => (
            <Row key={i} columns={cols} last={i === A.stock.length - 1}
              cells={[
                <Thumb hue={w.hue} sold={w.status === "sold"} />,
                <div><div style={{ color: "var(--text-primary)" }}>{w.model}</div><div style={{ fontSize: 12, color: "var(--text-tertiary)" }}>{w.brand}</div></div>,
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 13 }}>{w.ref}</span>,
                <span style={{ color: "var(--text-primary)" }}>{w.price}</span>,
                <Badge variant={w.status === "sold" ? "sold" : "available"} />,
                <span>{w.added}</span>,
                <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", color: "var(--text-tertiary)" }}>
                  <a title="Editar" style={{ cursor: "pointer" }}><Icon name="pencil" size={16} /></a>
                  <a title="Marcar vendido" style={{ cursor: "pointer" }}><Icon name="check" size={16} /></a>
                  <a title="Arquivar" style={{ cursor: "pointer" }}><Icon name="archive" size={16} /></a>
                </div>,
              ]} />
          ))}
        </Table>
      </div>
    );
  }

  function BlogScreen() {
    const Table = window.AdminTable, Row = window.AdminRow, Pill = window.AdminStatusPill;
    const cols = [{ label: "Título", w: "2fr" }, { label: "Categoria", w: "1fr" }, { label: "Estado", w: "1fr" }, { label: "Data", w: "1fr" }, { label: "Ações", w: "140px", align: "right" }];
    const pending = A.posts.filter((p) => p.status === "Pendente").length;
    return (
      <div style={PAD}>
        {pending > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 22px", border: "1px solid var(--accent)", borderRadius: 6, background: "rgba(184,152,106,0.08)", marginBottom: 24 }}>
            <Icon name="bell" size={18} color="var(--accent)" />
            <span style={{ fontSize: 14, color: "var(--text-primary)" }}>{pending} artigos pendentes de aprovação</span>
            <span style={{ flex: 1 }} />
            <Button variant="solid" size="sm">Rever pendentes</Button>
          </div>
        )}
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 24 }}>
          <Button variant="solid" size="sm" iconLeft={<Icon name="plus" size={15} />}>Novo Artigo</Button>
        </div>
        <Table columns={cols}>
          {A.posts.map((p, i) => {
            const pend = p.status === "Pendente";
            return (
              <Row key={i} columns={cols} last={i === A.posts.length - 1}
                cells={[
                  <span style={{ color: "var(--text-primary)", borderLeft: pend ? "2px solid var(--accent)" : "none", paddingLeft: pend ? 12 : 0 }}>{p.title}</span>,
                  <span>{p.category}</span>,
                  <Pill status={p.status} />,
                  <span>{p.date}</span>,
                  <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", color: "var(--text-tertiary)" }}>
                    {pend && <a title="Aprovar" style={{ cursor: "pointer", color: "var(--trend-up)" }}><Icon name="check" size={16} /></a>}
                    <a title="Editar" style={{ cursor: "pointer" }}><Icon name="pencil" size={16} /></a>
                    <a title="Eliminar" style={{ cursor: "pointer" }}><Icon name="trash" size={16} /></a>
                  </div>,
                ]} />
            );
          })}
        </Table>
      </div>
    );
  }

  function AnalyticsScreen() {
    const [period, setPeriod] = React.useState("30 dias");
    const Table = window.AdminTable, Row = window.AdminRow;
    const cols = [{ label: "Página", w: "1.4fr" }, { label: "Visualizações", w: "0.8fr", align: "right" }, { label: "", w: "1.4fr" }];
    const data = period === "7 dias" ? A.visits7 : A.visits30;
    return (
      <div style={PAD}>
        <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
          {["7 dias", "30 dias", "90 dias"].map((p) => {
            const on = p === period;
            return <button key={p} onClick={() => setPeriod(p)} style={{ cursor: "pointer", padding: "8px 18px", borderRadius: 999, background: on ? "var(--surface-raised)" : "transparent", border: `1px solid ${on ? "var(--accent)" : "var(--border-strong)"}`, color: on ? "var(--accent)" : "var(--text-secondary)", fontSize: 12, letterSpacing: "0.04em", textTransform: "uppercase" }}>{p}</button>;
          })}
        </div>
        <Card padding="26px 28px" style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 18, marginBottom: 20 }}>Visitas · {period}</h3>
          <window.AdminLineChart data={data} height={250} />
        </Card>
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 24 }}>
          <div>
            <h3 style={{ fontSize: 18, marginBottom: 18 }}>Páginas mais vistas</h3>
            <Table columns={cols}>
              {A.topPages.map((p, i) => (
                <Row key={i} columns={cols} last={i === A.topPages.length - 1}
                  cells={[
                    <span style={{ color: "var(--text-primary)", fontFamily: "var(--font-mono)", fontSize: 13 }}>{p.page}</span>,
                    <span style={{ color: "var(--text-primary)" }}>{p.views}</span>,
                    <div style={{ height: 6, background: "var(--bg-page-alt)", borderRadius: 999, overflow: "hidden" }}><div style={{ width: `${p.pct}%`, height: "100%", background: "var(--accent)" }} /></div>,
                  ]} />
              ))}
            </Table>
          </div>
          <Card padding="26px 28px">
            <h3 style={{ fontSize: 18, marginBottom: 22 }}>Dispositivos</h3>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 36, padding: "20px 0" }}>
              <Donut pct={68} />
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <Legend color="var(--accent)" label="Desktop" value="68%" />
                <Legend color="var(--border-strong)" label="Mobile" value="32%" />
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  function Donut({ pct }) {
    const r = 52, c = 2 * Math.PI * r;
    return (
      <svg width="130" height="130" viewBox="0 0 130 130">
        <circle cx="65" cy="65" r={r} fill="none" stroke="var(--border-strong)" strokeWidth="14" />
        <circle cx="65" cy="65" r={r} fill="none" stroke="var(--accent)" strokeWidth="14" strokeLinecap="round"
          strokeDasharray={`${(pct / 100) * c} ${c}`} transform="rotate(-90 65 65)" />
        <text x="65" y="71" textAnchor="middle" fontFamily="var(--font-display)" fontSize="24" fill="var(--text-primary)">{pct}%</text>
      </svg>
    );
  }
  function Legend({ color, label, value }) {
    return <div style={{ display: "flex", alignItems: "center", gap: 10 }}><span style={{ width: 12, height: 12, borderRadius: 3, background: color }} /><span style={{ fontSize: 14, color: "var(--text-secondary)" }}>{label}</span><span style={{ fontSize: 14, color: "var(--text-primary)", marginLeft: 6 }}>{value}</span></div>;
  }

  function SettingsScreen() {
    return (
      <div style={{ ...PAD, maxWidth: 680 }}>
        <Card padding="36px 38px" style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 20, marginBottom: 6 }}>Informações do site</h3>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 30 }}>Dados públicos apresentados no site.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
            <Input label="Nome do site" defaultValue="HMG Watches" />
            <Input label="Email de contacto" type="email" defaultValue="ola@hmgwatches.pt" />
          </div>
          <div style={{ marginTop: 32 }}><Button variant="solid" size="sm">Guardar alterações</Button></div>
        </Card>
        <Card padding="36px 38px">
          <h3 style={{ fontSize: 20, marginBottom: 6 }}>Alterar password</h3>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 30 }}>Recomendamos uma password forte e única.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
            <Input label="Password atual" type="password" placeholder="••••••••" />
            <Input label="Nova password" type="password" placeholder="••••••••" />
          </div>
          <div style={{ marginTop: 32 }}><Button variant="solid" size="sm">Atualizar password</Button></div>
        </Card>
      </div>
    );
  }

  function PlaceholderScreen({ title, icon }) {
    return (
      <div style={{ ...PAD, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", textAlign: "center" }}>
        <span style={{ color: "var(--text-tertiary)", marginBottom: 20 }}><Icon name={icon} size={44} strokeWidth={1} /></span>
        <h3 style={{ fontSize: 26, marginBottom: 10 }}>{title}</h3>
        <p style={{ fontSize: 15, color: "var(--text-secondary)", maxWidth: 380 }}>Esta secção faz parte do painel mas não está incluída neste protótipo visual.</p>
      </div>
    );
  }

  window.AdminDashboard = Dashboard;
  window.AdminWatches = WatchesScreen;
  window.AdminBlog = BlogScreen;
  window.AdminAnalytics = AnalyticsScreen;
  window.AdminSettings = SettingsScreen;
  window.AdminPlaceholder = PlaceholderScreen;
})();

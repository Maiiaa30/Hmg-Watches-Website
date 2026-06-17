/* HMG Watches — Market screen + reusable Contact block (responsive). */
(function () {
  const { Button, Badge, WatchCard, Overline, Card, Input, Select } =
    window.HMGWatchesDesignSystem_1cb2d0;
  const Icon = window.Icon,
    WatchVisual = window.WatchVisual,
    D = window.HMGDATA;
  const pad = (vp) => (vp.mobile ? "0 20px" : vp.tablet ? "0 36px" : "0 56px");
  const WRAP = (vp) => ({ maxWidth: 1320, margin: "0 auto", padding: pad(vp) });

  function Spark({ data, color }) {
    const w = 120,
      h = 36,
      max = Math.max(...data),
      min = Math.min(...data);
    const pts = data
      .map(
        (v, i) =>
          `${(i / (data.length - 1)) * w},${h - ((v - min) / (max - min || 1)) * h}`,
      )
      .join(" ");
    return (
      <svg
        viewBox={`0 0 ${w} ${h}`}
        preserveAspectRatio="none"
        style={{
          display: "block",
          width: "100%",
          height: 36,
          overflow: "visible",
        }}
      >
        <polyline
          points={pts}
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  function MetalCard({ m }) {
    const up = m.change >= 0;
    return (
      <Card
        padding="24px 26px"
        style={{ display: "flex", flexDirection: "column", gap: 18 }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 10,
          }}
        >
          <div>
            <div style={{ fontSize: 18, fontFamily: "var(--font-display)" }}>
              {m.name}
            </div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                color: "var(--text-tertiary)",
                marginTop: 4,
              }}
            >
              {m.symbol}
            </div>
          </div>
          <Badge variant={up ? "up" : "down"}>
            <span
              style={{ display: "inline-flex", alignItems: "center", gap: 4 }}
            >
              <Icon name={up ? "trending-up" : "trending-down"} size={13} />
              {up ? "+" : ""}
              {m.change.toFixed(2)}%
            </span>
          </Badge>
        </div>
        <Spark data={m.spark} color={up ? "#3F6B3F" : "#B5543F"} />
        <div
          style={{
            fontSize: 22,
            fontFamily: "var(--font-display)",
            color: "var(--text-primary)",
          }}
        >
          {m.price}
        </div>
      </Card>
    );
  }

  function MarketScreen({ openWatch }) {
    const vp = window.useVP();
    const metalCols = vp.mobile
      ? "repeat(2, 1fr)"
      : vp.tablet
        ? "repeat(3, 1fr)"
        : "repeat(5, 1fr)";
    return (
      <div
        style={{
          ...WRAP(vp),
          padding: `${vp.mobile ? "72px" : "100px"} ${pad(vp).split(" ")[1]} 110px`,
        }}
      >
        <div style={{ marginBottom: 16 }}>
          <Overline>Mercado</Overline>
          <h1 style={{ fontSize: vp.mobile ? 36 : 52, marginTop: 16 }}>
            O pulso do mercado
          </h1>
          <p
            style={{
              fontSize: 17,
              lineHeight: 1.7,
              color: "var(--text-secondary)",
              marginTop: 16,
              maxWidth: 560,
            }}
          >
            Referências financeiras relevantes para o universo da relojoaria de
            luxo.
          </p>
        </div>

        <section style={{ marginTop: vp.mobile ? 44 : 64 }}>
          <h2 style={{ fontSize: vp.mobile ? 24 : 28, marginBottom: 28 }}>
            Metais preciosos e diamantes
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: metalCols,
              gap: vp.mobile ? 14 : 22,
            }}
          >
            {D.metals.map((m) => (
              <MetalCard key={m.symbol} m={m} />
            ))}
          </div>
          <div
            style={{
              fontSize: 12,
              color: "var(--text-tertiary)",
              marginTop: 22,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Icon name="clock" size={13} /> Preços actualizados de hora em hora
            · Valores indicativos
          </div>
        </section>

        <section style={{ marginTop: vp.mobile ? 72 : 104 }}>
          <h2 style={{ fontSize: vp.mobile ? 24 : 28, marginBottom: 8 }}>
            Relógios em alta
          </h2>
          <p
            style={{
              fontSize: 15,
              color: "var(--text-secondary)",
              marginBottom: 40,
              maxWidth: 520,
            }}
          >
            As referências que mais valorizaram no mercado secundário nos
            últimos meses.
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: vp.desktop ? "repeat(2, 1fr)" : "1fr",
              gap: 28,
            }}
          >
            {D.risers.map((r, i) => (
              <div
                key={i}
                style={{
                  display: "grid",
                  gridTemplateColumns: vp.mobile ? "120px 1fr" : "180px 1fr",
                  gap: vp.mobile ? 18 : 28,
                  alignItems: "center",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: 8,
                  padding: vp.mobile ? 18 : 24,
                  background: "var(--surface-card)",
                }}
              >
                <div
                  style={{
                    aspectRatio: "1 / 1",
                    borderRadius: 6,
                    background:
                      "linear-gradient(180deg, #FFFFFF 0%, #F4EEE1 100%)",
                    border: "1px solid var(--border-subtle)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "14%",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      filter: "drop-shadow(0 14px 24px rgba(40,33,20,0.16))",
                    }}
                  >
                    <WatchVisual hue={r.hue} size="100%" />
                  </div>
                </div>
                <div>
                  <div style={{ marginBottom: 12 }}>
                    <Badge variant="gold">{r.appreciation}</Badge>
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      letterSpacing: "0.16em",
                      textTransform: "uppercase",
                      color: "var(--text-secondary)",
                    }}
                  >
                    {r.brand}
                  </div>
                  <h3 style={{ fontSize: 20, margin: "6px 0 4px" }}>
                    {r.model}
                  </h3>
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 12,
                      color: "var(--text-tertiary)",
                      marginBottom: 12,
                    }}
                  >
                    Ref. {r.ref}
                  </div>
                  <p
                    style={{
                      fontSize: 14,
                      lineHeight: 1.7,
                      color: "var(--text-secondary)",
                    }}
                  >
                    {r.note}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  // Reusable contact block — used on the homepage
  function ContactBlock({ compact }) {
    const vp = window.useVP();
    const [sent, setSent] = React.useState(false);
    const twoCol = vp.desktop;
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: twoCol ? "1fr 1fr" : "1fr",
          gap: vp.mobile ? 40 : 80,
          alignItems: "start",
        }}
      >
        <div>
          <Overline>Contacto</Overline>
          <h2
            style={{
              fontSize: vp.mobile ? 38 : 50,
              marginTop: 16,
              lineHeight: 1.08,
            }}
          >
            Vamos falar
            <br />
            de relógios.
          </h2>
          <p
            style={{
              fontSize: 18,
              lineHeight: 1.8,
              color: "var(--text-secondary)",
              marginTop: 24,
              maxWidth: 420,
            }}
          >
            Quer comprar, quer vender, quer apenas uma opinião — escreva-nos.
            Respondemos em 24 a 48 horas úteis.
          </p>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 20,
              marginTop: 40,
            }}
          >
            {[
              { ic: "mail", label: "Email", value: "contact@hmgwatches.com" },
              { ic: "instagram", label: "Instagram", value: "@hmg.watch_" },
              {
                ic: "message-circle",
                label: "WhatsApp",
                value: "+351 930 675 358",
              },
            ].map((c) => (
              <div
                key={c.label}
                style={{ display: "flex", alignItems: "center", gap: 16 }}
              >
                <span
                  style={{
                    width: 44,
                    height: 44,
                    flexShrink: 0,
                    border: "1px solid var(--border-strong)",
                    borderRadius: "50%",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--accent-press)",
                  }}
                >
                  <Icon name={c.ic} size={18} />
                </span>
                <div>
                  <div
                    style={{
                      fontSize: 11,
                      letterSpacing: "0.16em",
                      textTransform: "uppercase",
                      color: "var(--text-tertiary)",
                    }}
                  >
                    {c.label}
                  </div>
                  <div
                    style={{
                      fontSize: 16,
                      color: "var(--text-primary)",
                      marginTop: 3,
                    }}
                  >
                    {c.value}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Card padding={vp.mobile ? "32px 26px" : "44px 40px"}>
          {sent ? (
            <div style={{ textAlign: "center", padding: "50px 10px" }}>
              <div
                style={{
                  color: "var(--accent-press)",
                  display: "flex",
                  justifyContent: "center",
                  marginBottom: 22,
                }}
              >
                <Icon name="check" size={44} />
              </div>
              <h3 style={{ fontSize: 26, marginBottom: 12 }}>
                Mensagem enviada
              </h3>
              <p style={{ fontSize: 15, color: "var(--text-secondary)" }}>
                Obrigado pelo seu contacto. Respondemos em 24 a 48 horas úteis.
              </p>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
              style={{ display: "flex", flexDirection: "column", gap: 26 }}
            >
              <Input label="Nome" placeholder="O seu nome" required />
              <Input
                label="Email"
                type="email"
                placeholder="nome@email.com"
                required
              />
              <Select
                label="Assunto"
                options={[
                  "Quero comprar um relógio",
                  "Tenho um relógio para vender",
                  "Informação geral",
                ]}
              />
              <label style={{ display: "block" }}>
                <span
                  style={{
                    display: "block",
                    marginBottom: 8,
                    fontSize: 11,
                    fontWeight: 500,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "var(--text-secondary)",
                  }}
                >
                  Mensagem
                </span>
                <textarea
                  rows={4}
                  placeholder="Em que podemos ajudar?"
                  style={{
                    width: "100%",
                    padding: "13px 0",
                    background: "transparent",
                    border: "none",
                    borderBottom: "1px solid var(--border-strong)",
                    color: "var(--text-primary)",
                    fontFamily: "var(--font-ui)",
                    fontSize: 16,
                    outline: "none",
                    resize: "vertical",
                  }}
                />
              </label>
              <div style={{ marginTop: 8 }}>
                <Button
                  variant="ghost-gold"
                  size="lg"
                  fullWidth
                  as="button"
                  type="submit"
                  iconRight={<Icon name="arrow-right" size={16} />}
                >
                  Enviar
                </Button>
              </div>
            </form>
          )}
        </Card>
      </div>
    );
  }

  window.MarketScreen = MarketScreen;
  window.ContactBlock = ContactBlock;
})();

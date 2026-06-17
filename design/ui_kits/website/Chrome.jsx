/* HMG Watches — site chrome: Header + Footer (light editorial, responsive). */
(function () {
  const Icon = window.Icon;
  const LOGO = "../../assets/logo.png";
  const NAV = [
    { key: "home", label: "Início" },
    { key: "catalog", label: "Catálogo" },
    { key: "market", label: "Mercado" },
    { key: "blog", label: "Diário de Bordo" },
    { key: "about", label: "Sobre" },
    { key: "contact", label: "Contacto" },
  ];

  function Wordmark({ go, compact }) {
    return (
      <a
        onClick={() => go("home")}
        style={{
          cursor: "pointer",
          display: "flex",
          alignItems: "baseline",
          gap: 9,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontSize: compact ? 23 : 27,
            fontWeight: 600,
            letterSpacing: "0.01em",
            color: "var(--text-primary)",
          }}
        >
          HMG
        </span>
        <span
          style={{
            fontFamily: "var(--font-ui)",
            fontSize: compact ? 9 : 10,
            letterSpacing: "0.36em",
            textTransform: "uppercase",
            color: "var(--accent-press)",
          }}
        >
          Watches
        </span>
      </a>
    );
  }

  function Header({ route, go }) {
    const vp = window.useVP();
    const [scrolled, setScrolled] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    React.useEffect(() => {
      const el = document.getElementById("hmg-scroll");
      const onScroll = () =>
        setScrolled((el ? el.scrollTop : window.scrollY) > 16);
      const target = el || window;
      target.addEventListener("scroll", onScroll);
      return () => target.removeEventListener("scroll", onScroll);
    }, []);
    React.useEffect(() => {
      setOpen(false);
    }, [route]);

    const solid = scrolled || open;
    const isActive = (k) =>
      route === k ||
      (k === "blog" && route === "article") ||
      (k === "catalog" && route === "detail");

    return (
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: solid ? "rgba(247,242,232,0.92)" : "transparent",
          backdropFilter: solid ? "blur(16px)" : "none",
          borderBottom: `1px solid ${solid ? "var(--border-subtle)" : "transparent"}`,
          transition: "all var(--dur-base) var(--ease-out)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: vp.mobile ? "0 20px" : "0 56px",
            height: vp.mobile ? 70 : 84,
          }}
        >
          <Wordmark go={go} compact={vp.mobile} />
          {vp.desktop ? (
            <nav style={{ display: "flex", gap: 32, alignItems: "center" }}>
              {NAV.map((n) => {
                const active = isActive(n.key);
                const isContact = n.key === "contact";
                return (
                  <a
                    key={n.key}
                    onClick={() => go(n.key)}
                    style={{
                      cursor: "pointer",
                      fontFamily: "var(--font-ui)",
                      fontSize: 12.5,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: isContact
                        ? "var(--accent-press)"
                        : active
                          ? "var(--text-primary)"
                          : "var(--text-secondary)",
                      position: "relative",
                      paddingBottom: 5,
                      transition: "color var(--dur-base) var(--ease-out)",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "var(--accent-press)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = isContact
                        ? "var(--accent-press)"
                        : active
                          ? "var(--text-primary)"
                          : "var(--text-secondary)")
                    }
                  >
                    {n.label}
                    <span
                      style={{
                        position: "absolute",
                        left: 0,
                        bottom: 0,
                        height: 1.5,
                        width: active ? "100%" : 0,
                        background: "var(--accent)",
                        transition: "width var(--dur-base) var(--ease-out)",
                      }}
                    />
                  </a>
                );
              })}
            </nav>
          ) : (
            <button
              onClick={() => setOpen((o) => !o)}
              aria-label="Menu"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--text-primary)",
                padding: 8,
                display: "flex",
              }}
            >
              <Icon name={open ? "x" : "menu"} size={24} />
            </button>
          )}
        </div>

        {/* Mobile dropdown */}
        {!vp.desktop && open && (
          <div
            style={{
              borderTop: "1px solid var(--border-subtle)",
              padding: "12px 20px 22px",
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            {NAV.map((n) => (
              <a
                key={n.key}
                onClick={() => go(n.key)}
                style={{
                  cursor: "pointer",
                  padding: "13px 6px",
                  fontFamily: "var(--font-ui)",
                  fontSize: 15,
                  letterSpacing: "0.04em",
                  color:
                    n.key === "contact"
                      ? "var(--accent-press)"
                      : isActive(n.key)
                        ? "var(--accent-press)"
                        : "var(--text-primary)",
                  borderBottom: "1px solid var(--border-subtle)",
                }}
              >
                {n.label}
              </a>
            ))}
          </div>
        )}
      </header>
    );
  }

  function Footer({ go }) {
    const vp = window.useVP();
    const col = (title, items) => (
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div
          style={{
            fontFamily: "var(--font-ui)",
            fontSize: 11,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--accent-press)",
          }}
        >
          {title}
        </div>
        {items.map((it) => (
          <a
            key={it.label}
            onClick={it.go}
            style={{
              cursor: "pointer",
              fontSize: 14,
              color: "var(--text-secondary)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "var(--text-primary)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "var(--text-secondary)")
            }
          >
            {it.label}
          </a>
        ))}
      </div>
    );
    return (
      <footer
        style={{
          borderTop: "1px solid var(--border-strong)",
          padding: vp.mobile ? "56px 20px 36px" : "84px 56px 44px",
          background: "var(--bg-page-alt)",
        }}
      >
        <div
          style={{
            maxWidth: 1320,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: vp.mobile ? "1fr 1fr" : "1.7fr 1fr 1fr 1fr",
            gap: vp.mobile ? "40px 24px" : 48,
          }}
        >
          <div style={{ gridColumn: vp.mobile ? "1 / -1" : "auto" }}>
            <img
              src={LOGO}
              alt="HMG Watches"
              style={{
                height: 84,
                width: "auto",
                mixBlendMode: "multiply",
                marginBottom: 16,
              }}
            />
            <p
              style={{
                fontSize: 15,
                lineHeight: 1.8,
                color: "var(--text-secondary)",
                maxWidth: 300,
              }}
            >
              Relógios de exceção. Curados, autenticados, prontos a usar.
            </p>
            <div style={{ display: "flex", gap: 12, marginTop: 22 }}>
              {["instagram", "message-circle", "mail"].map((ic) => (
                <a
                  key={ic}
                  onClick={() =>
                    ic === "mail" || ic === "message-circle"
                      ? go("contact")
                      : null
                  }
                  style={{
                    cursor: "pointer",
                    width: 42,
                    height: 42,
                    border: "1px solid var(--border-strong)",
                    borderRadius: "50%",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--text-secondary)",
                    transition: "all var(--dur-base) var(--ease-out)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--accent)";
                    e.currentTarget.style.color = "var(--accent-press)";
                    e.currentTarget.style.background = "var(--surface-card)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--border-strong)";
                    e.currentTarget.style.color = "var(--text-secondary)";
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  <Icon name={ic} size={18} />
                </a>
              ))}
            </div>
          </div>
          {col("Navegar", [
            { label: "Catálogo", go: () => go("catalog") },
            { label: "Mercado", go: () => go("market") },
            { label: "Diário de Bordo", go: () => go("blog") },
          ])}
          {col("Empresa", [
            { label: "Sobre Nós", go: () => go("about") },
            { label: "Contacto", go: () => go("contact") },
          ])}
          {col("Legal", [
            { label: "Política de Privacidade", go: () => {} },
            { label: "Termos de Utilização", go: () => {} },
          ])}
        </div>
        <div
          style={{
            maxWidth: 1320,
            margin: "56px auto 0",
            paddingTop: 28,
            borderTop: "1px solid var(--border-subtle)",
            display: "flex",
            flexDirection: vp.mobile ? "column" : "row",
            gap: 10,
            justifyContent: "space-between",
            fontSize: 12,
            color: "var(--text-tertiary)",
          }}
        >
          <span>© 2026 HMG Watches. Todos os direitos reservados.</span>
          <span>Portugal</span>
        </div>
      </footer>
    );
  }

  window.Header = Header;
  window.Footer = Footer;
})();

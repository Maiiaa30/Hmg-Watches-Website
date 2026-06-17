/* HMG Watches — Home & About screens (light editorial luxe, responsive). */
(function () {
  const { Button, Badge, WatchCard, Overline, Card } = window.HMGWatchesDesignSystem_1cb2d0;
  const Icon = window.Icon, WatchVisual = window.WatchVisual, D = window.HMGDATA;
  const pad = (vp) => (vp.mobile ? "0 20px" : vp.tablet ? "0 36px" : "0 56px");
  const WRAP = (vp) => ({ maxWidth: 1320, margin: "0 auto", padding: pad(vp) });
  const gx = (vp) => pad(vp).split(" ")[1];

  function NumberedHead({ n, eyebrow, title, sub, action, vp }) {
    return (
      <div style={{ marginBottom: vp.mobile ? 40 : 56 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
          <span style={{ fontFamily: "var(--font-display)", fontSize: 15, color: "var(--accent)", fontStyle: "italic" }}>{n}</span>
          <span style={{ height: 1, width: 44, background: "var(--accent)" }} />
          <Overline>{eyebrow}</Overline>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
          <div>
            <h2 style={{ fontSize: vp.mobile ? 32 : 44, lineHeight: 1.1 }}>{title}</h2>
            {sub && <p style={{ fontSize: 17, lineHeight: 1.7, color: "var(--text-secondary)", marginTop: 16, maxWidth: 520 }}>{sub}</p>}
          </div>
          {action}
        </div>
      </div>
    );
  }

  // Display niche (arch) — real photo when `image` given, else the drawn watch
  function ArchNiche({ hue, size = 380, image }) {
    return (
      <div style={{ position: "relative", width: "100%", maxWidth: size, display: "flex", justifyContent: "center" }}>
        <div style={{ position: "absolute", left: "4%", right: "4%", bottom: 0, top: "2%", background: image ? "#EFE8D7" : "linear-gradient(180deg, #FFFFFF 0%, #F4EEE1 100%)", borderRadius: "999px 999px 8px 8px", border: "1px solid var(--border-subtle)", boxShadow: "var(--shadow-card)", overflow: "hidden" }}>
          {image && <img src={image} alt="Relógio em destaque" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 38%" }} />}
        </div>
        <div style={{ position: "absolute", left: "9%", right: "9%", bottom: "4%", top: "7%", borderRadius: "999px 999px 6px 6px", border: "1px solid rgba(182,138,46,0.45)", pointerEvents: "none" }} />
        {!image && (
          <div style={{ position: "relative", zIndex: 2, width: "62%", padding: "26% 0 22%", filter: "drop-shadow(0 30px 50px rgba(40,33,20,0.18))" }}>
            <WatchVisual hue={hue} size="100%" />
          </div>
        )}
        {image && <div style={{ position: "relative", width: "100%", paddingBottom: "118%" }} />}
      </div>
    );
  }

  function HomeScreen({ go, openWatch }) {
    const vp = window.useVP();
    const hero = D.watches[0];
    const featured = D.watches.slice(0, 4);
    const featCols = vp.mobile ? "1fr" : vp.tablet ? "repeat(2, 1fr)" : "repeat(4, 1fr)";
    const blogCols = vp.desktop ? "repeat(3, 1fr)" : vp.tablet ? "repeat(2, 1fr)" : "1fr";

    return (
      <div>
        {/* Hero — Editorial */}
        <section style={{ position: "relative", minHeight: vp.mobile ? "auto" : "calc(100vh - 84px)", display: "flex", alignItems: "center", padding: vp.mobile ? "44px 0 56px" : "20px 0" }}>
          <div style={{ ...WRAP(vp), display: "grid", gridTemplateColumns: vp.desktop ? "1fr 1fr" : "1fr", gap: vp.mobile ? 44 : 56, alignItems: "center", width: "100%" }}>
            <div style={{ maxWidth: 560 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 22 }}>
                <span style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 17, color: "var(--accent)", whiteSpace: "nowrap" }}>Nº 01</span>
                <span style={{ height: 1, width: 46, background: "var(--accent)" }} />
                <Overline>Em destaque</Overline>
              </div>
              <h1 style={{ fontSize: vp.mobile ? 46 : vp.tablet ? 62 : 78, lineHeight: 1.02, letterSpacing: "-0.025em" }}>Tempo que<br/><span style={{ fontStyle: "italic", color: "var(--accent-press)" }}>não</span> se perde.</h1>
              <p style={{ fontSize: vp.mobile ? 17 : 19, lineHeight: 1.7, color: "var(--text-secondary)", marginTop: 26, maxWidth: 400 }}>
                Relógios de exceção. Curados, autenticados, prontos a usar.
              </p>
              <div style={{ display: "flex", gap: 14, marginTop: 38, flexWrap: "wrap" }}>
                <Button variant="ghost-gold" size={vp.mobile ? "md" : "lg"} onClick={() => go("catalog")} iconRight={<Icon name="arrow-right" size={16} />}>Ver Coleção</Button>
                <Button variant="ghost-light" size={vp.mobile ? "md" : "lg"} onClick={() => go("about")}>A nossa história</Button>
              </div>
            </div>

            <div style={{ position: "relative", height: vp.desktop ? 500 : "auto" }}>
              <div onClick={() => openWatch(hero.id)} style={{ position: vp.desktop ? "absolute" : "relative", right: 0, top: vp.desktop ? "50%" : "auto", transform: vp.desktop ? "translateY(-50%)" : "none", width: vp.desktop ? 380 : "100%", maxWidth: vp.desktop ? "none" : 420, marginLeft: vp.desktop ? 0 : "auto", aspectRatio: "37 / 47", borderRadius: 8, overflow: "hidden", border: "1px solid var(--border-strong)", boxShadow: "var(--shadow-float)", cursor: "pointer" }}>
                <img src={hero.images && hero.images[0]} alt={`${hero.brand} ${hero.model}`} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 42%" }} />
              </div>
              <div onClick={() => openWatch(hero.id)} style={{ position: "absolute", left: vp.desktop ? 0 : 16, bottom: vp.desktop ? 56 : 16, background: "var(--surface-card)", border: "1px solid var(--border-subtle)", padding: "16px 20px", boxShadow: "var(--shadow-card)", cursor: "pointer", maxWidth: 220 }}>
                <div style={{ fontFamily: "var(--font-ui)", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--text-secondary)" }}>{hero.brand}</div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 19, marginTop: 4, lineHeight: 1.15 }}>{hero.model}</div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginTop: 8 }}>
                  <span style={{ fontSize: 14, color: "var(--accent-press)" }}>{hero.price}</span>
                  <Icon name="arrow-up-right" size={15} color="var(--accent-press)" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured */}
        <section style={{ ...WRAP(vp), padding: `${vp.mobile ? "72px" : "120px"} ${gx(vp)}`, borderTop: "1px solid var(--border-subtle)" }}>
          <NumberedHead vp={vp} n="01" eyebrow="Coleção em destaque" title="Peças selecionadas"
            sub="Uma curadoria breve do que está disponível agora — cada relógio autenticado e pronto a usar."
            action={!vp.mobile && <Button variant="ghost-light" onClick={() => go("catalog")} iconRight={<Icon name="arrow-right" size={15} />}>Ver tudo</Button>} />
          <div style={{ display: "grid", gridTemplateColumns: featCols, gap: 28 }}>
            {featured.map((w) => (
              <WatchCard key={w.id} brand={w.brand} model={w.model} reference={w.ref} price={w.price} status={w.status}
                image={w.images && w.images[0]} visual={<WatchVisual hue={w.hue} sold={w.status === "sold"} />} onClick={() => openWatch(w.id)} />
            ))}
          </div>
          {vp.mobile && <div style={{ marginTop: 40 }}><Button variant="ghost-light" fullWidth onClick={() => go("catalog")} iconRight={<Icon name="arrow-right" size={15} />}>Ver tudo</Button></div>}
        </section>

        {/* About teaser */}
        <section style={{ background: "var(--bg-page-alt)", borderTop: "1px solid var(--border-subtle)", borderBottom: "1px solid var(--border-subtle)" }}>
          <div style={{ ...WRAP(vp), padding: `${vp.mobile ? "72px" : "130px"} ${gx(vp)}`, display: "grid", gridTemplateColumns: vp.desktop ? "1fr 1fr" : "1fr", gap: vp.mobile ? 36 : 90, alignItems: "center" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
                <span style={{ fontFamily: "var(--font-display)", fontSize: 15, color: "var(--accent)", fontStyle: "italic" }}>02</span>
                <span style={{ height: 1, width: 44, background: "var(--accent)" }} />
                <Overline>Sobre nós</Overline>
              </div>
              <h2 style={{ fontSize: vp.mobile ? 34 : 46, lineHeight: 1.12 }}>Uma montra limpa<br/>que serve as peças.</h2>
            </div>
            <div>
              <p style={{ fontSize: vp.mobile ? 17 : 19, lineHeight: 1.85, color: "var(--text-secondary)" }}>
                Não vendemos tempo — devolvemos-lhe valor. Cada relógio que chega à HMG é estudado, autenticado e avaliado com o mesmo rigor com que escolheríamos para nós próprios.
              </p>
              <div style={{ marginTop: 34 }}>
                <Button variant="ghost-gold" onClick={() => go("about")} iconRight={<Icon name="arrow-right" size={15} />}>Saber mais</Button>
              </div>
            </div>
          </div>
        </section>

        {/* Blog teaser */}
        <section style={{ ...WRAP(vp), padding: `${vp.mobile ? "72px" : "120px"} ${gx(vp)}` }}>
          <NumberedHead vp={vp} n="03" eyebrow="Diário de Bordo" title="Do nosso caderno"
            action={!vp.mobile && <Button variant="ghost-light" onClick={() => go("blog")} iconRight={<Icon name="arrow-right" size={15} />}>Todos os artigos</Button>} />
          <div style={{ display: "grid", gridTemplateColumns: blogCols, gap: vp.mobile ? 40 : 36 }}>
            {D.articles.slice(0, 3).map((a) => <window.ArticleCard key={a.id} a={a} go={() => go("article", a.id)} />)}
          </div>
        </section>

        {/* Contact — on the homepage */}
        <section id="home-contact" style={{ background: "var(--bg-page-alt)", borderTop: "1px solid var(--border-subtle)" }}>
          <div style={{ ...WRAP(vp), padding: `${vp.mobile ? "72px" : "120px"} ${gx(vp)}` }}>
            <window.ContactBlock />
          </div>
        </section>
      </div>
    );
  }

  function AboutScreen({ go }) {
    const vp = window.useVP();
    const values = [
      { n: "01", icon: "search", title: "Curadoria", text: "Selecionamos poucas peças, mas certas. Cada relógio passa por um crivo apertado antes de chegar à montra." },
      { n: "02", icon: "shield-check", title: "Autenticidade", text: "Verificação completa de número de série, movimento e proveniência. Garantia de autenticidade em todas as peças." },
      { n: "03", icon: "clock", title: "Prontos a usar", text: "Revisados quando necessário e entregues no seu melhor estado — para começar a contar tempo desde o primeiro dia." },
    ];
    return (
      <div>
        <section style={{ ...WRAP(vp), padding: `${vp.mobile ? "72px" : "120px"} ${gx(vp)} 70px`, textAlign: "center", maxWidth: 860 }}>
          <Overline>Sobre a HMG Watches</Overline>
          <h1 style={{ fontSize: vp.mobile ? 42 : 64, lineHeight: 1.08, marginTop: 22 }}>Começou com uma<br/><span style={{ fontStyle: "italic", color: "var(--accent-press)" }}>obsessão honesta.</span></h1>
          <p style={{ fontSize: vp.mobile ? 17 : 20, lineHeight: 1.85, color: "var(--text-secondary)", marginTop: 26 }}>
            A HMG nasceu da convicção simples de que um bom relógio não devia ser um mistério. Reunimos anos de procura, comparação e paixão num lugar só — para que comprar uma peça de exceção seja tão claro como apreciá-la.
          </p>
        </section>
        <section style={{ ...WRAP(vp), padding: `20px ${gx(vp)} 80px` }}>
          <div style={{ aspectRatio: vp.mobile ? "4 / 3" : "21 / 9", borderRadius: 8, border: "1px solid var(--border-subtle)", background: "linear-gradient(135deg, #FCFAF4 0%, #EFE8D7 100%)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-tertiary)", fontSize: 13, letterSpacing: "0.18em", textTransform: "uppercase", boxShadow: "var(--shadow-soft)" }}>
            Retrato da equipa · fotografia
          </div>
        </section>
        <section style={{ ...WRAP(vp), padding: `20px ${gx(vp)} ${vp.mobile ? "72px" : "120px"}` }}>
          <div style={{ display: "grid", gridTemplateColumns: vp.desktop ? "repeat(3, 1fr)" : "1fr", gap: 28 }}>
            {values.map((v) => (
              <Card key={v.title} padding={vp.mobile ? "34px 28px" : "44px 38px"}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
                  <span style={{ color: "var(--accent-press)" }}><Icon name={v.icon} size={26} /></span>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: 30, fontStyle: "italic", color: "var(--border-strong)" }}>{v.n}</span>
                </div>
                <h3 style={{ fontSize: 25, marginBottom: 14 }}>{v.title}</h3>
                <p style={{ fontSize: 15, lineHeight: 1.8, color: "var(--text-secondary)" }}>{v.text}</p>
              </Card>
            ))}
          </div>
        </section>
        <section style={{ background: "var(--bg-page-alt)", borderTop: "1px solid var(--border-subtle)" }}>
          <div style={{ ...WRAP(vp), padding: `${vp.mobile ? "72px" : "110px"} ${gx(vp)}`, textAlign: "center" }}>
            <h2 style={{ fontSize: vp.mobile ? 30 : 40 }}>Tem um relógio para vender?</h2>
            <p style={{ fontSize: 17, color: "var(--text-secondary)", marginTop: 16, marginBottom: 38 }}>Avaliamos a sua peça com transparência e sem compromisso.</p>
            <div style={{ display: "flex", justifyContent: "center" }}><Button variant="ghost-gold" size="lg" onClick={() => go("contact")}>Falar connosco</Button></div>
          </div>
        </section>
      </div>
    );
  }

  window.HomeScreen = HomeScreen;
  window.AboutScreen = AboutScreen;
})();

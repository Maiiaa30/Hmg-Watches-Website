/* HMG Watches — Blog list & article screens + ArticleCard (responsive). */
(function () {
  const { Button, Badge, Overline, Card } = window.HMGWatchesDesignSystem_1cb2d0;
  const Icon = window.Icon, D = window.HMGDATA;
  const pad = (vp) => (vp.mobile ? "0 20px" : vp.tablet ? "0 36px" : "0 56px");
  const WRAP = (vp) => ({ maxWidth: 1320, margin: "0 auto", padding: pad(vp) });
  const NARROW = (vp) => ({ maxWidth: 760, margin: "0 auto", padding: vp.mobile ? "0 20px" : "0 24px" });
  const gx = (vp) => pad(vp).split(" ")[1];
  const CATS = ["Todos", "Novidades", "Curiosidades", "Guias", "Mercado"];

  function CoverArt({ hue, ratio = "16 / 10", label }) {
    return (
      <div style={{ aspectRatio: ratio, borderRadius: 6, overflow: "hidden", position: "relative",
        background: `linear-gradient(140deg, hsl(${hue} 26% 93%) 0%, hsl(${hue} 20% 84%) 100%)`,
        display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid var(--border-subtle)" }}>
        <div style={{ width: "42%", filter: "drop-shadow(0 18px 30px rgba(40,33,20,0.16))" }}><window.WatchVisual hue={hue} size="100%" /></div>
        {label && <span style={{ position: "absolute", bottom: 12, right: 14, fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--text-tertiary)" }}>{label}</span>}
      </div>
    );
  }

  function ArticleCard({ a, go }) {
    const [hover, setHover] = React.useState(false);
    return (
      <article onClick={go} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
        style={{ cursor: "pointer", display: "flex", flexDirection: "column", gap: 18 }}>
        <div style={{ transform: hover ? "translateY(-4px)" : "none", transition: "transform var(--dur-base) var(--ease-out)", boxShadow: hover ? "var(--shadow-card)" : "none", borderRadius: 6 }}>
          <CoverArt hue={a.hue} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--accent-press)" }}>{a.category}</span>
          <span style={{ width: 3, height: 3, borderRadius: "50%", background: "var(--text-tertiary)" }} />
          <span style={{ fontSize: 12, color: "var(--text-tertiary)" }}>{a.read} de leitura</span>
        </div>
        <h3 style={{ fontSize: 23, lineHeight: 1.25, color: hover ? "var(--accent-press)" : "var(--text-primary)", transition: "color var(--dur-base) var(--ease-out)" }}>{a.title}</h3>
        <p style={{ fontSize: 15, lineHeight: 1.7, color: "var(--text-secondary)" }}>{a.excerpt}</p>
        <span style={{ fontSize: 12, color: "var(--text-tertiary)" }}>{a.date}</span>
      </article>
    );
  }

  function BlogScreen({ go }) {
    const vp = window.useVP();
    const [cat, setCat] = React.useState("Todos");
    const list = cat === "Todos" ? D.articles : D.articles.filter((a) => a.category === cat);
    const cols = vp.desktop ? "repeat(3, 1fr)" : vp.tablet ? "repeat(2, 1fr)" : "1fr";
    return (
      <div>
        <section style={{ ...WRAP(vp), padding: `${vp.mobile ? "72px" : "110px"} ${gx(vp)} 56px`, textAlign: "center" }}>
          <Overline>Diário de Bordo</Overline>
          <h1 style={{ fontSize: vp.mobile ? 42 : 60, marginTop: 20 }}>Notas de relojoaria</h1>
          <p style={{ fontSize: vp.mobile ? 17 : 19, lineHeight: 1.7, color: "var(--text-secondary)", marginTop: 18, maxWidth: 560, marginLeft: "auto", marginRight: "auto" }}>
            Guias, leituras de mercado e curiosidades — escrito por quem vive o ofício.
          </p>
        </section>
        <section style={{ ...WRAP(vp), padding: `0 ${gx(vp)} 24px`, display: "flex", justifyContent: vp.mobile ? "flex-start" : "center", gap: 12, flexWrap: vp.mobile ? "nowrap" : "wrap", overflowX: vp.mobile ? "auto" : "visible" }}>
          {CATS.map((c) => {
            const on = c === cat;
            return (
              <button key={c} onClick={() => setCat(c)} style={{
                cursor: "pointer", padding: "9px 20px", borderRadius: 999, background: "transparent", whiteSpace: "nowrap",
                border: `1px solid ${on ? "var(--accent)" : "var(--border-strong)"}`,
                color: on ? "var(--accent-press)" : "var(--text-secondary)",
                fontFamily: "var(--font-ui)", fontSize: 12, letterSpacing: "0.06em", textTransform: "uppercase",
                transition: "all var(--dur-base) var(--ease-out)",
              }}>{c}</button>
            );
          })}
        </section>
        <section style={{ ...WRAP(vp), padding: `48px ${gx(vp)} 80px` }}>
          <div style={{ display: "grid", gridTemplateColumns: cols, gap: 28, rowGap: vp.mobile ? 48 : 64 }}>
            {list.map((a) => <ArticleCard key={a.id} a={a} go={() => go("article", a.id)} />)}
          </div>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 72 }}>
            <Button variant="ghost-light" size="lg">Carregar mais</Button>
          </div>
        </section>
      </div>
    );
  }

  function ArticleScreen({ go, articleId }) {
    const vp = window.useVP();
    const a = D.articles.find((x) => x.id === articleId) || D.articles[0];
    const related = D.articles.filter((x) => x.id !== a.id).slice(0, 3);
    const [copied, setCopied] = React.useState(false);
    const relCols = vp.desktop ? "repeat(3, 1fr)" : vp.tablet ? "repeat(2, 1fr)" : "1fr";
    const paras = [
      "Há um instante particular em que um relógio deixa de ser um objecto e passa a ser uma decisão. Acontece, quase sempre, antes de olharmos para o preço — quando o pulso reconhece o peso certo e o olho se prende a um detalhe que não sabíamos procurar.",
      "É esse instante que tentamos proteger. Não vendemos pressa, vendemos clareza: a informação que precisa para decidir bem, apresentada sem ruído.",
    ];
    return (
      <div>
        <section style={{ position: "relative", height: vp.mobile ? 360 : 520, display: "flex", alignItems: "flex-end", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(140deg, hsl(${a.hue} 30% 91%) 0%, hsl(${a.hue} 22% 80%) 100%)` }} />
          <div style={{ position: "absolute", inset: 0, background: "var(--scrim-bottom)" }} />
          <div style={{ ...NARROW(vp), position: "relative", paddingBottom: vp.mobile ? 36 : 56, maxWidth: 820 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20, flexWrap: "wrap" }}>
              <Badge variant="gold">{a.category}</Badge>
              <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{a.date}</span>
              <span style={{ width: 3, height: 3, borderRadius: "50%", background: "var(--text-tertiary)" }} />
              <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{a.read} de leitura</span>
            </div>
            <h1 style={{ fontSize: vp.mobile ? 34 : 56, lineHeight: 1.1 }}>{a.title}</h1>
          </div>
        </section>
        <article style={{ ...NARROW(vp), padding: `${vp.mobile ? "48px" : "72px"} ${vp.mobile ? "20px" : "24px"} 40px` }}>
          <p style={{ fontSize: vp.mobile ? 19 : 21, lineHeight: 1.7, color: "var(--text-primary)", marginBottom: 32, fontFamily: "var(--font-display)", fontWeight: 400 }}>{a.excerpt}</p>
          {paras.map((p, i) => <p key={i} style={{ fontSize: vp.mobile ? 17 : 19, lineHeight: 1.85, color: "var(--text-secondary)", marginBottom: 28 }}>{p}</p>)}
          <blockquote style={{ borderLeft: "2px solid var(--accent)", paddingLeft: 28, margin: "44px 0", fontFamily: "var(--font-display)", fontSize: vp.mobile ? 24 : 28, lineHeight: 1.4, color: "var(--text-primary)" }}>
            “Um bom relógio não se compra duas vezes. Compra-se com tempo.”
          </blockquote>
          {[
            "A diferença entre uma peça boa e uma peça certa está, quase sempre, nos detalhes invisíveis: a integridade da caixa, a honestidade do mostrador, a história documentada.",
            "É por isso que insistimos em mostrar tudo. Caixa, papéis, estado de conservação — a transparência é a nossa forma de respeito por quem compra.",
          ].map((p, i) => <p key={i} style={{ fontSize: vp.mobile ? 17 : 19, lineHeight: 1.85, color: "var(--text-secondary)", marginBottom: 28 }}>{p}</p>)}
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 48, paddingTop: 32, borderTop: "1px solid var(--border-subtle)" }}>
            <Button variant="ghost-light" size="sm" onClick={() => setCopied(true)} iconLeft={<Icon name={copied ? "check" : "link"} size={15} />}>
              {copied ? "Link copiado" : "Partilhar"}
            </Button>
          </div>
        </article>
        <section style={{ ...WRAP(vp), padding: `80px ${gx(vp)} 110px`, borderTop: "1px solid var(--border-subtle)", marginTop: 60 }}>
          <h2 style={{ fontSize: vp.mobile ? 26 : 30, marginBottom: 40 }}>Continuar a ler</h2>
          <div style={{ display: "grid", gridTemplateColumns: relCols, gap: 28, rowGap: 48 }}>
            {related.map((r) => <ArticleCard key={r.id} a={r} go={() => go("article", r.id)} />)}
          </div>
        </section>
      </div>
    );
  }

  window.ArticleCard = ArticleCard;
  window.BlogScreen = BlogScreen;
  window.ArticleScreen = ArticleScreen;
})();

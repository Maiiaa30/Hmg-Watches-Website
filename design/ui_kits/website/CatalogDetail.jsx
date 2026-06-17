/* HMG Watches — Catalog & Detail screens (responsive, real photos). */
(function () {
  const { Button, Badge, WatchCard, Overline, Checkbox, Select } = window.HMGWatchesDesignSystem_1cb2d0;
  const Icon = window.Icon, WatchVisual = window.WatchVisual, D = window.HMGDATA;
  const pad = (vp) => (vp.mobile ? "0 20px" : vp.tablet ? "0 36px" : "0 56px");
  const WRAP = (vp) => ({ maxWidth: 1320, margin: "0 auto", padding: pad(vp) });
  const gx = (vp) => pad(vp).split(" ")[1];
  const BRANDS = [...new Set(D.watches.map((w) => w.brand))];
  const MOVES = ["Automático", "Manual", "Quartzo"];

  function FilterGroup({ title, children }) {
    return (
      <div style={{ paddingBottom: 26, marginBottom: 26, borderBottom: "1px solid var(--border-subtle)" }}>
        <div style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 18 }}>{title}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>{children}</div>
      </div>
    );
  }

  function CatalogScreen({ openWatch }) {
    const vp = window.useVP();
    const [brands, setBrands] = React.useState([]);
    const [status, setStatus] = React.useState("Todos");
    const [moves, setMoves] = React.useState([]);
    const [sort, setSort] = React.useState("Mais recentes");
    const [q, setQ] = React.useState("");
    const [filtersOpen, setFiltersOpen] = React.useState(false);

    const toggle = (arr, set, v) => set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

    let list = D.watches.filter((w) => {
      if (brands.length && !brands.includes(w.brand)) return false;
      if (status === "Disponível" && w.status !== "available") return false;
      if (status === "Vendido" && w.status !== "sold") return false;
      if (moves.length && !moves.includes(w.movement)) return false;
      if (q && !`${w.brand} ${w.model} ${w.ref}`.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
    if (sort === "Preço crescente") list = [...list].sort((a, b) => a.priceNum - b.priceNum);
    if (sort === "Preço decrescente") list = [...list].sort((a, b) => b.priceNum - a.priceNum);

    const gridCols = vp.mobile ? "1fr" : vp.tablet ? "repeat(2, 1fr)" : "repeat(3, 1fr)";
    const showFilters = vp.desktop || filtersOpen;

    const Filters = (
      <aside>
        {vp.desktop && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28, color: "var(--text-primary)" }}>
            <Icon name="sliders-horizontal" size={18} /><span style={{ fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase" }}>Filtros</span>
          </div>
        )}
        <FilterGroup title="Marca">
          {BRANDS.map((b) => <Checkbox key={b} label={b} checked={brands.includes(b)} onChange={() => toggle(brands, setBrands, b)} />)}
        </FilterGroup>
        <FilterGroup title="Estado">
          {["Todos", "Disponível", "Vendido"].map((s) => (
            <label key={s} style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer", fontSize: 14, color: "var(--text-secondary)" }}>
              <span style={{ width: 14, height: 14, borderRadius: "50%", border: `1px solid ${status === s ? "var(--accent)" : "var(--border-strong)"}`, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                {status === s && <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--accent)" }} />}
              </span>
              <input type="radio" checked={status === s} onChange={() => setStatus(s)} style={{ position: "absolute", opacity: 0 }} />{s}
            </label>
          ))}
        </FilterGroup>
        <FilterGroup title="Movimento">
          {MOVES.map((m) => <Checkbox key={m} label={m} checked={moves.includes(m)} onChange={() => toggle(moves, setMoves, m)} />)}
        </FilterGroup>
      </aside>
    );

    return (
      <div style={{ ...WRAP(vp), padding: `${vp.mobile ? "72px" : "100px"} ${gx(vp)} ${vp.mobile ? "80px" : "120px"}` }}>
        <div style={{ marginBottom: vp.mobile ? 32 : 48 }}>
          <Overline>Catálogo</Overline>
          <h1 style={{ fontSize: vp.mobile ? 38 : 52, marginTop: 16 }}>A coleção</h1>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: vp.desktop ? "260px 1fr" : "1fr", gap: vp.desktop ? 56 : 0, alignItems: "start" }}>
          {vp.desktop ? Filters : (
            <div style={{ marginBottom: 24 }}>
              <button onClick={() => setFiltersOpen((o) => !o)} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", background: "var(--surface-card)", border: "1px solid var(--border-strong)", borderRadius: 4, cursor: "pointer", color: "var(--text-primary)", fontFamily: "var(--font-ui)", fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}><Icon name="sliders-horizontal" size={17} /> Filtros</span>
                <Icon name={filtersOpen ? "chevron-down" : "chevron-right"} size={16} />
              </button>
              {showFilters && <div style={{ marginTop: 22 }}>{Filters}</div>}
            </div>
          )}

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: vp.mobile ? "stretch" : "center", marginBottom: 28, gap: 16, flexDirection: vp.mobile ? "column" : "row" }}>
              <div style={{ position: "relative", flex: 1, maxWidth: vp.mobile ? "none" : 360 }}>
                <span style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", color: "var(--text-tertiary)" }}><Icon name="search" size={18} /></span>
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Pesquisar marca, modelo, referência…"
                  style={{ width: "100%", padding: "12px 0 12px 30px", background: "transparent", border: "none", borderBottom: "1px solid var(--border-strong)", color: "var(--text-primary)", fontFamily: "var(--font-ui)", fontSize: 15, outline: "none" }} />
              </div>
              <div style={{ minWidth: vp.mobile ? "auto" : 200 }}>
                <Select value={sort} onChange={(e) => setSort(e.target.value)} options={["Mais recentes", "Preço crescente", "Preço decrescente"]} />
              </div>
            </div>
            <div style={{ fontSize: 13, color: "var(--text-tertiary)", marginBottom: 28 }}>{list.length} {list.length === 1 ? "relógio" : "relógios"}</div>

            {list.length === 0 ? (
              <div style={{ padding: "80px 20px", textAlign: "center", border: "1px solid var(--border-subtle)", borderRadius: 8, background: "var(--surface-card)" }}>
                <div style={{ color: "var(--text-tertiary)", display: "flex", justifyContent: "center", marginBottom: 22 }}><Icon name="search" size={40} strokeWidth={1} /></div>
                <h3 style={{ fontSize: 26, marginBottom: 12 }}>Nada encontrado</h3>
                <p style={{ fontSize: 15, color: "var(--text-secondary)", maxWidth: 360, margin: "0 auto 28px" }}>Não há peças que correspondam a estes filtros. Experimente alargar a procura.</p>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <Button variant="ghost-gold" onClick={() => { setBrands([]); setMoves([]); setStatus("Todos"); setQ(""); }}>Limpar filtros</Button>
                </div>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: gridCols, gap: 28 }}>
                {list.map((w) => (
                  <WatchCard key={w.id} brand={w.brand} model={w.model} reference={w.ref} price={w.price} status={w.status}
                    image={w.images && w.images[0]} visual={<WatchVisual hue={w.hue} sold={w.status === "sold"} />} onClick={() => openWatch(w.id)} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  function Spec({ label, value }) {
    return (
      <div style={{ display: "flex", justifyContent: "space-between", padding: "16px 0", borderBottom: "1px solid var(--border-subtle)", gap: 24 }}>
        <span style={{ fontSize: 14, color: "var(--text-secondary)" }}>{label}</span>
        <span style={{ fontSize: 14, color: "var(--text-primary)", textAlign: "right" }}>{value}</span>
      </div>
    );
  }

  function Gallery({ w, vp }) {
    const [active, setActive] = React.useState(0);
    const sold = w.status === "sold";
    const imgs = w.images || [];
    const hasPhotos = imgs.length > 0;
    return (
      <div>
        <div style={{ aspectRatio: "1 / 1", borderRadius: 8, border: "1px solid var(--border-subtle)", background: "var(--surface-raised)", display: "flex", alignItems: hasPhotos ? "stretch" : "flex-end", justifyContent: "center", position: "relative", overflow: "hidden", boxShadow: "var(--shadow-soft)" }}>
          <span style={{ position: "absolute", top: 20, right: 20, zIndex: 3 }}><Badge variant={sold ? "sold" : "available"} /></span>
          {hasPhotos ? (
            <img src={imgs[active]} alt={`${w.brand} ${w.model}`} style={{ width: "100%", height: "100%", objectFit: "cover", filter: sold ? "grayscale(0.5)" : "none" }} />
          ) : (
            <React.Fragment>
              <div style={{ position: "absolute", left: "16%", right: "16%", bottom: 0, top: "10%", background: "linear-gradient(180deg, #FFFFFF 0%, #F4EEE1 100%)", borderRadius: "999px 999px 6px 6px", border: "1px solid rgba(182,138,46,0.3)", borderBottom: "none" }} />
              <div style={{ width: "52%", position: "relative", zIndex: 2, marginBottom: "14%", filter: "drop-shadow(0 26px 44px rgba(40,33,20,0.18))" }}><WatchVisual hue={w.hue} sold={sold} size="100%" /></div>
            </React.Fragment>
          )}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${hasPhotos ? Math.min(imgs.length, 5) : 5}, 1fr)`, gap: 12, marginTop: 16 }}>
          {(hasPhotos ? imgs : [0, 1, 2, 3, 4]).map((it, i) => (
            <button key={i} onClick={() => setActive(i)} style={{ aspectRatio: "1 / 1", borderRadius: 6, cursor: "pointer", overflow: "hidden", background: hasPhotos ? "var(--surface-raised)" : "linear-gradient(180deg, #FFFFFF 0%, #F4EEE1 100%)", border: `1px solid ${active === i ? "var(--accent)" : "var(--border-subtle)"}`, display: "flex", alignItems: "center", justifyContent: "center", padding: hasPhotos ? 0 : "14%", transition: "border-color var(--dur-base) var(--ease-out)" }}>
              {hasPhotos ? <img src={it} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ width: "100%" }}><WatchVisual hue={w.hue + i * 6} sold={sold} size="100%" /></div>}
            </button>
          ))}
        </div>
      </div>
    );
  }

  function DetailScreen({ watchId, openWatch, go }) {
    const vp = window.useVP();
    const w = D.watches.find((x) => x.id === watchId) || D.watches[0];
    const related = D.watches.filter((x) => x.id !== w.id && x.status === "available").slice(0, 3);
    const sold = w.status === "sold";
    const relCols = vp.mobile ? "1fr" : vp.tablet ? "repeat(2, 1fr)" : "repeat(3, 1fr)";

    return (
      <div style={{ ...WRAP(vp), padding: `${vp.mobile ? "24px" : "40px"} ${gx(vp)} ${vp.mobile ? "80px" : "120px"}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "var(--text-tertiary)", margin: "32px 0 40px", flexWrap: "wrap" }}>
          <a onClick={() => go("home")} style={{ cursor: "pointer" }}>Início</a><Icon name="chevron-right" size={13} />
          <a onClick={() => go("catalog")} style={{ cursor: "pointer" }}>Catálogo</a><Icon name="chevron-right" size={13} />
          <span style={{ color: "var(--text-secondary)" }}>{w.brand}</span><Icon name="chevron-right" size={13} />
          <span style={{ color: "var(--text-primary)" }}>{w.model}</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: vp.desktop ? "1fr 1fr" : "1fr", gap: vp.mobile ? 40 : 72, alignItems: "start" }}>
          <Gallery w={w} vp={vp} />

          <div>
            <Overline>{w.brand}</Overline>
            <h1 style={{ fontSize: vp.mobile ? 34 : 46, marginTop: 14, lineHeight: 1.1 }}>{w.model}</h1>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--text-tertiary)", marginTop: 12 }}>Ref. {w.ref}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 20, margin: "32px 0", flexWrap: "wrap" }}>
              <span style={{ fontSize: vp.mobile ? 30 : 34, fontFamily: "var(--font-display)", color: sold ? "var(--text-tertiary)" : "var(--text-primary)" }}>{w.price}</span>
              <Badge variant={sold ? "sold" : "available"} />
            </div>
            <p style={{ fontSize: 16, lineHeight: 1.8, color: "var(--text-secondary)", marginBottom: 36 }}>
              {w.brand} {w.model} de {w.year}, em {w.caseMat.toLowerCase()}. Peça autenticada, revista e pronta a usar — acompanhada da documentação disponível.
            </p>
            <div style={{ marginBottom: 44 }}>
              <Button variant="ghost-gold" size="lg" fullWidth as="a" href={`mailto:ola@hmgwatches.pt?subject=Interesse: ${w.brand} ${w.model} (Ref. ${w.ref})`} iconRight={<Icon name="arrow-up-right" size={16} />} disabled={sold}>
                {sold ? "Peça vendida" : "Contactar sobre este relógio"}
              </Button>
            </div>

            <h3 style={{ fontSize: 13, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 4 }}>Especificações</h3>
            <Spec label="Marca" value={w.brand} />
            <Spec label="Modelo" value={w.model} />
            <Spec label="Referência" value={w.ref} />
            <Spec label="Ano de fabrico" value={w.year} />
            <Spec label="Movimento" value={w.movement} />
            <Spec label="Material da caixa" value={w.caseMat} />
            <Spec label="Diâmetro" value={w.diameter} />
            <Spec label="Bracelete / pulseira" value={w.strap} />
            <Spec label="Estado de conservação" value={w.condition} />
            <Spec label="Inclui caixa original" value={w.box ? "Sim" : "Não"} />
            <Spec label="Inclui papéis / documentação" value={w.papers ? "Sim" : "Não"} />
          </div>
        </div>

        <section style={{ marginTop: vp.mobile ? 80 : 120 }}>
          <h2 style={{ fontSize: vp.mobile ? 26 : 30, marginBottom: 40 }}>Poderá também gostar</h2>
          <div style={{ display: "grid", gridTemplateColumns: relCols, gap: 28 }}>
            {related.map((r) => (
              <WatchCard key={r.id} brand={r.brand} model={r.model} reference={r.ref} price={r.price} status={r.status}
                image={r.images && r.images[0]} visual={<WatchVisual hue={r.hue} sold={r.status === "sold"} />} onClick={() => openWatch(r.id)} />
            ))}
          </div>
        </section>
      </div>
    );
  }

  window.CatalogScreen = CatalogScreen;
  window.DetailScreen = DetailScreen;
})();

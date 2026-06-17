/* HMG Watches — Admin sample data + chart helpers. Exposes window.ADMINDATA. */
(function () {
  const visits30 = [120,138,131,150,162,144,158,171,165,180,176,190,205,198,212,206,225,219,234,228,246,240,255,262,251,268,274,281,290,305];
  const visits7 = [228,246,240,255,262,251,268];
  const visits90label = "Últimos 30 dias";

  const metrics = [
    { label: "Visitas hoje", value: "1.284", delta: "+8,2%", up: true, icon: "eye" },
    { label: "Relógios em stock", value: "37", delta: "+3", up: true, icon: "watch" },
    { label: "Relógios vendidos", value: "112", delta: "+5 este mês", up: true, icon: "check" },
    { label: "Artigos publicados", value: "48", delta: "+2", up: true, icon: "file-text" },
    { label: "Leads não lidos", value: "9", delta: "carece atenção", up: false, icon: "bell" },
  ];

  const topWatches = [
    { brand: "Patek Philippe", model: "Nautilus", ref: "5711/1A", views: 4820 },
    { brand: "Rolex", model: "Submariner Date", ref: "126610LN", views: 3915 },
    { brand: "Audemars Piguet", model: "Royal Oak", ref: "15500ST", views: 3240 },
    { brand: "Omega", model: "Speedmaster Professional", ref: "310.30.42", views: 2680 },
    { brand: "Cartier", model: "Santos de Cartier", ref: "WSSA0018", views: 2114 },
  ];

  const activity = [
    { icon: "watch", text: "Relógio adicionado — Vacheron Overseas 4500V", time: "há 12 min" },
    { icon: "check", text: "Marcado como vendido — Royal Oak 15500ST", time: "há 1 h" },
    { icon: "file-text", text: "Artigo publicado — «O regresso do Nautilus»", time: "há 3 h" },
    { icon: "bell", text: "Novo lead — interesse no Submariner 126610LN", time: "há 4 h" },
    { icon: "pencil", text: "Preço actualizado — Speedmaster 310.30.42", time: "ontem" },
  ];

  const stock = [
    { brand: "Rolex", model: "Submariner Date", ref: "126610LN", price: "€ 14.500", status: "available", added: "10 Jun 2026", hue: 205 },
    { brand: "Omega", model: "Speedmaster Professional", ref: "310.30.42", price: "€ 6.200", status: "available", added: "8 Jun 2026", hue: 30 },
    { brand: "Patek Philippe", model: "Nautilus", ref: "5711/1A", price: "€ 132.000", status: "available", added: "2 Jun 2026", hue: 215 },
    { brand: "Audemars Piguet", model: "Royal Oak", ref: "15500ST", price: "€ 48.900", status: "sold", added: "28 Mai 2026", hue: 220 },
    { brand: "Cartier", model: "Santos de Cartier", ref: "WSSA0018", price: "€ 7.450", status: "available", added: "24 Mai 2026", hue: 38 },
    { brand: "Tudor", model: "Black Bay Fifty-Eight", ref: "M79030N", price: "€ 3.300", status: "available", added: "20 Mai 2026", hue: 0 },
    { brand: "Jaeger-LeCoultre", model: "Reverso Classic", ref: "Q3858520", price: "€ 8.900", status: "sold", added: "12 Mai 2026", hue: 35 },
  ];

  const posts = [
    { title: "Como escolher o seu primeiro Rolex", category: "Guias", status: "Publicado", date: "12 Jun 2026" },
    { title: "O regresso do Nautilus ao seu valor justo", category: "Mercado", status: "Publicado", date: "5 Jun 2026" },
    { title: "Pátina tropical: defeito ou tesouro?", category: "Curiosidades", status: "Pendente", date: "—" },
    { title: "Watches & Wonders 2026: o que chegou", category: "Novidades", status: "Pendente", date: "—" },
    { title: "Caixa e papéis: quanto valem mesmo?", category: "Guias", status: "Rascunho", date: "—" },
  ];

  const topPages = [
    { page: "/catalogo", views: "12.480", pct: 100 },
    { page: "/relogio/nautilus-5711", views: "4.820", pct: 39 },
    { page: "/ (homepage)", views: "4.210", pct: 34 },
    { page: "/mercado", views: "3.140", pct: 25 },
    { page: "/diario-de-bordo", views: "2.060", pct: 17 },
  ];

  window.ADMINDATA = { visits30, visits7, visits90label, metrics, topWatches, activity, stock, posts, topPages };
})();

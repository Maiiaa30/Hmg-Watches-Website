/* HMG Watches — sample data for the website UI kit. Exposes window.HMGDATA. */
(function () {
  const watches = [
    { id: "tag-heuer-professional-200m", brand: "TAG Heuer", model: "Professional 200m", ref: "WK1112", price: "€ 1.250", priceNum: 1250, year: 1998, movement: "Quartzo", status: "available", caseMat: "Aço inoxidável", diameter: "38 mm", strap: "Pulseira em aço", condition: "Muito bom", box: false, papers: false, hue: 210,
      images: ["../../assets/watches/th-pro-2.jpg", "../../assets/watches/th-pro-1.jpg", "../../assets/watches/th-pro-4.jpg", "../../assets/watches/th-pro-5.jpg", "../../assets/watches/th-pro-3.jpg"] },
    { id: "tag-heuer-2000-professional", brand: "TAG Heuer", model: "2000 Professional", ref: "964.008", price: "€ 980", priceNum: 980, year: 1995, movement: "Quartzo", status: "available", caseMat: "Aço & ouro", diameter: "28 mm", strap: "Bicolor · aço e ouro", condition: "Bom", box: false, papers: false, hue: 42,
      images: ["../../assets/watches/th-2000-2.jpg", "../../assets/watches/th-2000-1.jpg"] },
    { id: "rolex-submariner-126610ln", brand: "Rolex", model: "Submariner Date", ref: "126610LN", price: "€ 14.500", priceNum: 14500, year: 2021, movement: "Automático", status: "available", caseMat: "Oystersteel", diameter: "41 mm", strap: "Oyster · Oystersteel", condition: "Excelente", box: true, papers: true, hue: 205 },
    { id: "omega-speedmaster-310", brand: "Omega", model: "Speedmaster Professional", ref: "310.30.42", price: "€ 6.200", priceNum: 6200, year: 2020, movement: "Manual", status: "available", caseMat: "Aço inoxidável", diameter: "42 mm", strap: "Pulseira em aço", condition: "Muito bom", box: true, papers: false, hue: 30 },
    { id: "patek-nautilus-5711", brand: "Patek Philippe", model: "Nautilus", ref: "5711/1A", price: "€ 132.000", priceNum: 132000, year: 2019, movement: "Automático", status: "available", caseMat: "Aço inoxidável", diameter: "40 mm", strap: "Integrada · aço", condition: "Excelente", box: true, papers: true, hue: 215 },
    { id: "ap-royal-oak-15500", brand: "Audemars Piguet", model: "Royal Oak", ref: "15500ST", price: "€ 48.900", priceNum: 48900, year: 2022, movement: "Automático", status: "sold", caseMat: "Aço inoxidável", diameter: "41 mm", strap: "Integrada · aço", condition: "Excelente", box: true, papers: true, hue: 220 },
    { id: "cartier-santos-wssa0018", brand: "Cartier", model: "Santos de Cartier", ref: "WSSA0018", price: "€ 7.450", priceNum: 7450, year: 2021, movement: "Automático", status: "available", caseMat: "Aço inoxidável", diameter: "39,8 mm", strap: "QuickSwitch · aço", condition: "Muito bom", box: true, papers: true, hue: 38 },
    { id: "tudor-black-bay-58", brand: "Tudor", model: "Black Bay Fifty-Eight", ref: "M79030N", price: "€ 3.300", priceNum: 3300, year: 2020, movement: "Automático", status: "available", caseMat: "Aço inoxidável", diameter: "39 mm", strap: "Pulseira em aço", condition: "Bom", box: true, papers: false, hue: 0 },
    { id: "jlc-reverso-classic", brand: "Jaeger-LeCoultre", model: "Reverso Classic", ref: "Q3858520", price: "€ 8.900", priceNum: 8900, year: 2018, movement: "Manual", status: "sold", caseMat: "Aço inoxidável", diameter: "45,6 × 27,4 mm", strap: "Pele de bezerro", condition: "Muito bom", box: true, papers: true, hue: 35 },
    { id: "iwc-portugieser-chrono", brand: "IWC Schaffhausen", model: "Portugieser Chronograph", ref: "IW371617", price: "€ 7.100", priceNum: 7100, year: 2021, movement: "Automático", status: "available", caseMat: "Aço inoxidável", diameter: "41 mm", strap: "Pele de jacaré", condition: "Excelente", box: true, papers: true, hue: 210 },
    { id: "vacheron-overseas-4500v", brand: "Vacheron Constantin", model: "Overseas", ref: "4500V/110A", price: "€ 24.500", priceNum: 24500, year: 2019, movement: "Automático", status: "available", caseMat: "Aço inoxidável", diameter: "41 mm", strap: "Integrada · aço", condition: "Muito bom", box: true, papers: true, hue: 200 },
  ];

  const articles = [
    { id: "guia-comprar-primeiro-rolex", category: "Guias", title: "Como escolher o seu primeiro Rolex", excerpt: "Um guia honesto para quem entra no universo da relojoaria — o que olhar antes do preço.", date: "12 Jun 2026", read: "8 min", hue: 205 },
    { id: "mercado-nautilus-2026", category: "Mercado", title: "O regresso do Nautilus ao seu valor justo", excerpt: "Depois do pico de 2022, o mercado secundário encontrou um novo equilíbrio. Analisamos porquê.", date: "5 Jun 2026", read: "6 min", hue: 215 },
    { id: "anatomia-cronografo", category: "Curiosidades", title: "Anatomia de um cronógrafo manual", excerpt: "Do botão ao came em coluna — o que acontece dentro da caixa quando carrega no pulsador.", date: "28 Mai 2026", read: "5 min", hue: 30 },
    { id: "novidades-watches-and-wonders", category: "Novidades", title: "Watches & Wonders 2026: o que chegou", excerpt: "As peças que nos fizeram parar — e as que vão chegar à montra nos próximos meses.", date: "20 Mai 2026", read: "7 min", hue: 38 },
    { id: "box-and-papers", category: "Guias", title: "Caixa e papéis: quanto valem mesmo?", excerpt: "O conjunto completo pesa no preço — mas nem sempre da forma que imagina.", date: "14 Mai 2026", read: "4 min", hue: 35 },
    { id: "patine-tropical", category: "Curiosidades", title: "Pátina tropical: defeito ou tesouro?", excerpt: "Mostradores que desbotam para tons de chocolate dividem coleccionadores há décadas.", date: "2 Mai 2026", read: "6 min", hue: 25 },
  ];

  const metals = [
    { name: "Ouro", symbol: "XAU", price: "€ 2.214/oz", change: 0.82, spark: [38,40,39,42,44,43,46,48,47,50] },
    { name: "Prata", symbol: "XAG", price: "€ 27,40/oz", change: -0.45, spark: [50,48,49,47,46,47,45,44,45,43] },
    { name: "Platina", symbol: "XPT", price: "€ 920/oz", change: 1.24, spark: [30,32,31,34,36,35,38,40,42,44] },
    { name: "Paládio", symbol: "XPD", price: "€ 980/oz", change: -1.10, spark: [55,53,54,52,50,51,49,48,46,45] },
    { name: "Diamante", symbol: "IDX", price: "118,4 pts", change: 0.15, spark: [44,44,45,45,44,45,46,46,45,46] },
  ];

  const risers = [
    { brand: "Patek Philippe", model: "Nautilus", ref: "5711/1A", appreciation: "+23% em 6 meses", note: "A descontinuação do 5711 mantém a procura muito acima da oferta no secundário.", hue: 215 },
    { brand: "Rolex", model: "GMT-Master II «Pepsi»", ref: "126710BLRO", appreciation: "+17% em 6 meses", note: "Lista de espera longa nas boutiques empurra o prémio no mercado de revenda.", hue: 205 },
    { brand: "Audemars Piguet", model: "Royal Oak Jumbo", ref: "16202ST", appreciation: "+15% em 6 meses", note: "A edição do 50.º aniversário tornou-se referência imediata de coleccionador.", hue: 220 },
    { brand: "Omega", model: "Speedmaster «Snoopy»", ref: "310.32.42", appreciation: "+12% em 6 meses", note: "Produção limitada e forte apelo temático sustentam a valorização.", hue: 30 },
  ];

  window.HMGDATA = { watches, articles, metals, risers };
})();

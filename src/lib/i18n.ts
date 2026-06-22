// Lightweight i18n. English is the default; Portuguese is the existing copy.
// This module is pure (no next/headers) so it is safe to import from both
// Server and Client Components. Reading the active locale on the server lives
// in i18n-server.ts; the client toggle sets the cookie + refreshes.

export type Locale = "en" | "pt";

export const LOCALE_COOKIE = "hmg_lang";
export const DEFAULT_LOCALE: Locale = "en";
export const LOCALES: Locale[] = ["en", "pt"];

export function isLocale(v: unknown): v is Locale {
  return v === "en" || v === "pt";
}

interface Dict {
  nav: { home: string; catalogue: string; market: string; auctions: string; journal: string; about: string; contact: string };
  toggle: { switchTo: string; ariaTo: string };
  footer: { blurb: string; navigate: string; company: string; about: string; contact: string; rights: string; online: string };
  home: {
    featured: string; heroA: string; heroNot: string; heroB: string; heroSubtitle: string;
    viewCollection: string; ourStory: string;
    auctionToday: string; viewAuction: string;
    selectionOverline: string; selectionTitle: string; selectionText: string; viewAll: string;
    aboutOverline: string; aboutTitle: string; aboutText: string; learnMore: string;
    journalOverline: string; journalTitle: string; allArticles: string;
    contactOverline: string; contactTitle: string; contactText: string;
  };
  catalog: {
    overline: string; title: string; subtitle: string;
    available: string; sold: string; piece: string; pieces: string;
    comingSoon: string; noMatch: string; all: string;
    sortLabel: string; sortRecent: string; sortPriceDesc: string; sortPriceAsc: string;
    recentlyViewed: string; priceOnRequest: string; readingMins: string;
  };
  market: { overline: string; title: string; subtitle: string; metals: string; metalsNote: string; risers: string; topN: string; metalsUnavailable: string };
  auctions: { overline: string; title: string; subtitle: string; emptyTitle: string; emptyText: string; viewAuction: string; today: string };
  blog: { overline: string; title: string; heroTitle: string; subtitle: string; empty: string; filterAll: string };
  watch: { back: string; viewExternal: string };
  notFound: { title: string; text: string; home: string; collection: string };
}

const en: Dict = {
  nav: { home: "Home", catalogue: "Catalogue", market: "Market", auctions: "Auctions", journal: "Journal", about: "About", contact: "Contact" },
  toggle: { switchTo: "PT", ariaTo: "Mudar para Português" },
  footer: {
    blurb: "Luxury watches, online. Hand-selected and authenticated pieces, with personal curation for every client.",
    navigate: "Navigate", company: "Company", about: "About", contact: "Contact",
    rights: "All rights reserved.", online: "Online store · Portugal",
  },
  home: {
    featured: "Featured", heroA: "Time that\n", heroNot: "isn't", heroB: " lost.",
    heroSubtitle: "Exceptional watchmaking, chosen piece by piece. Curated, authenticated and ready for your wrist.",
    viewCollection: "View Collection", ourStory: "Our story",
    auctionToday: "Auction live now:", viewAuction: "View auction",
    selectionOverline: "Featured collection", selectionTitle: "Selected pieces",
    selectionText: "A brief curation of what's available now — each watch authenticated and ready to wear.",
    viewAll: "View all",
    aboutOverline: "About us", aboutTitle: "Passion for watchmaking,\ntaken further.",
    aboutText: "We started from a love of watches — and chose to go deeper. Today, more than selling, we look for the right piece for each person: studied, authenticated and chosen with the same care we'd keep it for ourselves.",
    learnMore: "Learn more",
    journalOverline: "Journal", journalTitle: "From our notebook", allArticles: "All articles",
    contactOverline: "Contact", contactTitle: "Interested in a watch?",
    contactText: "Tell us what you're after. We enjoy talking watchmaking as much as finding the right watch for each person.",
  },
  catalog: {
    overline: "Collection", title: "Catalogue",
    subtitle: "Available watches and a record of past sales. Every piece authenticated.",
    available: "Available", sold: "Sold", piece: "piece", pieces: "pieces",
    comingSoon: "New watches coming soon.", noMatch: "No piece matches the filters.", all: "All",
    sortLabel: "Sort", sortRecent: "Most recent", sortPriceDesc: "Price: high to low", sortPriceAsc: "Price: low to high",
    recentlyViewed: "Recently viewed", priceOnRequest: "Price on request", readingMins: "min read",
  },
  market: {
    overline: "Market", title: "Market pulse",
    subtitle: "Precious metals and watches in focus on the secondary market.",
    metals: "Precious metals",
    metalsNote: "Price per ounce (oz) in EUR · last 3 months · updated hourly. Source: Yahoo Finance.",
    risers: "Top movers", topN: "watches that gained the most", metalsUnavailable: "Metal quotes temporarily unavailable.",
  },
  auctions: {
    overline: "Auctions", title: "Upcoming auctions",
    subtitle: "We follow the watch auctions worth knowing. Each entry links straight to the auction house — bidding happens on their site, not here.",
    emptyTitle: "There are no auctions scheduled at the moment.",
    emptyText: "Check back soon — we announce the next key auctions here.",
    viewAuction: "View auction", today: "Today",
  },
  blog: {
    overline: "Journal", title: "Journal", heroTitle: "Watchmaking notes",
    subtitle: "Guides, market reads and curiosities — written by people who live the craft.",
    empty: "New articles coming soon.", filterAll: "All",
  },
  watch: { back: "Back to catalogue", viewExternal: "View external listing" },
  notFound: {
    title: "Page not found", text: "The page you're looking for doesn't exist or has moved. You might find what you're after in our collection.",
    home: "Back home", collection: "View collection",
  },
};

const pt: Dict = {
  nav: { home: "Início", catalogue: "Catálogo", market: "Mercado", auctions: "Leilões", journal: "Diário de Bordo", about: "Sobre", contact: "Contacto" },
  toggle: { switchTo: "EN", ariaTo: "Switch to English" },
  footer: {
    blurb: "Relojoaria de luxo, online. Peças seleccionadas e autenticadas, com curadoria pessoal para cada cliente.",
    navigate: "Navegar", company: "Empresa", about: "Sobre Nós", contact: "Contacto",
    rights: "Todos os direitos reservados.", online: "Loja online · Portugal",
  },
  home: {
    featured: "Em destaque", heroA: "Tempo que\n", heroNot: "não", heroB: " se perde.",
    heroSubtitle: "Relojoaria de exceção, escolhida peça a peça. Curada, autenticada e pronta para o seu pulso.",
    viewCollection: "Ver Coleção", ourStory: "A nossa história",
    auctionToday: "Leilão a decorrer:", viewAuction: "Ver leilão",
    selectionOverline: "Coleção em destaque", selectionTitle: "Peças selecionadas",
    selectionText: "Uma curadoria breve do que está disponível agora — cada relógio autenticado e pronto a usar.",
    viewAll: "Ver tudo",
    aboutOverline: "Sobre nós", aboutTitle: "Paixão por relojoaria,\nlevada mais longe.",
    aboutText: "Começámos pela paixão pelos relógios — e decidimos ir mais fundo. Hoje, mais do que vender, procuramos para cada pessoa a peça certa: estudada, autenticada e escolhida com o mesmo rigor com que a guardaríamos para nós.",
    learnMore: "Saber mais",
    journalOverline: "Diário de Bordo", journalTitle: "Do nosso caderno", allArticles: "Todos os artigos",
    contactOverline: "Contacto", contactTitle: "Tem interesse num relógio?",
    contactText: "Diga-nos o que procura. Gostamos de conversar sobre relojoaria tanto quanto de encontrar o relógio certo para cada pessoa.",
  },
  catalog: {
    overline: "Coleção", title: "Catálogo",
    subtitle: "Relógios disponíveis e histórico de vendas. Cada peça autenticada.",
    available: "Disponíveis", sold: "Vendidos", piece: "peça", pieces: "peças",
    comingSoon: "Em breve, novos relógios.", noMatch: "Nenhuma peça corresponde aos filtros.", all: "Todas",
    sortLabel: "Ordenar", sortRecent: "Mais recentes", sortPriceDesc: "Preço: maior primeiro", sortPriceAsc: "Preço: menor primeiro",
    recentlyViewed: "Vistos recentemente", priceOnRequest: "Sob consulta", readingMins: "min de leitura",
  },
  market: {
    overline: "Mercado", title: "Pulso do mercado",
    subtitle: "Metais preciosos e relógios em destaque no mercado secundário.",
    metals: "Metais preciosos",
    metalsNote: "Preços por onça (oz) em EUR · últimos 3 meses · actualizado de hora em hora. Fonte: Yahoo Finance.",
    risers: "Maiores valorizações", topN: "relógios que mais valorizaram", metalsUnavailable: "Cotações de metais temporariamente indisponíveis.",
  },
  auctions: {
    overline: "Leilões", title: "Próximos leilões",
    subtitle: "Acompanhamos os leilões de relojoaria que vale a pena conhecer. Cada entrada liga diretamente à casa leiloeira — a licitação decorre no site da casa, não aqui.",
    emptyTitle: "De momento, não há leilões agendados.",
    emptyText: "Volte em breve — anunciamos aqui os próximos leilões de referência.",
    viewAuction: "Ver leilão", today: "Hoje",
  },
  blog: {
    overline: "Diário de Bordo", title: "Diário de Bordo", heroTitle: "Notas de relojoaria",
    subtitle: "Guias, leituras de mercado e curiosidades — escrito por quem vive o ofício.",
    empty: "Em breve, novos artigos.", filterAll: "Todos",
  },
  watch: { back: "Voltar ao catálogo", viewExternal: "Ver anúncio externo" },
  notFound: {
    title: "Página não encontrada", text: "A página que procura não existe ou foi movida. Talvez encontre o que procura na nossa coleção.",
    home: "Voltar ao início", collection: "Ver coleção",
  },
};

const DICTS: Record<Locale, Dict> = { en, pt };

export function getDict(locale: Locale): Dict {
  return DICTS[locale] ?? DICTS[DEFAULT_LOCALE];
}

// Blog category labels per locale (used by the listing filter + cards).
export const BLOG_CATEGORY_I18N: Record<Locale, Record<string, string>> = {
  en: { novidades: "News", curiosidades: "Curiosities", guias: "Guides", mercado: "Market" },
  pt: { novidades: "Novidades", curiosidades: "Curiosidades", guias: "Guias", mercado: "Mercado" },
};

# UI Kit — HMG Watches (public website)

High-fidelity, click-through recreation of the public HMG Watches site. Dark, quiet,
ghost-button driven. All copy in Português de Portugal.

**Entry:** `index.html` — a single-page router with sticky header + footer.

**Screens** (navigate via the header nav, watch cards, and CTAs):
- **Home** (`HomeAbout.jsx`) — fullscreen hero with floating watch, featured pieces, about
  teaser, blog teaser.
- **About** (`HomeAbout.jsx`) — story, value pillars (curadoria / autenticidade / prontos a usar).
- **Catálogo** (`CatalogDetail.jsx`) — brand/status/movement filters, search, sort, empty state.
- **Detalhe** (`CatalogDetail.jsx`) — gallery + thumbnails, breadcrumb, full spec table,
  mailto CTA, related watches.
- **Diário de Bordo** (`BlogScreens.jsx`) — article grid with category pills + "carregar mais".
- **Artigo** (`BlogScreens.jsx`) — editorial layout, blockquote, share, related.
- **Mercado** (`MarketContact.jsx`) — precious-metals cards with sparklines + "relógios em alta".
- **Contacto** (`MarketContact.jsx`) — form with subject dropdown + success state.

**Shared:** `Chrome.jsx` (Header/Footer), `Icon.jsx` (Lucide-based), `WatchVisual.jsx`
(CSS placeholder for real photos), `data.js` (sample watches/articles/market data).

Composes the design-system components (`Button`, `Badge`, `WatchCard`, `Overline`, `Card`,
`Input`, `Select`, `Checkbox`) from `_ds_bundle.js`.

> Watch imagery is the `WatchVisual` CSS placeholder — pass a real `image` URL to `WatchCard`
> to use photographs.

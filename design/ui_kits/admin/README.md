# UI Kit — HMG Watches (admin panel)

High-fidelity, click-through recreation of the HMG Watches admin panel. Distinct from the
public site: operational, sidebar-driven, and the **only** place solid gold buttons appear.
Keeps the brand's dark palette. All copy in Português de Portugal.

**Entry:** `index.html` — sidebar shell + topbar router.

**Screens** (navigate via the sidebar):
- **Dashboard** (`AdminScreens.jsx`) — 5 metric cards, 30-day visits line chart, top-viewed
  watches table, recent-activity feed.
- **Relógios** — stock table (thumbnail, marca/modelo, ref, price, status, date, actions),
  "Adicionar Relógio".
- **Blog** — posts table with approval flow; pending articles highlighted.
- **Analytics** — period toggle (7/30/90 dias), visits chart, top pages, device donut.
- **Definições** — site info + change password.
- **Leads / Mercado** — placeholder screens.

**Shared:** `AdminShell.jsx` (sidebar, topbar, table, status pill, line chart),
`AdminScreens.jsx`, `data.js`. Reuses `Icon.jsx` and `WatchVisual.jsx` from `../website/`.

Composes design-system components (`Button` solid variant, `Badge`, `Card`, `Input`,
`Select`) from `_ds_bundle.js`.

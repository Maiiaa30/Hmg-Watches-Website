# HMG Watches — Design System

A premium, modern and elegant design system for **HMG Watches**, a curated luxury-watch
resale boutique. **Light luxury is the identity** — a warm ivory canvas (drawn from the
brand logo), charcoal ink, and refined gold used with restraint. The site is a clean
showcase that serves the watches: generous whitespace, ghost buttons, a signature
display-niche **arch** motif (echoing the logo), and photography given room to breathe.
All interface language is **Português de Portugal**.

> Visual references in the spirit of Hodinkee, Chrono24 and independent watch boutiques.

---

## Sources used to build this system

- **GitHub — `Maiiaa30/HmgWatches`** (https://github.com/Maiiaa30/HmgWatches) — the repo the
  user attached. It was empty at build time.
- **GitHub — `Maiiaa30/HMG-Watch`** (https://github.com/Maiiaa30/HMG-Watch) — the company's
  backend system: an analysis-only autonomous agent company that finds **undervalued luxury
  watches** and reports profitable resale opportunities (humans act, agents only analyse).
  This gave the business context and the brand list used across the catalogue. It contains
  **no frontend, fonts, CSS or visual assets** — the visual identity below was authored from
  the brand brief supplied by the user.

Explore those repositories for deeper context if you have access.

> **Substitutions flagged:** No font files were supplied — fonts are the requested Google
> Fonts matches (Playfair Display + DM Sans + DM Mono). The **real logo** (`assets/logo.png`)
> is now in use. Product imagery uses an elegant CSS placeholder (`WatchVisual`) standing in
> for real photos. See **Open questions** at the bottom.

---

## Company & product context

HMG Watches buys and sells curated, authenticated luxury watches for resale. The public
**website** is a quiet boutique montra: hero, featured pieces, catalogue with filters,
detailed product pages with full specs, an editorial blog ("Diário de Bordo"), an "About"
story, a financial **Mercado** dashboard (precious metals + fastest-rising watches), and a
contact form. A separate **admin panel** (distinct, operational, sidebar-driven) manages
stock, blog approval, leads, analytics and settings.

Brands carried (from the company's brand list): Rolex, Cartier, Audemars Piguet, Patek
Philippe, Omega, Richard Mille, Vacheron Constantin, IWC, Jaeger-LeCoultre, Breitling,
Hublot, TAG Heuer, Tudor, Panerai, Breguet, A. Lange & Söhne, and more.

---

## CONTENT FUNDAMENTALS

How HMG writes — copy is the quiet voice of a confident, knowledgeable boutique.

- **Language:** European Portuguese only. Use PT-PT spelling and vocabulary
  (*coleção, autenticados, ecrã, atualizar, contacto, relógio*), never Brazilian forms.
  Currency is the euro, formatted `€ 14.500` (point as thousands separator).
- **Voice & person:** Warm, assured, never salesy. Speaks as **"nós"** (we) to the reader
  as **"você/o seu"** implicitly — polite, personal, understated. Example:
  *"Não vendemos tempo — devolvemos-lhe valor."*
- **Tone:** Confident restraint. Short, declarative lines for impact
  (*"Tempo que não se perde."*), longer flowing sentences for editorial/about copy.
  Avoid hype words ("incrível", "imperdível"), avoid exclamation marks.
- **Headlines:** Often a single evocative idea, occasionally poetic, set in the serif
  display. *"Tempo que não se perde." · "Uma montra limpa que serve as peças."*
- **Casing:** Sentence case for headlines and body. **Overlines/eyebrows and buttons are
  UPPERCASE** with generous tracking (e.g. `VER COLEÇÃO`, `COLEÇÃO EM DESTAQUE`).
- **Microcopy is precise and reassuring:** *"Respondemos em 24 a 48 horas úteis."*,
  *"Preços actualizados de hora em hora · Valores indicativos."*, *"Curados, autenticados,
  prontos a usar."*
- **Specs are factual, never embellished:** brand, model, reference (monospace),
  year, movement, case material & diameter, strap, condition (*Excelente / Muito bom / Bom*),
  box & papers (*Sim / Não*).
- **Emoji:** Never. Not part of the brand.
- **Empty states** are graceful and human: *"Nada encontrado — experimente alargar a procura."*

---

## VISUAL FOUNDATIONS

**The principle:** zero visual noise. The watch floats; everything else recedes. Whitespace
is design, not waste. Gold is used with restraint — only where it matters.

### Colour
- **Light luxury as identity.** Page is warm ivory `#F2EADB` (matched to the logo plate),
  with a deeper ivory band `#EADFC9` for alternating sections.
- **Surfaces:** crisp white cards `#FFFFFF`, soft raised/niche surface `#FBF7EF`.
- **Text:** warm charcoal `#1A1814` primary, taupe `#5C5648` secondary, muted `#938A78`
  tertiary.
- **Accent:** refined gold `#B68A2E` (bright highlight `#C9A24B`, deep/text-safe `#8A6A22`).
  Never neon, never a gradient.
- **Borders** are warm hairlines: `#E3D9C6`, stronger `#CFC3AC`.
- **Status:** Available = subtle green (`#E2ECDD` / text `#3F6B3F`, with a small dot);
  Sold = warm grey (`#E8E2D5` / `#8C8472`). Market trend up = `#3F6B3F`, down = warm
  desaturated red `#B5543F` — never a harsh pure red.

### Type
- **Display / headings:** Playfair Display (elegant high-contrast serif), regular/medium
  weight, tight tracking (`-0.02em`), tight line-height (1.08) at large sizes.
- **Body / UI:** DM Sans — clean, modern, neutral.
- **Mono:** DM Mono for references (`Ref. 126610LN`) and technical figures.
- **Hierarchy:** large, deliberate jumps. Hero 76px, page titles 56px, section 40px.
  Editorial body 18–20px at line-height 1.8. Overlines 11px uppercase, tracking `0.18em`.

### Spacing & layout
- 4px base scale; sections breathe at 96–160px vertical rhythm.
- Containers: 1320px max for grids, 760px narrow for editorial reading.
- Product cards sit on a generous grid (3 desktop / 2 tablet / 1 mobile) with 28–32px gaps —
  each watch never crowded, always floating with space around it.

### Signature motif — the display niche (arch)
- Watches are presented inside a soft, gold-lined **arch niche** — a museum-display alcove
  that echoes the arch in the HMG logo. It appears in the hero, every `WatchCard`, and the
  product gallery. This is the system's distinctive, unique element.
- Editorial scaffolding: **numbered section markers** (italic serif `01 / 02 / 03`) with a
  short gold rule and an uppercase eyebrow; a thin **brand-name strip** under the hero.

### Imagery
- Watch photography is the hero: large, contained (`object-fit: contain`, never aggressive
  crop), floating inside the white arch niche on ivory, with a soft warm drop shadow.
- (In this system, real photos are stood in by the CSS `WatchVisual` placeholder.)

### Motion
- Subtle, 250–350ms, `cubic-bezier(0.22,0.61,0.36,1)` ease-out. No bounces, no excess.
- Cards lift `translateY(-4 to -6px)` and the watch scales `1.04` on hover.
- Header fades to a blurred translucent bar on scroll.
- Entrance animations gate on reduced-motion preference.

### Hover / focus / press
- **Ghost buttons fill** with their border colour on hover (the signature interaction).
- Links shift from secondary taupe to charcoal / deep gold; a hairline gold underline marks
  the active nav item.
- Focus: 2px gold outline, offset 2px (WCAG-friendly).
- Cards: border goes from `#E3D9C6` to gold on hover, with a soft lift and warm shadow.

### Borders, radii & shadows
- **Radii are restrained:** 2px (sm), 4px (md, default for cards), 8px (lg), pills for badges.
  Nothing playful or heavily rounded.
- **Shadows** are soft and warm (tinted, not pure black): ambient
  `0 14px 44px rgba(40,33,20,.10)` on cards, deeper `0 40px 90px rgba(40,33,20,.16)` to make
  a watch float in its niche. Used sparingly.
- Transparency + blur (`backdrop-filter`) only on the sticky header scrim and admin topbar.

### Buttons — the rule
> **Ghost buttons only on the public site.** Thin 1px border (gold or charcoal), transparent
> fill, fills with the border colour on hover (250ms). **No solid-fill buttons in public
> pages.** The `solid` gold variant exists *only* in the admin panel, where operational
> clarity demands it.

---

## ICONOGRAPHY

- The brand had **no icon set, icon font, or SVGs** in its repositories.
- This system uses **[Lucide](https://lucide.dev) (MIT)** — a thin, consistent stroke set
  that matches the restrained, elegant aesthetic. Icon paths are bundled into
  `ui_kits/website/Icon.jsx` (an `<Icon name size color strokeWidth>` React component,
  default stroke **1.5** for elegance), so no CDN dependency and full colour control
  (gold/white) at runtime. **Substitution flagged:** Lucide is a stand-in for any future
  bespoke icon set.
- **Usage:** icons are functional and sparse — search, filters, chevrons, arrows, social
  (Instagram / WhatsApp via `message-circle` / mail), market trend arrows, and admin nav
  glyphs. Never decorative, never coloured beyond gold / charcoal / taupe.
- **Emoji / unicode:** not used as icons anywhere.
- The **brand logo** is `assets/logo.png` (the supplied HMG Watches mark — a two-tone watch
  in a display arch over an ivory plate). It is used in the site header, footer, and admin
  sidebar (with `mix-blend-mode: multiply` so its ivory plate melts into the page). Earlier
  typographic placeholders (`logo-wordmark.svg`, `monogram.svg`) remain in `assets/` but are
  superseded.

---

## Index / manifest

**Foundations**
- `styles.css` — the single entry point consumers link (imports only).
- `tokens/` — `colors.css`, `typography.css`, `spacing.css`, `fonts.css`, `base.css`.
- `guidelines/*.card.html` — foundation specimen cards (Colors, Type, Spacing, Brand).
- `assets/` — `logo.png` (the real brand mark), plus legacy SVG placeholders + favicon.

**Components** (`components/`, namespace `HMGWatchesDesignSystem_1cb2d0`)
- `core/` — **Button** (ghost-gold / ghost-light / solid), **Badge** (available / sold /
  gold / up / down), **Overline**, **Card**.
- `forms/` — **Input**, **Select**, **Checkbox** (underline-on-ivory style).
- `product/` — **WatchCard** (the signature floating product card).

**UI kits** (`ui_kits/`)
- `website/` — the full public site: Home, About, Catalogue (filters/search/sort/empty
  state), Watch detail (gallery, breadcrumb, full specs, related), Blog list + Article,
  Mercado (metals + risers), Contact. Entry: `ui_kits/website/index.html`.
- `admin/` — the admin panel: Dashboard (metrics, visits chart, top watches, activity),
  Relógios (stock table), Blog (approval flow), Analytics (period chart, top pages,
  devices), Definições. Entry: `ui_kits/admin/index.html`.

**Other**
- `SKILL.md` — Agent-Skill-compatible entry point.

---

## Open questions for the user (let's make this perfect)

1. **Logo on ivory** — the supplied logo has its own cream plate; I blend it with
   `mix-blend-mode: multiply`. A transparent-background PNG/SVG would render even cleaner —
   send one if you have it.
2. **Fonts** — happy with Playfair Display + DM Sans, or do you have licensed/self-hosted
   font files you'd prefer?
3. **Photography** — real watch photos will transform the showcase. The `WatchCard`
   already accepts an `image` URL; we can swap in your shots immediately.
4. **Gold tone** — is `#B68A2E` the right accent, or should we tune it warmer/cooler?

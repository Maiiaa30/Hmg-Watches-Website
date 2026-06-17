---
name: hmg-watches-design
description: Use this skill to generate well-branded interfaces and assets for HMG Watches — a premium luxury-watch resale boutique (light ivory luxury, gold accents, ghost buttons, arch display-niche motif, Português de Portugal) — either for production or throwaway prototypes/mocks. Contains essential design guidelines, colours, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the `readme.md` file within this skill, and explore the other available files
(`styles.css` + `tokens/` for the foundations, `components/` for reusable primitives,
`ui_kits/website` and `ui_kits/admin` for full-screen recreations).

If creating visual artifacts (slides, mocks, throwaway prototypes), copy assets out and
create static HTML files for the user to view, linking `styles.css` and loading
`_ds_bundle.js` (namespace `HMGWatchesDesignSystem_1cb2d0`). If working on production code,
copy assets and read the rules here to become an expert designing with this brand.

Non-negotiables for this brand:
- **Light luxury is the identity.** Warm ivory canvas (`#F2EADB`, from the logo), crisp
  white cards, warm charcoal text.
- **The arch display niche** is the signature motif — watches float inside a gold-lined
  arch (hero, cards, gallery), echoing the logo.
- **Ghost buttons only on public surfaces** (thin border, transparent fill, fills on hover).
  Solid buttons live only in the admin panel.
- **Gold (`#B68A2E`) used with restraint.** Never gradients, never neon.
- **The watch floats** — generous whitespace, contained photography, nothing crowded.
- **All copy in Português de Portugal** (PT-PT), euro as `€ 14.500`, no emoji.
- Use the real logo `assets/logo.png` (blend with `mix-blend-mode: multiply` on ivory).
- Playfair Display for headlines, DM Sans for UI/body, DM Mono for references.

If the user invokes this skill without other guidance, ask what they want to build or design,
ask a few focused questions, and act as an expert designer who outputs HTML artifacts _or_
production code, depending on the need.

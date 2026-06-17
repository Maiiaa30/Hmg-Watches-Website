A ghost-first button — thin border, transparent fill, fills with the border colour on hover. Use for every public-site CTA; only the admin panel uses the `solid` variant.

```jsx
<Button variant="ghost-gold" size="md" href="/catalogo">Ver Coleção</Button>
<Button variant="ghost-light">Saber mais</Button>
<Button variant="solid" size="sm">Adicionar Relógio</Button>
```

Variants: `ghost-gold` (primary CTA, gold border), `ghost-light` (secondary, white border), `solid` (admin only). Sizes `sm`/`md`/`lg`. Pass `href` to render an `<a>`. Hover fills with the border colour over 280ms.

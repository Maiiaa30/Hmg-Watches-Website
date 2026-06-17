A discreet status pill for watch availability and market trend. Defaults to a Portuguese label per variant.

```jsx
<Badge variant="available" />            {/* Disponível, green dot */}
<Badge variant="sold" />                 {/* Vendido */}
<Badge variant="up">+23% em 6 meses</Badge>
<Badge variant="gold">Destaque</Badge>
```

Variants: `available`, `sold`, `gold` (outlined), `up`/`down` (market trend, tinted). Pass children to override the default label.

"use client";

import { useMemo, useState } from "react";
import { WatchCard } from "@/components/public/WatchCard";
import type { Watch } from "@/types";

type CatalogWatch = Pick<
  Watch,
  "id" | "slug" | "brand" | "model" | "reference" | "price" | "status" | "images" | "createdAt"
>;

type SortKey = "recent" | "price-desc" | "price-asc";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "recent", label: "Mais recentes" },
  { value: "price-desc", label: "Preço: maior primeiro" },
  { value: "price-asc", label: "Preço: menor primeiro" },
];

export function CatalogBrowser({ watches }: { watches: CatalogWatch[] }) {
  const [brand, setBrand] = useState<string | null>(null);
  const [sort, setSort] = useState<SortKey>("recent");

  const brands = useMemo(
    () => Array.from(new Set(watches.map((w) => w.brand))).sort((a, b) => a.localeCompare(b, "pt")),
    [watches]
  );

  const sorted = useMemo(() => {
    const filtered = brand ? watches.filter((w) => w.brand === brand) : watches.slice();
    filtered.sort((a, b) => {
      if (sort === "price-asc") return Number(a.price) - Number(b.price);
      if (sort === "price-desc") return Number(b.price) - Number(a.price);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    return filtered;
  }, [watches, brand, sort]);

  const available = sorted.filter((w) => w.status === "available");
  const sold = sorted.filter((w) => w.status === "sold");

  return (
    <>
      {/* Filter / sort bar */}
      <div className="hmg-filterbar" role="region" aria-label="Filtrar catálogo">
        <button
          type="button"
          className="hmg-filter-pill"
          aria-pressed={brand === null}
          onClick={() => setBrand(null)}
        >
          Todas
        </button>
        {brands.map((b) => (
          <button
            key={b}
            type="button"
            className="hmg-filter-pill"
            aria-pressed={brand === b}
            onClick={() => setBrand((cur) => (cur === b ? null : b))}
          >
            {b}
          </button>
        ))}

        <span className="hmg-filter-spacer" />

        <span className="hmg-filter-count">
          {sorted.length} {sorted.length === 1 ? "peça" : "peças"}
        </span>
        <label className="hmg-filter-count" htmlFor="catalog-sort" style={{ marginLeft: 4 }}>
          Ordenar
        </label>
        <select
          id="catalog-sort"
          className="hmg-filter-select"
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      {available.length > 0 && (
        <section style={{ marginBottom: 80 }}>
          <SectionHeader label="Disponíveis" count={available.length} color="var(--status-available-fg)" />
          <Grid>
            {available.map((w) => (
              <WatchCard key={w.id} watch={w} />
            ))}
          </Grid>
        </section>
      )}

      {sold.length > 0 && (
        <section>
          <SectionHeader label="Vendidos" count={sold.length} color="var(--text-tertiary)" />
          <Grid>
            {sold.map((w) => (
              <WatchCard key={w.id} watch={w} />
            ))}
          </Grid>
        </section>
      )}

      {sorted.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "100px 0",
            color: "var(--text-tertiary)",
            fontFamily: "var(--font-display)",
            fontSize: "var(--fs-display-s)",
            fontStyle: "italic",
          }}
        >
          Nenhuma peça corresponde aos filtros.
        </div>
      )}
    </>
  );
}

function SectionHeader({ label, count, color }: { label: string; count: number; color: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        marginBottom: 40,
        paddingBottom: 20,
        borderBottom: "1px solid var(--border-subtle)",
      }}
    >
      <h2
        style={{
          fontFamily: "var(--font-ui)",
          fontSize: 11,
          fontWeight: 500,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color,
        }}
      >
        {label}
      </h2>
      <span style={{ fontSize: 12, color: "var(--text-tertiary)" }}>
        {count} {count === 1 ? "peça" : "peças"}
      </span>
    </div>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
        gap: "var(--gap-card)",
      }}
    >
      {children}
    </div>
  );
}

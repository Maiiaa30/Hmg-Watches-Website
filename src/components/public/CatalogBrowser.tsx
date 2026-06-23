"use client";

import { useMemo, useState } from "react";
import { WatchCard } from "@/components/public/WatchCard";
import type { Watch } from "@/types";
import { getDict, type Locale } from "@/lib/i18n";

type CatalogWatch = Pick<
  Watch,
  "id" | "slug" | "brand" | "model" | "reference" | "price" | "status" | "images" | "createdAt"
>;

type SortKey = "recent" | "price-desc" | "price-asc";

export function CatalogBrowser({
  watches,
  locale = "en",
}: {
  watches: CatalogWatch[];
  locale?: Locale;
}) {
  const t = getDict(locale);
  const [brand, setBrand] = useState<string | null>(null);
  const [sort, setSort] = useState<SortKey>("recent");

  const SORT_OPTIONS: { value: SortKey; label: string }[] = [
    { value: "recent", label: t.catalog.sortRecent },
    { value: "price-desc", label: t.catalog.sortPriceDesc },
    { value: "price-asc", label: t.catalog.sortPriceAsc },
  ];

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
          {t.catalog.all}
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
          {sorted.length} {sorted.length === 1 ? t.catalog.piece : t.catalog.pieces}
        </span>
        <label className="hmg-filter-count" htmlFor="catalog-sort" style={{ marginLeft: 4 }}>
          {t.catalog.sortLabel}
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
          <SectionHeader
            label={t.catalog.available}
            count={available.length}
            color="var(--status-available-fg)"
            piece={t.catalog.piece}
            pieces={t.catalog.pieces}
          />
          <Grid>
            {available.map((w) => (
              <WatchCard key={w.id} watch={w} locale={locale} />
            ))}
          </Grid>
        </section>
      )}

      {sold.length > 0 && (
        <section>
          <SectionHeader
            label={t.catalog.sold}
            count={sold.length}
            color="var(--text-tertiary)"
            piece={t.catalog.piece}
            pieces={t.catalog.pieces}
          />
          <Grid>
            {sold.map((w) => (
              <WatchCard key={w.id} watch={w} locale={locale} />
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
          {t.catalog.noMatch}
        </div>
      )}
    </>
  );
}

function SectionHeader({
  label,
  count,
  color,
  piece,
  pieces,
}: {
  label: string;
  count: number;
  color: string;
  piece: string;
  pieces: string;
}) {
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
        {count} {count === 1 ? piece : pieces}
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

import type { Metadata } from "next";
import { db } from "@/lib/db";
import { watches } from "@/lib/db/schema";
import { eq, or, desc } from "drizzle-orm";
import { CatalogBrowser } from "@/components/public/CatalogBrowser";
import { RecentlyViewed } from "@/components/public/RecentlyViewed";
import { TypingText } from "@/components/public/TypingText";
import { getT } from "@/lib/i18n-server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT();
  return {
    title: t.catalog.title,
    description: t.catalog.subtitle,
  };
}

export const revalidate = 120;

export default async function CatalogoPage() {
  const { locale, t } = await getT();

  // Only the columns the cards + filter/sort need (no description / image_order).
  const allWatches = await db
    .select({
      id: watches.id,
      slug: watches.slug,
      brand: watches.brand,
      model: watches.model,
      reference: watches.reference,
      price: watches.price,
      status: watches.status,
      images: watches.images,
      createdAt: watches.createdAt,
    })
    .from(watches)
    .where(or(eq(watches.status, "available"), eq(watches.status, "sold")))
    .orderBy(desc(watches.createdAt));

  return (
    <div style={{ padding: "var(--section-y) 0" }}>
      <div className="hmg-container">
        {/* Header */}
        <div className="hmg-fade-up" style={{ marginBottom: 64 }}>
          <span className="hmg-overline">{t.catalog.overline}</span>
          <h1
            aria-label={t.catalog.title}
            style={{
              fontSize: "var(--fs-display-l)",
              lineHeight: "var(--lh-tight)",
              marginTop: 16,
              marginBottom: 16,
            }}
          >
            <TypingText segments={[{ text: t.catalog.title }]} />
          </h1>
          <p
            style={{
              fontSize: "var(--fs-body-l)",
              color: "var(--text-secondary)",
              maxWidth: 520,
              lineHeight: "var(--lh-relaxed)",
            }}
          >
            {t.catalog.subtitle}
          </p>
        </div>

        {allWatches.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "120px 0",
              color: "var(--text-tertiary)",
              fontFamily: "var(--font-display)",
              fontSize: "var(--fs-display-s)",
              fontStyle: "italic",
            }}
          >
            {t.catalog.comingSoon}
          </div>
        ) : (
          <CatalogBrowser watches={allWatches} locale={locale} />
        )}

        <RecentlyViewed locale={locale} />
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { cache } from "react";
import { db } from "@/lib/db";
import { watches } from "@/lib/db/schema";
import { eq, ne, and } from "drizzle-orm";
import { Badge } from "@/components/ui/Badge";
import { LeadForm } from "@/components/public/LeadForm";
import { WatchCard } from "@/components/public/WatchCard";
import { WatchGallery } from "@/components/public/WatchGallery";
import { DetailAnalytics } from "@/components/public/DetailAnalytics";
import { RecentlyViewedRecorder } from "@/components/public/RecentlyViewedRecorder";
import { APP_URL } from "@/lib/app-url";
import {
  MOVEMENT_TYPE_LABELS,
  CONDITION_LABELS,
} from "@/constants";

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 300;

// Build an absolute URL from a site-relative path.
const absolute = (path: string) => `${APP_URL}${path}`;

// Single-watch fetch shared by generateMetadata and the page component.
// Wrapped in React's cache() so Next dedupes the query within a request.
const getWatch = cache(async (slug: string) => {
  const [watch] = await db
    .select()
    .from(watches)
    .where(eq(watches.slug, slug))
    .limit(1);
  return watch;
});

export async function generateStaticParams() {
  const all = await db
    .select({ slug: watches.slug })
    .from(watches)
    .where(ne(watches.status, "archived"));
  return all.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const watch = await getWatch(slug);

  if (!watch) return { title: "Não encontrado" };

  const title = `${watch.brand} ${watch.model}`;
  const description =
    watch.description ??
    `${watch.brand} ${watch.model}${watch.reference ? ` (${watch.reference})` : ""}. ${watch.year ?? ""}`;
  const url = absolute(`/catalogo/${slug}`);
  const firstImage = watch.images[0];

  return {
    title,
    description,
    alternates: { canonical: `/catalogo/${slug}` },
    openGraph: {
      type: "website",
      title,
      description,
      url,
      images: firstImage
        ? [{ url: firstImage, width: 1200, height: 1500 }]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: firstImage ? [firstImage] : [],
    },
  };
}

export default async function WatchDetailPage({ params }: Props) {
  const { slug } = await params;
  const watch = await getWatch(slug);

  if (!watch || watch.status === "archived") notFound();

  // Narrow projection — WatchCard only needs these columns. Prefer same-brand
  // pieces (excluding the current one), non-archived, limited to 4.
  const related = await db
    .select({
      id: watches.id,
      slug: watches.slug,
      brand: watches.brand,
      model: watches.model,
      reference: watches.reference,
      price: watches.price,
      status: watches.status,
      images: watches.images,
    })
    .from(watches)
    .where(
      and(
        eq(watches.brand, watch.brand),
        ne(watches.id, watch.id),
        ne(watches.status, "archived")
      )
    )
    .limit(4);

  // JSON-LD for rich results. JSON.stringify drops undefined fields.
  const productLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${watch.brand} ${watch.model}`,
    brand: { "@type": "Brand", name: watch.brand },
    sku: watch.reference || undefined,
    image: watch.images?.length ? watch.images : undefined,
    description: watch.description || undefined,
    offers: {
      "@type": "Offer",
      priceCurrency: "EUR",
      price: Number(watch.price),
      availability:
        watch.status === "available"
          ? "https://schema.org/InStock"
          : "https://schema.org/SoldOut",
      url: absolute(`/catalogo/${watch.slug}`),
    },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: absolute("/") },
      {
        "@type": "ListItem",
        position: 2,
        name: "Catálogo",
        item: absolute("/catalogo"),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `${watch.brand} ${watch.model}`,
        item: absolute(`/catalogo/${watch.slug}`),
      },
    ],
  };

  const priceFormatted = new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(Number(watch.price));

  const specs = [
    { label: "Referência", value: watch.reference },
    { label: "Ano", value: watch.year?.toString() },
    { label: "Movimento", value: watch.movementType ? MOVEMENT_TYPE_LABELS[watch.movementType] : null },
    { label: "Material da caixa", value: watch.caseMaterial },
    { label: "Diâmetro", value: watch.caseDiameterMm ? `${watch.caseDiameterMm} mm` : null },
    { label: "Bracelete", value: watch.braceletMaterial },
    { label: "Estado", value: watch.condition ? CONDITION_LABELS[watch.condition] : null },
    { label: "Caixa original", value: watch.hasBox ? "Incluída" : "Não incluída" },
    { label: "Papéis", value: watch.hasPapers ? "Incluídos" : "Não incluídos" },
  ].filter((s) => s.value);

  return (
    <div style={{ padding: "60px 0 120px" }}>
      <DetailAnalytics watchId={watch.id} />
      <RecentlyViewedRecorder
        watch={{
          slug: watch.slug,
          brand: watch.brand,
          model: watch.model,
          reference: watch.reference,
          price: watch.price,
          status: watch.status,
          images: watch.images,
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <div className="hmg-container">
        {/* Breadcrumb */}
        <nav
          style={{
            marginBottom: 48,
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 13,
            color: "var(--text-tertiary)",
          }}
        >
          <Link href="/" style={{ color: "var(--text-tertiary)" }}>
            Início
          </Link>
          <span>/</span>
          <Link href="/catalogo" style={{ color: "var(--text-tertiary)" }}>
            Catálogo
          </Link>
          <span>/</span>
          <span style={{ color: "var(--text-secondary)" }}>
            {watch.brand} {watch.model}
          </span>
        </nav>

        <div
          className="hmg-stack"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "var(--sp-10)",
            alignItems: "start",
          }}
        >
          {/* Gallery */}
          <WatchGallery images={watch.images} alt={`${watch.brand} ${watch.model}`} />

          {/* Info */}
          <div style={{ position: "sticky", top: 100 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 20,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-ui)",
                  fontSize: 11,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "var(--text-secondary)",
                }}
              >
                {watch.brand}
              </span>
              <Badge status={watch.status} />
            </div>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--fs-display-s)",
                lineHeight: "var(--lh-snug)",
                marginBottom: 8,
              }}
            >
              {watch.model}
            </h1>
            {watch.reference && (
              <p
                style={{
                  fontSize: 14,
                  color: "var(--text-tertiary)",
                  marginBottom: 24,
                  fontFamily: "var(--font-mono)",
                }}
              >
                Ref. {watch.reference}
              </p>
            )}
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 34,
                color: "var(--accent-press)",
                marginBottom: 32,
              }}
            >
              {priceFormatted}
            </div>

            {/* Specs table */}
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginBottom: 32,
                fontSize: 14,
              }}
            >
              <tbody>
                {specs.map((s) => (
                  <tr
                    key={s.label}
                    style={{ borderBottom: "1px solid var(--border-subtle)" }}
                  >
                    <td
                      style={{
                        padding: "11px 0",
                        color: "var(--text-tertiary)",
                        width: "44%",
                        fontFamily: "var(--font-ui)",
                        fontSize: 12,
                        letterSpacing: "0.06em",
                      }}
                    >
                      {s.label}
                    </td>
                    <td
                      style={{
                        padding: "11px 0",
                        color: "var(--text-primary)",
                      }}
                    >
                      {s.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {watch.description && (
              <p
                style={{
                  fontSize: 15,
                  lineHeight: 1.8,
                  color: "var(--text-secondary)",
                  marginBottom: 32,
                }}
              >
                {watch.description}
              </p>
            )}

            {/* Lead form CTA */}
            <LeadForm
              watchId={watch.id}
              watchStatus={watch.status}
              watchName={`${watch.brand} ${watch.model}`}
            />

            {watch.externalLink && (
              <div style={{ marginTop: 12 }}>
                <a
                  href={watch.externalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hmg-ghost-btn hmg-ghost-btn--dark"
                  style={{ width: "100%" }}
                >
                  Ver anúncio externo
                  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                    <path d="M7 17L17 7M17 7H7M17 7v10" />
                  </svg>
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section style={{ marginTop: "var(--section-y)" }}>
            <div
              style={{
                borderTop: "1px solid var(--border-subtle)",
                paddingTop: 56,
                marginBottom: 40,
              }}
            >
              <span className="hmg-overline">Outras peças</span>
            </div>
            <div
              className="hmg-stack"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "var(--gap-card)",
              }}
            >
              {related.map((w) => (
                <WatchCard key={w.id} watch={w} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

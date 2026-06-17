import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/db";
import { watches } from "@/lib/db/schema";
import { eq, ne, and } from "drizzle-orm";
import { Badge } from "@/components/ui/Badge";
import { LeadForm } from "@/components/public/LeadForm";
import { WatchCard } from "@/components/public/WatchCard";
import {
  MOVEMENT_TYPE_LABELS,
  CONDITION_LABELS,
} from "@/constants";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const all = await db
    .select({ slug: watches.slug })
    .from(watches)
    .where(ne(watches.status, "archived"));
  return all.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const [watch] = await db
    .select()
    .from(watches)
    .where(eq(watches.slug, slug))
    .limit(1);

  if (!watch) return { title: "Não encontrado" };

  return {
    title: `${watch.brand} ${watch.model}`,
    description: watch.description ?? `${watch.brand} ${watch.model}${watch.reference ? ` (${watch.reference})` : ""}. ${watch.year ?? ""}`,
    openGraph: {
      images: watch.images[0] ? [{ url: watch.images[0] }] : [],
    },
  };
}

export default async function WatchDetailPage({ params }: Props) {
  const { slug } = await params;
  const [watch] = await db
    .select()
    .from(watches)
    .where(eq(watches.slug, slug))
    .limit(1);

  if (!watch || watch.status === "archived") notFound();

  const related = await db
    .select()
    .from(watches)
    .where(
      and(
        ne(watches.id, watch.id),
        ne(watches.status, "archived")
      )
    )
    .limit(4);

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
          <div>
            <div
              style={{
                position: "relative",
                aspectRatio: "4 / 5",
                background: "var(--bg-page-alt)",
                marginBottom: 16,
                border: "1px solid var(--border-subtle)",
                overflow: "hidden",
              }}
            >
              {watch.images[0] ? (
                <Image
                  src={watch.images[0]}
                  alt={`${watch.brand} ${watch.model}`}
                  fill
                  style={{ objectFit: "cover", objectPosition: "center 42%" }}
                  priority
                  sizes="(max-width: 1200px) 50vw, 600px"
                />
              ) : (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--text-tertiary)",
                    fontFamily: "var(--font-display)",
                    fontStyle: "italic",
                  }}
                >
                  Sem imagem
                </div>
              )}
            </div>
            {/* Thumbnails */}
            {watch.images.length > 1 && (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {watch.images.slice(0, 5).map((img, i) => (
                  <div
                    key={i}
                    style={{
                      width: 72,
                      height: 72,
                      border: i === 0 ? "1px solid var(--accent)" : "1px solid var(--border-subtle)",
                      overflow: "hidden",
                      position: "relative",
                      flexShrink: 0,
                    }}
                  >
                    <Image
                      src={img}
                      alt={`Vista ${i + 1}`}
                      fill
                      style={{ objectFit: "cover" }}
                      sizes="72px"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

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

import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import { getDict, type Locale } from "@/lib/i18n";
import type { Watch } from "@/types";

interface WatchCardProps {
  watch: Pick<
    Watch,
    "slug" | "brand" | "model" | "reference" | "price" | "status" | "images"
  >;
  locale?: Locale;
}

export function WatchCard({ watch, locale = "en" }: WatchCardProps) {
  const t = getDict(locale);
  const numberLocale = locale === "en" ? "en-GB" : "pt-PT";
  const image = watch.images[0];
  // High-end pieces are often listed without a public price ("price on
  // request") — render that elegantly instead of "€0".
  const priceNum = Number(watch.price);
  const priceFormatted =
    priceNum > 0
      ? new Intl.NumberFormat(numberLocale, {
          style: "currency",
          currency: "EUR",
          maximumFractionDigits: 0,
        }).format(priceNum)
      : t.card.priceOnRequest;

  return (
    <Link
      href={`/catalogo/${watch.slug}`}
      style={{ display: "block", textDecoration: "none", cursor: "pointer" }}
    >
      <div className="hmg-watchcard">
        {/* Image */}
        <div
          style={{
            position: "relative",
            aspectRatio: "4 / 5",
            background: "var(--bg-page-alt)",
            overflow: "hidden",
          }}
        >
          {image ? (
            <Image
              src={image}
              alt={`${watch.brand} ${watch.model}`}
              fill
              style={{ objectFit: "cover", objectPosition: "center 42%" }}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
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
                fontSize: 13,
                fontStyle: "italic",
              }}
            >
              {t.card.noImage}
            </div>
          )}
          {watch.status === "sold" && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(247,242,232,0.42)",
              }}
            />
          )}
          <div style={{ position: "absolute", top: 14, right: 14 }}>
            <Badge status={watch.status} locale={locale} />
          </div>
        </div>

        {/* Info */}
        <div style={{ padding: "18px 20px 22px" }}>
          <div
            style={{
              fontFamily: "var(--font-ui)",
              fontSize: 10.5,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "var(--text-secondary)",
              marginBottom: 6,
            }}
          >
            {watch.brand}
            {watch.reference && (
              <span style={{ marginLeft: 8, color: "var(--text-tertiary)" }}>
                · {watch.reference}
              </span>
            )}
          </div>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 19,
              lineHeight: 1.25,
              color: "var(--text-primary)",
              marginBottom: 12,
            }}
          >
            {watch.model}
          </div>
          <div
            style={{
              fontFamily: "var(--font-ui)",
              fontSize: 15,
              fontWeight: 500,
              color:
                watch.status === "sold"
                  ? "var(--text-tertiary)"
                  : "var(--accent-press)",
            }}
          >
            {priceFormatted}
          </div>
        </div>
      </div>
    </Link>
  );
}

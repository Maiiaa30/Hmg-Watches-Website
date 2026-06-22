import type { Metadata } from "next";
import { TypingText } from "@/components/public/TypingText";
import { getUpcomingAuctions, todayLisbon, type Auction } from "@/lib/leiloes";
import { getT } from "@/lib/i18n-server";

export const metadata: Metadata = {
  title: "Leilões",
  description:
    "Leilões de relojoaria a acompanhar. Selecionamos os próximos leilões de referência e ligamos diretamente à casa leiloeira.",
};

export const revalidate = 600; // 10 min — also revalidated on admin changes

function formatDate(iso: string): string {
  // iso = "YYYY-MM-DD" — parse as a plain date (no timezone shift).
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return new Intl.DateTimeFormat("pt-PT", { day: "numeric", month: "long", year: "numeric" }).format(
    new Date(Date.UTC(y, m - 1, d))
  );
}

export default async function LeiloesPage() {
  const { t } = await getT();
  const auctions = await getUpcomingAuctions();
  const today = todayLisbon();

  return (
    <div style={{ padding: "var(--section-y) 0" }}>
      <div className="hmg-container" style={{ maxWidth: "var(--container-narrow)" }}>
        <div className="hmg-fade-up" style={{ marginBottom: 64 }}>
          <span className="hmg-overline">{t.auctions.overline}</span>
          <h1
            aria-label={t.auctions.title}
            style={{
              fontSize: "var(--fs-display-l)",
              lineHeight: "var(--lh-tight)",
              marginTop: 16,
              marginBottom: 16,
            }}
          >
            <TypingText segments={[{ text: t.auctions.title }]} />
          </h1>
          <p style={{ fontSize: "var(--fs-body-l)", color: "var(--text-secondary)", maxWidth: 540, lineHeight: "var(--lh-relaxed)" }}>
            {t.auctions.subtitle}
          </p>
        </div>

        {auctions.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "90px 24px",
              border: "1px solid var(--border-subtle)",
              background: "var(--surface-card)",
              borderRadius: 8,
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--fs-display-s)",
                fontStyle: "italic",
                color: "var(--text-secondary)",
                marginBottom: 10,
              }}
            >
              {t.auctions.emptyTitle}
            </div>
            <p style={{ fontSize: 15, color: "var(--text-tertiary)", margin: 0 }}>
              {t.auctions.emptyText}
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {auctions.map((a) => (
              <AuctionCard
                key={a.id}
                auction={a}
                isToday={a.startsAt === today}
                viewAuctionLabel={t.auctions.viewAuction}
                todayLabel={t.auctions.today}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function AuctionCard({
  auction,
  isToday,
  viewAuctionLabel,
  todayLabel,
}: {
  auction: Auction;
  isToday: boolean;
  viewAuctionLabel: string;
  todayLabel: string;
}) {
  return (
    <a
      href={auction.url}
      target="_blank"
      rel="noopener noreferrer"
      className="hmg-auction-card"
    >
      {auction.imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="hmg-auction-thumb" src={auction.imageUrl} alt={auction.title} loading="lazy" />
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8, flexWrap: "wrap" }}>
          <span
            style={{
              fontFamily: "var(--font-ui)",
              fontSize: 11,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--accent-press)",
            }}
          >
            {formatDate(auction.startsAt)}
            {auction.startsTime && ` · ${auction.startsTime}`}
          </span>
          {isToday && <span className="hmg-auction-today">{todayLabel}</span>}
        </div>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 23, lineHeight: 1.25, marginBottom: 6 }}>
          {auction.title}
        </h2>
        {(auction.house || auction.location) && (
          <div style={{ fontSize: 13, color: "var(--text-tertiary)", marginBottom: auction.description ? 10 : 0 }}>
            {[auction.house, auction.location].filter(Boolean).join(" · ")}
          </div>
        )}
        {auction.description && (
          <p style={{ fontSize: 15, lineHeight: 1.7, color: "var(--text-secondary)", margin: 0 }}>
            {auction.description}
          </p>
        )}
      </div>
      <span className="hmg-auction-cta" aria-hidden="true">
        {viewAuctionLabel}
        <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path d="M7 17L17 7M17 7H7M17 7v10" />
        </svg>
      </span>
    </a>
  );
}

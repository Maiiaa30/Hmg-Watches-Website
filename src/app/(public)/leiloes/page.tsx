import type { Metadata } from "next";
import { TypingText } from "@/components/public/TypingText";
import { getUpcomingAuctions, todayLisbon, type Auction } from "@/lib/leiloes";

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
  const auctions = await getUpcomingAuctions();
  const today = todayLisbon();

  return (
    <div style={{ padding: "var(--section-y) 0" }}>
      <div className="hmg-container" style={{ maxWidth: "var(--container-narrow)" }}>
        <div className="hmg-fade-up" style={{ marginBottom: 64 }}>
          <span className="hmg-overline">Leilões</span>
          <h1
            aria-label="Próximos leilões"
            style={{
              fontSize: "var(--fs-display-l)",
              lineHeight: "var(--lh-tight)",
              marginTop: 16,
              marginBottom: 16,
            }}
          >
            <TypingText segments={[{ text: "Próximos leilões" }]} />
          </h1>
          <p style={{ fontSize: "var(--fs-body-l)", color: "var(--text-secondary)", maxWidth: 540, lineHeight: "var(--lh-relaxed)" }}>
            Acompanhamos os leilões de relojoaria que vale a pena conhecer. Cada
            entrada liga diretamente à casa leiloeira — a licitação decorre no
            site da casa, não aqui.
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
              De momento, não há leilões agendados.
            </div>
            <p style={{ fontSize: 15, color: "var(--text-tertiary)", margin: 0 }}>
              Volte em breve — anunciamos aqui os próximos leilões de referência.
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {auctions.map((a) => (
              <AuctionCard key={a.id} auction={a} isToday={a.startsAt === today} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function AuctionCard({ auction, isToday }: { auction: Auction; isToday: boolean }) {
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
          {isToday && <span className="hmg-auction-today">Hoje</span>}
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
        Ver leilão
        <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path d="M7 17L17 7M17 7H7M17 7v10" />
        </svg>
      </span>
    </a>
  );
}

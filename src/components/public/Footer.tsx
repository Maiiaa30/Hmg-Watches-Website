"use client";

import Link from "next/link";

const NAV_COLUMNS = [
  {
    title: "Navegar",
    links: [
      { label: "Catálogo", href: "/catalogo" },
      { label: "Mercado", href: "/mercado" },
      { label: "Diário de Bordo", href: "/blog" },
    ],
  },
  {
    title: "Empresa",
    links: [
      { label: "Sobre Nós", href: "/sobre-nos" },
      { label: "Contacto", href: "/contacto" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Política de Privacidade", href: "/privacidade" },
      { label: "Termos de Utilização", href: "/termos" },
    ],
  },
];

export function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--border-strong)",
        padding: "84px 56px 44px",
        background: "var(--bg-page-alt)",
      }}
    >
      <div
        style={{
          maxWidth: "var(--container-max)",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1.7fr 1fr 1fr 1fr",
          gap: 48,
        }}
      >
        {/* Brand column */}
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 9,
              marginBottom: 16,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 32,
                fontWeight: 600,
                letterSpacing: "0.01em",
                color: "var(--text-primary)",
              }}
            >
              HMG
            </span>
            <span
              style={{
                fontFamily: "var(--font-ui)",
                fontSize: 10,
                letterSpacing: "0.36em",
                textTransform: "uppercase",
                color: "var(--accent-press)",
              }}
            >
              Watches
            </span>
          </div>
          <p
            style={{
              fontSize: 15,
              lineHeight: 1.8,
              color: "var(--text-secondary)",
              maxWidth: 300,
            }}
          >
            Relógios de exceção. Curados, autenticados, prontos a usar.
          </p>
          <div style={{ display: "flex", gap: 12, marginTop: 22 }}>
            {/* Instagram */}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              style={socialIconStyle}
              onMouseEnter={(e) => applyHover(e)}
              onMouseLeave={(e) => removeHover(e)}
            >
              <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
              </svg>
            </a>
            {/* WhatsApp */}
            <a
              href="/contacto"
              aria-label="Contacto"
              style={socialIconStyle}
              onMouseEnter={(e) => applyHover(e)}
              onMouseLeave={(e) => removeHover(e)}
            >
              <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
              </svg>
            </a>
            {/* Email */}
            <a
              href="/contacto"
              aria-label="Email"
              style={socialIconStyle}
              onMouseEnter={(e) => applyHover(e)}
              onMouseLeave={(e) => removeHover(e)}
            >
              <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </a>
          </div>
        </div>

        {/* Nav columns */}
        {NAV_COLUMNS.map((col) => (
          <div key={col.title} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div
              style={{
                fontFamily: "var(--font-ui)",
                fontSize: 11,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--accent-press)",
              }}
            >
              {col.title}
            </div>
            {col.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{ fontSize: 14, color: "var(--text-secondary)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--text-primary)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--text-secondary)")
                }
              >
                {link.label}
              </Link>
            ))}
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div
        style={{
          maxWidth: "var(--container-max)",
          margin: "56px auto 0",
          paddingTop: 28,
          borderTop: "1px solid var(--border-subtle)",
          display: "flex",
          justifyContent: "space-between",
          fontSize: 12,
          color: "var(--text-tertiary)",
        }}
      >
        <span>© {new Date().getFullYear()} HMG Watches. Todos os direitos reservados.</span>
        <span>Lisboa · Portugal</span>
      </div>
    </footer>
  );
}

const socialIconStyle: React.CSSProperties = {
  width: 42,
  height: 42,
  border: "1px solid var(--border-strong)",
  borderRadius: "50%",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  color: "var(--text-secondary)",
  transition: "all var(--dur-base) var(--ease-out)",
  cursor: "pointer",
};

function applyHover(e: React.MouseEvent<HTMLAnchorElement>) {
  e.currentTarget.style.borderColor = "var(--accent)";
  e.currentTarget.style.color = "var(--accent-press)";
  e.currentTarget.style.background = "var(--surface-card)";
}
function removeHover(e: React.MouseEvent<HTMLAnchorElement>) {
  e.currentTarget.style.borderColor = "var(--border-strong)";
  e.currentTarget.style.color = "var(--text-secondary)";
  e.currentTarget.style.background = "transparent";
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/", label: "Início" },
  { href: "/catalogo", label: "Catálogo" },
  { href: "/mercado", label: "Mercado" },
  { href: "/leiloes", label: "Leilões" },
  { href: "/blog", label: "Diário de Bordo" },
  { href: "/sobre-nos", label: "Sobre" },
  { href: "/contacto", label: "Contacto" },
] as const;

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const solid = scrolled || mobileOpen;

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  // On the homepage, "Contacto" smooth-scrolls to the embedded form instead
  // of navigating. On every other page it behaves as a normal link.
  function handleNavClick(e: React.MouseEvent, href: string) {
    if (href === "/contacto" && pathname === "/") {
      e.preventDefault();
      document.getElementById("home-contact")?.scrollIntoView({ behavior: "smooth", block: "start" });
      setMobileOpen(false);
    }
  }

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: "var(--z-sticky)",
        background: solid ? "rgba(247,242,232,0.92)" : "transparent",
        backdropFilter: solid ? "blur(16px)" : "none",
        borderBottom: `1px solid ${solid ? "var(--border-subtle)" : "transparent"}`,
        transition: "all var(--dur-base) var(--ease-out)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 var(--gutter)",
          height: 84,
          maxWidth: "var(--container-max)",
          margin: "0 auto",
        }}
      >
        {/* Wordmark */}
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 9,
            cursor: "pointer",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 27,
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
        </Link>

        {/* Desktop nav */}
        <nav
          className="hidden md:flex"
          style={{ gap: 32, alignItems: "center" }}
        >
          {NAV.map((n) => {
            const active = isActive(n.href);
            const isContact = n.href === "/contacto";
            return (
              <Link
                key={n.href}
                href={n.href}
                onClick={(e) => handleNavClick(e, n.href)}
                style={{
                  fontFamily: "var(--font-ui)",
                  fontSize: 12.5,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: isContact
                    ? "var(--accent-press)"
                    : active
                      ? "var(--text-primary)"
                      : "var(--text-secondary)",
                  position: "relative",
                  paddingBottom: 5,
                  transition: "color var(--dur-base) var(--ease-out)",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--accent-press)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = isContact
                    ? "var(--accent-press)"
                    : active
                      ? "var(--text-primary)"
                      : "var(--text-secondary)")
                }
              >
                {n.label}
                <span
                  style={{
                    position: "absolute",
                    left: 0,
                    bottom: 0,
                    height: 1.5,
                    width: active ? "100%" : 0,
                    background: "var(--accent)",
                    transition: "width var(--dur-base) var(--ease-out)",
                  }}
                />
              </Link>
            );
          })}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="flex md:hidden"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--text-primary)",
            padding: 8,
          }}
        >
          {mobileOpen ? (
            <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true" focusable="false">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          ) : (
            <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true" focusable="false">
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div
          id="mobile-nav"
          style={{
            borderTop: "1px solid var(--border-subtle)",
            padding: "12px 20px 22px",
            display: "flex",
            flexDirection: "column",
            gap: 4,
            background: "rgba(247,242,232,0.96)",
          }}
        >
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              onClick={(e) => handleNavClick(e, n.href)}
              style={{
                padding: "13px 6px",
                fontFamily: "var(--font-ui)",
                fontSize: 15,
                letterSpacing: "0.04em",
                color:
                  n.href === "/contacto" || isActive(n.href)
                    ? "var(--accent-press)"
                    : "var(--text-primary)",
                borderBottom: "1px solid var(--border-subtle)",
              }}
            >
              {n.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}

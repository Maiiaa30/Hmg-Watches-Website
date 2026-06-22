import Link from "next/link";
import { getT } from "@/lib/i18n-server";

export default async function NotFound() {
  const { t } = await getT();
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg-page)",
        textAlign: "center",
        padding: "0 20px",
      }}
    >
      <span className="hmg-overline">Erro 404</span>
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(56px, 8vw, 96px)",
          lineHeight: 1,
          letterSpacing: "-0.03em",
          marginTop: 20,
          marginBottom: 16,
          color: "var(--text-primary)",
        }}
      >
        {t.notFound.title}
      </h1>
      <p
        style={{
          fontSize: 18,
          color: "var(--text-secondary)",
          maxWidth: 400,
          marginBottom: 40,
        }}
      >
        {t.notFound.text}
      </p>
      <div
        style={{
          display: "flex",
          gap: 16,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <Link href="/" className="hmg-ghost-btn hmg-ghost-btn--gold">
          {t.notFound.home}
        </Link>
        <Link href="/catalogo" className="hmg-ghost-btn hmg-ghost-btn--gold">
          {t.notFound.collection}
        </Link>
      </div>
    </div>
  );
}

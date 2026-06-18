import Link from "next/link";

export default function NotFound() {
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
        Não encontrado.
      </h1>
      <p
        style={{
          fontSize: 18,
          color: "var(--text-secondary)",
          maxWidth: 400,
          marginBottom: 40,
        }}
      >
        A página que procura não existe ou foi movida. Talvez encontre o que
        procura na nossa coleção.
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
          Voltar ao início
        </Link>
        <Link href="/catalogo" className="hmg-ghost-btn hmg-ghost-btn--gold">
          Ver coleção
        </Link>
      </div>
    </div>
  );
}

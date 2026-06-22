import type { Metadata } from "next";
import { ContactForm } from "@/components/public/ContactForm";
import { TypingText } from "@/components/public/TypingText";
import { getT } from "@/lib/i18n-server";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Fale connosco sobre compra, venda ou avaliação de relógios.",
};

const CONTENT = {
  pt: {
    overline: "Contacto",
    title: "Fale connosco.",
    intro:
      "Gostamos de conversar sobre relojoaria tanto quanto de encontrar o relógio certo. Para comprar, vender ou apenas trocar impressões — estamos a uma mensagem de distância.",
  },
  en: {
    overline: "Contact",
    title: "Talk to us.",
    intro:
      "We enjoy talking about watchmaking as much as finding the right watch. To buy, sell or simply share thoughts — we're just one message away.",
  },
} as const;

export default async function ContactoPage() {
  const { locale } = await getT();
  const copy = CONTENT[locale];

  return (
    <div style={{ padding: "var(--section-y) 0" }}>
      <div
        className="hmg-container hmg-stack"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 90,
          alignItems: "start",
        }}
      >
        {/* Left */}
        <div className="hmg-fade-up">
          <span className="hmg-overline">{copy.overline}</span>
          <h1
            aria-label={copy.title}
            style={{
              fontSize: "var(--fs-display-l)",
              lineHeight: "var(--lh-tight)",
              marginTop: 20,
              marginBottom: 24,
            }}
          >
            <TypingText segments={[{ text: copy.title }]} />
          </h1>
          <p
            style={{
              fontSize: "var(--fs-body-l)",
              lineHeight: "var(--lh-relaxed)",
              color: "var(--text-secondary)",
              maxWidth: 400,
            }}
          >
            {copy.intro}
          </p>
        </div>

        {/* Form */}
        <div>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}

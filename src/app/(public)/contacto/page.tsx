import type { Metadata } from "next";
import { ContactForm } from "@/components/public/ContactForm";
import { TypingText } from "@/components/public/TypingText";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Fale connosco sobre compra, venda ou avaliação de relógios.",
};

export default function ContactoPage() {
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
          <span className="hmg-overline">Contacto</span>
          <h1
            aria-label="Fale connosco."
            style={{
              fontSize: "var(--fs-display-l)",
              lineHeight: "var(--lh-tight)",
              marginTop: 20,
              marginBottom: 24,
            }}
          >
            <TypingText segments={[{ text: "Fale connosco." }]} />
          </h1>
          <p
            style={{
              fontSize: "var(--fs-body-l)",
              lineHeight: "var(--lh-relaxed)",
              color: "var(--text-secondary)",
              maxWidth: 400,
            }}
          >
            Gostamos de conversar sobre relojoaria tanto quanto de encontrar o
            relógio certo. Para comprar, vender ou apenas trocar impressões —
            estamos a uma mensagem de distância.
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

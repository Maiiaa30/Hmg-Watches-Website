import type { Metadata } from "next";
import { ContactForm } from "@/components/public/ContactForm";
import { SITE_NAME } from "@/constants";

export const metadata: Metadata = {
  title: `Contacto — ${SITE_NAME}`,
  description: "Fale connosco sobre compra, venda ou avaliação de relógios.",
};

export default function ContactoPage() {
  return (
    <div style={{ padding: "var(--section-y) 0" }}>
      <div
        className="hmg-container"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 90,
          alignItems: "start",
        }}
      >
        {/* Left */}
        <div>
          <span className="hmg-overline">Contacto</span>
          <h1
            style={{
              fontSize: "var(--fs-display-l)",
              lineHeight: "var(--lh-tight)",
              marginTop: 20,
              marginBottom: 24,
            }}
          >
            Fale connosco.
          </h1>
          <p
            style={{
              fontSize: "var(--fs-body-l)",
              lineHeight: "var(--lh-relaxed)",
              color: "var(--text-secondary)",
              maxWidth: 400,
            }}
          >
            Gostamos de conversar sobre relojoaria tanto quanto de vender
            relógios. Seja para comprar, vender ou simplesmente perguntar.
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

import type { Metadata } from "next";
import { TypingText } from "@/components/public/TypingText";

export const metadata: Metadata = {
  title: "Sobre Nós",
  description: "A história e os valores da HMG Watches.",
};

export default function SobreNosPage() {
  return (
    <div style={{ padding: "var(--section-y) 0" }}>
      <div className="hmg-container" style={{ maxWidth: "var(--container-narrow)" }}>
        <span className="hmg-overline">Sobre nós</span>
        <h1
          aria-label="Uma montra limpa que serve as peças."
          style={{
            fontSize: "var(--fs-display-l)",
            lineHeight: "var(--lh-tight)",
            marginTop: 20,
            marginBottom: 32,
          }}
        >
          <TypingText
            segments={[
              { text: "Uma montra limpa que\n" },
              { text: "serve as peças.", style: { fontStyle: "italic", color: "var(--accent-press)" } },
            ]}
          />
        </h1>

        <div
          style={{
            fontSize: "var(--fs-body-l)",
            lineHeight: "var(--lh-relaxed)",
            color: "var(--text-secondary)",
            display: "flex",
            flexDirection: "column",
            gap: 24,
          }}
        >
          <p>
            Não vendemos tempo — devolvemos-lhe valor. Cada relógio que chega à
            HMG é estudado, autenticado e avaliado com o mesmo rigor com que
            escolheríamos para nós próprios.
          </p>
          <p>
            Somos movidos pela convicção de que um relógio bem escolhido não
            precisa de apresentações. Serve o pulso. Conta uma história. E, com
            o tempo certo, valoriza.
          </p>
        </div>

        <div
          className="hmg-stack"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 40,
            marginTop: 80,
            paddingTop: 60,
            borderTop: "1px solid var(--border-subtle)",
          }}
        >
          {[
            {
              n: "01",
              title: "Curadoria",
              text: "Não listamos tudo — listamos o que merece ser listado. Cada peça passa por uma selecção rigorosa antes de entrar no catálogo.",
            },
            {
              n: "02",
              title: "Autenticidade",
              text: "Cada relógio é verificado internamente. Sabemos o que procurar e o que rejeitar. A sua confiança não tem preço — a peça tem.",
            },
            {
              n: "03",
              title: "Prontos a usar",
              text: "Os relógios chegam-lhe em condição de uso imediato. Sem surpresas depois da compra.",
            },
          ].map((pillar) => (
            <div key={pillar.n}>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 15,
                  color: "var(--accent)",
                  fontStyle: "italic",
                  marginBottom: 12,
                }}
              >
                {pillar.n}
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "var(--fs-heading)",
                  marginBottom: 12,
                }}
              >
                {pillar.title}
              </h3>
              <p
                style={{
                  fontSize: "var(--fs-body-s)",
                  lineHeight: "var(--lh-relaxed)",
                  color: "var(--text-secondary)",
                }}
              >
                {pillar.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

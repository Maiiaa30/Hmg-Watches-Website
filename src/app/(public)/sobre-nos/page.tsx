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
          aria-label="Pela paixão pelos relógios, levada mais longe."
          style={{
            fontSize: "var(--fs-display-l)",
            lineHeight: "var(--lh-tight)",
            marginTop: 20,
            marginBottom: 32,
          }}
        >
          <TypingText
            segments={[
              { text: "Pela paixão pelos relógios,\n" },
              { text: "levada mais longe.", style: { fontStyle: "italic", color: "var(--accent-press)" } },
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
            A HMG Watches nasceu de uma paixão simples e genuína: o fascínio
            pelos relógios — pela engenharia que cabe num pulso e pelas histórias
            que cada peça transporta consigo.
          </p>
          <p>
            Quisemos ir mais fundo. Em vez de apenas vender relógios, decidimos
            criar algo pessoal — uma curadoria que procura, para cada pessoa, a
            peça certa. Não a mais cara nem a mais óbvia: a certa. Aquela que
            serve o pulso, conta uma história e, com o tempo, valoriza.
          </p>
          <p>
            Trabalhamos inteiramente online. É isso que nos permite dedicar a
            atenção ao que realmente importa: seleccionar bem, autenticar com
            rigor e acompanhar cada cliente de perto, esteja onde estiver.
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
              title: "Acompanhamento",
              text: "Trabalhamos online e de forma próxima. Aconselhamos, esclarecemos e acompanhamos cada compra como se fosse para nós.",
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

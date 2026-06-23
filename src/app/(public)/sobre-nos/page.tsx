import type { Metadata } from "next";
import { TypingText } from "@/components/public/TypingText";
import { getT } from "@/lib/i18n-server";

const CONTENT = {
  pt: {
    overline: "Sobre nós",
    title: "Pela paixão pelos relógios, levada mais longe.",
    seg1: "Pela paixão pelos relógios,\n",
    seg2: "levada mais longe.",
    paragraphs: [
      "A HMG Watches nasceu de uma paixão simples e genuína: o fascínio pelos relógios — pela engenharia que cabe num pulso e pelas histórias que cada peça transporta consigo.",
      "Quisemos ir mais fundo. Em vez de apenas vender relógios, decidimos criar algo pessoal — uma curadoria que procura, para cada pessoa, a peça certa. Não a mais cara nem a mais óbvia: a certa. Aquela que serve o pulso, conta uma história e, com o tempo, valoriza.",
      "Trabalhamos inteiramente online. É isso que nos permite dedicar a atenção ao que realmente importa: seleccionar bem, autenticar com rigor e acompanhar cada cliente de perto, esteja onde estiver.",
    ],
    pillars: [
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
    ],
  },
  en: {
    overline: "About us",
    title: "A passion for watches, taken further.",
    seg1: "A passion for watches,\n",
    seg2: "taken further.",
    paragraphs: [
      "HMG Watches was born from a simple, genuine passion: the fascination with watches — with the engineering that fits on a wrist and the stories each piece carries with it.",
      "We wanted to go deeper. Rather than simply selling watches, we set out to create something personal — a curation that seeks, for each person, the right piece. Not the most expensive nor the most obvious one: the right one. The one that suits the wrist, tells a story and, over time, appreciates.",
      "We work entirely online. That is what allows us to devote our attention to what truly matters: selecting well, authenticating rigorously and following each client closely, wherever they may be.",
    ],
    pillars: [
      {
        n: "01",
        title: "Curation",
        text: "We don't list everything — we list what deserves to be listed. Every piece goes through a rigorous selection before entering the catalogue.",
      },
      {
        n: "02",
        title: "Authenticity",
        text: "Every watch is verified in-house. We know what to look for and what to reject. Your trust is priceless — the piece has a price.",
      },
      {
        n: "03",
        title: "Support",
        text: "We work online and up close. We advise, clarify and accompany every purchase as if it were our own.",
      },
    ],
  },
} as const;

export async function generateMetadata(): Promise<Metadata> {
  const { locale, t } = await getT();
  return {
    title: t.nav.about,
    description: CONTENT[locale].paragraphs[0],
  };
}

export default async function SobreNosPage() {
  const { locale } = await getT();
  const copy = CONTENT[locale];

  return (
    <div style={{ padding: "var(--section-y) 0" }}>
      <div className="hmg-container" style={{ maxWidth: "var(--container-narrow)" }}>
        <span className="hmg-overline">{copy.overline}</span>
        <h1
          aria-label={copy.title}
          style={{
            fontSize: "var(--fs-display-l)",
            lineHeight: "var(--lh-tight)",
            marginTop: 20,
            marginBottom: 32,
          }}
        >
          <TypingText
            segments={[
              { text: copy.seg1 },
              { text: copy.seg2, style: { fontStyle: "italic", color: "var(--accent-press)" } },
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
          {copy.paragraphs.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
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
          {copy.pillars.map((pillar) => (
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

import type { Metadata } from "next";
import Link from "next/link";
import { getT } from "@/lib/i18n-server";

const CONTENT = {
  pt: {
    metaTitle: "Termos de Utilização",
    metaDescription:
      "Condições de utilização do site HMG Watches: conteúdos, propriedade intelectual e responsabilidade.",
    overline: "Legal",
    title: "Termos de Utilização",
    intro:
      "Ao utilizar o site da HMG Watches, aceita as condições descritas abaixo. Leia-as com atenção antes de continuar a navegar.",
    sections: [
      {
        heading: "Uso do site",
        paragraphs: [
          "Este site destina-se a apresentar a nossa seleção de relógios e a facilitar o contacto com potenciais interessados. Compromete-se a utilizá-lo de forma lícita e a não interferir com o seu funcionamento normal nem com a sua segurança.",
        ],
      },
      {
        heading: "Propriedade intelectual",
        paragraphs: [
          "Todos os conteúdos presentes neste site — incluindo fotografias, textos, logótipos e elementos gráficos — são propriedade da HMG Watches ou utilizados com a devida autorização. Não é permitida a reprodução, distribuição ou utilização destes conteúdos sem consentimento prévio por escrito.",
        ],
      },
      {
        heading: "Natureza das peças",
        paragraphs: [
          "Os relógios apresentados são peças únicas em segunda mão. Cada relógio é individual e, uma vez vendido, não pode ser reposto. As descrições e fotografias procuram refletir fielmente o estado de cada peça, mas pequenas variações naturais de um artigo usado podem existir.",
        ],
      },
      {
        heading: "Catálogo e processo de venda",
        paragraphs: [
          "A HMG Watches é uma loja online e este site funciona como catálogo das peças disponíveis. Não processa pagamentos nem encomendas automáticas: qualquer interesse, negociação ou venda é tratado diretamente connosco, através do contacto que estabelecer a partir do site.",
        ],
      },
      {
        heading: "Preços",
        paragraphs: [
          "Os preços indicados são meramente indicativos e podem ser atualizados sem aviso prévio. O preço final é confirmado no momento do contacto e da negociação direta.",
        ],
      },
      {
        heading: "Limitação de responsabilidade",
        paragraphs: [
          "Esforçamo-nos por manter a informação do site atualizada e correta, mas não garantimos a ausência de erros ou omissões. A HMG Watches não se responsabiliza por danos decorrentes da utilização do site ou da confiança depositada em informação aqui apresentada.",
        ],
      },
    ],
    lawHeading: "Lei aplicável",
    lawBefore:
      "Estes termos regem-se pela lei portuguesa. Qualquer litígio será submetido aos tribunais competentes em Portugal. Para qualquer esclarecimento, utilize a nossa ",
    lawLink: "página de contacto",
    lawAfter: ".",
    legalNote: "Documento informativo — rever com aconselhamento jurídico.",
  },
  en: {
    metaTitle: "Terms of Use",
    metaDescription:
      "Conditions for using the HMG Watches website: content, intellectual property and liability.",
    overline: "Legal",
    title: "Terms of Use",
    intro:
      "By using the HMG Watches website, you accept the conditions set out below. Please read them carefully before continuing to browse.",
    sections: [
      {
        heading: "Use of the site",
        paragraphs: [
          "This site is intended to present our selection of watches and to facilitate contact with potential buyers. You undertake to use it lawfully and not to interfere with its normal operation or its security.",
        ],
      },
      {
        heading: "Intellectual property",
        paragraphs: [
          "All content on this site — including photographs, texts, logos and graphic elements — is the property of HMG Watches or used with the appropriate authorisation. Reproduction, distribution or use of this content without prior written consent is not permitted.",
        ],
      },
      {
        heading: "Nature of the pieces",
        paragraphs: [
          "The watches shown are unique second-hand pieces. Each watch is individual and, once sold, cannot be replaced. The descriptions and photographs aim to reflect the condition of each piece faithfully, but minor natural variations of a used item may exist.",
        ],
      },
      {
        heading: "Catalogue and sales process",
        paragraphs: [
          "HMG Watches is an online store and this site works as a catalogue of the available pieces. It does not process payments or automatic orders: any interest, negotiation or sale is handled directly with us, through the contact you establish from the site.",
        ],
      },
      {
        heading: "Prices",
        paragraphs: [
          "The prices shown are merely indicative and may be updated without prior notice. The final price is confirmed at the moment of contact and direct negotiation.",
        ],
      },
      {
        heading: "Limitation of liability",
        paragraphs: [
          "We strive to keep the site's information up to date and accurate, but we do not guarantee the absence of errors or omissions. HMG Watches is not liable for damages arising from the use of the site or from reliance on information presented here.",
        ],
      },
    ],
    lawHeading: "Applicable law",
    lawBefore:
      "These terms are governed by Portuguese law. Any dispute will be submitted to the competent courts in Portugal. For any clarification, please use our ",
    lawLink: "contact page",
    lawAfter: ".",
    legalNote: "Informational document — review with legal advice.",
  },
} as const;

export async function generateMetadata(): Promise<Metadata> {
  const { locale } = await getT();
  const copy = CONTENT[locale];
  return {
    title: copy.metaTitle,
    description: copy.metaDescription,
  };
}

const sectionStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 12,
};

const h2Style: React.CSSProperties = {
  fontFamily: "var(--font-display)",
  fontSize: "var(--fs-heading)",
  color: "var(--text-primary)",
  marginBottom: 4,
};

const pStyle: React.CSSProperties = {
  fontSize: "var(--fs-body-s)",
  lineHeight: "var(--lh-relaxed)",
  color: "var(--text-secondary)",
  margin: 0,
};

export default async function TermosPage() {
  const { locale } = await getT();
  const copy = CONTENT[locale];

  return (
    <div style={{ padding: "var(--section-y) 0" }}>
      <div className="hmg-container" style={{ maxWidth: 720 }}>
        <span className="hmg-overline">{copy.overline}</span>
        <h1
          style={{
            fontSize: "var(--fs-display-l)",
            lineHeight: "var(--lh-tight)",
            marginTop: 20,
            marginBottom: 32,
            color: "var(--text-primary)",
          }}
        >
          {copy.title}
        </h1>

        <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
          <p
            style={{
              fontSize: "var(--fs-body-l)",
              lineHeight: "var(--lh-relaxed)",
              color: "var(--text-secondary)",
              margin: 0,
            }}
          >
            {copy.intro}
          </p>

          {copy.sections.map((section) => (
            <section key={section.heading} style={sectionStyle}>
              <h2 style={h2Style}>{section.heading}</h2>
              {section.paragraphs.map((paragraph, i) => (
                <p key={i} style={pStyle}>
                  {paragraph}
                </p>
              ))}
            </section>
          ))}

          <section style={sectionStyle}>
            <h2 style={h2Style}>{copy.lawHeading}</h2>
            <p style={pStyle}>
              {copy.lawBefore}
              <Link
                href="/contacto"
                style={{ color: "var(--accent-press)", textDecoration: "underline" }}
              >
                {copy.lawLink}
              </Link>
              {copy.lawAfter}
            </p>
          </section>

          <p
            style={{
              fontSize: "var(--fs-body-s)",
              fontStyle: "italic",
              color: "var(--text-tertiary)",
              marginTop: 16,
            }}
          >
            {copy.legalNote}
          </p>
        </div>
      </div>
    </div>
  );
}

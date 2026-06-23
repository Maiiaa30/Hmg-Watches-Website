import type { Metadata } from "next";
import Link from "next/link";
import { getT } from "@/lib/i18n-server";

const CONTENT = {
  pt: {
    metaTitle: "Política de Privacidade",
    metaDescription:
      "Como a HMG Watches recolhe, utiliza e protege os seus dados pessoais, em conformidade com o RGPD.",
    overline: "Legal",
    title: "Política de Privacidade",
    intro:
      "A sua privacidade é importante para nós. Esta política explica que dados pessoais recolhemos, para que os usamos e quais os direitos que lhe assistem ao abrigo do Regulamento Geral sobre a Proteção de Dados (RGPD).",
    sections: [
      {
        heading: "Que dados recolhemos",
        paragraphs: [
          "Recolhemos apenas os dados que nos fornece voluntariamente através dos nossos formulários — o formulário de contacto e o formulário de interesse presente em cada página de relógio. Estes podem incluir o seu nome, endereço de email, número de telemóvel e a mensagem que nos envia.",
          "Recolhemos ainda estatísticas de utilização anónimas (páginas visitadas, tipo de dispositivo e país aproximado) para compreender como o site é utilizado. Não guardamos o seu endereço IP completo e não utilizamos cookies de rastreamento de terceiros.",
        ],
      },
      {
        heading: "Para que usamos os seus dados",
        paragraphs: [
          "Utilizamos os dados de contacto exclusivamente para responder às suas mensagens e pedidos de informação sobre relógios. As estatísticas anónimas servem apenas para melhorar o site e a experiência de navegação. Nunca vendemos nem partilhamos os seus dados com terceiros para fins de marketing.",
        ],
      },
      {
        heading: "Base legal do tratamento",
        paragraphs: [
          "O tratamento dos seus dados de contacto assenta no seu consentimento, dado ao submeter um formulário, e no nosso interesse legítimo em responder a pedidos e gerir o relacionamento comercial. As estatísticas anónimas baseiam-se no interesse legítimo de melhorar o serviço, sem identificar utilizadores individuais.",
        ],
      },
      {
        heading: "Conservação dos dados",
        paragraphs: [
          "Conservamos os dados de contacto apenas durante o tempo necessário para dar seguimento ao seu pedido e cumprir eventuais obrigações legais. Quando deixam de ser necessários, os dados são eliminados ou anonimizados.",
        ],
      },
      {
        heading: "Os seus direitos",
        paragraphs: [
          "Tem o direito de aceder aos seus dados pessoais, de solicitar a sua retificação caso estejam incorretos e de pedir a sua eliminação. Pode também opor-se ao tratamento ou retirar o consentimento a qualquer momento. Para exercer qualquer destes direitos, basta contactar-nos.",
        ],
      },
    ],
    contactHeading: "Contacto",
    contactBefore:
      "Para questões relacionadas com a privacidade ou para exercer os seus direitos, utilize a nossa ",
    contactLink: "página de contacto",
    contactAfter: ". Responderemos com a maior brevidade possível.",
    legalNote: "Documento informativo — rever com aconselhamento jurídico.",
  },
  en: {
    metaTitle: "Privacy Policy",
    metaDescription:
      "How HMG Watches collects, uses and protects your personal data, in compliance with the GDPR.",
    overline: "Legal",
    title: "Privacy Policy",
    intro:
      "Your privacy matters to us. This policy explains what personal data we collect, what we use it for and the rights you have under the General Data Protection Regulation (GDPR).",
    sections: [
      {
        heading: "What data we collect",
        paragraphs: [
          "We only collect the data you voluntarily provide through our forms — the contact form and the interest form on each watch page. These may include your name, email address, phone number and the message you send us.",
          "We also collect anonymous usage statistics (pages visited, device type and approximate country) to understand how the site is used. We do not store your full IP address and we do not use third-party tracking cookies.",
        ],
      },
      {
        heading: "How we use your data",
        paragraphs: [
          "We use contact data solely to reply to your messages and requests for information about watches. The anonymous statistics serve only to improve the site and the browsing experience. We never sell or share your data with third parties for marketing purposes.",
        ],
      },
      {
        heading: "Legal basis for processing",
        paragraphs: [
          "The processing of your contact data is based on your consent, given when you submit a form, and on our legitimate interest in responding to requests and managing the business relationship. The anonymous statistics rely on the legitimate interest of improving the service, without identifying individual users.",
        ],
      },
      {
        heading: "Data retention",
        paragraphs: [
          "We keep contact data only for as long as necessary to follow up on your request and to comply with any legal obligations. Once it is no longer needed, the data is deleted or anonymised.",
        ],
      },
      {
        heading: "Your rights",
        paragraphs: [
          "You have the right to access your personal data, to request its rectification if it is incorrect and to ask for its deletion. You may also object to the processing or withdraw your consent at any time. To exercise any of these rights, simply contact us.",
        ],
      },
    ],
    contactHeading: "Contact",
    contactBefore:
      "For privacy-related questions or to exercise your rights, please use our ",
    contactLink: "contact page",
    contactAfter: ". We will reply as soon as possible.",
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

export default async function PrivacidadePage() {
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
            <h2 style={h2Style}>{copy.contactHeading}</h2>
            <p style={pStyle}>
              {copy.contactBefore}
              <Link
                href="/contacto"
                style={{ color: "var(--accent-press)", textDecoration: "underline" }}
              >
                {copy.contactLink}
              </Link>
              {copy.contactAfter}
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

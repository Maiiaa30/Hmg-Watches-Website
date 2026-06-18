import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description:
    "Como a HMG Watches recolhe, utiliza e protege os seus dados pessoais, em conformidade com o RGPD.",
};

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

export default function PrivacidadePage() {
  return (
    <div style={{ padding: "var(--section-y) 0" }}>
      <div className="hmg-container" style={{ maxWidth: 720 }}>
        <span className="hmg-overline">Legal</span>
        <h1
          style={{
            fontSize: "var(--fs-display-l)",
            lineHeight: "var(--lh-tight)",
            marginTop: 20,
            marginBottom: 32,
            color: "var(--text-primary)",
          }}
        >
          Política de Privacidade
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
            A sua privacidade é importante para nós. Esta política explica que
            dados pessoais recolhemos, para que os usamos e quais os direitos que
            lhe assistem ao abrigo do Regulamento Geral sobre a Proteção de Dados
            (RGPD).
          </p>

          <section style={sectionStyle}>
            <h2 style={h2Style}>Que dados recolhemos</h2>
            <p style={pStyle}>
              Recolhemos apenas os dados que nos fornece voluntariamente através
              dos nossos formulários — o formulário de contacto e o formulário de
              interesse presente em cada página de relógio. Estes podem incluir o
              seu nome, endereço de email, número de telemóvel e a mensagem que
              nos envia.
            </p>
            <p style={pStyle}>
              Recolhemos ainda estatísticas de utilização anónimas (páginas
              visitadas, tipo de dispositivo e país aproximado) para compreender
              como o site é utilizado. Não guardamos o seu endereço IP completo e
              não utilizamos cookies de rastreamento de terceiros.
            </p>
          </section>

          <section style={sectionStyle}>
            <h2 style={h2Style}>Para que usamos os seus dados</h2>
            <p style={pStyle}>
              Utilizamos os dados de contacto exclusivamente para responder às
              suas mensagens e pedidos de informação sobre relógios. As
              estatísticas anónimas servem apenas para melhorar o site e a
              experiência de navegação. Nunca vendemos nem partilhamos os seus
              dados com terceiros para fins de marketing.
            </p>
          </section>

          <section style={sectionStyle}>
            <h2 style={h2Style}>Base legal do tratamento</h2>
            <p style={pStyle}>
              O tratamento dos seus dados de contacto assenta no seu
              consentimento, dado ao submeter um formulário, e no nosso interesse
              legítimo em responder a pedidos e gerir o relacionamento comercial.
              As estatísticas anónimas baseiam-se no interesse legítimo de
              melhorar o serviço, sem identificar utilizadores individuais.
            </p>
          </section>

          <section style={sectionStyle}>
            <h2 style={h2Style}>Conservação dos dados</h2>
            <p style={pStyle}>
              Conservamos os dados de contacto apenas durante o tempo necessário
              para dar seguimento ao seu pedido e cumprir eventuais obrigações
              legais. Quando deixam de ser necessários, os dados são eliminados ou
              anonimizados.
            </p>
          </section>

          <section style={sectionStyle}>
            <h2 style={h2Style}>Os seus direitos</h2>
            <p style={pStyle}>
              Tem o direito de aceder aos seus dados pessoais, de solicitar a sua
              retificação caso estejam incorretos e de pedir a sua eliminação.
              Pode também opor-se ao tratamento ou retirar o consentimento a
              qualquer momento. Para exercer qualquer destes direitos, basta
              contactar-nos.
            </p>
          </section>

          <section style={sectionStyle}>
            <h2 style={h2Style}>Contacto</h2>
            <p style={pStyle}>
              Para questões relacionadas com a privacidade ou para exercer os seus
              direitos, utilize a nossa{" "}
              <Link
                href="/contacto"
                style={{ color: "var(--accent-press)", textDecoration: "underline" }}
              >
                página de contacto
              </Link>
              . Responderemos com a maior brevidade possível.
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
            Documento informativo — rever com aconselhamento jurídico.
          </p>
        </div>
      </div>
    </div>
  );
}

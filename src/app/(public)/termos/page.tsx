import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Termos de Utilização",
  description:
    "Condições de utilização do site HMG Watches: conteúdos, propriedade intelectual e responsabilidade.",
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

export default function TermosPage() {
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
          Termos de Utilização
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
            Ao utilizar o site da HMG Watches, aceita as condições descritas
            abaixo. Leia-as com atenção antes de continuar a navegar.
          </p>

          <section style={sectionStyle}>
            <h2 style={h2Style}>Uso do site</h2>
            <p style={pStyle}>
              Este site destina-se a apresentar a nossa seleção de relógios e a
              facilitar o contacto com potenciais interessados. Compromete-se a
              utilizá-lo de forma lícita e a não interferir com o seu
              funcionamento normal nem com a sua segurança.
            </p>
          </section>

          <section style={sectionStyle}>
            <h2 style={h2Style}>Propriedade intelectual</h2>
            <p style={pStyle}>
              Todos os conteúdos presentes neste site — incluindo fotografias,
              textos, logótipos e elementos gráficos — são propriedade da HMG
              Watches ou utilizados com a devida autorização. Não é permitida a
              reprodução, distribuição ou utilização destes conteúdos sem
              consentimento prévio por escrito.
            </p>
          </section>

          <section style={sectionStyle}>
            <h2 style={h2Style}>Natureza das peças</h2>
            <p style={pStyle}>
              Os relógios apresentados são peças únicas em segunda mão. Cada
              relógio é individual e, uma vez vendido, não pode ser reposto. As
              descrições e fotografias procuram refletir fielmente o estado de
              cada peça, mas pequenas variações naturais de um artigo usado podem
              existir.
            </p>
          </section>

          <section style={sectionStyle}>
            <h2 style={h2Style}>Montra e processo de venda</h2>
            <p style={pStyle}>
              Este site funciona como uma montra. Não processa pagamentos nem
              encomendas online. Qualquer interesse, negociação ou venda é tratado
              diretamente connosco, através do contacto que estabelecer a partir
              do site.
            </p>
          </section>

          <section style={sectionStyle}>
            <h2 style={h2Style}>Preços</h2>
            <p style={pStyle}>
              Os preços indicados são meramente indicativos e podem ser
              atualizados sem aviso prévio. O preço final é confirmado no momento
              do contacto e da negociação direta.
            </p>
          </section>

          <section style={sectionStyle}>
            <h2 style={h2Style}>Limitação de responsabilidade</h2>
            <p style={pStyle}>
              Esforçamo-nos por manter a informação do site atualizada e correta,
              mas não garantimos a ausência de erros ou omissões. A HMG Watches
              não se responsabiliza por danos decorrentes da utilização do site ou
              da confiança depositada em informação aqui apresentada.
            </p>
          </section>

          <section style={sectionStyle}>
            <h2 style={h2Style}>Lei aplicável</h2>
            <p style={pStyle}>
              Estes termos regem-se pela lei portuguesa. Qualquer litígio será
              submetido aos tribunais competentes em Portugal. Para qualquer
              esclarecimento, utilize a nossa{" "}
              <Link
                href="/contacto"
                style={{ color: "var(--accent-press)", textDecoration: "underline" }}
              >
                página de contacto
              </Link>
              .
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

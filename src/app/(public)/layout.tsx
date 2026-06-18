import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { AnalyticsTracker } from "@/components/public/AnalyticsTracker";
import { WhatsAppButton } from "@/components/public/WhatsAppButton";
import { getSetting } from "@/lib/db/settings";

async function getWhatsAppNumber(): Promise<string | null> {
  try {
    return await getSetting("whatsapp_number");
  } catch {
    return null;
  }
}

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const whatsappNumber = await getWhatsAppNumber();

  return (
    <>
      <a href="#main" className="hmg-skip-link">Saltar para o conteúdo</a>
      <AnalyticsTracker />
      <Header />
      <main id="main" tabIndex={-1}>{children}</main>
      <Footer />
      {whatsappNumber && whatsappNumber.trim() !== "" && (
        <WhatsAppButton phone={whatsappNumber.trim()} />
      )}
    </>
  );
}

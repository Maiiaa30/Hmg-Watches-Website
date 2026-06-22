import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { AnalyticsTracker } from "@/components/public/AnalyticsTracker";
import { WhatsAppButton } from "@/components/public/WhatsAppButton";
import { getSetting } from "@/lib/db/settings";

// Read the public-facing site settings (best-effort — never crash the layout).
async function getPublicSettings() {
  try {
    const [whatsapp, instagram, contactEmail] = await Promise.all([
      getSetting("whatsapp_number"),
      getSetting("instagram_url"),
      getSetting("site_contact_email"),
    ]);
    return {
      whatsapp: whatsapp?.trim() || "",
      instagram: instagram?.trim() || "",
      contactEmail: contactEmail?.trim() || "",
    };
  } catch {
    return { whatsapp: "", instagram: "", contactEmail: "" };
  }
}

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getPublicSettings();

  return (
    <>
      <a href="#main" className="hmg-skip-link">Saltar para o conteúdo</a>
      <AnalyticsTracker />
      <Header />
      <main id="main" tabIndex={-1}>{children}</main>
      <Footer instagramUrl={settings.instagram} contactEmail={settings.contactEmail} />
      {settings.whatsapp && <WhatsAppButton phone={settings.whatsapp} />}
    </>
  );
}

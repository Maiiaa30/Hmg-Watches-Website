import { cookies } from "next/headers";
import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { AnalyticsTracker } from "@/components/public/AnalyticsTracker";
import { WhatsAppButton } from "@/components/public/WhatsAppButton";
import { MaintenanceScreen } from "@/components/public/MaintenanceScreen";
import { getSetting } from "@/lib/db/settings";
import { getLocale } from "@/lib/i18n-server";

// Read the public-facing site settings (best-effort — never crash the layout).
async function getPublicSettings() {
  try {
    const [whatsapp, instagram, contactEmail, maintenance] = await Promise.all([
      getSetting("whatsapp_number"),
      getSetting("instagram_url"),
      getSetting("site_contact_email"),
      getSetting("maintenance_mode"),
    ]);
    return {
      whatsapp: whatsapp?.trim() || "",
      instagram: instagram?.trim() || "",
      contactEmail: contactEmail?.trim() || "",
      maintenance: maintenance === "true",
    };
  } catch {
    return { whatsapp: "", instagram: "", contactEmail: "", maintenance: false };
  }
}

// Owner preview bypass: visiting any page with ?preview=<MAINTENANCE_SECRET>
// sets the hmg_preview cookie (handled in middleware); we honour it here too.
async function isPreviewUnlocked(): Promise<boolean> {
  const secret = process.env.MAINTENANCE_SECRET;
  if (!secret) return false;
  try {
    const store = await cookies();
    return store.get("hmg_preview")?.value === secret;
  } catch {
    return false;
  }
}

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, locale] = await Promise.all([getPublicSettings(), getLocale()]);

  if (settings.maintenance && !(await isPreviewUnlocked())) {
    return <MaintenanceScreen />;
  }

  return (
    <>
      <a href="#main" className="hmg-skip-link">Saltar para o conteúdo</a>
      <AnalyticsTracker />
      <Header locale={locale} />
      <main id="main" tabIndex={-1}>{children}</main>
      <Footer instagramUrl={settings.instagram} contactEmail={settings.contactEmail} locale={locale} />
      {settings.whatsapp && <WhatsAppButton phone={settings.whatsapp} locale={locale} />}
    </>
  );
}

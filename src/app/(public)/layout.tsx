import { cookies } from "next/headers";
import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { AnalyticsTracker } from "@/components/public/AnalyticsTracker";
import { WhatsAppButton } from "@/components/public/WhatsAppButton";
import { MaintenanceScreen } from "@/components/public/MaintenanceScreen";
import { getSettings } from "@/lib/db/settings";
import { getLocale } from "@/lib/i18n-server";

// Read the public-facing site settings in ONE query (best-effort — never crash
// the layout).
async function getPublicSettings() {
  try {
    const map = await getSettings([
      "whatsapp_number",
      "instagram_url",
      "site_contact_email",
      "maintenance_mode",
    ]);
    return {
      whatsapp: map.whatsapp_number?.trim() || "",
      instagram: map.instagram_url?.trim() || "",
      contactEmail: map.site_contact_email?.trim() || "",
      maintenance: map.maintenance_mode === "true",
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

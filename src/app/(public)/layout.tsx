import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { AnalyticsTracker } from "@/components/public/AnalyticsTracker";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AnalyticsTracker />
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}

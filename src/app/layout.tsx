import type { Metadata } from "next";
import { Playfair_Display, DM_Sans, DM_Mono } from "next/font/google";
import "./globals.css";
import { SITE_NAME, SITE_DESCRIPTION } from "@/constants";
import { APP_URL } from "@/lib/app-url";

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display-loaded",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body-loaded",
  display: "swap",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono-loaded",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: SITE_NAME,
    template: `%s — ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  metadataBase: new URL(APP_URL),
  openGraph: {
    type: "website",
    locale: "pt_PT",
    siteName: SITE_NAME,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt"
      className={`${playfairDisplay.variable} ${dmSans.variable} ${dmMono.variable}`}
    >
      <head>
        <style
          dangerouslySetInnerHTML={{
            __html: `
              :root {
                --font-display: var(--font-display-loaded, "Playfair Display", Georgia, serif);
                --font-body: var(--font-body-loaded, "DM Sans", system-ui, sans-serif);
                --font-mono: var(--font-mono-loaded, "DM Mono", ui-monospace, monospace);
              }
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

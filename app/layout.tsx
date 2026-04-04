import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/ui/footer";
import { Navbar } from "@/components/ui/navbar";
import { getSeasonPrefix } from "@/lib/metadata";
import { getLocale, getTranslations, t } from "@/lib/i18n";
import { LocaleProvider } from "@/lib/i18n/locale-context";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const trans = getTranslations(locale);
  const prefix = getSeasonPrefix();
  return {
    title: prefix === "x5s3" ? t(trans, "layout.titleSeason3") : t(trans, "layout.titleSeason2"),
    description: t(trans, "layout.description"),
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{
          fontFeatureSettings: '"rlig" 1, "calt" 1',
        }}
      >
        <LocaleProvider initialLocale={locale}>
          <div
            id="root-container"
            className="min-h-screen flex flex-col bg-background"
          >
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </LocaleProvider>
        <Analytics />
      </body>
    </html>
  );
}

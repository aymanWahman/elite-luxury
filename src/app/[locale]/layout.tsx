import Header from "@/components/header";
import Footer from "@/components/footer";
import "./globals.css";

import { ThemeProvider } from "@/components/header/theme-provider";
import { Directions, Languages } from "@/constants/enums";
import type { Metadata } from "next";
import { Cairo, Tajawal } from "next/font/google";
import { Locale } from "@/i18n.config";
import { Toaster } from "@/components/ui/toaster";
import NextAuthSessionProvider from "@/providers/NextAuthSessionProvider";

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["400", "500", "700"],
  preload: true,
});

const cairo = Cairo({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  preload: true,
});

export const metadata: Metadata = {
  title: "Elite Luxury",
  description: "Premium Hospitality in Makkah",
  keywords: "Elite Luxury, Makkah, Hotels, Hospitality",
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  return (
    <html
      lang={locale}
      dir={locale === Languages.ARABIC ? Directions.RTL : Directions.LTR}
      suppressHydrationWarning
    >
      <body
        className={
          locale === Languages.ARABIC ? tajawal.className : cairo.className
        }
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <NextAuthSessionProvider>
            <Header />
            <main className="pt-24 print:mt-0 print:pt-0">{children}</main>
            <Footer />
            <Toaster />
          </NextAuthSessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Directions, Languages } from "@/constants/enums";
import { Locale } from "@/i18n.config";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import NextAuthSessionProvider from "@/providers/NextAuthSessionProvider";
import { ThemeProvider } from "@/components/header/theme-provider";
import type { Metadata } from "next";
import { Cairo } from "next/font/google";

export async function generateStaticParams() {
  return [{ locale: Languages.ARABIC }, { locale: Languages.ENGLISH }];
}

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "800"],
  preload: true,
});

export const metadata: Metadata = {
  title: "Elite Luxury | فخامة النخبة",
  description: "Premium Hospitality in Makkah",
  keywords: "Elite Luxury, Makkah, Hotels, Hospitality",
};

export default async function RootLayout({
  params,
  children,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
}>) {
  const locale = (await params).locale;
  return (
    <html lang={locale}
      dir={locale === Languages.ARABIC ? Directions.RTL : Directions.LTR}
    >
      <body className={cairo.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
           <NextAuthSessionProvider>
            <Header />
            <main className="pt-20 ">{children}</main>
            <Footer />
            <Toaster />
          
        </NextAuthSessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

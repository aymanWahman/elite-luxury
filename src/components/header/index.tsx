import Link from "../link";
import Navbar from "./Navbar";
import { getCurrentLocale } from "@/lib/getCurrentLocale";
import getTrans from "@/lib/translation";
import LanguageSwitcher from "./language-switcher";
import AuthButtons from "./auth-buttons";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { ThemeToggleButton } from "./ThemeToggleButton";
import Image from "next/image";
import { Languages } from "@/constants/enums";

async function Header() {
  // جلب اللغة تلقائياً مثل الفوتر
  const locale = await getCurrentLocale();
  const isAr = locale === Languages.ARABIC || (locale as string) === "ar";

  const initialSession = await getServerSession(authOptions);
  const translations = await getTrans(locale);

  const logoText = translations?.logo || (isAr ? "فخامة النخبة" : "Elite Luxury");

  return (
    <header className="print:hidden fixed top-0 w-full py-4 bg-background/80 backdrop-blur-md z-50 border-b border-border/40">
      <div className="container flex items-center justify-between gap-6 lg:gap-8">
        <Link
          href={`/${locale}`}
          className="flex gap-3 items-center text-primary shrink-0"
        >
          <Image
            src="https://res.cloudinary.com/dktod7mod/image/upload/v1788210789/elite/elite-logo_h1xt5f.jpg"
            alt={logoText}
            width={42}
            height={42}
            className="object-contain rounded-full border border-border"
            priority
          />
          <span className="font-serif text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            {logoText}
          </span>
        </Link>

        <Navbar translations={translations} initialSession={initialSession} />

        <div className="flex items-center gap-4 flex-1 justify-end">
          <div className="hidden lg:flex lg:items-center lg:gap-6">
            <AuthButtons
              translations={translations}
              initialSession={initialSession}
            />
            <LanguageSwitcher />
          </div>

          <ThemeToggleButton />
        </div>
      </div>
    </header>
  );
}

export default Header;
import Link from "../link";
import Navbar from "./Navbar";
// import CartButton from "./cart-button";
import { getCurrentLocale } from "@/lib/getCurrentLocale";
import getTrans from "@/lib/translation";
// import {getTrans} from "@/i18n/loader";
import LanguageSwitcher from "./language-switcher";
import AuthButtons from "./auth-buttons";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { ThemeToggleButton } from "./ThemeToggleButton";
import Image from "next/image";

async function Header() {
  const locale = await getCurrentLocale();
  const initialSession = await getServerSession(authOptions);
  const translations = await getTrans(locale);
  return (
    <header className="print:hidden fixed top-0 w-full py-4 bg-transparent backdrop-blur-md z-50">
      <div className="container flex items-center justify-between gap-6 lg:gap-8">
        <Link
          href={`/${locale}`}
          className="flex gap-2 items-center text-primary md:mb-3"
        >
          <Image
    src="https://res.cloudinary.com/dktod7mod/image/upload/v1788210789/elite/elite-logo_h1xt5f.jpg"
    alt={translations.logo || "Logo"}
    width={45}
    height={45}
    className="object-contain rounded-full"
    priority
  />
          <span className="font-serif text-3xl font-bold">
            {translations.logo}
          </span>
        </Link>

        <Navbar translations={translations} initialSession={initialSession} />
        <div className="flex items-center gap-6 flex-1 justify-end">
          <div className="hidden lg:flex lg:items-center lg:gap-6 ">
            <AuthButtons
              translations={translations}
              initialSession={initialSession}
            />
            <LanguageSwitcher />
          </div>

          {/* <CartButton /> */}
          <ThemeToggleButton />
        </div>
      </div>
    </header>
  );
}

export default Header;

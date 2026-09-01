"use client";

import { Routes } from "@/constants/enums";
import Link from "../link";
import { Button } from "../ui/button";
import { useState } from "react";
import { Menu, XIcon } from "lucide-react";
import { useParams, usePathname } from "next/navigation";
import AuthButtons from "./auth-buttons";
import LanguageSwitcher from "./language-switcher";
import { Translations } from "@/types/translations";

import { Session } from "next-auth";
import { useClientSession } from "@/hooks/useClientSession";
import { UserRole } from "@/constants/enums";

function Navbar({
  translations,
  initialSession,
}: {
  translations: Translations;
  initialSession: Session | null;
}) {
  const session = useClientSession(initialSession);
  const [openMenu, setOpenMenu] = useState(false);
  const { locale } = useParams();
  const pathname = usePathname();

  const links = [
    {
      id: "home",
      title: translations.navbar.home,
      href: Routes.CONTACT,
    },
     
  ];

  // 🚀 الدالة تقرأ الترجمة الصافية من الملف فقط وتدمج معها الاسم، والمسار موحد للبروفايل
  const getRoleRouteAndTitle = (
    role: UserRole | undefined,
    name: string | null | undefined,
  ) => {
    const firstName = name ? name.split(" ")[0] : "";

    switch (role) {
      case UserRole.ADMIN:
        return {
          route: Routes.PROFILE,
          title: `${translations.navbar.admin} (${firstName})`,
        };


      default:
        return {
          route: Routes.PROFILE,
          title: translations.navbar.profile,
        };
    }
  };

  // 🎯 استخراج الـ role والـ name من الـ session الحالي
  const currentUserRole = session.data?.user?.role as UserRole | undefined;
  const currentUserName = session.data?.user?.name;

  // تمرير الـ Role والـ Name معاً للدالة
  const { route: userRoute, title: userLinkTitle } = getRoleRouteAndTitle(
    currentUserRole,
    currentUserName,
  );
  const fullTargetHref = `/${locale}/${userRoute}`;

  return (
    <nav className="order-last lg:order-none">
      <Button
        variant="secondary"
        size="sm"
        className="lg:hidden"
        onClick={() => setOpenMenu(true)}
      >
        <Menu className="!w-6 !h-6" />
      </Button>

      <ul
        className={`lg:flex items-center gap-6
          fixed top-0 left-0 h-screen w-full px-10 py-20 bg-background text-xl
          flex-col transition-transform duration-300 ease-in-out
          ${openMenu ? "translate-x-0 space-y-8" : "-translate-x-full"}
          lg:static lg:h-auto lg:w-auto lg:flex-row lg:p-0 lg:bg-transparent lg:translate-x-0`}
      >
        <Button
          variant="secondary"
          size="sm"
          className="absolute top-10 right-10 lg:hidden"
          onClick={() => setOpenMenu(false)}
        >
          <XIcon className="!w-6 !h-6" />
        </Button>

        {links.map((link) => (
          <li key={link.id}>
            <Link
              onClick={() => setOpenMenu(false)}
              href={`/${locale}/${link.href}`}
              className={`hover:text-primary duration-200 transition-colors font-semibold ${
                pathname.startsWith(`/${locale}/${link.href}`)
                  ? "text-primary"
                  : "text-accent"
              }`}
            >
              {link.title}
            </Link>
          </li>
        ))}

        {/* 🛡️ الرابط الديناميكي الموحد حسب الدور المستهدف */}
        {session.data?.user && (
          <li>
            <Link
              href={fullTargetHref}
              onClick={() => setOpenMenu(false)}
              className={`${
                pathname === fullTargetHref ||
                pathname.startsWith(`${fullTargetHref}/`)
                  ? "text-primary"
                  : "text-accent"
              } hover:text-primary duration-200 transition-colors font-semibold`}
            >
              {userLinkTitle}
            </Link>
          </li>
        )}

        <li className="lg:hidden flex flex-col gap-8">
          <div onClick={() => setOpenMenu(false)}>
            <AuthButtons
              translations={translations}
              initialSession={initialSession}
            />
          </div>
          <LanguageSwitcher />
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { i18n, LanguageType, Locale } from "./i18n.config";
import { withAuth } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";
import { Pages, Routes } from "./constants/enums";
import { UserRole } from "@prisma/client";

function getLocale(request: NextRequest): string | undefined {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  const locales: LanguageType[] = i18n.locales;
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();
  let locale = "";

  try {
    locale = matchLocale(languages, locales, i18n.defaultLocale);
  } catch {
    locale = i18n.defaultLocale;
  }
  return locale;
}

export default withAuth(
  async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    // 1. فحص إذا كان المسار يفتقد للغة (مثلاً /about بدلاً من /ar/about)
    const pathnameIsMissingLocale = i18n.locales.every(
      (locale) => !pathname.startsWith(`/${locale}`) && pathname !== `/${locale}`
    );

    if (pathnameIsMissingLocale) {
      const locale = getLocale(request);
      return NextResponse.redirect(
        new URL(`/${locale}${pathname.startsWith("/") ? "" : "/"}${pathname}`, request.url)
      );
    }

    // 2. تحديث x-url في הـ Headers ليشير للرابط الحالي بدقة
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-url", request.url);

    // 3. استخراج اللغة الحالية من المسار
    const segments = pathname.split("/").filter(Boolean);
    const currentLocale = segments[0] as Locale;

    const isAuth = await getToken({ req: request });
    const isAuthPage = pathname.startsWith(`/${currentLocale}/${Routes.AUTH}`);
    const protectedRoutes = [Routes.PROFILE, Routes.ADMIN];
    const isProtectedRoute = protectedRoutes.some((route) =>
      pathname.startsWith(`/${currentLocale}/${route}`)
    );

    // حماية المسارات للزائر غير المسجل
    if (!isAuth && isProtectedRoute) {
      return NextResponse.redirect(
        new URL(`/${currentLocale}/${Routes.AUTH}/${Pages.LOGIN}`, request.url)
      );
    }

    // توجيه المستخدم المسجل بعيداً عن صفحات التسجيل
    if (isAuthPage && isAuth) {
      const role = isAuth.role;
      if (role === UserRole.ADMIN) {
        return NextResponse.redirect(
          new URL(`/${currentLocale}/${Routes.ADMIN}`, request.url)
        );
      }
      return NextResponse.redirect(
        new URL(`/${currentLocale}/${Routes.PROFILE}`, request.url)
      );
    }

    // منع غير الآدمن من دخول صفحة الآدمن
    if (isAuth && pathname.startsWith(`/${currentLocale}/${Routes.ADMIN}`)) {
      const role = isAuth.role;
      if (role !== UserRole.ADMIN) {
        return NextResponse.redirect(
          new URL(`/${currentLocale}/${Routes.PROFILE}`, request.url)
        );
      }
    }

    // 🚀 إرجاع الاستجابة مع الـ Headers الجديدة التي تحتوي على x-url
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  },
  {
    callbacks: {
      authorized() {
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
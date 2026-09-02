import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { i18n, LanguageType, Locale } from "./i18n.config";
import { getToken } from "next-auth/jwt";
import { Pages, Routes, UserRole } from "./constants/enums";

/**
 * 🛠️ دالة مساعدة سريعة ومتوافقة مع الـ Edge Runtime بنسبة 100%
 */
function getLocale(request: NextRequest): string {
  const acceptLanguage = request.headers.get("accept-language");
  if (!acceptLanguage) return i18n.defaultLocale;

  const prefersEn = acceptLanguage.toLowerCase().includes("en");
  const detectedLocale = prefersEn ? "en" : "ar";

  return i18n.locales.includes(detectedLocale as LanguageType)
    ? detectedLocale
    : i18n.defaultLocale;
}

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 🎯 1. الأولوية القصوى: تحضير الـ Headers وإضافة x-url بأمان من البداية
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-url", request.url);

  // 🎯 2. التحقق هل المسار الحالي يفتقد للغة؟
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) =>
      !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`,
  );

  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);
    const redirectUrl = new URL(
      `/${locale}${pathname.startsWith("/") ? "" : "/"}${pathname}`,
      request.url
    );
    redirectUrl.search = request.nextUrl.search;

    return NextResponse.redirect(redirectUrl);
  }

  // استخراج الـ Locale الحقيقي من الـ URL بأمان
  const segments = pathname.split("/");
  const currentLocale = (segments[1] || i18n.defaultLocale) as Locale;

  // جلب كائن الـ Token الموثق من الـ Cookie المشفرة
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  const userRole = token?.role as UserRole | undefined;

  // تحديد نوع المسار الحالي
  const isAuthPage = pathname.startsWith(`/${currentLocale}/${Routes.AUTH}`);
  const isAdminPage = pathname.startsWith(`/${currentLocale}/${Routes.ADMIN}`);
  const isProfilePage = pathname.startsWith(
    `/${currentLocale}/${Routes.PROFILE}`,
  );

  // 3️⃣ حماية المسارات من الزوار غير المسجلين (Guest Protection)
  if (!token && (isAdminPage || isProfilePage)) {
    return NextResponse.redirect(
      new URL(`/${currentLocale}/${Routes.AUTH}/${Pages.LOGIN}`, request.url),
    );
  }

  // 4️⃣ منع المستخدم المسجل من تكرار دخول صفحات الـ Auth
  if (token && isAuthPage) {
    if (userRole === UserRole.ADMIN) {
      return NextResponse.redirect(
        new URL(`/${currentLocale}/${Routes.ADMIN}`, request.url),
      );
    }
    return NextResponse.redirect(
      new URL(`/${currentLocale}/${Routes.PROFILE}`, request.url),
    );
  }

  // 5️⃣ حماية لوحة تحكم الأدمن الصارمة (Admin Privilege Validation)
  if (isAdminPage && userRole !== UserRole.ADMIN) {
    return NextResponse.redirect(
      new URL(`/${currentLocale}/${Routes.PROFILE}`, request.url),
    );
  }

  // 🎯 6. تمرير الطلب مع الـ Headers الجديدة المصنعة
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|images|assets|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};


// import type { NextRequest } from "next/server";
// import { NextResponse } from "next/server";
// import { i18n, LanguageType, Locale } from "./i18n.config";
// import { getToken } from "next-auth/jwt";
// import { Pages, Routes, UserRole } from "./constants/enums";

// /**
//  * 🛠️ دالة مساعدة سريعة ومتوافقة مع الـ Edge Runtime بنسبة 100%
//  */
// function getLocale(request: NextRequest): string {
//   const acceptLanguage = request.headers.get("accept-language");
//   if (!acceptLanguage) return i18n.defaultLocale;

//   const prefersEn = acceptLanguage.toLowerCase().includes("en");
//   const detectedLocale = prefersEn ? "en" : "ar";

//   return i18n.locales.includes(detectedLocale as LanguageType)
//     ? detectedLocale
//     : i18n.defaultLocale;
// }

// export default async function middleware(request: NextRequest) {
//   const pathname = request.nextUrl.pathname;

//   // 🎯 1. الأولوية القصوى والسريعة: التحقق هل المسار الحالي يفتقد للغة؟
//   const pathnameIsMissingLocale = i18n.locales.every(
//     (locale) =>
//       !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`,
//   );

//   if (pathnameIsMissingLocale) {
//     const locale = getLocale(request);

//     return NextResponse.redirect(
//       new URL(
//         `/${locale}${pathname.startsWith("/") ? "" : "/"}${pathname}${request.nextUrl.search}`,
//         request.url,
//       ),
//     );
//   }

//   // استخراج الـ Locale الحقيقي من الـ URL بأمان
//   const segments = pathname.split("/");
//   const currentLocale = (segments[1] || i18n.defaultLocale) as Locale;

//   // جلب كائن الـ Token الموثق من الـ Cookie المشفرة بأمان في بيئة الـ Edge لمرة واحدة فقط
//   const token = await getToken({
//     req: request,
//     secret: process.env.NEXTAUTH_SECRET,
//   });
//   const userRole = token?.role as UserRole | undefined;

//   // تحديد نوع المسار الحالي بشكل صارم ومحكم
//   const isAuthPage = pathname.startsWith(`/${currentLocale}/${Routes.AUTH}`);
//   const isAdminPage = pathname.startsWith(`/${currentLocale}/${Routes.ADMIN}`);
//   const isProfilePage = pathname.startsWith(
//     `/${currentLocale}/${Routes.PROFILE}`,
//   );

//   // 2️⃣ حماية المسارات من الزوار غير المسجلين (Guest Protection)
//   if (!token && (isAdminPage || isProfilePage)) {
//     return NextResponse.redirect(
//       new URL(`/${currentLocale}/${Routes.AUTH}/${Pages.LOGIN}`, request.url),
//     );
//   }

//   // 3️⃣ منع المستخدم المسجل من تكرار دخول صفحات الـ Auth (تسجيل / دخول)
//   if (token && isAuthPage) {
//     if (userRole === UserRole.ADMIN) {
//       return NextResponse.redirect(
//         new URL(`/${currentLocale}/${Routes.ADMIN}`, request.url),
//       );
//     }
//     return NextResponse.redirect(
//       new URL(`/${currentLocale}/${Routes.PROFILE}`, request.url),
//     );
//   }

//   // 4️⃣ حماية لوحة تحكم الأدمن الصارمة (Admin Privilege Validation)
//   if (isAdminPage && userRole !== UserRole.ADMIN) {
//     return NextResponse.redirect(
//       new URL(`/${currentLocale}/${Routes.PROFILE}`, request.url),
//     );
//   }

//   // 🎯 5. شحن الـ Headers وتمرير الطلب بسلام بعد تخطي كل جدران الحماية
//   const requestHeaders = new Headers(request.headers);
//   requestHeaders.set("x-url", request.url);

//   return NextResponse.next({
//     request: {
//       headers: requestHeaders,
//     },
//   });
// }

// export const config = {
//   matcher: [
//     "/((?!api|_next/static|_next/image|images|assets|favicon.ico|robots.txt|sitemap.xml).*)",
//   ],
// };
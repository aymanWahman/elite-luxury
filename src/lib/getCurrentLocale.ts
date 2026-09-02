import { i18n, Locale } from "@/i18n.config";
import { headers } from "next/headers";

export const getCurrentLocale = async (): Promise<Locale> => {
  try {
    const headersList = await headers();
    // قراءة referer الصفحة القادم منها الطلب أو x-url
    const referer = headersList.get("referer") || headersList.get("x-url");

    if (!referer) return i18n.defaultLocale as Locale;

    const url = new URL(referer);
    const pathname = url.pathname;
    const segments = pathname.split("/").filter(Boolean);
    const localeCandidate = segments[0] as Locale;

    if (localeCandidate && i18n.locales.includes(localeCandidate)) {
      return localeCandidate;
    }

    return i18n.defaultLocale as Locale;
  } catch {
    // في حال حدوث أي خطأ في تحليل الرابط نعود للغة الافتراضية فوراً دون إسقاط السيرفر
    return i18n.defaultLocale as Locale;
  }
};


// import { i18n, Locale } from "@/i18n.config";
// import { headers } from "next/headers";

// export const getCurrentLocale = async (): Promise<Locale> => {
//   const url = (await headers()).get("x-url");

//   // 🚀 التعديل هنا: نستخدم القيمة الافتراضية المحددة في الـ config بتاعك (واللي هي Languages.ARABIC)
//   if (!url) return i18n.defaultLocale;

//   try {
//     const pathname = new URL(url).pathname;
//     const locale = pathname.split("/")[1] as Locale;

//     // 🚀 إذا لم يجد لغة في الرابط، يرجع للغة الافتراضية المحددة في النظام عندك
//     return locale || i18n.defaultLocale;
//   } catch {
//     return i18n.defaultLocale;
//   }
// };

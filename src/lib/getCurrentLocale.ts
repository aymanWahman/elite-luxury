import { i18n, Locale } from "@/i18n.config";
import { headers } from "next/headers";

export const getCurrentLocale = async (): Promise<Locale> => {
  const url = (await headers()).get("x-url");

  // 🚀 التعديل هنا: نستخدم القيمة الافتراضية المحددة في الـ config بتاعك (واللي هي Languages.ARABIC)
  if (!url) return i18n.defaultLocale;

  try {
    const pathname = new URL(url).pathname;
    const locale = pathname.split("/")[1] as Locale;

    // 🚀 إذا لم يجد لغة في الرابط، يرجع للغة الافتراضية المحددة في النظام عندك
    return locale || i18n.defaultLocale;
  } catch {
    return i18n.defaultLocale;
  }
};

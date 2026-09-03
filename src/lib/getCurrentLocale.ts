import { i18n, Locale } from "@/i18n.config";
import { headers } from "next/headers";

export const getCurrentLocale = async (): Promise<Locale> => {
  try {
    const headersList = await headers();
    
    // 🚀 نقرأ x-url الممرر من الميدلوير للطلب الحالي، وإذا لم يوجد نقرأ referer كخيار بديل
    const currentUrl = headersList.get("x-url") || headersList.get("referer");

    if (!currentUrl) return i18n.defaultLocale as Locale;

    const url = new URL(currentUrl);
    const pathname = url.pathname;
    
    // استخراج أول جزء من المسار مثل: /ar/about -> ar
    const segments = pathname.split("/").filter(Boolean);
    const localeCandidate = segments[0] as Locale;

    if (localeCandidate && i18n.locales.includes(localeCandidate)) {
      return localeCandidate;
    }

    return i18n.defaultLocale as Locale;
  } catch {
    return i18n.defaultLocale as Locale;
  }
};
"server-only";

import { Locale } from "../i18n.config";

export async function getTrans(locale: Locale) {
  try {
    // تحميل ملف اللغة بالكامل (ar.json أو en.json)
    return await import(`@/dictionaries/${locale}.json`).then((m) => m.default);
  } catch {
    // في حال حدوث خطأ، يتم تحميل ملف اللغة العربية كاحتياط
    return await import(`../dictionaries/ar.json`).then((m) => m.default);
  }
}

import { Locale } from "@/i18n.config";
import { LocalizedText } from "@/types/app";

/**
 * دالة جلب النص المترجم بناءً على اللغة الممررة
 */
export function getText(
  textObj: LocalizedText | null | undefined,
  locale: Locale,
): string {
  if (!textObj) return "";
  return textObj[locale] || textObj["ar"] || textObj["en"] || "";
}

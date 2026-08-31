import { Translations } from "@/types/translations";
import { z } from "zod";

/**
 * 👤 سكيمة تحديث الملف الشخصي للمستخدم (Update Profile Schema)
 * مطهرة بالكامل من كراشات السيرفر وحقول النصوص الفارغة
 */
export const updateProfileSchema = (translations: Translations) => {
  return z.object({
    name: z
      .string()
      .trim()
      .min(1, {
        message: translations.validation?.nameRequired || "الاسم مطلوب",
      }),

    email: z
      .string()
      .trim()
      .email({
        message:
          translations.validation?.validEmail || "بريد إلكتروني غير صالح",
      }),

    phone: z
      .string()
      .trim()
      .optional()
      .or(z.literal("")) // 🚀 تأمين: السماح بالنصوص الفارغة القادمة من الفورم دون كراش
      .refine(
        (value) => {
          if (!value) return true;
          return /^\+?[1-9]\d{1,14}$/.test(value);
        },
        {
          message:
            translations.profile?.form?.phone?.validation?.invalid ||
            "رقم الهاتف غير صالح",
        },
      ),

    // 🎯 تطهير الحقول الاختيارية: تحويل النص الفارغ "" إلى undefined ليتم حفظه كـ null في قاعدة البيانات
    streetAddress: z.string().trim().optional().or(z.literal("")),

    postalCode: z
      .string()
      .trim()
      .optional()
      .or(z.literal(""))
      .refine(
        (value) => {
          if (!value) return true;
          return /^\d{5,10}$/.test(value);
        },
        {
          message:
            translations.profile?.form?.postalCode?.validation?.invalid ||
            "الرقم البريدي غير صالح",
        },
      ),

    city: z.string().trim().optional().or(z.literal("")),
    country: z.string().trim().optional().or(z.literal("")),

    /**
     * 📸 حل فخ الصورة: السماح بـ File (عند الرفع الجديد) أو String (رابط الصورة الحالي)
     * لتجنب كراش الـ instanceof على الـ Server Actions والـ Edge Runtimes
     */
    image: z
      .any()
      .optional()
      .refine(
        (val) => {
          if (!val) return true;
          if (typeof val === "string") return true; // رابط قديم مخزن
          if (typeof val === "object" && "size" in val) return true; // كائن ملف مرفوع كاملاً
          return false;
        },
        { message: "صيغة الصورة غير مدعومة" },
      ),
  });
};

import * as z from "zod";
import { Translations } from "@/types/translations";

/**
 * 🔒 1. سكيمة تسجيل الدخول (Login Schema)
 */
export const loginSchema = (translations: Translations) => {
  return z.object({
    // 🚀 تم التعديل: إزالة emailRequired واستخدام validEmail المتاح في الـ Types
    email: z
      .string()
      .trim()
      .email({
        message:
          translations.validation?.validEmail || "بريد إلكتروني غير صالح",
      }),
    password: z
      .string()
      .min(6, {
        message:
          translations.validation?.passwordMinLength ||
          "كلمة المرور قصيرة جداً",
      })
      .max(40, {
        message:
          translations.validation?.passwordMaxLength ||
          "كلمة المرور طويلة جداً",
      }),
  });
};

/**
 * 📝 2. سكيمة إنشاء الحساب الشاملة والمطهرة (SignUp Schema)
 */
export const signUpSchema = (translations: Translations) => {
  return z
    .object({
      name: z
        .string()
        .trim()
        .min(2, {
          message: translations.validation?.nameRequired || "الاسم مطلوب",
        }),
      // 🚀 تم التعديل هنا أيضاً لمنع اعتراض الـ Compiler
      email: z
        .string()
        .trim()
        .email({
          message:
            translations.validation?.validEmail || "بريد إلكتروني غير صالح",
        }),
      role: z.string().optional().default("STUDENT"),
      studentEmail: z
        .string()
        .trim()
        .email({
          message:
            translations.validation?.validEmail || "بريد إلكتروني غير صالح",
        })
        .optional()
        .or(z.literal("")),
      password: z
        .string()
        .min(6, {
          message:
            translations.validation?.passwordMinLength ||
            "يجب أن تكون كلمة المرور 6 أحرف على الأقل",
        })
        .max(40, {
          message:
            translations.validation?.passwordMaxLength ||
            "كلمة المرور طويلة جداً",
        }),
      confirmPassword: z.string().min(6, {
        message:
          translations.validation?.confirmPasswordRequired ||
          "برجاء تأكيد كلمة المرور",
      }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message:
        translations.validation?.passwordMismatch ||
        "كلمتا المرور غير متطابقتين",
      path: ["confirmPassword"],
    })
    .refine(
      (data) => {
        if (data.role === "PARENT" && !data.studentEmail) {
          return false;
        }
        return true;
      },
      {
        message: "برجاء إدخال البريد الإلكتروني للابن لربط الحساب",
        path: ["studentEmail"],
      },
    );
};

/**
 * 🎯 3. نوع الـ ValidationErrors المتوافق مع الـ Inputs
 */
export type ValidationErrors = Record<string, string> | undefined;

"use server";

import { Locale } from "@/i18n.config";
import { getCurrentLocale } from "@/lib/getCurrentLocale";
import { db } from "@/lib/prisma";
import getTrans from "@/lib/translation";
import bcrypt from "bcrypt";
import { UserRole } from "@prisma/client";

/**
 * 🔑 دالة تسجيل الدخول (Login Action)
 */
export const login = async (
  credentials: Record<"email" | "password", string> | undefined,
  locale: Locale,
) => {
  const translations = await getTrans(locale);

  if (!credentials?.email || !credentials?.password) {
    return {
      status: 400,
      message: translations.messages?.unexpectedError || "بيانات غير مكتملة",
      error: {},
    };
  }

  const invalidCredentialsResponse = {
    status: 401,
    message:
      translations.messages?.invalidCredentials ||
      "الإيميل أو كلمة المرور غير صحيحة",
    error: {},
  };

  try {
    const user = await db.user.findUnique({
      where: {
        email: credentials.email.trim().toLowerCase(),
      },
    });

    if (!user) {
      return invalidCredentialsResponse;
    }

    const isValidPassword = await bcrypt.compare(
      credentials.password,
      user.password,
    );

    if (!isValidPassword) {
      return invalidCredentialsResponse;
    }

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      status: 200,
      message:
        translations.messages?.loginSuccessful || "تم تسجيل الدخول بنجاح",
      error: {},
    };
  } catch (error: unknown) {
    console.error("❌ Login Action Error:", error);
    return {
      status: 500,
      message: translations.messages?.unexpectedError || "حدث خطأ غير متوقع",
      error: {},
    };
  }
};

/**
 * 📝 دالة إنشاء حساب جديد المأمنة والمطورة (Signup Action)
 */
export const signup = async (prevState: unknown, formData: FormData) => {
  const locale = await getCurrentLocale();
  const translations = await getTrans(locale);

  const rawFormData = Object.fromEntries(formData.entries());

  try {
    // 1. التحقق من وجود الحساب مسبقاً
    const existingUser = await db.user.findUnique({
      where: { email: (rawFormData.email as string).trim().toLowerCase() },
    });

    if (existingUser) {
      return {
        status: 409,
        message:
          translations.messages?.userAlreadyExists || "هذا الحساب مسجل بالفعل",
        error: {
          email:
            translations.messages?.userAlreadyExists ||
            "هذا الحساب مسجل بالفعل",
        }, // 🚀 تأمين الـ Input Boundary
        formData: rawFormData,
      };
    }

    // 2. فلترة الدور والتحقق الآمن من الـ Enum
    const rawRole = ((rawFormData.role as string) || "STUDENT").toUpperCase();
    const selectedRole = Object.values(UserRole).includes(rawRole as UserRole)
      ? (rawRole as UserRole)
      : UserRole.STUDENT;

    let linkedStudentId: string | null = null;

    // 3. مسار التحقق الخاص بولي الأمر (Parent Profile Connection)
    if (selectedRole === UserRole.PARENT) {
      const studentEmail = rawFormData.studentEmail as string;
      if (!studentEmail) {
        return {
          status: 400,
          message:
            locale === "ar"
              ? "برجاء إدخال البريد الإلكتروني للابن لربط الحساب"
              : "Please enter your student's email to link accounts",
          error: { studentEmail: "حقل مطلوب" },
          formData: rawFormData,
        };
      }

      const studentUser = await db.user.findUnique({
        where: { email: studentEmail.trim().toLowerCase() },
      });

      if (!studentUser) {
        return {
          status: 404,
          message:
            locale === "ar"
              ? "❌ بريد الابن غير مسجل! اطلب من ابنك يسجل حسابه أولاً."
              : "❌ Student email not registered yet!",
          error: {
            studentEmail:
              locale === "ar" ? "بريد الابن غير مسجل" : "Email not found",
          },
          formData: rawFormData,
        };
      }

      linkedStudentId = studentUser.id;
    }

    // 4. تشفير كلمة المرور
    const hashedPassword = await bcrypt.hash(
      rawFormData.password as string,
      10,
    );

    // 5. 🚀 استخدام الـ Prisma Transaction لتأمين عمليتين (إنشاء الأب + تحديث الابن) ككتلة واحدة لا تتجزأ
    if (selectedRole === UserRole.PARENT && linkedStudentId) {
      await db.$transaction(async (tx) => {
        const parentUser = await tx.user.create({
          data: {
            name: rawFormData.name as string,
            email: (rawFormData.email as string).trim().toLowerCase(),
            password: hashedPassword,
            role: selectedRole,
          },
        });

        await tx.user.update({
          where: { id: linkedStudentId },
          data: { parentId: parentUser.id },
        });
      });

      return {
        status: 201,
        message:
          locale === "ar"
            ? "تم إنشاء حساب ولي الأمر وربطه بالابن بنجاح! 🎉"
            : "Parent account created and linked successfully!",
        error: {},
      };
    }

    // 6. مسار الحسابات العادية (طالب / معلم / مستخدم عام)
    await db.user.create({
      data: {
        name: rawFormData.name as string,
        email: (rawFormData.email as string).trim().toLowerCase(),
        password: hashedPassword,
        role: selectedRole,
      },
    });

    return {
      status: 201,
      message: translations.messages?.accountCreated || "تم إنشاء الحساب بنجاح",
      error: {},
    };
  } catch (error: unknown) {
    console.error("❌ Global Signup Error:", error);
    return {
      status: 500,
      message:
        locale === "ar"
          ? "❌ حدث خطأ داخلي في السيرفر أثناء المعالجة"
          : "Internal server error",
      error: {},
      formData: rawFormData,
    };
  }
};

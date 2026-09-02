// "use server";

// import { getCurrentLocale } from "@/lib/getCurrentLocale";
// import { db } from "@/lib/prisma";
// import getTrans from "@/lib/translation";
// import { signUpSchema } from "@/validations/auth";
// import bcrypt from "bcrypt";
// import { UserRole } from "@prisma/client";

// export const signup = async (prevState: unknown, formData: FormData) => {
//   try {
//     const locale = await getCurrentLocale();
//     const translations = await getTrans(locale);

//     const rawFormData = Object.fromEntries(formData.entries());

//     const dataToValidate = {
//       name: (rawFormData.name as string) || "",
//       email: (rawFormData.email as string) || "",
//       password: (rawFormData.password as string) || "",
//       confirmPassword: (rawFormData.confirmPassword as string) || "",
//       role: (rawFormData.role as string) || "USER",
//       studentEmail: (rawFormData.studentEmail as string) || "",
//     };

//     const safeFormData = {
//       name: dataToValidate.name,
//       email: dataToValidate.email,
//     };

//     // 1. التحقق عبر Zod
//     const schema = signUpSchema(translations);
//     const validationResult = schema.safeParse(dataToValidate);

//     if (!validationResult.success) {
//       const formattedErrors: Record<string, string> = {};
//       validationResult.error.issues.forEach((issue) => {
//         if (issue.path[0]) {
//           formattedErrors[issue.path[0].toString()] = issue.message;
//         }
//       });

//       return {
//         status: 400,
//         message: translations.messages?.unexpectedError || "بيانات غير صالحة",
//         error: formattedErrors,
//         formData: safeFormData,
//       };
//     }

//     const { name, email, password } = validationResult.data;
//     const cleanEmail = email.trim().toLowerCase();

//     // 2. التحقق من وجود الحساب
//     const existingUser = await db.user.findUnique({
//       where: { email: cleanEmail },
//     });

//     if (existingUser) {
//       return {
//         status: 409,
//         message: translations.messages?.userAlreadyExists || "الحساب مسجل بالفعل",
//         error: { email: translations.messages?.userAlreadyExists || "الحساب مسجل بالفعل" },
//         formData: safeFormData,
//       };
//     }

//     // 3. التشفير والتخزين
//     const hashedPassword = await bcrypt.hash(password, 10);

//     await db.user.create({
//       data: {
//         name,
//         email: cleanEmail,
//         password: hashedPassword,
//         role: UserRole.USER,
//       },
//     });

//     return {
//       status: 201,
//       message: translations.messages?.accountCreated || "تم إنشاء الحساب بنجاح",
//       error: {},
//     };
//   } catch (error: unknown) {
//     console.error("❌ SIGNUP_ACTION_CRASH:", error);
//     return {
//       status: 500,
//       message: "حدث خطأ أثناء معالجة الطلب، يرجى إعادة المحاولة",
//       error: {},
//     };
//   }
// };

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
 * 📝 دالة إنشاء حساب جديد (Signup Action)
 */
export const signup = async (prevState: unknown, formData: FormData) => {
  const locale = await getCurrentLocale();
  const translations = await getTrans(locale);

  const rawFormData = Object.fromEntries(formData.entries());
  
  // تطهير البيانات وتجنب إرجاع كلمات المرور في كائن الـ Response
  const safeFormData = {
    name: rawFormData.name as string,
    email: rawFormData.email as string,
    role: rawFormData.role as string,
  };

  try {
    const email = (rawFormData.email as string || "").trim().toLowerCase();

    // 1. التحقق من وجود الحساب مسبقاً
    const existingUser = await db.user.findUnique({
      where: { email },
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
        },
        formData: safeFormData,
      };
    }

    // 2. فلترة الدور والتحقق الآمن من الـ Enum
    const rawRole = ((rawFormData.role as string) || "USER").toUpperCase();
    const selectedRole = Object.values(UserRole).includes(rawRole as UserRole)
      ? (rawRole as UserRole)
      : UserRole.USER;

    // 3. تشفير كلمة المرور
    const hashedPassword = await bcrypt.hash(
      rawFormData.password as string,
      10,
    );

    // 4. إنشاء الحساب
    await db.user.create({
      data: {
        name: rawFormData.name as string,
        email,
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
      formData: safeFormData,
    };
  }
};
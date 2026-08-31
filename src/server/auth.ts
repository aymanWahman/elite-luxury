import { Environments, Pages, Routes } from "../constants/enums";
import { DefaultSession, type NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "../lib/prisma";
import { login } from "./_actions/auth";
import { i18n, Locale } from "../i18n.config";
import { UserRole } from "@prisma/client";
import { JWT } from "next-auth/jwt";

// 🛡️ توسيع الـ Interfaces لضمان الـ Type Safety الكامل وعكس الحقول الصافية للمنصة
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      name: string;
      email: string;
      role: UserRole;
      image?: string | null;
      country?: string | null;
      city?: string | null;
      postalCode?: string | null;
      streetAddress?: string | null;
      phone?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    image?: string | null;
    country?: string | null;
    city?: string | null;
    postalCode?: string | null;
    streetAddress?: string | null;
    phone?: string | null;
  }
}

export const authOptions: NextAuthOptions = {
  callbacks: {
    /**
     * 👥 كولباك الجلسة (Session Callback) - نقل البيانات الفلات المؤمنة من الـ Token إلى الواجهات
     */
    session: ({ session, token }) => {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.role = token.role;
        session.user.image = token.image;
        session.user.country = token.country;
        session.user.city = token.city;
        session.user.postalCode = token.postalCode;
        session.user.streetAddress = token.streetAddress;
        session.user.phone = token.phone;
      }
      return session;
    },

    /**
     * 🪙 كولباك الـ Token (JWT Callback) - مأمن 100% من الـ DB Hammering ويدعم التحديث اللحظي
     */
    /**
     * 🪙 كولباك الـ Token (JWT Callback) - مأمن 100% ومطهر من الـ any ومنع اختراق الـ ESLint
     */
    jwt: async ({ token, user, trigger, session }): Promise<JWT> => {
      // 🎯 1. لقطة تسجيل الدخول الأولي: شحن الـ Token فوراً من بيانات الـ User العائد من دالة authorize
      if (user) {
        // 🚀 الحل: عمل Cast للـ user إلى نوع الـ JWT الموعود والموسع فوق بدلاً من any
        const dbUser = user as unknown as JWT;

        return {
          ...token,
          id: dbUser.id,
          name: dbUser.name,
          email: dbUser.email,
          role: dbUser.role,
          image: dbUser.image,
          city: dbUser.city,
          country: dbUser.country,
          phone: dbUser.phone,
          postalCode: dbUser.postalCode,
          streetAddress: dbUser.streetAddress,
        };
      }

      // 🎯 2. لقطة التحديث اللحظي (Session Dynamic Sync): عند مناداة update() من الكلاينت فورم
      if (trigger === "update" && session?.user) {
        return {
          ...token,
          ...session.user, // دمج البيانات الجديدة المحدثة داخل الـ Token فوراً
        };
      }

      // 🚀 3. في الطلبات العادية: إرجاع الـ Token المخزن في الكاش مباشرةً
      return token as JWT;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 أيام مدة صلاحية الجلسة
    updateAge: 24 * 60 * 60, // تحديث الجلسة في الخلفية كل 24 ساعة
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === Environments.DEV,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials, req) => {
        const currentUrl = req?.headers?.referer;
        let locale = i18n.defaultLocale as Locale;

        if (currentUrl) {
          const urlSegments = currentUrl.split("/");
          const detectedLocale = urlSegments[3] as Locale;
          if (i18n.locales.includes(detectedLocale)) {
            locale = detectedLocale;
          }
        }

        const res = await login(credentials, locale);

        // جلب مستخدم كامل البيانات من الداتابيز وشحنه للـ JWT لمرة واحدة فقط
        if (res.status === 200 && "user" in res && res.user) {
          const dbUser = await db.user.findUnique({
            where: { id: res.user.id },
          });

          if (!dbUser) return null;

          return {
            id: dbUser.id,
            name: dbUser.name || "",
            email: dbUser.email,
            role: dbUser.role,
            image: dbUser.image,
            city: dbUser.city,
            country: dbUser.country,
            phone: dbUser.phone,
            postalCode: dbUser.postalCode,
            streetAddress: dbUser.streetAddress,
          };
        } else {
          const validationError = "error" in res ? res.error : undefined;
          const responseError =
            "message" in res ? res.message : "Authentication failed";

          throw new Error(
            JSON.stringify({
              validationError,
              responseError,
            }),
          );
        }
      },
    }),
  ],
  // 🚀 إزالة الـ Adapter لتعارض الـ Credentials وتوفير الأداء الصافي للـ JWT
  pages: {
    signIn: `/${Routes.AUTH}/${Pages.LOGIN}`,
  },
};

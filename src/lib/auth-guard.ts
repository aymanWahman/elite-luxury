import { getServerSession } from "next-auth/next";
import { authOptions } from "../server/auth";
import { UserRole } from "@prisma/client";

// 🚀 تعريف تايب مأمن وموسع محلياً لضمان عدم شكوى الـ TypeScript من الـ role والـ id
type ProtectedUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  id: string;
  role: UserRole;
};

/**
 * 🔒 جدار حماية مركزي للتحقق من تسجيل دخول المستخدم (أي دور)
 * يُستدعى داخل الـ Server Actions والـ Server Components لمنع تكرار كود فحص السيشن.
 * @returns كائن الـ session الحالي إذا كان المستخدم مسجلاً ومؤمناً.
 */
export async function requireAuth() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    throw new Error("Unauthorized: Please sign in to access this resource.");
  }

  // تأمين كائن المستخدم بالـ Types الجديدة الصارمة للسيستم
  return session as Omit<typeof session, "user"> & { user: ProtectedUser };
}

/**
 * 👑 جدار حماية مركزي مخصص للـ Admin فقط
 * يقوم بفحص السيشن والتأكد من أن دور المستخدم هو ADMIN حصراً.
 */
export async function requireAdmin() {
  // 1. التأكد أولاً من تسجيل الدخول عبر المساعد الرئيسي
  const session = await requireAuth();

  // 2. التحقق الصارم من الصلاحية
  if (session.user.role !== UserRole.ADMIN) {
    throw new Error(
      "Forbidden: You do not have permission to perform this action.",
    );
  }

  return session;
}

/**
 * 📚 جدار حماية مركزي مخصص للـ Teacher (والمسؤولين)
 */
export async function requireTeacher() {
  const session = await requireAuth();

  if (
    session.user.role !== UserRole.TEACHER &&
    session.user.role !== UserRole.ADMIN
  ) {
    throw new Error(
      "Forbidden: Only teachers and admins can access this resource.",
    );
  }

  return session;
}

/**
 * 👨‍👩‍👦 جدار حماية مركزي مخصص للـ Parent (والمسؤولين)
 */
export async function requireParent() {
  const session = await requireAuth();

  if (
    session.user.role !== UserRole.PARENT &&
    session.user.role !== UserRole.ADMIN
  ) {
    throw new Error(
      "Forbidden: Only parents and admins can access this resource.",
    );
  }

  return session;
}

/**
 * 👦 جدار حماية مركزي مخصص للبطل الصغير (Student)
 * تم تجهيزه وتأمينه لحماية صفحة الخطة الدراسية القادمة للطالب
 */
export async function requireStudent() {
  const session = await requireAuth();

  if (
    session.user.role !== UserRole.STUDENT &&
    session.user.role !== UserRole.ADMIN
  ) {
    throw new Error(
      "Forbidden: Only students and admins can access this resource.",
    );
  }

  return session;
}

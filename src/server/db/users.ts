import { cache } from "../../lib/cache";
import { db } from "../../lib/prisma";

// 🚀 كائن التحديد الآمن لمنع جلب الـ password المشفرة نهائياً وحماية البيانات الحساسة
const secureUserSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  phone: true,
  streetAddress: true,
  postalCode: true,
  city: true,
  country: true,
  parentId: true,
  createdAt: true,
  updatedAt: true,
};

/**
 * 1️⃣ جلب كل المستخدمين بكاش ذكي ومحدث (يستخدم للأدمن والتقارير)
 */
export const getUsers = cache(
  async () => {
    return db.user.findMany({
      select: {
        ...secureUserSelect,
        parent: {
          select: secureUserSelect,
        },
        children: {
          select: secureUserSelect,
        },
      },
      orderBy: { createdAt: "desc" }, // ترتيب تنازلي لسهولة المتابعة
    });
  },
  ["users"],
  { revalidate: 600 }, // تقليل وقت الكاش لـ 10 دقائق لتوازن الأداء والداتا الحية
);

/**
 * 2️⃣ 🎯 جلب مستخدم فردي مأمن ومصفى من كلمة المرور تماماً مع علاقاته
 */
export const getUser = cache(
  async (userId: string) => {
    if (!userId) return null;

    return db.user.findUnique({
      where: { id: userId },
      select: {
        ...secureUserSelect,
        parent: {
          select: secureUserSelect,
        },
        children: {
          select: secureUserSelect,
        },
      },
    });
  },
  // الـ Dynamic Tag مأمن ومربوط بالـ ID بالملي
  (userId: string) => (userId ? [`user-${userId}`] : ["user-none"]),
  { revalidate: 3600 }, // كاش لمدة ساعة للحقل الفردي، ويسحق فوراً عند مناداة revalidateTag(`user-${id}`)
);

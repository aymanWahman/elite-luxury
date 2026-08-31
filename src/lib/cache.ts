
import { unstable_cache as nextCache } from "next/cache";
import { cache as reactCache } from "react";

// 👇 generic callback لضمان التقاط أي دالة غير معروفة البنية مسبقاً
type Callback<Args extends unknown[], Result> = (
  ...args: Args
) => Promise<Result>;

// 👇 بناء مصفوفة المفاتيح ديناميكياً بناءً على وسائط الدالة الممررة
type KeyParts<Args extends unknown[]> =
  | string[]
  | ((...args: Args) => string[]);

interface CacheOptions {
  revalidate?: number | false;
  tags?: string[];
}

export function cache<Args extends unknown[], Result>(
  cb: Callback<Args, Result>,
  keyParts: KeyParts<Args>,
  options: CacheOptions = {}
) {
  // تغليف الدالة بـ reactCache لضمان الكاش أثناء الطلب الواحد (Per-request)
  const memoizedCb = reactCache(cb);

  return async (...args: Args): Promise<Result> => {
    const keys =
      typeof keyParts === "function"
        ? keyParts(...args)
        : keyParts;

    // تمرير الدالة الميموزد إلى unstable_cache للحفظ المستمر عبر السيرفر
    const cachedFn = nextCache(
      async (...passedArgs: Args) => memoizedCb(...passedArgs),
      keys,
      options
    );

    return cachedFn(...args);
  };
}
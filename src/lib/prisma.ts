import { Environments } from "@/constants/enums";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

// 🎯 إنشاء الـ Client بالطريقة الكلاسيكية المستقرة بدون تعقيد الـ adapters
export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === Environments.DEV
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== Environments.PROD) globalForPrisma.prisma = db;

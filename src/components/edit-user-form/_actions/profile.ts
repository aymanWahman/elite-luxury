"use server";

import { Pages, Routes } from "@/constants/enums";
import { getCurrentLocale } from "@/lib/getCurrentLocale";
import { db } from "@/lib/prisma";
import getTrans from "@/lib/translation";
import { updateProfileSchema } from "@/validations/profile";
import { UserRole } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const updateProfile = async (
  isAdminField: boolean,
  prevState: unknown,
  formData: FormData,
) => {
  try {
    const locale = await getCurrentLocale();
    const translations = await getTrans(locale);

    // 🎯 1. لقط الـ targetUserId والـ role المختارين والـ studentEmail من الفورم مباشرة
    const targetUserId =
      (formData.get("id") as string) ||
      (formData.get("targetUserId") as string);
    const selectedRole = formData.get("role") as UserRole | null;
    const studentEmail = formData.get("studentEmail") as string | null;

    // تحويل البيانات لنص للتحقق منها عبر الـ Zod Schema
    const rawData = Object.fromEntries(formData.entries());
    const result = updateProfileSchema(translations).safeParse(rawData);

    if (!result.success) {
      return {
        error: result.error.flatten().fieldErrors,
      };
    }

    const data = result.data;

    // 2. معالجة الصورة يدوياً لتجنب كراش الـ Zod
    const imageFile = formData.get("image") as File | null;
    let imageUrl: string | undefined = undefined;

    if (imageFile && imageFile.size > 0 && typeof imageFile !== "string") {
      imageUrl = await getImageUrl(imageFile);
    }

    // 🎯 3. البحث الآمن عن المستخدم عبر الـ ID المستهدف أولاً، وإلا فبالإيميل
    let user = null;
    if (targetUserId) {
      user = await db.user.findUnique({ where: { id: targetUserId } });
    } else {
      user = await db.user.findUnique({ where: { email: data.email } });
    }

    if (!user) {
      return {
        message: translations.messages.userNotFound,
        status: 404,
      };
    }

    // 🎯 4. تحديد الـ Role الجديد بحكمة بالغة لمنع تصفير الأدوار
    const finalRole = selectedRole || user.role;

 

    // 6. التحديث الفعلي والآمن في قاعدة البيانات عبر الـ ID الثابت
    await db.user.update({
      where: { id: user.id },
      data: {
        name: data.name,
        email: data.email,
        image: imageUrl ?? user.image,
        role: finalRole,
      },
    });

    // 🚀 7. سحق الكاش الشامل لضمان تحديث لحظي وفوري في السستم بأكمله بدون تعليق
    revalidatePath(`/${locale}/${Routes.PROFILE}`);
    revalidatePath(`/${locale}/${Routes.ADMIN}/${Pages.USERS}`);
    revalidatePath(
      `/${locale}/${Routes.ADMIN}/${Pages.USERS}/${user.id}/${Pages.EDIT}`,
    );

  

    return {
      status: 200,
      message: translations.messages.updateProfileSucess,
    };
  } catch (error) {
    console.error("❌ SERVER_ACTION_ERROR inside updateProfile:", error);
    return {
      status: 500,
      message: "حدث خطأ في السيرفر أثناء حفظ البيانات الجديدة.",
    };
  }
};

const getImageUrl = async (imageFile: File) => {
  const uploadFormData = new FormData();
  uploadFormData.append("file", imageFile);
  uploadFormData.append("pathName", "profile_images");

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/upload`,
      {
        method: "POST",
        body: uploadFormData,
      },
    );

    if (!response.ok) return undefined;

    const image = (await response.json()) as { url: string };
    return image.url;
  } catch (error) {
    console.error("Upload failed:", error);
    return undefined;
  }
};

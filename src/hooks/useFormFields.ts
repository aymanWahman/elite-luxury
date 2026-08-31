import { Pages, Routes } from "@/constants/enums";
import { IFormField, IFormFieldsVariables } from "@/types/app";
import { Translations } from "@/types/translations";

interface Props extends IFormFieldsVariables {
  translations: Translations;
}

const useFormFields = ({
  slug,
  translations,
}: Props): { getFormFields: () => IFormField[] } => {
  // ✅ 1. حقول تسجيل الدخول مأمنة الترجمات
  const loginFields = (): IFormField[] => [
    {
      label: translations.auth?.login?.email?.label || "البريد الإلكتروني",
      name: "email",
      type: "email",
      placeholder:
        translations.auth?.login?.email?.placeholder || "example@domain.com",
      autoFocus: true,
    },
    {
      label: translations.auth?.login?.password?.label || "كلمة المرور",
      name: "password",
      type: "password",
      placeholder:
        translations.auth?.login?.password?.placeholder || "••••••••",
    },
  ];

  // ✅ 2. حقول التسجيل
  const signupFields = (): IFormField[] => [
    {
      label: translations.auth?.register?.name?.label || "الاسم الكامل",
      name: "name",
      type: "text",
      placeholder:
        translations.auth?.register?.name?.placeholder || "اكتب اسمك الثلاثي",
      autoFocus: true,
    },
    {
      label: translations.auth?.register?.email?.label || "البريد الإلكتروني",
      name: "email",
      type: "email",
      placeholder:
        translations.auth?.register?.email?.placeholder || "example@domain.com",
    },
    {
      label: translations.auth?.register?.password?.label || "كلمة المرور",
      name: "password",
      type: "password",
      placeholder:
        translations.auth?.register?.password?.placeholder || "••••••••",
    },
    {
      label:
        translations.auth?.register?.confirmPassword?.label ||
        "تأكيد كلمة المرور",
      name: "confirmPassword",
      type: "password",
      placeholder:
        translations.auth?.register?.confirmPassword?.placeholder || "••••••••",
    },
  ];

  // ✅ 3. حقول الملف الشخصي وتحديث بيانات المستخدمين للأدمن
  const profileFields = (): IFormField[] => [
    {
      label: translations.profile?.form?.name?.label || "الاسم",
      name: "name",
      type: "text",
      placeholder: translations.profile?.form?.name?.placeholder || "الاسم",
      autoFocus: true,
    },
    {
      label: translations.profile?.form?.email?.label || "البريد الإلكتروني",
      name: "email",
      type: "email",
      placeholder: translations.profile?.form?.email?.placeholder || "الإيميل",
    },
    {
      label: translations.profile?.form?.phone?.label || "رقم الهاتف",
      name: "phone",
      type: "text",
      placeholder: translations.profile?.form?.phone?.placeholder || "01xxxxx",
    },
    {
      label: translations.profile?.form?.address?.label || "العنوان بالتفصيل",
      name: "streetAddress",
      type: "text",
      placeholder:
        translations.profile?.form?.address?.placeholder || "شارع ...",
    },
    {
      label: translations.profile?.form?.postalCode?.label || "الرمز البريدي",
      name: "postalCode",
      type: "text",
      placeholder:
        translations.profile?.form?.postalCode?.placeholder || "xxxxx",
    },
    {
      label: translations.profile?.form?.city?.label || "المدينة",
      name: "city",
      type: "text",
      placeholder: translations.profile?.form?.city?.placeholder || "بورسعيد",
    },
    {
      label: translations.profile?.form?.country?.label || "الدولة",
      name: "country",
      type: "text",
      placeholder: translations.profile?.form?.country?.placeholder || "مصر",
    },
  ];

  // ✅ 4. حقول العقد والمسارات (تم تحويل الـ Dot Notation إلى Underscore لمنع فخاخ الـ FormData واصطياد الـ Textarea)
  const nodeFields = (): IFormField[] => [
    {
      label: "Slug (URL)",
      name: "slug",
      type: "text",
      placeholder: "e.g. intro-to-arabic",
      autoFocus: true,
    },
    {
      label: "العنوان بالعربية",
      name: "title_ar", // 🚀 مطهر ومأمن للـ Zod والـ Object.fromEntries
      type: "text",
    },
    {
      label: "English Title",
      name: "title_en", // 🚀 مطهر ومأمن
      type: "text",
    },
    {
      label: "المقدمة بالعربية",
      name: "intro_ar",
      type: "text",
    },
    {
      label: "Intro (EN)",
      name: "intro_en",
      type: "text",
    },
    {
      label: "الخاتمة بالعربية",
      name: "outro_ar",
      type: "text",
    },
    {
      label: "Outro (EN)",
      name: "outro_en",
      type: "text",
    },
    {
      label: "اسم ملف الـ JSON المحلي (إن وجد)",
      name: "jsonFileName",
      type: "text",
      placeholder: "e.g. letters/alef",
    },
    {
      label: "Order / الترتيب",
      name: "order",
      type: "number",
    },
    {
      label: "نشر المحتوى للمنصة",
      name: "isPublished",
      type: "checkbox",
    },
    // 🎯 تنبيه: تأكد من إضافة نوع textarea داخل مكون FormFields الرئيسي لاحقاً ليرندر <textarea> كفؤ
    {
      label: "بيانات وخطوات الدرس (Data JSON)",
      name: "data",
      type: "textarea",
    },
    {
      label: "الوسائط والمرفقات (Media JSON)",
      name: "media",
      type: "textarea",
    },
  ];

  const getFormFields = (): IFormField[] => {
    if (slug && slug.includes(`${Routes.ADMIN}/${Pages.NODES}`)) {
      return nodeFields();
    }

    switch (slug) {
      case Pages.LOGIN:
        return loginFields();
      case Pages.REGISTER:
        return signupFields();
      case Routes.PROFILE:
      case Pages.USERS:
        return profileFields();
      default:
        return [];
    }
  };

  return { getFormFields };
};

export default useFormFields;

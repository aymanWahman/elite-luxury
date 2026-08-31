import Link from "@/components/link";
import { buttonVariants } from "@/components/ui/button";
import { Pages, Routes } from "@/constants/enums";
import { Locale } from "@/i18n.config";
import getTrans from "@/lib/translation";
import Form from "./_components/Form";

interface PageProps {
  params: Promise<{ locale: Locale }>; // 🎯 اعتماد الـ Promise للتوافق الكامل مع Next.js 15 ومنع انهيار الـ Build
}

async function SignupPage({ params }: PageProps) {
  // 🛡️ فك الـ params كـ Promise حتمي
  const { locale } = await params;
  const translations = await getTrans(locale);

  return (
    // ضبط مساحة حرة عمودية لسنترة الكارد بشكل مريح للعين
    <main className="section-gap min-h-[80vh] flex items-center justify-center bg-background text-foreground">
      <div className="container flex justify-center items-center">
        {/* 🎯 التعديل السحري: الاعتماد على bg-card و border-input لدعم الدارك مود تلقائياً */}
        <div className="w-full max-w-md md:max-w-xl p-8 bg-card border border-input rounded-2xl shadow-xl">
          {/* 🎯 ضبط ألوان العنوان لتقرأ من الـ Theme تلقائياً */}
          <h2 className="text-3xl font-black text-center text-foreground mb-6">
            {translations.auth.register.title}
          </h2>

          {/* فورم إنشاء الحساب الذكي */}
          <Form translations={translations} />

          {/* نص التوجيه لصفحة تسجيل الدخول متوافق مع الألوان الديناميكية */}
          <p className="mt-6 flex flex-wrap items-center justify-center gap-1 text-muted-foreground text-sm font-medium">
            <span>{translations.auth.register.authPrompt.message}</span>
            <Link
              href={`/${locale}/${Routes.AUTH}/${Pages.LOGIN}`}
              // 🎯 تحويل اللينك لـ text-primary ليكون جذاباً ومتناسقاً مع نظام الموقع
              className={`${buttonVariants({
                variant: "link",
                size: "sm",
              })} !text-primary font-bold px-1`}
            >
              {translations.auth.register.authPrompt.loginLinkText}
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default SignupPage;

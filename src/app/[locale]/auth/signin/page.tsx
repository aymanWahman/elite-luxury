import Link from "@/components/link";
import { buttonVariants } from "@/components/ui/button";
import { Pages, Routes } from "@/constants/enums";
import { getCurrentLocale } from "@/lib/getCurrentLocale";
import Form from "./_components/Form";
import getTrans from "@/lib/translation";

async function SigninPage() {
  const locale = await getCurrentLocale();
  const translations = await getTrans(locale);

  return (
    // تم إضافة min-h-[80vh] لضمان سنترة الكارد عمودياً في منتصف الشاشة بشكل مريح
    <main className="section-gap min-h-[80vh] flex items-center justify-center bg-background text-foreground">
      <div className="container flex justify-center items-center">
        {/* 🎯 التعديل السحري: استبدال bg-white بـ bg-card لدعم الدارك مود تلقائياً */}
        <div className="w-full max-w-md md:max-w-xl p-8 bg-card border border-input rounded-2xl shadow-xl">
          {/* 🎯 استبدال text-black بـ text-foreground */}
          <h2 className="text-3xl font-black text-center text-foreground mb-6">
            {translations.auth.login.title}
          </h2>

          {/* الفورم الذكي المطور */}
          <Form translations={translations} />

          {/* نص التوجيه لإنشاء حساب جديد متوافق مع الألوان الديناميكية */}
          <p className="mt-6 flex flex-wrap items-center justify-center gap-1 text-muted-foreground text-sm font-medium">
            <span>{translations.auth.login.authPrompt.message}</span>
            <Link
              href={`/${locale}/${Routes.AUTH}/${Pages.REGISTER}`}
              // 🎯 تم إزالة !text-black واستبدالها بـ text-primary ليكون اللينك جذاباً ومتناسقاً
              className={`${buttonVariants({
                variant: "link",
                size: "sm",
              })} !text-primary font-bold px-1`}
            >
              {translations.auth.login.authPrompt.signUpLinkText}
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default SigninPage;

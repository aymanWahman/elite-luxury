import Link from "@/components/link";
import EditUserForm from "@/components/edit-user-form";
import { buttonVariants } from "@/components/ui/button";
import { Pages, Routes } from "@/constants/enums";
import { Locale } from "@/i18n.config";
import getTrans from "@/lib/translation";
import { authOptions } from "@/server/auth";
import { UserRole } from "@prisma/client";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Award, UserCheck, ShieldAlert, Sparkles, Flame } from "lucide-react";

interface PageProps {
  params: Promise<{ locale: Locale }>;
}

async function ProfilePage({ params }: PageProps) {
  const { locale } = await params;
  const isAr = locale === "ar";

  // جلب جلسة المستخدم من السيرفر بأمان
  const session = await getServerSession(authOptions);

  // 🛡️ 1. جدار حماية الزوار: منع الزائر غير المسجل
  if (!session) {
    redirect(`/${locale}/${Routes.AUTH}/${Pages.LOGIN}`);
  }

  // 🛡️ 2. توجيه ذكي وصارم للمسؤول: الأدمن يعدل بياناته من لوحته الخاصة منعا للتكرار
  if (session.user.role === UserRole.ADMIN) {
    redirect(`/${locale}/${Routes.ADMIN}`);
  }

  const translations = await getTrans(locale);
  const userRole = session.user.role as UserRole;

  // 🎯 3. تحديد مسارات لوحات التحكم والتقارير المحدثة لكل دور
  let dashboardHref = "";
  let dashboardLabel = "";
  let reportDescription = "";
  let DashboardIcon = Sparkles;
  let cardGradient = "from-sky-50 to-white";



  // عمل Deep Copy آمن لكائن الـ user لإرضاء الـ Form
  const safeUser = JSON.parse(JSON.stringify(session.user));

  return (
    <main className="bg-background text-foreground min-h-screen">
      <section className="section-gap">
        <div
          className="container max-w-4xl mx-auto px-4"
          dir={isAr ? "rtl" : "ltr"}
        >
          {/* كارت الترحيب ببيانات المستخدم الحالي */}
          <div className="bg-white border-4 border-slate-800 p-6 rounded-[2rem] shadow-[0_5px_0_0_#1e293b] flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-amber-100 border-3 border-amber-500 flex items-center justify-center font-black text-slate-800 text-2xl shadow-[0_3px_0_0_#1e293b]">
                {session.user.name?.charAt(0) || "U"}
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-800 flex items-center gap-1.5">
                  {session.user.name}
               
                </h2>
                <span className="inline-block mt-1 px-3 py-0.5 bg-slate-100 border-2 border-slate-300 rounded-xl text-xs font-black text-slate-500 uppercase tracking-wide">
                  {userRole}
                </span>
              </div>
            </div>
          </div>

          <h1 className="text-primary text-center font-black text-3xl mb-4">
            {translations.profile.title}
          </h1>

          {/* 🧭 بوابة الدخول السريع والذكية للوحات التقارير الجديدة */}
          {dashboardHref && (
            <div className="mb-10">
              <div
                className={`p-5 bg-gradient-to-l ${cardGradient} border-4 border-slate-800 rounded-[2rem] shadow-[0_6px_0_0_#1e293b] flex flex-col md:flex-row items-center justify-between gap-4 transition-all`}
              >
                <div className="flex gap-3.5 text-center md:text-start flex-col md:flex-row items-center">
                  <div className="p-3 bg-white border-3 border-slate-800 rounded-2xl shadow-[0_3px_0_0_#1e293b] text-slate-800 shrink-0">
                    <DashboardIcon className="w-6 h-6 stroke-[2.5]" />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-800 text-base md:text-lg">
                      {isAr
                        ? "لوحة التقارير والتحكم متاحة الآن"
                        : "Reports & Dashboard Control Available"}
                    </h3>
                    <p className="text-xs md:text-sm font-bold text-slate-500 mt-1 max-w-md leading-relaxed">
                      {reportDescription}
                    </p>
                  </div>
                </div>

                <Link
                  href={dashboardHref}
                  className={`${buttonVariants({ variant: "default" })} !rounded-xl font-black px-8 py-3.5 h-auto shadow-[0_4px_0_0_#1e293b] active:translate-y-1 active:shadow-none border-3 border-slate-800 text-sm shrink-0 w-full md:w-auto text-center flex justify-center`}
                >
                  {dashboardLabel} {isAr ? "←" : "→"}
                </Link>
              </div>
            </div>
          )}

          {/* فورم تعديل بيانات البروفايل الموحدة للأدوار الحالية */}
          <div className="bg-white border-3 border-slate-200 p-1 rounded-2xl">
            <EditUserForm user={safeUser} translations={translations} />
          </div>
        </div>
      </section>
    </main>
  );
}

export default ProfilePage;

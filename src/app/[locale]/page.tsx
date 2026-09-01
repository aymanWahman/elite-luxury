import Link from "@/components/link";
import { buttonVariants } from "@/components/ui/button";
import { Languages, Routes } from "@/constants/enums";
import { getCurrentLocale } from "@/lib/getCurrentLocale";
import getTrans from "@/lib/translation";
import {
  ArrowRightCircle,
  CheckCircle2,
  HeartHandshake,
  Compass,
  MapPin,
} from "lucide-react";
import Image from "next/image";
import { db } from "../../lib/prisma";

async function Home() {
  const locale = await getCurrentLocale();
  const { home } = await getTrans(locale);
  const { hero } = home;
  const isArabic = locale === Languages.ARABIC;

  return (
    <main className="container space-y-16 py-6">
      {/* 1. قسم البانر العلوي الترحيبي */}
      {/* <section className="h-[25vh] md:h-[30vh] mx-auto">
        <div className="relative h-full w-full rounded-2xl overflow-hidden shadow-md">
          <Image
            src="https://res.cloudinary.com/dktod7mod/image/upload/v1788210789/elite/elite-logo_h1xt5f.jpg"
            alt={hero.title || (isArabic ? "رحلات العمرة والحج" : "Hajj & Umrah Trips")}
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4">
            <p className="text-md md:text-xl lg:text-2xl font-medium text-center max-w-3xl italic leading-relaxed">
              {hero.Hadith ||
                (isArabic
                  ? "«العُمْرَةُ إِلَى العُمْرَةِ كَفَّارَةٌ لِمَا بَيْنَهُمَا، وَالحَجُّ المَبْرُورُ لَيْسَ لَهُ جَزَاءٌ إِلَّا الجَنَّةُ»"
                  : "“Umrah is an expiation for the sins committed between it and the previous one, and the reward of Hajj Mabrur is nothing except Paradise.”")}
            </p>
          </div>
        </div>
      </section> */}

      {/* 2. قسم التحويل الرئيسي (Main Conversion Zone) */}
      <section className="px-4 grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch section-gap">
        {/* العمود الأول: النصوص والأزرار */}
        <div className="flex flex-col justify-center h-full">
          <h1 className="text-3xl md:text-4xl font-semibold text-primary leading-tight">
            {hero.title ||
              (isArabic
                ? "رحلتك إلى بيت الله الحرام بأعلى معايير الراحة والسكينة"
                : "Your Spiritual Journey to the Holy Mosque with Divine Comfort")}
          </h1>
          <p className="text-accent my-4 text-lg">
            {hero.description ||
              (isArabic
                ? "نرافقكم خطوة بخطوة من حجز الرحلة وحتى إتمام المناسك مع فندق راقية، إرشاد ديني متميز، وخدمات نقل متطورة."
                : "We accompany you step by step from booking to completing your rituals with premium hotels, religious guidance, and transport.")}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 pt-4 w-full">
            {/* زر احجز رحلتك / ابدأ */}
            <Link
              href={`/${locale}/${Routes.EXPLORE}`}
              className={`${buttonVariants({
                size: "lg",
              })} space-x-2 w-full sm:w-auto !px-8 !py-6 !rounded-full text-lg font-bold shadow-lg shadow-primary/20 hover:shadow-xl transition-all duration-300 text-center justify-center items-center animate-float`}
            >
              <span>
                {hero.startLearnning ||
                  (isArabic ? "استكشف برامج العمرة" : "Explore Umrah Packages")}
              </span>
              <ArrowRightCircle
                className={`w-6 h-6 inline-block mx-1 ${isArabic ? "rotate-180" : ""}`}
              />
            </Link>

            {/* زر من نحن */}
            <Link
              href={`/${locale}/${Routes.ABOUT}`}
              className="w-full sm:w-auto flex gap-2 items-center justify-center text-primary font-bold text-lg hover:text-accent duration-200 transition-colors py-4 border border-primary/30 rounded-full sm:border-none sm:p-0"
            >
              <span>{hero.aboutUs || (isArabic ? "عن المنصة" : "About Us")}</span>
              <ArrowRightCircle
                className={`w-5 h-5 ${isArabic ? "rotate-180" : ""}`}
              />
            </Link>
          </div>
        </div>

        {/* العمود الثاني: الصورة */}
        <div className="hidden md:block relative w-full h-[350px]">
          <Image
            src="https://res.cloudinary.com/dktod7mod/image/upload/v1788210583/elite/makka_ntumxx.png"
            alt={isArabic ? "الحرم المكي والمدني" : "Kaaba & Prophet's Mosque"}
            fill
            className="shadow-2xl rounded-xl object-cover"
            loading="eager"
            priority
          />
        </div>
      </section>

      <hr className="border-muted/40 my-8" />

      {/* 3. قسم المميزات والإحصائيات */}
      <section className="px-4 space-y-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-primary">
            {isArabic
              ? "لماذا يختار ضيوف الرحمن خدماتنا؟"
              : "Why Pilgrims Choose Our Services"}
          </h2>

          <p className="mt-4 text-muted-foreground leading-relaxed">
            {isArabic
              ? "نوفر لضيوف الرحمن بيئة إيمانية مريحة وبرامج منظمة تتيح لهم أداء المناسك بطمأنينة ويسر تام."
              : "We provide pilgrims with a comfortable spiritual environment and well-organized packages to perform rituals with complete peace of mind."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 bg-card rounded-2xl border border-border/60 shadow-sm hover:shadow-lg transition-all">
            <div className="flex items-center gap-4 mb-5">
              <div className="p-4 bg-primary/10 rounded-full text-primary">
                <MapPin className="w-8 h-8" />
              </div>
            </div>

            <h3 className="text-xl font-bold mb-3">
              {isArabic ? "فنادق قريبة من الحرمين" : "Hotels Near The Haram"}
            </h3>

            <p className="text-muted-foreground">
              {isArabic
                ? "إقامات مميزة ومختارة بعناية على بُعد خطوات من ساحات الحرم المكي والمدني."
                : "Carefully selected accommodations just steps away from the Holy Mosques."}
            </p>
          </div>

          <div className="p-8 bg-card rounded-2xl border border-border/60 shadow-sm hover:shadow-lg transition-all">
            <div className="flex items-center gap-4 mb-5">
              <div className="p-4 bg-primary/10 rounded-full text-primary">
                <Compass className="w-8 h-8" />
              </div>
            </div>

            <h3 className="text-xl font-bold mb-3">
              {isArabic ? "إرشاد ومرافقة دينية" : "Religious Guidance"}
            </h3>

            <p className="text-muted-foreground">
              {isArabic
                ? "مرشدون ذوو خبرة لمرافقتكم وشرح المناسك بالتفصيل وفق السنة النبوية المشرفة."
                : "Experienced guides accompanying you to explain rituals accurately."}
            </p>
          </div>

          <div className="p-8 bg-card rounded-2xl border border-border/60 shadow-sm hover:shadow-lg transition-all">
            <div className="flex items-center gap-4 mb-5">
              <div className="p-4 bg-primary/10 rounded-full text-primary">
                <HeartHandshake className="w-8 h-8" />
              </div>

              <div>
                <span className="block text-3xl font-extrabold text-primary">
                  24/7
                </span>
              </div>
            </div>

            <h3 className="text-xl font-bold mb-3">
              {isArabic ? "دعم وخدمة متواصلة" : "24/7 Pilgrim Support"}
            </h3>

            <p className="text-muted-foreground">
              {isArabic
                ? "فريق متكامل في خدمتكم طوال فترة الرحلة لتلبية كافة الاحتياجات والمتطلبات."
                : "A dedicated team at your service throughout the journey to meet all needs."}
            </p>
          </div>
        </div>
      </section>

      <hr className="border-muted/40 my-8" />

      {/* 4. قسم كيف تعمل المنصة / خطوات حجز الرحلة */}
      <section className="px-4 py-12">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-primary">
            {isArabic ? "خطوات حجز رحلتك المباركة" : "How To Book Your Journey"}
          </h2>

          <p className="mt-4 text-muted-foreground">
            {isArabic
              ? "خطوات بسيطة وميسرة لتأكيد حجزك والانطلاق في رحلة العمرة أو الحج."
              : "Simple steps to confirm your booking and begin your sacred pilgrimage."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center p-6 bg-card rounded-xl border">
            <div className="text-5xl mb-4">🕋</div>
            <h3 className="font-bold mb-2">
              {isArabic ? "اختر البرنامج" : "Select Package"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {isArabic
                ? "اختر باقة العمرة أو الحج المناسبة لاحتياجاتك."
                : "Choose the Hajj or Umrah package that suits you best."}
            </p>
          </div>

          <div className="text-center p-6 bg-card rounded-xl border">
            <div className="text-5xl mb-4">📜</div>
            <h3 className="font-bold mb-2">
              {isArabic ? "إدخال البيانات والتأشيرة" : "Submit Details & Visa"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {isArabic
                ? "قم بتأكيد بياناتك المستندية وإصدار التأشيرة بسهولة."
                : "Enter your personal details for easy visa issuance."}
            </p>
          </div>

          <div className="text-center p-6 bg-card rounded-xl border">
            <div className="text-5xl mb-4">💳</div>
            <h3 className="font-bold mb-2">
              {isArabic ? "تأكيد الحجز والدفع" : "Confirm & Pay"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {isArabic
                ? "طرق دفع آمنة وسريعة مع إمكانية التقسيط."
                : "Secure payment methods with full transparency."}
            </p>
          </div>

          <div className="text-center p-6 bg-card rounded-xl border">
            <div className="text-5xl mb-4">✈️</div>
            <h3 className="font-bold mb-2">
              {isArabic ? "الانطلاق للرحلة" : "Begin Your Journey"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {isArabic
                ? "استلم جدول الرحلة واستعد للتوجه إلى البقاع المقدسة."
                : "Receive your itinerary and set off for the Holy Lands."}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;
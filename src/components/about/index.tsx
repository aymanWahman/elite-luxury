import { Directions, Languages, Routes } from "../../constants/enums";
import MainHeading from "../main-heading";
import { getCurrentLocale } from "../../lib/getCurrentLocale";
import getTrans from "../../lib/translation";
import { cn } from "../../lib/utils";
import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";
import { Bus, Compass, Hotel, Mail, MapPin, Phone, ShieldCheck } from "lucide-react";

async function About() {
  const locale = await getCurrentLocale();
  const {
    home: {
      about,
      about: { cards },
    },
    myName,
    designed,
  } = await getTrans(locale);
  const isArabic = locale === Languages.ARABIC;

  // 🕋 ميزات وخدمات رحلات الحج والعمرة
  const umrahFeatures = [
    {
      title: isArabic ? "إرشاد ديني ومرافقة شرعية" : "Religious Guidance & Companionship",
      desc: isArabic
        ? "مرافقة نخبة من الدعاة والمشايخ لتوضيح مناسك الحج والعمرة والإجابة على الاستفسارات."
        : "Accompanied by qualified scholars to guide through rituals and answer queries.",
      icon: <Compass className="w-8 h-8 text-primary" />,
    },
    {
      title: isArabic ? "إقامة فاخرة قريبة من الحرمين" : "Luxury Accommodation Near Harams",
      desc: isArabic
        ? "فنادق متميزة بالقرب من الحرم المكي والمسجد النبوي لتوفير أعلى درجات الراحة."
        : "Premium hotels near Al-Haram in Makkah and Madinah for maximum convenience.",
      icon: <Hotel className="w-8 h-8 text-primary" />,
    },
    {
      title: isArabic ? "وسائل نقل حديثة ومكيفة" : "Modern & Comfortable Transport",
      desc: isArabic
        ? "تنقلات مريحة بين المطارات والمشاعر المقدسة باستخدام أحدث حافلات التنقل."
        : "Seamless transfers between airports and holy sites in modern buses.",
      icon: <Bus className="w-8 h-8 text-primary" />,
    },
    {
      title: isArabic ? "دعم ورعاية على مدار الساعة" : "24/7 Dedicated Support",
      desc: isArabic
        ? "فريق متخصص في خدمتكم طوال فترة الرحلة للتأكد من راحة وسلامة ضيوف الرحمن."
        : "Dedicated team assisting pilgrims throughout the journey.",
      icon: <ShieldCheck className="w-8 h-8 text-primary" />,
    },
  ];

  return (
    <main
      className="container text-center space-y-20 py-10"
      id={Routes.ABOUT}
      dir={isArabic ? Directions.RTL : Directions.LTR}
    >
      {/* العنوان الرئيسي */}
      <MainHeading subTitle={about.ourStory} title={about.aboutUs} />

      {/* سيكشن الرؤية والرسالة */}
      <section className="mx-auto text-center">
        <div
          className={cn(
            "grid grid-cols-1 md:grid-cols-3 gap-6",
            isArabic && "text-right",
          )}
        >
          <div className="bg-card p-6 rounded-2xl border border-border/60 shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-xl font-bold mb-2 text-primary">
              {cards.missionTitle}
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {cards.missionText}
            </p>
          </div>

          <div className="bg-card p-6 rounded-2xl border border-border/60 shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-xl font-bold mb-2 text-primary">
              {cards.visionTitle}
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {cards.visionText}
            </p>
          </div>

          <div className="bg-card p-6 rounded-2xl border border-border/60 shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-xl font-bold mb-2 text-primary">
              {cards.identityTitle}
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {cards.identityText}
            </p>
          </div>
        </div>
      </section>

      {/* سيكشن الهوية والشعار */}
      <section className="text-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center border border-border/80 bg-card/50 backdrop-blur-sm rounded-2xl p-6 md:p-10 shadow-sm text-center">
          {/* حاوية الشعار */}
          <div className="flex justify-center items-center w-full h-full">
            <div className="relative w-full aspect-square max-w-[180px] md:max-w-[220px] rounded-full border border-border/80 shadow-md overflow-hidden group">
              <Image
                src="https://res.cloudinary.com/dktod7mod/image/upload/v1788210789/elite/elite-logo_h1xt5f.jpg"
                alt="Elite Luxury Hajj & Umrah"
                fill
                className="object-cover scale-[1.35] translate-y-3 duration-500 transition-transform group-hover:scale-[1.4]"
                loading="eager"
                priority
              />
            </div>
          </div>

          {/* عمود النصوص والأزرار */}
          <div
            className={cn(
              "space-y-4 flex flex-col justify-center h-full text-center",
              isArabic ? "md:text-right" : "md:text-left",
            )}
          >
            <h2 className="text-primary text-3xl">{myName}</h2>
            <p className="text-sm text-muted-foreground">{designed}</p>
            <h3 className="text-2xl md:text-3xl font-extrabold text-primary">
              {cards.slogan}
            </h3>
            <p className="text-muted-foreground text-md leading-relaxed">
              {cards.subSlogan}
            </p>

            <div className="pt-2 self-center md:self-start w-full sm:w-auto">
              <Button asChild className="rounded-full w-full sm:w-auto">
                <Link href={`/${locale}/${Routes.ROOT}`}>{cards.button}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 🕋 سيكشن ميزات الرحلات والخدمات المقدمة */}
      <section className="space-y-6 pt-4">
        <div className="text-center md:text-start">
          <h2 className="text-2xl md:text-3xl font-extrabold text-primary flex items-center justify-center md:justify-start gap-2">
            <Compass className="w-7 h-7" />
            {isArabic ? "لماذا تختار خدماتنا للحج والعمرة؟" : "Why Choose Our Services?"}
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            {isArabic
              ? "نسعى لتقديم تجربة إيمانية مريحة ومتكاملة لضيوف الرحمن، بدءاً من إجراءات السفر وحتى العودة بسلامة الله."
              : "We strive to deliver a seamless spiritual journey for pilgrims from departure to safe return."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {umrahFeatures.map((feature, index) => (
            <div
              key={index}
              className="bg-card border border-border/80 p-6 rounded-2xl shadow-sm flex items-start gap-4 hover:shadow-md transition-all"
            >
              <div className="p-3 bg-secondary/50 rounded-xl border shrink-0">
                {feature.icon}
              </div>
              <div
                className={cn(
                  "space-y-1 flex-1 text-center",
                  isArabic ? "text-right" : "text-left",
                )}
              >
                <h3 className="text-lg font-bold text-foreground pt-1">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed pt-1">
                  {feature.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* وسائل التواصل وعنوان الشركة */}
      <div className="flex flex-col md:flex-row flex-wrap gap-4 py-4 justify-center items-center">
        {/* عنوان الشركة */}
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground bg-muted/40 px-5 py-2.5 rounded-full justify-center border border-border/40">
          <MapPin className="w-4 h-4 text-primary shrink-0" />
          <span>
            {isArabic
              ? "مكة المكرمة / العزيزية - برج الصفا الإداري - الدور الرابع"
              : "Makkah / Al Aziziyah - Al Safa Administrative Tower - 4th Floor"}
          </span>
        </div>

        {/* البريد الإلكتروني */}
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground bg-muted/40 px-5 py-2.5 rounded-full justify-center border border-border/40">
          <Mail className="w-4 h-4 text-primary shrink-0" />
          <span>elite@gmail.com</span>
        </div>

        {/* رقم الهاتف */}
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground bg-muted/40 px-5 py-2.5 rounded-full justify-center border border-border/40">
          <Phone className="w-4 h-4 text-primary shrink-0" />
          <span dir="ltr">+966564715584</span>
        </div>
      </div>
    </main>
  );
}

export default About;
import Link from "../link";
import { getCurrentLocale } from "@/lib/getCurrentLocale";
import { Languages } from "@/constants/enums";
import getTrans from "@/lib/translation";
import { MapPin, Phone, Mail } from "lucide-react";

export default async function Footer() {
  const locale = await getCurrentLocale();
  const translations = await getTrans(locale);
  const isAr = locale === Languages.ARABIC;
  const logoText = translations?.logo || (isAr ? "فخامة النخبة" : "Elite Luxury");

  return (
    <footer className="bg-card text-card-foreground border-t border-border/60 transition-colors duration-300 pt-16 pb-8">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-border/40">
          
          {/* 1. عن الشركة */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-amber-600 dark:text-amber-400 font-serif tracking-wide">
              {logoText}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {isAr
                ? "نقدم لك تجربة ضيافة استثنائية تفوق التوقعات. عالم من الفخامة والراحة المصممة خصيصاً لنخبة العملاء."
                : "Offering an unparalleled hospitality experience beyond expectations. A world of bespoke luxury crafted for the elite."}
            </p>
          </div>

          {/* 2. روابط سريعة */}
          <div className="space-y-4">
            <h4 className="text-amber-600 dark:text-amber-400 font-semibold">
              {isAr ? "روابط سريعة" : "Quick Links"}
            </h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>
                <Link href={`/${locale}`} className="hover:text-foreground transition-colors">
                  {isAr ? "الرئيسية" : "Home"}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/about`} className="hover:text-foreground transition-colors">
                  {isAr ? "من نحن" : "About Us"}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/explore`} className="hover:text-foreground transition-colors">
                  {isAr ? "استكشف" : "Explore"}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/contact`} className="hover:text-foreground transition-colors">
                  {isAr ? "تواصل معنا" : "Contact"}
                </Link>
              </li>
            </ul>
          </div>

          {/* 3. خدماتنا */}
          <div className="space-y-4">
            <h4 className="text-amber-600 dark:text-amber-400 font-semibold">
              {isAr ? "خدماتنا" : "Our Services"}
            </h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li className="hover:text-foreground transition-colors cursor-pointer">
                {isAr ? "الأجنحة الفاخرة" : "Luxury Suites"}
              </li>
              <li className="hover:text-foreground transition-colors cursor-pointer">
                {isAr ? "الفيلات الخاصة" : "Private Villas"}
              </li>
              <li className="hover:text-foreground transition-colors cursor-pointer">
                {isAr ? "خدمات VIP" : "VIP Concierge"}
              </li>
            </ul>
          </div>

          {/* 4. معلومات الاتصال والعنوان */}
          <div className="space-y-4">
            <h4 className="text-amber-600 dark:text-amber-400 font-semibold">
              {isAr ? "تواصل معنا" : "Contact Us"}
            </h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  {isAr
                    ? "مكة المكرمة / العزيزية - برج الصفا الإداري - الدور الرابع"
                    : "Makkah / Al Aziziyah - Al Safa Administrative Tower - 4th Floor"}
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <span dir="ltr">+966564715584</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <span>elite@gmail.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* حقوق النشر */}
        <div className="pt-8 text-center text-xs text-muted-foreground/80">
          © {new Date().getFullYear()} ELITE LUXURY. {isAr ? "جميع الحقوق محفوظة." : "All rights reserved."}
        </div>
      </div>
    </footer>
  );
}
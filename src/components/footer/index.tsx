import Link from "next/link";
import { Locale } from "@/i18n.config";

interface FooterProps {
  locale: Locale;
}

export default function Footer({ locale }: FooterProps) {
  const isAr = locale === "ar";

  return (
    <footer className="bg-zinc-950 text-zinc-300 border-t border-amber-500/20 pt-16 pb-8">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-zinc-800">
          
          {/* 1. عن الشركة */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-amber-400">ELITE LUXURY</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              {isAr
                ? "نقدم لك تجربة ضيافة استثنائية تفوق التوقعات. عالم من الفخامة والراحة المصممة خصيصاً لنخبة العملاء."
                : "Offering an unparalleled hospitality experience beyond expectations. A world of bespoke luxury crafted for the elite."}
            </p>
          </div>

          {/* 2. روابط سريعة */}
          <div className="space-y-4">
            <h4 className="text-amber-400 font-semibold">{isAr ? "روابط سريعة" : "Quick Links"}</h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li><Link href={`/${locale}`}>{isAr ? "الرئيسية" : "Home"}</Link></li>
              <li><Link href={`/${locale}/about`}>{isAr ? "من نحن" : "About Us"}</Link></li>
              <li><Link href={`/${locale}/explore`}>{isAr ? "استكشف" : "Explore"}</Link></li>
              <li><Link href={`/${locale}/contact`}>{isAr ? "تواصل معنا" : "Contact"}</Link></li>
            </ul>
          </div>

          {/* 3. خدماتنا */}
          <div className="space-y-4">
            <h4 className="text-amber-400 font-semibold">{isAr ? "خدماتنا" : "Our Services"}</h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li>{isAr ? "الأجنحة الفاخرة" : "Luxury Suites"}</li>
              <li>{isAr ? "الفيلات الخاصة" : "Private Villas"}</li>
              <li>{isAr ? "خدمات VIP" : "VIP Concierge"}</li>
            </ul>
          </div>

          {/* 4. الحقوق */}
          <div className="space-y-4">
            <h4 className="text-amber-400 font-semibold">{isAr ? "النشرة البريدية" : "Newsletter"}</h4>
            <p className="text-xs text-zinc-400">
              {isAr ? "اشترك للحصول على أحدث العروض." : "Subscribe for latest offers."}
            </p>
          </div>

        </div>

        <div className="pt-8 text-center text-xs text-zinc-500">
          © {new Date().getFullYear()} ELITE LUXURY. {isAr ? "جميع الحقوق محفوظة." : "All rights reserved."}
        </div>
      </div>
    </footer>
  );
}
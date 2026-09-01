import { Locale } from "@/i18n.config";
import getTrans from "@/lib/translation";
import { Languages } from "@/constants/enums";
import { Phone, Mail, MapPin, MessageCircle, Star, Sparkles, Clock, ShieldCheck } from "lucide-react";

interface ContactPageProps {
  params: Promise<{
    locale: Locale;
  }>;
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale } = await params;
  const translations = await getTrans(locale);
  const isAr = locale === Languages.ARABIC ;

  // بيانات التواصل المباشر
  const whatsappNumber = "966500000000"; // استبدل برقم الواتساب الخاص بك (مع رمز الدولة بدون +)
  const phoneNumber = "+966500000000";  // استبدل برقم الهاتف
  const emailAddress = "vip@elite-luxury.com";

  const defaultMessage = encodeURIComponent(
    isAr
      ? "مرحباً، أود الاستفسار عن حجز تجربة فاخرة مع إيليت لوكشري."
      : "Hello, I would like to inquire about booking a luxury experience with Elite Luxury."
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-300">
      
      {/* خلفية الإضاءة الجمالية متوافقة مع الوضعين */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 dark:bg-amber-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-12 relative z-10">
        
        {/* 1. قسم العنوان الرئيسي */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-semibold tracking-wider uppercase">
            <Star className="w-3.5 h-3.5 fill-amber-500 dark:fill-amber-400" />
            {isAr ? "خدمة العملاء الحصرية VIP" : "Exclusive VIP Assistance"}
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-slate-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-amber-200 dark:via-amber-400 dark:to-amber-600">
            {isAr ? "تواصل معنا مباشرة" : "Instant Direct Contact"}
          </h1>
          <p className="text-slate-600 dark:text-zinc-400 text-sm sm:text-base leading-relaxed">
            {isAr
              ? "لا داعي لانتظار الرد على النماذج. يمكنك التواصل فوراً مع مستشارك المباشر للحصول على استشارة وحجز سريع."
              : "No need to fill out forms or wait. Connect instantly with your dedicated advisor for personal assistance."}
          </p>
        </div>

        {/* 2. كروت التواصل الفوري المباشر (Direct Action Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* كارت 1: الواتساب الفوري */}
          <a
            href={`https://wa.me/${whatsappNumber}?text=${defaultMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-white dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-800 rounded-3xl p-8 shadow-xl hover:shadow-emerald-500/10 dark:hover:shadow-emerald-500/5 hover:border-emerald-500/50 transition-all duration-300 flex flex-col items-center text-center space-y-4 relative overflow-hidden backdrop-blur-xl"
          >
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform duration-300">
              <MessageCircle className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-zinc-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                {isAr ? "محادثة واتساب فورية" : "Instant WhatsApp"}
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-2 leading-relaxed">
                {isAr ? "تحدث معنا عبر الواتساب للرد الفوري وتجهيز الحجوزات" : "Chat directly on WhatsApp for instant support"}
              </p>
            </div>
            <span className="mt-auto inline-flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-4 py-2 rounded-xl">
              {isAr ? "ابدأ المحادثة الآن" : "Start Chat Now"}
            </span>
          </a>

          {/* كارت 2: الاتصال المباشر */}
          <a
            href={`tel:${phoneNumber}`}
            className="group bg-white dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-800 rounded-3xl p-8 shadow-xl hover:shadow-amber-500/10 dark:hover:shadow-amber-500/5 hover:border-amber-500/50 transition-all duration-300 flex flex-col items-center text-center space-y-4 relative overflow-hidden backdrop-blur-xl"
          >
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform duration-300">
              <Phone className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-zinc-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                {isAr ? "اتصال هاتف مباشر" : "Direct Call"}
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-2 leading-relaxed dir-ltr">
                {phoneNumber}
              </p>
            </div>
            <span className="mt-auto inline-flex items-center gap-2 text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-4 py-2 rounded-xl">
              {isAr ? "اتصل الآن" : "Call Now"}
            </span>
          </a>

          {/* كارت 3: البريد الإلكتروني */}
          <a
            href={`mailto:${emailAddress}`}
            className="group bg-white dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-800 rounded-3xl p-8 shadow-xl hover:shadow-amber-500/10 dark:hover:shadow-amber-500/5 hover:border-amber-500/50 transition-all duration-300 flex flex-col items-center text-center space-y-4 relative overflow-hidden backdrop-blur-xl"
          >
            <div className="w-16 h-16 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-600 dark:text-sky-400 group-hover:scale-110 transition-transform duration-300">
              <Mail className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-zinc-100 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                {isAr ? "البريد الرسمي" : "Email Concierge"}
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-2 leading-relaxed">
                {emailAddress}
              </p>
            </div>
            <span className="mt-auto inline-flex items-center gap-2 text-xs font-semibold text-sky-600 dark:text-sky-400 bg-sky-500/10 px-4 py-2 rounded-xl">
              {isAr ? "إرسال رسالة" : "Send Email"}
            </span>
          </a>

        </div>

        {/* 3. شريط المميزات والمعلومات الإضافية */}
        <div className="bg-white dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800/80 rounded-2xl p-6 shadow-sm backdrop-blur-xl grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          
          <div className="flex flex-col items-center space-y-2">
            <Clock className="w-6 h-6 text-amber-500 dark:text-amber-400" />
            <h4 className="text-sm font-semibold text-slate-900 dark:text-zinc-200">
              {isAr ? "تغطية على مدار الساعة" : "24/7 Availability"}
            </h4>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              {isAr ? "مستشارون متاحون طوال اليوم" : "Dedicated advisors online 24/7"}
            </p>
          </div>

          <div className="flex flex-col items-center space-y-2">
            <MapPin className="w-6 h-6 text-amber-500 dark:text-amber-400" />
            <h4 className="text-sm font-semibold text-slate-900 dark:text-zinc-200">
              {isAr ? "المقر الرئيسي" : "Main Office"}
            </h4>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              {isAr ? "برج الساعة، مكة المكرمة" : "Clock Tower, Makkah"}
            </p>
          </div>

          <div className="flex flex-col items-center space-y-2">
            <ShieldCheck className="w-6 h-6 text-amber-500 dark:text-amber-400" />
            <h4 className="text-sm font-semibold text-slate-900 dark:text-zinc-200">
              {isAr ? "حجوزات مؤمنة" : "Secured Experience"}
            </h4>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              {isAr ? "ضمان أقصى درجات الخصوصية" : "Highest level of privacy guaranteed"}
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
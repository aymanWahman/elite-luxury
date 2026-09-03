import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Compass, Home, PhoneCall, Sparkles } from "lucide-react";

export default function NotFound() {
  return (
    <div 
      dir="rtl"
      className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 flex flex-col items-center justify-center p-4 relative overflow-hidden"
    >
      {/* خلفيات إضاءة */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[25rem] h-[25rem] bg-amber-500/10 dark:bg-amber-500/15 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-2xl mx-auto text-center space-y-8 relative z-10">
        
        {/* اللوجو */}
        <div className="relative inline-block">
          <div className="relative w-28 h-28 md:w-36 md:h-36 mx-auto rounded-full border-2 border-amber-500/40 p-1.5 shadow-2xl bg-white dark:bg-zinc-900 overflow-hidden group transition-transform duration-500 hover:scale-105">
            <div className="relative w-full h-full rounded-full overflow-hidden">
              <Image
                src="https://res.cloudinary.com/dktod7mod/image/upload/v1788210789/elite/elite-logo_h1xt5f.jpg"
                alt="Elite Luxury Logo"
                fill
                className="object-cover scale-[1.35] translate-y-2.5 duration-500 transition-transform group-hover:scale-[1.45]"
                priority
              />
            </div>
          </div>
          <div className="absolute -top-2 -right-2 bg-amber-500 text-white p-1.5 rounded-full shadow-lg animate-pulse">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>

        {/* 404 والعنوان */}
        <div className="space-y-3">
          <h1 className="text-7xl md:text-8xl font-extrabold tracking-tight text-slate-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-amber-200 dark:via-amber-400 dark:to-amber-600">
            404
          </h1>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-semibold tracking-wider uppercase">
            <Compass className="w-4 h-4" />
            الصفحة غير موجودة | Page Not Found
          </div>
        </div>

        {/* النصوص */}
        <div className="space-y-2 max-w-lg mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-zinc-100">
            عذراً، الصفحة غير متاحة!
          </h2>
          <p className="text-slate-600 dark:text-zinc-400 text-sm md:text-base leading-relaxed">
            الصفحة التي تحاول الوصول إليها ربما تم نقلها أو حذفها.
          </p>
        </div>

        {/* الأزرار */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Button
            asChild
            size="lg"
            className="w-full sm:w-auto rounded-full bg-amber-600 hover:bg-amber-700 text-white dark:bg-amber-500 dark:hover:bg-amber-600 dark:text-zinc-950 font-bold px-8 shadow-lg shadow-amber-500/20 gap-2 transition-all duration-300"
          >
            <Link href="/ar">
              <Home className="w-5 h-5" />
              العودة للرئيسية
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            size="lg"
            className="w-full sm:w-auto rounded-full border-slate-300 dark:border-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-900 font-semibold px-8 gap-2 transition-all duration-300"
          >
            <Link href="/ar/contact">
              <PhoneCall className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              تواصل معنا
            </Link>
          </Button>
        </div>

      </div>
    </div>
  );
}
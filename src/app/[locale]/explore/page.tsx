import Image from "next/image";
import { Locale } from "@/i18n.config";
import getTrans from "@/lib/translation";

interface ExplorePageProps {
  params: {
    locale: Locale;
  };
}

export default async function ExplorePage({ params: { locale } }: ExplorePageProps) {
  const translations = await getTrans(locale);
  const isAr = locale === "ar";

  // مصفوفة الصور مترجمة
  const galleryImages = [
    {
      url: "https://res.cloudinary.com/dktod7mod/image/upload/v1788297421/elite/2_yfywcr.jpg",
      title: isAr ? "أجنحة فاخرة" : "Luxury Suite",
    },
    {
      url: "https://res.cloudinary.com/dktod7mod/image/upload/v1788297481/elite/3_qohtd6.jpg",
      title: isAr ? "أجنحة فاخرة" : "Luxury Suite",
    },
    {
      url: "https://res.cloudinary.com/dktod7mod/image/upload/v1788297546/elite/4_jmovot.jpg",
      title: isAr ? "أجنحة فاخرة" : "Luxury Suite",
    },
    {
      url: "https://res.cloudinary.com/dktod7mod/image/upload/v1788299989/elite/5_xnpdol.jpg",
      title: isAr ? "أجنحة فاخرة" : "Luxury Suite",
    },
    {
      url: "https://res.cloudinary.com/dktod7mod/image/upload/v1788300250/elite/7_rukhiq.jpg",
      title: isAr ? "أجنحة فاخرة" : "Luxury Suite",
    },
    {
      url: "https://res.cloudinary.com/dktod7mod/image/upload/v1788300299/elite/8_eysvle.jpg",
      title: isAr ? "أجنحة فاخرة" : "Luxury Suite",
    },
    {
      url: "https://res.cloudinary.com/dktod7mod/image/upload/v1788300149/elite/6_a3a6tz.jpg",
      title: isAr ? "أجنحة فاخرة" : "Luxury Suite",
    },
    {
      url: "https://res.cloudinary.com/dktod7mod/image/upload/v1788300346/elite/9_ryebe4.jpg",
      title: isAr ? "أجنحة فاخرة" : "Luxury Suite",
    },
    {
      url: "https://res.cloudinary.com/dktod7mod/image/upload/v1788300476/elite/11_ro4m4q.jpg",
      title: isAr ? "أجنحة فاخرة" : "Luxury Suite",
    },
    {
      url: "https://res.cloudinary.com/dktod7mod/image/upload/v1788300525/elite/12_wqjpkp.jpg",
      title: isAr ? "أجنحة فاخرة" : "Luxury Suite",
    },
    {
      url: "https://res.cloudinary.com/dktod7mod/image/upload/v1788300408/elite/10_vwfxme.jpg",
      title: isAr ? "أجنحة فاخرة" : "Luxury Suite",
    },
  ];

  return (
    <main className="container mx-auto px-4 py-12 space-y-16">
      {/* 1. قسم الفيديو */}
      <section className="flex flex-col items-center text-center space-y-6">
        <h1 className="text-3xl md:text-5xl font-bold gold-text">
          {translations.explore?.heroTitle || (isAr ? "عش تجربة الفخامة الخالصة" : "Experience Pure Luxury")}
        </h1>
        <div className="w-full max-w-4xl aspect-video rounded-2xl overflow-hidden shadow-2xl border border-gold/20">
          <iframe
            src="https://res.cloudinary.com/dktod7mod/video/upload/v1788300660/elite/v1_oxnduq.mp4"
            className="w-full h-full border-0"
            allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        </div>
      </section>

      {/* 2. معرض الفنادق والغرف */}
      <section className="space-y-8">
        <h2 className="text-2xl md:text-4xl font-semibold text-center">
          {translations.explore?.featuredTitle || (isAr ? "فنادقنا وأجنتنا المميزة" : "Our Featured Hotels & Suites")}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryImages.map((img, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-xl shadow-lg border border-gray-800"
            >
              <div className="aspect-[4/3] relative">
                <Image
                  src={img.url}
                  alt={img.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                <span className="text-lg font-medium text-white">
                  {img.title}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
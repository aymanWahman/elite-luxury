import Link from "next/link";
import { Button } from "../../components/ui/button";
// import Head from 'next/head';

export default function NotFound() {
  return (
    <>
      {/* <Head>
        <title>الصفحة غير موجودة | Learn-Learn</title>
      </Head> */}

      <div className="mt-20 min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4 text-center">
        {/* الشعار أو أيقونة */}
        <div className="mb-8">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="120"
            height="120"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>

        {/* الرسالة الرئيسية */}
        <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-4">
          404
        </h1>

        <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-6">
          عذرًا، الصفحة التي تبحث عنها غير موجودة
        </h2>

        <p className="text-lg text-gray-600 max-w-md mb-8">
          ربما تم نقل الصفحة أو حذفها أو ربما كتبت العنوان بشكل غير صحيح.
        </p>

        {/* زر العودة للصفحة الرئيسية */}
        <Link href="/">
          <Button className="px-8 py-4 text-lg bg-blue-600 hover:bg-blue-700 transition-colors shadow-lg">
            العودة للصفحة الرئيسية
          </Button>
        </Link>

        {/* رسالة إضافية */}
        <p className="mt-10 text-gray-500">
          أو جرب استخدام شريط البحث للعثور على ما تريد
        </p>

        {/* تأثيرات زخرفية */}
        <div className="absolute bottom-10 left-10 w-20 h-20 rounded-full bg-blue-200 opacity-20"></div>
        <div className="absolute top-20 right-20 w-32 h-32 rounded-full bg-indigo-200 opacity-20"></div>
      </div>
    </>
  );
}

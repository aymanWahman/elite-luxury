
"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react"; // 💡 استيراد الخطافات اللازمة

export function ThemeToggleButton() {
  const { theme, setTheme } = useTheme();
  
  // 💡 الخطوة 1: تعريف حالة لانتظار تركيب المكون على العميل
  const [mounted, setMounted] = useState(false);

  // 💡 الخطوة 2: تحديث الحالة إلى true بعد اكتمال التحميل على العميل
  useEffect(() => {
    setMounted(true);
  }, []);

  // 💡 الخطوة 3: إذا لم يتم التركيب بعد، نرجع قيمة فارغة أو زر غير فعال
  // هذا يضمن تطابق الـ HTML الأولي المرسل من الخادم مع العميل
  if (!mounted) {
    // إرجاع عنصر حافظ للمكان (Placeholder) لضمان عدم اهتزاز التخطيط
    return (
        <button 
            className="transition" 
            disabled 
            style={{ 
                visibility: 'hidden', // لإخفاء الزر مع الحفاظ على مساحته
                width: '32px', // نفس عرض الأيقونة (w-8)
                height: '32px' // نفس طول الأيقونة (h-8)
            }}
        />
    );
  }

  // 💡 بعد التركيب، نقوم بحساب حالة الثيم الفعلية
  const isDark = theme === "dark";

  return (
    <button 
      onClick={() => setTheme(isDark ? "light" : "dark")} 
      className="transition"
    >
      {isDark ? (
        <Sun className="w-8 h-8 text-yellow-400" />
      ) : (
        <Moon className="w-8 h-8 text-gray-800" />
      )}
    </button>
  );
}
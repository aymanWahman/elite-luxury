"use client";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export const useClientSession = (initialSession: Session | null) => {
  const { data: session, status } = useSession();
  
  // 🚀 نبدأ فوراً بالـ initialSession الجاية من السيرفر لمنع الـ Layout Flash أو الـ Blink
  const [currentSession, setCurrentSession] = useState<Session | null>(initialSession);

  useEffect(() => {
    // 🎯 طالما الـ Client Session شحنت وخلصت تحميل، نعتمد عليها تماماً (سواء فيها داتا أو بقت null بعد تسجيل الخروج)
    if (status !== "loading") {
      setCurrentSession(session);
    }
  }, [session, status]);

  // 🎯 تحديث الـ State فقط لو الـ initialSession الجاية من السيرفر اتغيرت فعلياً (مثل التنقل بين الصفحات بسيرفر كويري جديد)
  useEffect(() => {
    if (initialSession) {
      setCurrentSession(initialSession);
    }
  }, [initialSession]);

  return { data: currentSession, status };
};
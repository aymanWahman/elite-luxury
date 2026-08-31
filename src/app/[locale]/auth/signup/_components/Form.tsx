"use client";

import FormFields from "@/components/form-fields/form-fields";
import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/loader";
import { Pages, Routes } from "@/constants/enums";
import { toast } from "@/hooks/use-toast";
import useFormFields from "@/hooks/useFormFields";
import { signup } from "@/server/_actions/auth";
import { IFormField } from "@/types/app";
import { Translations } from "@/types/translations";
import { ValidationErrors } from "@/validations/auth";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { UserRole } from "@prisma/client"; // 🚀 استيراد الـ Enum الرسمي لربط الصلاحيات بالملي

type SerializedFormData = Record<string, FormDataEntryValue>;

interface FormState {
  message?: string;
  error?: ValidationErrors;
  status?: number | null;
  formData?: FormData | SerializedFormData | null;
}

const initialState: FormState = {
  message: "",
  error: {},
  status: null,
  formData: null,
};

function SubmitButton({ translations }: { translations: Translations }) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full font-bold h-[50px] rounded-xl"
    >
      {pending ? <Loader /> : translations.auth.register.submit}
    </Button>
  );
}

function Form({ translations }: { translations: Translations }) {
  const { locale } = useParams();
  const router = useRouter();

  const [state, setState] = useState<FormState>(initialState);
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.STUDENT); // 🚀 الـ State الآن تعتمد على الـ Enum
  const [studentEmail, setStudentEmail] = useState<string>("");

  const handleAction = async (formData: FormData) => {
    formData.set("role", selectedRole);
    if (selectedRole === UserRole.PARENT) {
      formData.set("studentEmail", studentEmail.trim().toLowerCase());
    }

    setState((prev) => ({
      ...prev,
      status: null,
      message: undefined,
      error: {},
      formData,
    }));
    const newState = await signup(state, formData);
    setState(newState as FormState);
  };

  const { getFormFields } = useFormFields({
    slug: Pages.REGISTER,
    translations,
  });

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.message,
        className: state.status === 201 ? "text-green-400" : "text-destructive",
      });
    }
    if (state.status === 201) {
      router.replace(`/${locale}/${Routes.AUTH}/${Pages.LOGIN}`);
    }
  }, [locale, router, state.message, state.status]);

  const getFieldValue = (
    formData: FormData | SerializedFormData | null | undefined,
    fieldName: string,
  ): string => {
    if (!formData) return "";

    try {
      if (formData instanceof FormData) {
        const val = formData.get(fieldName);
        return typeof val === "string" ? val : "";
      }
      if (typeof formData === "object" && fieldName in formData) {
        const val = (formData as SerializedFormData)[fieldName];
        return typeof val === "string" ? val : "";
      }
    } catch {
      return "";
    }
    return "";
  };

  return (
    <form action={handleAction} className="space-y-4">
      {getFormFields().map((field: IFormField) => {
        const { options, ...cleanField } = field;
        const calculatedValue = getFieldValue(state?.formData, field.name);

        const typedOptions =
          field.type === "select"
            ? (options as unknown as Array<{ value: string; label: string }>)
            : undefined;

        return (
          <div key={field.name} className="text-foreground">
            <FormFields
              {...cleanField}
              options={typedOptions}
              defaultValue={calculatedValue}
              error={state?.error || {}}
            />
          </div>
        );
      })}

      {/* اختيار الرول - متوافق بالكامل مع الـ Enum والـ Dark Mode */}
      <div className="flex flex-col gap-1 text-right w-full mb-4" dir="rtl">
        <label className="text-sm font-bold text-muted-foreground mb-1">
          اختر هويتك في المنصة: ✨
        </label>
        <select
          name="role"
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value as UserRole)}
          className="w-full p-3 font-bold bg-background text-foreground border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer h-[50px]"
        >
          <option
            value={UserRole.STUDENT}
            className="bg-background text-foreground"
          >
            👦 بطل صغير (طالب)
          </option>
          <option
            value={UserRole.PARENT}
            className="bg-background text-foreground"
          >
            👨‍👩‍👦 ولي أمر (متابع)
          </option>
          <option
            value={UserRole.TEACHER}
            className="bg-background text-foreground"
          >
            📚 معلم / معلمة
          </option>
        </select>
      </div>

      {/* حقل إيميل الابن للأب - متوافق مع الدارك مود والتنبيهات الموزونة */}
      {selectedRole === UserRole.PARENT && (
        <div
          className="flex flex-col gap-2 p-4 bg-amber-50/10 dark:bg-amber-950/20 border-2 border-dashed border-amber-500/40 rounded-2xl text-right"
          dir="rtl"
        >
          <label className="text-sm font-black text-amber-600 dark:text-amber-400">
            📧 البريد الإلكتروني لابنك البطل الحقيقي:
          </label>
          <input
            type="email"
            value={studentEmail}
            onChange={(e) => setStudentEmail(e.target.value)}
            placeholder="student@example.com"
            className="w-full p-3 font-bold bg-background text-foreground border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-ring text-left"
            required
          />
          <p className="text-[11px] font-medium text-muted-foreground">
            💡 تلميح: يجب أن يقوم الطالب بإنشاء حسابه أولاً على المنصة باستخدام
            هذا البريد حتى تتمكن من ربطه بحسابك.
          </p>
        </div>
      )}

      <SubmitButton translations={translations} />
    </form>
  );
}

export default Form;

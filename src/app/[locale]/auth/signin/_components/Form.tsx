"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { signIn, getSession } from "next-auth/react";

import FormFields from "@/components/form-fields/form-fields";
import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/loader";
import { Pages, Routes } from "@/constants/enums";
import { toast } from "@/hooks/use-toast";
import useFormFields from "@/hooks/useFormFields";
import { IFormField } from "@/types/app";
import { Translations } from "@/types/translations";
import { UserRole } from "@prisma/client";

function Form({ translations }: { translations: Translations }) {
  const router = useRouter();
  const { locale } = useParams();
  const formRef = useRef<HTMLFormElement>(null);

  const [error, setError] = useState<Record<string, string[]> | undefined>(
    undefined,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { getFormFields } = useFormFields({
    slug: Pages.LOGIN,
    translations,
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    const formData = new FormData(formRef.current);
    const data: Record<string, string> = {};
    formData.forEach((value, key) => {
      data[key] = value.toString();
    });

    try {
      setIsLoading(true);
      setError(undefined);

      const res = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (res?.error) {
        try {
          const { validationError, responseError } = JSON.parse(res.error);
          setError(validationError);

          if (responseError) {
            toast({
              title: responseError,
              variant: "destructive",
              className: "font-bold",
            });
          }
        } catch {
          toast({
            title: translations.messages.unexpectedError,
            variant: "destructive",
            className: "font-bold",
          });
        }
      }

      if (res?.ok) {
        toast({
          title: translations.messages.loginSuccessful,
          className: "text-green-500 font-bold",
        });

        const session = await getSession();
        const role = session?.user?.role;

        // 🚀 التعديل الجوهري: توجيه الأدمن للوحته، وتوجيه باقي المستخدمين للبروفايل الموحد
        if (role === UserRole.ADMIN) {
          router.replace(`/${locale}/${Routes.ADMIN}`);
        } else {
          // 🎯 الطالب، المعلم، وولي الأمر يطيروا للبروفايل الموحد لتعديل بياناتهم والوصول لأزرار لوحاتهم
          router.replace(`/${locale}/${Routes.PROFILE}`);
        }
      }
    } catch (err) {
      console.error("Login component front-end error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) return <Loader />;

  return (
    <form onSubmit={onSubmit} ref={formRef} noValidate className="space-y-4">
      {getFormFields().map((field: IFormField) => {
        const { options, ...cleanField } = field;

        const typedOptions =
          field.type === "select"
            ? (options as unknown as Array<{ value: string; label: string }>)
            : undefined;

        return (
          // 🎯 تم إزالة text-black تماماً واستبدالها بـ text-foreground لدعم الدارك مود وسلاسة الألوان
          <div key={field.name} className="text-foreground">
            <FormFields
              {...cleanField}
              options={typedOptions}
              defaultValue=""
              error={
                error
                  ? Object.fromEntries(
                      Object.entries(error).map(([key, value]) => [
                        key,
                        Array.isArray(value) ? value[0] : value,
                      ]),
                    )
                  : undefined
              }
            />
          </div>
        );
      })}

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full font-bold h-[50px] rounded-xl"
      >
        {isLoading ? <Loader /> : translations.auth.login.submit}
      </Button>
    </form>
  );
}

export default Form;

"use client";

import { IFormField } from "@/types/app";
import { useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { ValidationErrors } from "@/validations/auth";
import { useParams } from "next/navigation";
import { Languages } from "@/constants/enums";

interface Props extends IFormField {
  error: ValidationErrors;
}
interface IState {
  showPassword: boolean;
}

const INITIAL_STATE: IState = { showPassword: false };

const PasswordField = ({
  label,
  name,
  placeholder,
  disabled,
  autoFocus,
  error,
  defaultValue,
}: Props) => {
  const [state, setState] = useState(INITIAL_STATE);
  const { showPassword } = state;
  const { locale } = useParams();

  const isArabic = locale === Languages.ARABIC || locale === "ar";

  const handleClickShowPassword = () =>
    setState((prevState) => ({
      ...prevState,
      showPassword: !prevState.showPassword,
    }));

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
  };

  return (
    <div
      className="space-y-1.5 text-right w-full"
      dir={isArabic ? "rtl" : "ltr"}
    >
      {/* 🎯 التعديل الأول: رندرة الـ Label فقط إذا وُجد وإزالة الألوان الصلبة لدعم الدارك مود */}
      {label && (
        <Label
          htmlFor={name}
          className="text-sm font-bold text-muted-foreground block mb-1"
        >
          {label}
        </Label>
      )}

      <div className="relative flex items-center">
        {/* 🚀 الـ Input مأمن بـ Padding داخلي (pl-10 أو pr-10) لمنع تداخل كلمة المرور مع العين */}
        <Input
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          disabled={disabled}
          autoFocus={autoFocus}
          autoComplete="off"
          name={name}
          id={name}
          defaultValue={defaultValue}
          className={`w-full p-3 font-medium bg-background text-foreground border border-input rounded-xl focus-visible:ring-2 focus-visible:ring-ring h-[50px] transition-colors ${
            isArabic ? "pl-11 pr-3" : "pr-11 pl-3"
          }`}
        />

        {/* زر العين متناسق ومريح للضغط وفي موضعه الصحيح بحسب اتجاه الصفحة */}
        <button
          type="button"
          onClick={handleClickShowPassword}
          onMouseDown={handleMouseDownPassword}
          className={`absolute flex items-center justify-center p-1 text-muted-foreground hover:text-foreground transition-colors ${
            isArabic ? "left-3" : "right-3"
          }`}
        >
          {showPassword ? (
            <EyeOffIcon className="h-5 w-5" />
          ) : (
            <EyeIcon className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* 🎯 التعديل الثاني: تنظيف وتطهير كلاسات رسالة الخطأ الصافية */}
      {error && error[name] && (
        <p className="text-destructive mt-1.5 text-xs font-bold animate-in fade-in duration-200">
          {error[name]}
        </p>
      )}
    </div>
  );
};

export default PasswordField;

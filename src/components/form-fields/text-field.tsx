import { IFormField } from "@/types/app";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { ValidationErrors } from "@/validations/auth";

interface Props extends IFormField {
  error: ValidationErrors;
}

const TextField = ({
  label,
  name,
  type,
  placeholder,
  disabled,
  autoFocus,
  error,
  defaultValue,
  readOnly,
}: Props) => {
  return (
    <div className="space-y-1.5 text-right w-full" dir="rtl">
      {/* 🎯 التعديل الأول: رندرة الـ Label فقط إذا وُجد، وإزالة text-black لدعم الدارك مود تلقائياً */}
      {label && (
        <Label
          htmlFor={name}
          className="text-sm font-bold text-muted-foreground block mb-1"
        >
          {label}
        </Label>
      )}

      {/* 🚀 الـ Input الأساسي متناغم الحواف والـ Focus Rings مع السيستم بالكامل */}
      <Input
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        autoFocus={autoFocus}
        name={name}
        id={name}
        defaultValue={defaultValue}
        readOnly={readOnly}
        className="w-full p-3 font-medium bg-background text-foreground border border-input rounded-xl focus-visible:ring-2 focus-visible:ring-ring h-[50px] transition-colors"
      />

      {/* 🎯 التعديل الثاني: تنظيف وتطهير كلاسات رسالة الخطأ لتكون حاسمة وصافية باللون الأحمر */}
      {error && error[name] && (
        <p className="text-destructive mt-1.5 text-xs font-bold animate-in fade-in duration-200">
          {error[name]}
        </p>
      )}
    </div>
  );
};

export default TextField;

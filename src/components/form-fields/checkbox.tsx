"use client";

import { IFormField } from "@/types/app";
import { Label } from "../ui/label";
import { Checkbox as ShadcnCheckbox } from "../ui/checkbox";

interface Props {
  onClick?: () => void;
  checked: boolean;
  label: IFormField["label"];
  name: IFormField["name"];
}

const Checkbox = ({ label, name, checked, onClick }: Props) => {
  return (
    // 🎯 التعديل الأول: ضبط التراص ودعم الألوان الديناميكية مع الـ Pointer
    <div
      className="flex items-center space-x-2 gap-2 text-foreground select-none py-1"
      dir="rtl"
    >
      <ShadcnCheckbox
        id={name}
        name={name}
        checked={checked}
        onCheckedChange={onClick} // 🚀 الـ Shadcn يفضل استخدام onCheckedChange لإدارة الـ State بدقة
        className="w-5 h-5 rounded-md border-input data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground cursor-pointer transition-colors"
      />

      {/* 🎯 التعديل الثاني: تحويل الخط لـ font-bold وتكبير مساحة الضغط للمستخدم */}
      <Label
        htmlFor={name}
        className="text-sm font-bold text-foreground cursor-pointer flex-1"
      >
        {label}
      </Label>
    </div>
  );
};

export default Checkbox;

import { InputTypes } from "@/constants/enums";
import TextField from "./text-field";
import PasswordField from "./password-field";
import { IFormField } from "@/types/app";
import Checkbox from "./checkbox";
import { ValidationErrors } from "@/validations/auth";

interface Props extends Omit<IFormField, "options"> {
  error: ValidationErrors;
  options?: Array<{ value: string; label: string }>;
  checked?: boolean;
  onClick?: () => void;
}

const FormFields = (props: Props) => {
  const {
    type,
    name,
    defaultValue,
    placeholder,
    options,
    error,
    checked,
    onClick,
    ...subProps
  } = props;

  const renderField = (): React.ReactNode => {
    // 1️⃣ دعم القائمة المنسدلة (Dropdown Select)
    if (type === "select") {
      return (
        <div
          className="flex flex-col gap-1.5 text-right w-full text-foreground"
          dir="rtl"
        >
          {placeholder && (
            <label className="text-sm font-bold text-muted-foreground mb-0.5">
              {placeholder}
            </label>
          )}
          <select
            name={name}
            defaultValue={defaultValue as string}
            className="w-full p-3 font-bold bg-background text-foreground border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer h-[50px] transition-colors"
          >
            {options?.map((opt) => (
              <option
                key={opt.value}
                value={opt.value}
                className="bg-background text-foreground"
              >
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      );
    }

    // 2️⃣ دعم النصوص والإيميل والـ Numbers
    if (
      type === InputTypes.EMAIL ||
      type === InputTypes.TEXT ||
      type === "number"
    ) {
      return (
        <div className="text-foreground">
          <TextField
            error={error}
            type={type} // 🚀 مأمن
            name={name}
            defaultValue={defaultValue}
            placeholder={placeholder}
            {...subProps}
          />
        </div>
      );
    }

    // 3️⃣ دعم حقل كلمة المرور (هنا كان الفخ التاني!)
    if (type === InputTypes.PASSWORD) {
      return (
        <div className="text-foreground">
          <PasswordField
            error={error}
            type={type} // 🚀 تم تمرير الـ type هنا كمان لمنع الشكوى وسحق الـ Error سطر 61
            name={name}
            defaultValue={defaultValue}
            placeholder={placeholder}
            {...subProps}
          />
        </div>
      );
    }

    // 4️⃣ دعم حقل الـ Checkbox الديناميكي
    if (type === InputTypes.CHECKBOX) {
      return (
        <Checkbox
          name={name}
          checked={checked ?? false}
          onClick={onClick}
          label={placeholder || ""}
        />
      );
    }

    // 5️⃣ الـ Fallback الأخير
    return (
      <div className="text-foreground">
        <TextField
          error={error}
          type={type || InputTypes.TEXT} // 🚀 مأمن
          name={name}
          defaultValue={defaultValue}
          placeholder={placeholder}
          {...subProps}
        />
      </div>
    );
  };

  return <>{renderField()}</>;
};

export default FormFields;

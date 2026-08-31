"use client";

import { Routes } from "@/constants/enums";
import useFormFields from "@/hooks/useFormFields";
import { IFormField } from "@/types/app";
import { Translations } from "@/types/translations";
import { Session } from "next-auth";
import Image from "next/image";
import FormFields from "../form-fields/form-fields";
import { Button } from "../ui/button";
import { UserRole } from "@prisma/client";
import Checkbox from "../form-fields/checkbox";
import { useEffect, useState } from "react";
import { ValidationErrors } from "@/validations/auth";
import { updateProfile } from "./_actions/profile";
import Loader from "../ui/loader";
import { CameraIcon } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import { useFormStatus } from "react-dom";

type FormState = {
  message?: string;
  error?: ValidationErrors;
  status?: number | null;
};

function SubmitButton({ translations }: { translations: Translations }) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      className="w-full font-black h-[50px] rounded-xl text-base shadow-md"
      disabled={pending}
    >
      {pending ? <Loader /> : translations.save}
    </Button>
  );
}

type UserWithRelations = Session["user"] & {
  id?: string;
  role?: string;
  children?: Array<{ email: string }>;
};

/**
 * 🚀 تطهير السطر 52: استبدال any بـ Record<string, unknown> لإرضاء ESLint بالكامل
 */
const flattenErrors = (
  rawErrors: Record<string, unknown> | null | undefined,
): Record<string, string> => {
  if (!rawErrors) return {};
  const clean: Record<string, string> = {};

  Object.keys(rawErrors).forEach((key) => {
    const val = rawErrors[key];
    if (Array.isArray(val) && val.length > 0) {
      clean[key] = String(val[0]);
    } else if (typeof val === "string") {
      clean[key] = val;
    }
  });

  return clean;
};

function EditUserForm({
  translations,
  user,
}: {
  translations: Translations;
  user: UserWithRelations;
}) {
  const { data: sessionData, update: updateSession } = useSession();

  const formData = new FormData();
  Object.entries(user).forEach(([key, value]) => {
    if (
      value !== null &&
      value !== undefined &&
      key !== "image" &&
      key !== "children"
    ) {
      formData.append(key, value.toString());
    }
  });

  const initialState: FormState = {
    message: "",
    error: {},
    status: null,
  };

  const [state, setState] = useState<FormState>(initialState);
  const [selectedImage, setSelectedImage] = useState(user.image ?? "");
  const [isAdmin, setIsAdmin] = useState(user.role === UserRole.ADMIN);
  const [currentRole, setCurrentRole] = useState<UserRole>(
    (user.role as UserRole) || UserRole.USER,
  );

  const initialStudentEmail =
    user.children && user.children.length > 0 ? user.children[0].email : "";
  const [studentEmail, setStudentEmail] = useState(initialStudentEmail);

  const handleAction = async (rawFormData: FormData) => {
    rawFormData.set("id", user.id || "");
    rawFormData.set("role", currentRole);
    

    const result = await updateProfile(isAdmin, {}, rawFormData);

    // 🎯 تطهير السطر 112: إزالة الحقل المتضارب والاكتفاء بالأخطاء والرسائل المضمونة
    setState({
      status: result.status,
      message: result.message,
      error: result.error
        ? flattenErrors(result.error as Record<string, unknown>)
        : {},
    });

    if (result.status === 200) {
      await updateSession({
        ...sessionData,
        user: {
          ...sessionData?.user,
          name: rawFormData.get("name")?.toString() || user.name,
          role: currentRole,
        },
      });
    }
  };

  const { getFormFields } = useFormFields({
    slug: Routes.PROFILE,
    translations,
  });

  useEffect(() => {
    if (state.message && state.status !== undefined && state.status !== null) {
      toast({
        title: state.message,
        className: state.status === 200 ? "text-green-400" : "text-destructive",
      });
    }
  }, [state.message, state.status]);

  useEffect(() => {
    if (user.image) setSelectedImage(user.image as string);
  }, [user.image]);

  return (
    <form
      action={handleAction}
      className="flex flex-col md:flex-row gap-10 text-right bg-card text-foreground p-6 rounded-2xl border border-border shadow-md"
      dir="rtl"
    >
      {/* الصورة الشخصية */}
      <div className="flex flex-col items-center justify-start pt-4">
        <div className="group relative w-[180px] h-[180px] overflow-hidden rounded-full mx-auto border border-input bg-muted flex items-center justify-center shadow-inner">
          {selectedImage ? (
            <Image
              src={selectedImage}
              alt={user.name || "avatar"}
              width={180}
              height={180}
              className="rounded-full object-cover w-full h-full"
            />
          ) : (
            <CameraIcon className="w-10 h-10 text-muted-foreground" />
          )}

          <div
            className={`absolute top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center transition-opacity duration-200 ${selectedImage ? "opacity-0 group-hover:opacity-100" : "opacity-100"}`}
          >
            <UploadImage setSelectedImage={setSelectedImage} />
          </div>
        </div>
        <p className="text-xs text-muted-foreground font-bold mt-3">
          اضغط لتغيير الصورة الشخصية
        </p>
      </div>

      {/* حقول البيانات */}
      <div className="flex-1 space-y-5">
        {getFormFields().map((field: IFormField) => {
          const { options, ...cleanField } = field;
          // 🚀 قراءة القيمة من الـ local formData الأصلي بثبات وبدون الاعتماد على راجع السيرفر المتضارب
          const fieldValue = formData.get(field.name);
          const typedOptions =
            field.type === "select"
              ? (options as unknown as Array<{ value: string; label: string }>)
              : undefined;

          return (
            <div key={field.name} className="text-foreground">
              <FormFields
                {...cleanField}
                options={typedOptions}
                defaultValue={fieldValue as string}
                error={state?.error || {}}
                readOnly={field.type === "email"}
              />
            </div>
          );
        })}

        {/* حقل اختيار الـ Role */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-bold text-muted-foreground">
            نوع الهوية الحالية في المنصة: 🌟
          </label>
          <select
            name="role"
            value={currentRole}
            onChange={(e) => setCurrentRole(e.target.value as UserRole)}
            className="w-full p-3 font-bold bg-background text-foreground border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer h-[50px]"
          >
        
            <option
              value={UserRole.USER}
              className="bg-background text-foreground"
            >
              👤 مستخدم عام
            </option>
            {sessionData?.user.role === UserRole.ADMIN && (
              <option
                value={UserRole.ADMIN}
                className="bg-background text-foreground"
              >
                🛠️ مدير المنصة (Admin)
              </option>
            )}
          </select>
        </div>


        {/* صلاحيات الأدمن */}
        {sessionData?.user.role === UserRole.ADMIN && (
          <div className="flex items-center gap-2 my-4 bg-destructive/5 p-3 rounded-xl border border-destructive/10">
            <Checkbox
              name="admin"
              checked={isAdmin}
              onClick={() => {
                const nextAdminState = !isAdmin;
                setIsAdmin(nextAdminState);
                if (nextAdminState) setCurrentRole(UserRole.ADMIN);
              }}
              label="منح صلاحية مدير النظام الكاملة (Admin Privilege)"
            />
          </div>
        )}

        <SubmitButton translations={translations} />
      </div>
    </form>
  );
}

export default EditUserForm;

const UploadImage = ({
  setSelectedImage,
}: {
  setSelectedImage: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSelectedImage(url);
    }
  };
  return (
    <>
      <input
        type="file"
        accept="image/*"
        className="hidden"
        id="image-upload"
        onChange={handleImageChange}
        name="image"
      />
      <label
        htmlFor="image-upload"
        className="w-full h-full flex items-center justify-center cursor-pointer"
      >
        <CameraIcon className="w-8 h-8 text-white" />
      </label>
    </>
  );
};

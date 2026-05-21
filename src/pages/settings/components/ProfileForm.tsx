import React from "react";
import { isAxiosError } from "axios";
import { Camera, LoaderCircle, LockKeyhole, UploadCloud } from "lucide-react";

import { uploadAvatarFile } from "@/api/files/file.api";
import { useUpdateUser } from "@/api/users/user.queries";
import { NotificationPopup } from "@/components/NotificationPopup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { normalizeRoles } from "@/helper/auth-roles";
import { useAuthStore } from "@/store/auth.store";
import type { AuthUser } from "@/types/auth";
import type { User, UserGender } from "@/types/user";

type ProfileFormValues = {
  name: string;
  email: string;
  age: string;
  gender: UserGender | "";
  address: string;
  avatarUrl: string;
};

type ProfileFormErrors = Partial<Record<keyof ProfileFormValues, string>> & {
  server?: string;
};

type ProfileFormProps = {
  user: User | null;
  isLoading?: boolean;
};

const avatarPlaceholder =
  "https://api.dicebear.com/9.x/initials/svg?seed=Job%20Portal";

const inputClass =
  "h-11 rounded border-slate-200 bg-slate-50 text-slate-900 shadow-none transition-all placeholder:text-slate-400 focus-visible:border-[#16a34a] focus-visible:ring-[#16a34a]/20";

function getErrorMessage(error: unknown, fallback: string) {
  if (!isAxiosError(error)) return fallback;

  const message = error.response?.data?.message;
  if (Array.isArray(message)) return message.join(", ");
  if (typeof message === "string" && message.trim()) return message;
  if (error.request) return "Network error. Please check your connection.";

  return error.message || fallback;
}

function getAvatarUrl(user: User | null) {
  return user?.avatarUrl?.trim() || user?.avatar?.trim() || "";
}

function mapToAuthUser(updatedUser: User, fallbackUser: AuthUser | null) {
  return {
    id: updatedUser.id,
    email: updatedUser.email,
    name: updatedUser.name,
    avatarUrl: getAvatarUrl(updatedUser) || null,
    isActive: updatedUser.isActive ?? fallbackUser?.isActive ?? null,
    roles: normalizeRoles(updatedUser.roles ?? fallbackUser?.roles ?? []),
    company: updatedUser.company ?? fallbackUser?.company ?? null,
  };
}

export default function ProfileForm({ user, isLoading }: ProfileFormProps) {
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const authUser = useAuthStore((state) => state.user);
  const accessToken = useAuthStore((state) => state.accessToken);
  const setAuth = useAuthStore((state) => state.setAuth);
  const updateUserMutation = useUpdateUser();

  const [form, setForm] = React.useState<ProfileFormValues>({
    name: "",
    email: "",
    age: "",
    gender: "",
    address: "",
    avatarUrl: "",
  });
  const [errors, setErrors] = React.useState<ProfileFormErrors>({});
  const [isUploadingAvatar, setIsUploadingAvatar] = React.useState(false);
  const [popup, setPopup] = React.useState<{
    open: boolean;
    variant: "success" | "error";
    title: string;
    message: string;
  }>({
    open: false,
    variant: "success",
    title: "",
    message: "",
  });

  React.useEffect(() => {
    if (!user) return;

    setForm({
      name: user.name ?? "",
      email: user.email ?? "",
      age: user.age != null ? String(user.age) : "",
      gender: user.gender ?? "",
      address: user.address ?? "",
      avatarUrl: getAvatarUrl(user),
    });
    setErrors({});
  }, [user]);

  const setField =
    (field: keyof ProfileFormValues) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm((current) => ({
        ...current,
        [field]: event.target.value,
      }));
      setErrors((current) => ({
        ...current,
        [field]: undefined,
        server: undefined,
      }));
    };

  const validate = () => {
    const nextErrors: ProfileFormErrors = {};
    const trimmedName = form.name.trim();
    const trimmedAddress = form.address.trim();
    const parsedAge = form.age ? Number(form.age) : undefined;

    if (!trimmedName) {
      nextErrors.name = "Full name is required.";
    } else if (trimmedName.length < 2) {
      nextErrors.name = "Full name must be at least 2 characters.";
    }

    if (
      form.age &&
      (parsedAge == null || !Number.isInteger(parsedAge) || parsedAge < 1)
    ) {
      nextErrors.age = "Age must be a positive number.";
    } else if (parsedAge != null && parsedAge > 120) {
      nextErrors.age = "Age must be 120 or below.";
    }

    if (trimmedAddress.length > 255) {
      nextErrors.address = "Address must be 255 characters or less.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleAvatarChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const isValidType = ["image/jpeg", "image/png"].includes(file.type);
    const isValidSize = file.size <= 5 * 1024 * 1024;

    if (!isValidType) {
      setErrors((current) => ({
        ...current,
        avatarUrl: "Avatar must be a JPG or PNG image.",
      }));
      event.target.value = "";
      return;
    }

    if (!isValidSize) {
      setErrors((current) => ({
        ...current,
        avatarUrl: "Avatar must be 5MB or smaller.",
      }));
      event.target.value = "";
      return;
    }

    setIsUploadingAvatar(true);
    setErrors((current) => ({ ...current, avatarUrl: undefined }));

    try {
      const response = await uploadAvatarFile(file);
      const avatarUrl = response.data?.filePath;

      if (!avatarUrl) {
        throw new Error("Missing avatar URL from upload response.");
      }

      setForm((current) => ({
        ...current,
        avatarUrl,
      }));
    } catch (error) {
      setErrors((current) => ({
        ...current,
        avatarUrl: getErrorMessage(error, "Avatar upload failed."),
      }));
    } finally {
      setIsUploadingAvatar(false);
      event.target.value = "";
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user || !validate()) return;

    const roles = normalizeRoles(user.roles ?? authUser?.roles ?? []);
    const parsedAge = form.age ? Number(form.age) : undefined;

    try {
      const response = await updateUserMutation.mutateAsync({
        id: user.id,
        data: {
          name: form.name.trim(),
          avatarUrl: form.avatarUrl || null,
          age: parsedAge,
          gender: form.gender || null,
          address: form.address.trim() || null,
          isActive: user.isActive ?? authUser?.isActive ?? null,
          companyId: user.company?.id ?? authUser?.company?.id ?? null,
          roles,
        },
      });

      const updatedUser = response.data ?? {
        ...user,
        name: form.name.trim(),
        avatarUrl: form.avatarUrl || null,
        age: parsedAge,
        gender: form.gender || null,
        address: form.address.trim() || null,
        roles,
      };

      if (accessToken) {
        setAuth(mapToAuthUser(updatedUser, authUser), accessToken);
      }

      setPopup({
        open: true,
        variant: "success",
        title: "Profile saved",
        message: "Your personal information has been updated successfully.",
      });
    } catch (error) {
      setErrors((current) => ({
        ...current,
        server: getErrorMessage(error, "Failed to save profile."),
      }));
    }
  };

  const avatarSrc = form.avatarUrl || avatarPlaceholder;
  const isSubmitting = updateUserMutation.isPending;
  const isDisabled = isLoading || isUploadingAvatar || isSubmitting || !user;

  return (
    <>
      <section
        id="profile"
        className="rounded-md border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-slate-950">
            Personal Information
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Keep your public profile and contact details up to date.
          </p>
        </div>

        {errors.server && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            {errors.server}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="relative size-24 shrink-0">
              <img
                src={avatarSrc}
                alt={form.name || "User avatar"}
                className="size-24 rounded-full border border-slate-200 object-cover shadow-sm"
                onError={(event) => {
                  event.currentTarget.src = avatarPlaceholder;
                }}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingAvatar}
                className="absolute bottom-0 right-0 flex size-9 items-center justify-center rounded-full border-2 border-white bg-[#16a34a] text-white shadow-lg transition-colors hover:bg-[#15803d] disabled:pointer-events-none disabled:opacity-70"
                aria-label="Upload avatar"
              >
                {isUploadingAvatar ? (
                  <LoaderCircle className="size-4 animate-spin" />
                ) : (
                  <Camera className="size-4" />
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <UploadCloud className="size-4 text-[#16a34a]" />
                Upload a new avatar
              </div>
              <p className="max-w-sm text-sm leading-6 text-slate-500">
                JPG or PNG image up to 5MB. The preview updates immediately
                after upload.
              </p>
              {errors.avatarUrl && (
                <p className="text-sm font-medium text-red-600">
                  {errors.avatarUrl}
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-700">
                Full Name
              </Label>
              <Input
                id="name"
                value={form.name}
                onChange={setField("name")}
                disabled={isDisabled}
                aria-invalid={Boolean(errors.name)}
                className={inputClass}
                placeholder="Enter your full name"
              />
              {errors.name && (
                <p className="text-sm font-medium text-red-600">
                  {errors.name}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700">
                Email
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  value={form.email}
                  readOnly
                  disabled
                  className={`${inputClass} pr-10 text-slate-500`}
                />
                <LockKeyhole className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="age" className="text-slate-700">
                Age
              </Label>
              <Input
                id="age"
                type="number"
                min={1}
                max={120}
                value={form.age}
                onChange={setField("age")}
                disabled={isDisabled}
                aria-invalid={Boolean(errors.age)}
                className={inputClass}
                placeholder="Enter your age"
              />
              {errors.age && (
                <p className="text-sm font-medium text-red-600">{errors.age}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender" className="text-slate-700">
                Gender
              </Label>
              <select
                id="gender"
                value={form.gender}
                onChange={setField("gender")}
                disabled={isDisabled}
                className={`${inputClass} px-3`}
              >
                <option value="">Select gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address" className="text-slate-700">
                Address
              </Label>
              <Input
                id="address"
                value={form.address}
                onChange={setField("address")}
                disabled={isDisabled}
                aria-invalid={Boolean(errors.address)}
                className={inputClass}
                placeholder="Enter your address"
              />
              {errors.address && (
                <p className="text-sm font-medium text-red-600">
                  {errors.address}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end border-t border-slate-100 pt-5">
            <Button
              type="submit"
              disabled={isDisabled}
              className="h-11 rounded bg-[#16a34a] px-6 font-semibold text-white shadow-sm hover:bg-[#15803d]"
            >
              {isSubmitting ? (
                <LoaderCircle className="size-4 animate-spin" />
              ) : (
                "Save Profile"
              )}
            </Button>
          </div>
        </form>
      </section>

      <NotificationPopup
        open={popup.open}
        variant={popup.variant}
        title={popup.title}
        message={popup.message}
        dismissLabel="Got it"
        onDismiss={() => setPopup((current) => ({ ...current, open: false }))}
      />
    </>
  );
}

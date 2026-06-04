import React from "react";
import { isAxiosError } from "axios";
import { Camera, LoaderCircle, LockKeyhole, UploadCloud } from "lucide-react";
import { useTranslation } from "react-i18next";

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

function getErrorMessage(
  error: unknown,
  fallback: string,
  networkMessage: string,
) {
  if (!isAxiosError(error)) return fallback;

  const message = error.response?.data?.message;
  if (Array.isArray(message)) return message.join(", ");
  if (typeof message === "string" && message.trim()) return message;
  if (error.request) return networkMessage;

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
  const { t } = useTranslation();
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
      nextErrors.name = t("accountSettings.profile.errors.nameRequired");
    } else if (trimmedName.length < 2) {
      nextErrors.name = t("accountSettings.profile.errors.nameMinLength");
    }

    if (
      form.age &&
      (parsedAge == null || !Number.isInteger(parsedAge) || parsedAge < 1)
    ) {
      nextErrors.age = t("accountSettings.profile.errors.agePositive");
    } else if (parsedAge != null && parsedAge > 120) {
      nextErrors.age = t("accountSettings.profile.errors.ageMax");
    }

    if (trimmedAddress.length > 255) {
      nextErrors.address = t("accountSettings.profile.errors.addressMax");
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
        avatarUrl: t("accountSettings.profile.errors.avatarType"),
      }));
      event.target.value = "";
      return;
    }

    if (!isValidSize) {
      setErrors((current) => ({
        ...current,
        avatarUrl: t("accountSettings.profile.errors.avatarSize"),
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
        avatarUrl: getErrorMessage(
          error,
          t("accountSettings.profile.errors.avatarUploadFailed"),
          t("accountSettings.common.networkError"),
        ),
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
        title: t("accountSettings.profile.notifications.savedTitle"),
        message: t("accountSettings.profile.notifications.savedMessage"),
      });
    } catch (error) {
      setErrors((current) => ({
        ...current,
        server: getErrorMessage(
          error,
          t("accountSettings.profile.errors.saveFailed"),
          t("accountSettings.common.networkError"),
        ),
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
            {t("accountSettings.profile.title")}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {t("accountSettings.profile.subtitle")}
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
                alt={form.name || t("accountSettings.profile.userAvatar")}
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
                aria-label={t("accountSettings.profile.uploadAvatar")}
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
                {t("accountSettings.profile.uploadNewAvatar")}
              </div>
              <p className="max-w-sm text-sm leading-6 text-slate-500">
                {t("accountSettings.profile.avatarHelp")}
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
                {t("accountSettings.profile.fields.fullName")}
              </Label>
              <Input
                id="name"
                value={form.name}
                onChange={setField("name")}
                disabled={isDisabled}
                aria-invalid={Boolean(errors.name)}
                className={inputClass}
                placeholder={t("accountSettings.profile.placeholders.fullName")}
              />
              {errors.name && (
                <p className="text-sm font-medium text-red-600">
                  {errors.name}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700">
                {t("accountSettings.profile.fields.email")}
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
                {t("accountSettings.profile.fields.age")}
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
                placeholder={t("accountSettings.profile.placeholders.age")}
              />
              {errors.age && (
                <p className="text-sm font-medium text-red-600">{errors.age}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender" className="text-slate-700">
                {t("accountSettings.profile.fields.gender")}
              </Label>
              <select
                id="gender"
                value={form.gender}
                onChange={setField("gender")}
                disabled={isDisabled}
                className={`${inputClass} px-3`}
              >
                <option value="">
                  {t("accountSettings.profile.placeholders.gender")}
                </option>
                <option value="MALE">
                  {t("accountSettings.profile.gender.male")}
                </option>
                <option value="FEMALE">
                  {t("accountSettings.profile.gender.female")}
                </option>
                <option value="OTHER">
                  {t("accountSettings.profile.gender.other")}
                </option>
              </select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address" className="text-slate-700">
                {t("accountSettings.profile.fields.address")}
              </Label>
              <Input
                id="address"
                value={form.address}
                onChange={setField("address")}
                disabled={isDisabled}
                aria-invalid={Boolean(errors.address)}
                className={inputClass}
                placeholder={t("accountSettings.profile.placeholders.address")}
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
                t("accountSettings.profile.actions.save")
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
        dismissLabel={t("accountSettings.common.gotIt")}
        onDismiss={() => setPopup((current) => ({ ...current, open: false }))}
      />
    </>
  );
}

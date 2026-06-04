import React from "react";
import { isAxiosError } from "axios";
import { Eye, EyeOff, KeyRound, LoaderCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useChangePassword } from "@/api/users/user.queries";
import { NotificationPopup } from "@/components/NotificationPopup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { preventSpaceKey } from "@/helper";

type PasswordField = "currentPassword" | "newPassword" | "confirmPassword";

type ChangePasswordValues = Record<PasswordField, string>;
type ChangePasswordErrors = Partial<Record<PasswordField, string>> & {
  server?: string;
};

const inputClass =
  "h-11 rounded border-slate-200 bg-slate-50 pr-10 text-slate-900 shadow-none transition-all placeholder:text-slate-400 focus-visible:border-[#16a34a] focus-visible:ring-[#16a34a]/20";

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

function SecurePasswordInput({
  error,
  id,
  label,
  onChange,
  placeholder,
  value,
}: {
  error?: string;
  id: PasswordField;
  label: string;
  onChange: (field: PasswordField, value: string) => void;
  placeholder: string;
  value: string;
}) {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = React.useState(false);

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-slate-700">
        {label}
      </Label>
      <div className="relative">
        <Input
          id={id}
          type={isVisible ? "text" : "password"}
          value={value}
          onKeyDown={preventSpaceKey}
          onChange={(event) => onChange(id, event.target.value)}
          aria-invalid={Boolean(error)}
          className={inputClass}
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={() => setIsVisible((current) => !current)}
          className="absolute right-3 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-md text-slate-400 transition-colors hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16a34a]/30"
          aria-label={
            isVisible
              ? t("accountSettings.password.hidePassword")
              : t("accountSettings.password.showPassword")
          }
        >
          {isVisible ? (
            <EyeOff className="size-4" />
          ) : (
            <Eye className="size-4" />
          )}
        </button>
      </div>
      {error && <p className="text-sm font-medium text-red-600">{error}</p>}
    </div>
  );
}

export default function ChangePasswordForm() {
  const { t } = useTranslation();
  const changePasswordMutation = useChangePassword();
  const [form, setForm] = React.useState<ChangePasswordValues>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = React.useState<ChangePasswordErrors>({});
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

  const handleChange = (field: PasswordField, value: string) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
    setErrors((current) => ({
      ...current,
      [field]: undefined,
      server: undefined,
    }));
  };

  const validate = () => {
    const nextErrors: ChangePasswordErrors = {};

    if (!form.currentPassword) {
      nextErrors.currentPassword = t(
        "accountSettings.password.errors.currentRequired",
      );
    }

    if (!form.newPassword) {
      nextErrors.newPassword = t("accountSettings.password.errors.newRequired");
    } else if (form.newPassword.length < 6) {
      nextErrors.newPassword = t("accountSettings.password.errors.minLength");
    } else if (form.newPassword === form.currentPassword) {
      nextErrors.newPassword = t("accountSettings.password.errors.samePassword");
    }

    if (!form.confirmPassword) {
      nextErrors.confirmPassword = t(
        "accountSettings.password.errors.confirmRequired",
      );
    } else if (form.confirmPassword !== form.newPassword) {
      nextErrors.confirmPassword = t("accountSettings.password.errors.mismatch");
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) return;

    try {
      await changePasswordMutation.mutateAsync({
        oldPassword: form.currentPassword,
        newPassword: form.newPassword,
        confirmPassword: form.confirmPassword,
      });

      setForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setPopup({
        open: true,
        variant: "success",
        title: t("accountSettings.password.notifications.updatedTitle"),
        message: t("accountSettings.password.notifications.updatedMessage"),
      });
    } catch (error) {
      setErrors((current) => ({
        ...current,
        server: getErrorMessage(
          error,
          t("accountSettings.password.errors.updateFailed"),
          t("accountSettings.common.networkError"),
        ),
      }));
    }
  };

  return (
    <>
      <section
        id="security"
        className="rounded-md border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="mb-6 flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#16a34a]/10 text-[#16a34a]">
            <KeyRound className="size-5" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-950">
              {t("accountSettings.password.title")}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {t("accountSettings.password.subtitle")}
            </p>
          </div>
        </div>

        {errors.server && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            {errors.server}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <SecurePasswordInput
            id="currentPassword"
            label={t("accountSettings.password.fields.currentPassword")}
            placeholder={t(
              "accountSettings.password.placeholders.currentPassword",
            )}
            value={form.currentPassword}
            error={errors.currentPassword}
            onChange={handleChange}
          />
          <SecurePasswordInput
            id="newPassword"
            label={t("accountSettings.password.fields.newPassword")}
            placeholder={t("accountSettings.password.placeholders.newPassword")}
            value={form.newPassword}
            error={errors.newPassword}
            onChange={handleChange}
          />
          <SecurePasswordInput
            id="confirmPassword"
            label={t("accountSettings.password.fields.confirmPassword")}
            placeholder={t(
              "accountSettings.password.placeholders.confirmPassword",
            )}
            value={form.confirmPassword}
            error={errors.confirmPassword}
            onChange={handleChange}
          />

          <div className="flex justify-end border-t border-slate-100 pt-5">
            <Button
              type="submit"
              variant="outline"
              disabled={changePasswordMutation.isPending}
              className="h-11 rounded border-[#16a34a] px-6 font-semibold text-[#16a34a] hover:bg-[#16a34a]/10 hover:text-[#15803d]"
            >
              {changePasswordMutation.isPending ? (
                <LoaderCircle className="size-4 animate-spin" />
              ) : (
                t("accountSettings.password.actions.save")
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

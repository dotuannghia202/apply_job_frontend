import React from "react";
import { isAxiosError } from "axios";
import { Eye, EyeOff, KeyRound, LoaderCircle } from "lucide-react";

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

function getErrorMessage(error: unknown, fallback: string) {
  if (!isAxiosError(error)) return fallback;

  const message = error.response?.data?.message;
  if (Array.isArray(message)) return message.join(", ");
  if (typeof message === "string" && message.trim()) return message;
  if (error.request) return "Network error. Please check your connection.";

  return error.message || fallback;
}

function SecurePasswordInput({
  error,
  id,
  label,
  onChange,
  value,
}: {
  error?: string;
  id: PasswordField;
  label: string;
  onChange: (field: PasswordField, value: string) => void;
  value: string;
}) {
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
          placeholder={`Enter ${label.toLowerCase()}`}
        />
        <button
          type="button"
          onClick={() => setIsVisible((current) => !current)}
          className="absolute right-3 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-md text-slate-400 transition-colors hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16a34a]/30"
          aria-label={isVisible ? "Hide password" : "Show password"}
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
    const hasLowercase = /[a-z]/.test(form.newPassword);
    const hasUppercase = /[A-Z]/.test(form.newPassword);
    const hasNumber = /\d/.test(form.newPassword);

    if (!form.currentPassword) {
      nextErrors.currentPassword = "Current password is required.";
    }

    if (!form.newPassword) {
      nextErrors.newPassword = "New password is required.";
    } else if (form.newPassword.length < 8) {
      nextErrors.newPassword = "New password must be at least 8 characters.";
    } else if (!hasLowercase || !hasUppercase || !hasNumber) {
      nextErrors.newPassword =
        "Use uppercase, lowercase, and at least one number.";
    } else if (form.newPassword === form.currentPassword) {
      nextErrors.newPassword =
        "New password must be different from current password.";
    }

    if (!form.confirmPassword) {
      nextErrors.confirmPassword = "Please confirm your new password.";
    } else if (form.confirmPassword !== form.newPassword) {
      nextErrors.confirmPassword = "Passwords do not match.";
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
        title: "Password updated",
        message: "Your password has been changed successfully.",
      });
    } catch (error) {
      setErrors((current) => ({
        ...current,
        server: getErrorMessage(error, "Failed to update password."),
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
              Change Password
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Use a strong password to keep your account secure.
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
            label="Current Password"
            value={form.currentPassword}
            error={errors.currentPassword}
            onChange={handleChange}
          />
          <SecurePasswordInput
            id="newPassword"
            label="New Password"
            value={form.newPassword}
            error={errors.newPassword}
            onChange={handleChange}
          />
          <SecurePasswordInput
            id="confirmPassword"
            label="Confirm New Password"
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
                "Save"
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

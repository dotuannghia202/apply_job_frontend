import React from "react";
import { isAxiosError } from "axios";
import { LoaderCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

import authApi from "@/api/authApi";
import { NotificationPopup } from "@/components/NotificationPopup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { preventSpaceKey } from "@/helper";
import type { ForgotPasswordRequest } from "@/types/auth";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function ForgotPasswordForm() {
  const navigate = useNavigate();
  const [formForgotPassword, setFormForgotPassword] =
    React.useState<ForgotPasswordRequest>({
      email: "",
    });
  const [errors, setErrors] = React.useState({
    email: "",
    server: "",
  });
  const [isLoading, setLoading] = React.useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = React.useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormForgotPassword({ email: e.target.value });
    setErrors({ email: "", server: "" });
  };

  const validate = () => {
    const email = formForgotPassword.email.trim();
    const newErrors = { email: "", server: "" };

    if (!email) {
      newErrors.email = "Email is required!";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Email is invalid!";
    }

    setErrors(newErrors);
    return !newErrors.email;
  };

  const getErrorMessage = (error: unknown) => {
    if (!isAxiosError(error)) {
      return "An unexpected error occurred.";
    }

    const responseMessage = error.response?.data?.message;

    if (Array.isArray(responseMessage)) {
      return responseMessage.join(", ");
    }

    if (typeof responseMessage === "string" && responseMessage.trim()) {
      return responseMessage;
    }

    if (error.request) {
      return "Network error! please check your internet connection.";
    }

    return error.message || "Forgot password failed! Please try again.";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    try {
      const res = await authApi.forgotPassword({
        email: formForgotPassword.email.trim(),
      });

      if (res.statusCode === 200) {
        setShowSuccessPopup(true);
      }
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        server: getErrorMessage(error),
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessDismiss = () => {
    setShowSuccessPopup(false);
    navigate("/login");
  };

  return (
    <>
      <form className="space-y-5" onSubmit={handleSubmit}>
        {errors.server && (
          <div className="bg-red-500/10 border border-red-500/50 p-3 rounded-xl animate-in fade-in zoom-in duration-300">
            <p className="text-red-500 text-sm font-medium text-center">
              {errors.server}
            </p>
          </div>
        )}

        <div className="space-y-2">
          <Label
            htmlFor="forgot-password-email"
            className={errors.email ? "text-red-500" : "text-white"}
          >
            Email
          </Label>
          <Input
            id="forgot-password-email"
            name="email"
            type="email"
            value={formForgotPassword.email}
            onKeyDown={preventSpaceKey}
            onChange={handleChange}
            placeholder="Enter your email ..."
            className={`h-12 transition-all duration-200 focus-visible:ring-green-500/50 ${
              errors.email
                ? "bg-white border-red-500 border-2 text-black shadow-[0_0_10px_rgba(239,68,68,0.2)]"
                : "bg-[#283128] border-none text-white"
            }`}
          />
          {errors.email && (
            <span className="block text-red-500 text-xs font-medium">
              {errors.email}
            </span>
          )}
        </div>

        <Button
          disabled={isLoading}
          type="submit"
          className="mt-4 w-full bg-primary hover:bg-primary-hover text-white font-bold h-12 rounded-xl transition-all"
        >
          {isLoading ? (
            <LoaderCircle className="w-5 h-5 animate-spin" />
          ) : (
            "Send new password"
          )}
        </Button>
      </form>

      <NotificationPopup
        open={showSuccessPopup}
        variant="success"
        title="Job Portal"
        message="Job Portal đã gửi mật khẩu mới đến email. Vui lòng kiểm tra email để lấy mật khẩu mới."
        dismissLabel="Đã hiểu"
        onDismiss={handleSuccessDismiss}
      />
    </>
  );
}

export default ForgotPasswordForm;

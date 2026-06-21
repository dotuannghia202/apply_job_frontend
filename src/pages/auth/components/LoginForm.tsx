import React from "react";
import { useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";
import { LoaderCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import authApi from "@/api/authApi";
import type { LoginRequest } from "@/types/auth";
import { preventSpaceKey } from "@/helper";
import { useAuthStore } from "@/store/auth.store";

export const LoginForm = () => {
  const { t } = useTranslation();

  const [formLogin, setFormLogin] = React.useState<LoginRequest>({
    username: "",
    password: "",
  });

  const [errors, setErrors] = React.useState({
    email: "",
    password: "",
    server: "",
  });

  const [isLoading, setLoading] = React.useState(false);
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormLogin((prev) => ({ ...prev, [name]: value }));

    setErrors((prev) => ({
      ...prev,
      [name === "username" ? "email" : "password"]: "",
      server: "",
    }));
  };

  const validate = () => {
    let valid = true;
    const newErrors = { email: "", password: "", server: "" };

    if (!formLogin.username) {
      newErrors.email = t("auth.validation.emailRequired");
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formLogin.username.toString())) {
      newErrors.email = t("auth.validation.emailInvalid");
      valid = false;
    }

    if (!formLogin.password) {
      newErrors.password = t("auth.validation.passwordRequired");
      valid = false;
    } else if (formLogin.password.length < 6) {
      newErrors.password = t("auth.validation.passwordMinLength");
      valid = false;
    }
    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setLoading(true);
      try {
        const res = await authApi.login(formLogin);
        if (res.statusCode === 200 && res.data) {
          const { user } = res.data;

          setAuth(user);
          navigate("/");
        }
      } catch (error) {
        console.error("Login error:", error);
        if (isAxiosError(error)) {
          if (error.response?.data.statusCode === 401) {
            setErrors((prev) => ({
              ...prev,
              server: t("auth.login.errors.invalidCredentials"),
            }));
          } else if (error.request) {
            console.error("No response received:", error);
            setErrors((prev) => ({
              ...prev,
              server: error.response?.data.message || t("auth.errors.network"),
            }));
          } else {
            setErrors((prev) => ({
              ...prev,
              server:
                error.response?.data.message || t("auth.errors.unexpected"),
            }));
          }
        } else {
          setErrors((prev) => ({
            ...prev,
            server: t("auth.errors.unexpected"),
          }));
        }
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {errors.server && (
        <div className="bg-red-500/10 border border-red-500/50 p-3 rounded-xl animate-in fade-in zoom-in duration-300">
          <p className="text-red-500 text-sm font-medium text-center">
            {errors.server}
          </p>
        </div>
      )}

      <div className="space-y-2">
        <Label
          htmlFor="user_name"
          className={errors.email ? "text-red-500" : "text-white"}
        >
          {t("auth.fields.email")}
        </Label>
        <Input
          id="user_name"
          name="username"
          onKeyDown={preventSpaceKey}
          onChange={handleChange}
          placeholder={t("auth.placeholders.emailExample")}
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

      <div className="space-y-2">
        <Label
          htmlFor="password"
          className={errors.password ? "text-red-500" : "text-white"}
        >
          {t("auth.fields.password")}
        </Label>
        <PasswordInput
          id="password"
          name="password"
          onKeyDown={preventSpaceKey}
          onChange={handleChange}
          placeholder={t("auth.placeholders.password")}
          className={`h-12 transition-all duration-200 focus-visible:ring-green-500/50 ${
            errors.password
              ? "bg-white border-red-500 border-2 text-black shadow-[0_0_10px_rgba(239,68,68,0.2)]"
              : "bg-[#283128] border-none text-white"
          }`}
        />
        {errors.password && (
          <span className="text-red-500 text-xs font-medium">
            {errors.password}
          </span>
        )}
      </div>

      <div className="text-right">
        <button
          type="button"
          onClick={() => navigate("/forgot-password")}
          className="text-sm text-gray-500 hover:text-gray-300 underline underline-offset-4 cursor-pointer"
        >
          {t("auth.login.forgotPassword")}
        </button>
      </div>

      <Button
        disabled={isLoading}
        type="submit"
        className="w-full bg-primary hover:bg-primary-hover text-white font-bold h-12 rounded-xl transition-all"
      >
        {isLoading ? (
          <LoaderCircle className="w-5 h-5 animate-spin" />
        ) : (
          t("auth.login.submit")
        )}
      </Button>
    </form>
  );
};

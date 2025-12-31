import React from "react";
import { useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";
import { LoaderCircle, Chrome, Github, Facebook } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import authApi from "@/api/authApi";
import type { LoginRequest } from "@/types/auth";

export const LoginForm = () => {
  console.count("Render LoginForm");

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
      newErrors.email = "Email is required!";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formLogin.username.toString())) {
      newErrors.email = "Email is invalid!";
      valid = false;
    }

    if (!formLogin.password) {
      newErrors.password = "Password is required!";
      valid = false;
    } else if (formLogin.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters!";
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
        if (res.statusCode === 200) {
          const { access_token, user } = res.data;
          localStorage.setItem("access_token", access_token.toString());
          localStorage.setItem("user", JSON.stringify(user));
          navigate("/admin/dashboard");
        }
      } catch (error) {
        if (isAxiosError(error)) {
          if (error.response?.data.statusCode === 400) {
            setErrors((prev) => ({
              ...prev,
              server: "Incorrect email or password!",
            }));
          } else if (error.request) {
            setErrors((prev) => ({
              ...prev,
              server: "Network error! please check your internet connection.",
            }));
          } else {
            setErrors((prev) => ({
              ...prev,
              server: error.message,
            }));
          }
        } else {
          setErrors((prev) => ({
            ...prev,
            server: "An unexpected error occurred.",
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
          Email
        </Label>
        <Input
          id="user_name"
          name="username"
          onChange={handleChange}
          placeholder="Johndoe@gmail.com"
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
          Password
        </Label>
        <PasswordInput
          id="password"
          name="password"
          onChange={handleChange}
          placeholder="Enter your password ..."
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
          className="text-sm text-gray-500 hover:text-gray-300 underline underline-offset-4 cursor-pointer"
        >
          Forgot Password
        </button>
      </div>

      <Button
        disabled={isLoading}
        type="submit"
        className="w-full bg-[#72b183] hover:bg-[#5e966c] text-[#0a0c0b] font-bold h-12 rounded-xl transition-all"
      >
        {isLoading ? (
          <LoaderCircle className="w-5 h-5 animate-spin" />
        ) : (
          "Sign in"
        )}
      </Button>

      {/* Social Logins */}
      <div className="flex justify-center gap-4 mt-8">
        <SocialButton icon={<Chrome className="w-5 h-5" />} />
        <SocialButton icon={<Github className="w-5 h-5" />} />
        <SocialButton
          icon={
            <Facebook className="w-5 h-5 text-blue-600" fill="currentColor" />
          }
        />
      </div>
    </form>
  );
};

const SocialButton = ({ icon }: { icon: React.ReactNode }) => (
  <button
    type="button"
    className="w-12 h-12 flex items-center justify-center rounded-full bg-white hover:bg-gray-100 transition-colors cursor-pointer shadow-md"
  >
    {icon}
  </button>
);

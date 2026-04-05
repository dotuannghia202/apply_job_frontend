import React from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import type { RegisterRequest } from "@/types/auth";

import authApi from "@/api/authApi";
import { isAxiosError } from "axios";
import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";
import { preventSpaceKey } from "@/helper";

function RegisterForm() {
  const [formRegister, setFormRegister] = React.useState<RegisterRequest>({
    name: "",
    email: "",
  });

  const [errors, setErrors] = React.useState({
    name: "",
    email: "",
    server: "",
  });

  const [isLoading, setLoading] = React.useState(false);

  // currying
  const handleChange =
    (name: keyof RegisterRequest) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormRegister((prev) => ({ ...prev, [name]: e.target.value }));
      setErrors((prev) => ({
        ...prev,
        [name === "email" ? "email" : "name"]: "",
        server: "",
      }));
    };

  const validate = (): Boolean => {
    let valid = true;
    const newErrors = { email: "", name: "", server: "" };

    if (!formRegister.email) {
      newErrors.email = "Email is required!";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formRegister.email.toString())) {
      newErrors.email = "Email is invalid!";
      valid = false;
    }
    if (!formRegister.name) {
      newErrors.name = "Name is required!";
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
        const res = await authApi.register(formRegister);
        if (res.statusCode === 201) {
          alert(
            "Register successfully! Please check your email to verify your account.",
          );
        }
      } catch (error) {
        if (isAxiosError(error)) {
          if (error.response?.data.statusCode === 400) {
            setErrors((prev) => ({
              ...prev,
              server:
                error.response?.data.message ||
                "Registration failed! Please try again.",
            }));
          } else {
            setErrors((prev) => ({
              ...prev,
              server: "Network error! please check your internet connection.",
            }));
          }
        }
      } finally {
        setLoading(false);
      }
    }
  };
  return (
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
          htmlFor="fullName"
          className={errors.name ? "text-red-500" : "text-white"}
        >
          Full name
        </Label>
        <Input
          id="fullName"
          name="name"
          placeholder="Enter full name ..."
          className={`h-12 transition-all duration-200 focus-visible:ring-green-500/50 ${
            errors.name
              ? "bg-white border-red-500 border-2 text-black shadow-[0_0_10px_rgba(239,68,68,0.2)]"
              : "bg-[#283128] border-none text-white"
          }`}
          onChange={handleChange("name")}
        />
        {errors.name && (
          <span className="block text-red-500 text-xs font-medium">
            {errors.name}
          </span>
        )}
      </div>
      <div className="space-y-2">
        <Label
          htmlFor="email"
          className={errors.email ? "text-red-500" : "text-white"}
        >
          Email
        </Label>
        <Input
          id="email"
          name="email"
          placeholder="Enter your email ..."
          className={`h-12 transition-all duration-200 focus-visible:ring-green-500/50 ${
            errors.email
              ? "bg-white border-red-500 border-2 text-black shadow-[0_0_10px_rgba(239,68,68,0.2)]"
              : "bg-[#283128] border-none text-white"
          }`}
          onKeyDown={preventSpaceKey}
          onChange={handleChange("email")}
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
          "Register"
        )}
      </Button>
    </form>
  );
}

export default RegisterForm;

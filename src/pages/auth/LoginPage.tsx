import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Github, Facebook, Chrome, Star, LoaderCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";

import { PasswordInput } from "@/components/ui/password-input";
import type { LoginRequest } from "@/types/auth";
import authApi from "@/api/authApi";

const LoginPage = () => {
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
    setFormLogin({
      ...formLogin,
      [name]: value,
    });

    // setErrors((prev) => ({
    //   ...prev,
    //   [name === "username" ? "email" : "password"]: "",
    //   server: "",
    // }));
  };

  const validate = () => {
    let valid = true;
    const newErrors = {
      email: "",
      password: "",
      server: "",
    };
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
    } else if (formLogin.password.toString().length < 6) {
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
    <div className="min-h-screen w-full bg-[#0a0c0b] flex items-center justify-center p-4 lg:p-8 font-sans">
      {/* Container chính */}
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 bg-[#121412] rounded-[40px] overflow-hidden shadow-2xl border border-white/5 min-h-[700px]">
        {/* BÊN TRÁI: Form Đăng nhập */}
        <div className="p-8 lg:p-16 flex flex-col justify-between relative overflow-hidden">
          {/* Hiệu ứng Glow mờ phía sau */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-green-500/30 blur-[120px] rounded-full pointer-events-none" />

          <div className="relative z-10">
            <h1 className="text-white font-bold text-xl mb-12">Apply Job</h1>

            <div className="space-y-2 mb-8">
              <h2 className="text-4xl font-semibold text-white tracking-tight">
                Welcome back
              </h2>
              <p className="text-gray-400">Please Enter your Account details</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="user_name" className="text-white">
                  Email
                </Label>
                <Input
                  onChange={handleChange}
                  id="user_name"
                  name="username"
                  placeholder="Johndoe@gmail.com"
                  className="bg-[#1c1f1c] border-none text-white h-12 focus-visible:ring-green-500/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">
                  Password
                </Label>
                <PasswordInput
                  onChange={handleChange}
                  name="password"
                  placeholder="Enter your password ..."
                  id="password"
                  className="px-3 py-1 bg-[#1c1f1c] border-none text-white h-12 focus-visible:ring-green-500/50"
                />
                <div className="text-right">
                  <button
                    type="button"
                    className="text-sm text-gray-500 hover:text-gray-300 underline underline-offset-4 cursor-pointer"
                  >
                    Forgot Password
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-[#72b183] hover:bg-[#5e966c] text-[#0a0c0b] font-bold h-12 rounded-xl transition-all"
              >
                {isLoading ? (
                  <LoaderCircle className="w-5 h-5 animate-spin" />
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>

            {/* Social Logins */}
            <div className="flex justify-center gap-4 mt-8">
              <SocialButton icon={<Chrome className="w-5 h-5" />} />
              <SocialButton icon={<Github className="w-5 h-5" />} />
              <SocialButton
                icon={
                  <Facebook
                    className="w-5 h-5 text-blue-600"
                    fill="currentColor"
                  />
                }
              />
            </div>
          </div>

          <div className="mt-8 text-center relative z-10">
            <button className="text-gray-400 hover:text-white text-sm underline underline-offset-4 cursor-pointer">
              Create an account
            </button>
          </div>
        </div>

        {/* BÊN PHẢI: Card Trang trí & Testimonial */}
        <div className="hidden lg:block p-6">
          <div className="h-full w-full bg-[#72b183] rounded-[32px] relative overflow-hidden p-12 flex flex-col justify-between">
            {/* Cấu trúc bo góc đặc biệt ở góc trên bên phải */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#121412] rounded-bl-[40px]">
              <div className="absolute top-0 right-0 w-full h-full bg-[#72b183] rounded-tr-[32px]" />
            </div>

            <div className="relative z-10">
              <h2 className="text-5xl font-bold text-[#0a0c0b] leading-tight max-w-[400px]">
                What's our Jobseekers Said.
              </h2>
              <div className="mt-8">
                <span className="text-4xl text-[#0a0c0b]">"</span>
                <p className="text-[#0a0c0b]/80 text-lg leading-relaxed max-w-[400px]">
                  Search and find your dream job is now easier than ever. Just
                  browse a job and apply if you need to.
                </p>
              </div>
            </div>

            <div className="relative z-10 flex items-end justify-between">
              {/* Floating Card nhỏ phía dưới góc phải */}
              <div className="bg-white rounded-2xl p-4 shadow-xl max-w-[240px] transform translate-y-4">
                <p className="text-xs font-bold text-gray-800 leading-tight">
                  Get your right job and right place apply now
                </p>
                <p className="text-[10px] text-gray-400 mt-2">
                  Be among the first founders to experience the easiest way to
                  start.
                </p>
                <div className="flex items-center mt-3">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="w-6 h-6 rounded-full border-2 border-white bg-gray-200 overflow-hidden"
                      >
                        <img
                          src={`https://i.pravatar.cc/100?img=${i + 10}`}
                          alt="avatar"
                        />
                      </div>
                    ))}
                  </div>
                  <span className="text-[10px] font-bold ml-2">+2</span>
                </div>
              </div>
            </div>

            {/* Hình ngôi sao trang trí mờ phía sau */}
            <div className="absolute bottom-1/4 right-0 opacity-20 rotate-12 pointer-events-none">
              <Star size={300} strokeWidth={0.5} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Component con cho các nút Social
const SocialButton = ({ icon }: { icon: React.ReactNode }) => (
  <button className="w-12 h-12 flex items-center justify-center rounded-full bg-white hover:bg-gray-100 transition-colors cursor-pointer shadow-md">
    {icon}
  </button>
);

export default LoginPage;

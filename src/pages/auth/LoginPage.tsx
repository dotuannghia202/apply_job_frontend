import { Star } from "lucide-react";

import { LoginForm } from "./components/LoginForm";

const LoginPage = () => {
  console.count("Render LoginPage");
  return (
    <div className="min-h-screen w-full bg-[#0a0c0b] flex items-center justify-center p-4 lg:p-8 font-sans">
      {/* Container chính */}h-
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 bg-[#121412] rounded-[40px] overflow-hidden shadow-2xl border border-white/5 min-h-175">
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
          </div>

          <div className="relative z-10">
            <LoginForm />
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
              <h2 className="text-5xl font-bold text-[#0a0c0b] leading-tight max-w-100">
                What's our Jobseekers Said.
              </h2>
              <div className="mt-8">
                <span className="text-4xl text-[#0a0c0b]">"</span>
                <p className="text-[#0a0c0b]/80 text-lg leading-relaxed max-w-100">
                  Search and find your dream job is now easier than ever. Just
                  browse a job and apply if you need to.
                </p>
              </div>
            </div>

            <div className="relative z-10 flex items-end justify-between">
              {/* Floating Card nhỏ phía dưới góc phải */}
              <div className="bg-white rounded-2xl p-4 shadow-xl max-w-60 transform translate-y-4">
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

export default LoginPage;

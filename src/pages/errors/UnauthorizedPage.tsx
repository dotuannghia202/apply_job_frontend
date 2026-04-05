import { ArrowLeft, ShieldAlert, Lock, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-[#0a0c0b] flex items-center justify-center p-4 lg:p-8 font-sans overflow-hidden">
      <div className="relative w-full max-w-6xl rounded-[40px] border border-white/5 bg-[#121412] shadow-2xl overflow-hidden">
        {/* Glow */}
        <div className="absolute top-1/3 left-1/4 w-[320px] h-[320px] bg-green-500/20 blur-[140px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[280px] h-[280px] bg-emerald-400/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[720px]">
          {/* LEFT */}
          <div className="relative p-8 lg:p-16 flex flex-col justify-between">
            <div>
              <p className="text-white font-bold text-xl mb-10">Job Portal</p>

              <div className="inline-flex items-center gap-2 rounded-full border border-red-400/20 bg-red-400/10 px-4 py-2 text-sm text-red-200 mb-6">
                <ShieldAlert size={16} />
                Access denied
              </div>

              <div className="space-y-4">
                <h1 className="text-[64px] lg:text-[100px] leading-none font-extrabold tracking-tight text-white">
                  403
                </h1>

                <h2 className="text-3xl lg:text-5xl font-semibold text-white leading-tight max-w-xl">
                  You do not have permission to access this page.
                </h2>

                <p className="text-gray-400 text-base lg:text-lg leading-relaxed max-w-xl">
                  Your account is signed in, but your current role does not have
                  access to this resource. Please contact an administrator if
                  you believe this is a mistake.
                </p>
              </div>

              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate(-1)}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white text-[#0a0c0b] px-6 py-3 font-semibold hover:opacity-90 transition cursor-pointer"
                >
                  <ArrowLeft size={18} />
                  Go Back
                </button>

                <button
                  onClick={() => navigate("/")}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 text-white px-6 py-3 font-semibold hover:bg-white/10 transition cursor-pointer"
                >
                  <Lock size={18} />
                  Back to Home
                </button>
              </div>
            </div>

            <div className="mt-10 border-t border-white/5 pt-6">
              <p className="text-sm text-gray-500">
                Tip: Different roles may have access to different sections of
                the system.
              </p>
            </div>
          </div>

          {/* RIGHT */}
          <div className="hidden lg:block p-6">
            <div className="relative h-full w-full rounded-[32px] bg-primary overflow-hidden p-12 flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#121412] rounded-bl-[40px]">
                <div className="absolute top-0 right-0 w-full h-full bg-primary rounded-tr-[32px]" />
              </div>

              <div className="relative z-10">
                <p className="text-[#0a0c0b]/70 text-sm font-semibold uppercase tracking-[0.2em] mb-4">
                  Restricted area
                </p>

                <h2 className="text-5xl font-bold text-[#0a0c0b] leading-tight max-w-[420px]">
                  This section is not available for your role.
                </h2>

                <p className="mt-8 text-[#0a0c0b]/80 text-lg leading-relaxed max-w-[420px]">
                  Some pages are only visible to authorized roles such as admin,
                  recruiter, or candidate depending on system permissions.
                </p>
              </div>

              <div className="relative z-10 flex justify-end">
                <div className="bg-white rounded-3xl p-5 shadow-xl max-w-[260px]">
                  <p className="text-xs font-bold text-gray-800 leading-tight">
                    Permission required
                  </p>
                  <p className="text-[12px] text-gray-500 mt-2 leading-relaxed">
                    Your current role cannot open this page.
                  </p>

                  <div className="mt-4 flex items-center gap-2">
                    <span className="inline-block h-2.5 w-2.5 rounded-full bg-amber-500" />
                    <span className="text-[11px] font-medium text-gray-700">
                      Status: 403 Forbidden
                    </span>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-8 right-0 opacity-20 rotate-12 pointer-events-none">
                <Star size={280} strokeWidth={0.5} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;

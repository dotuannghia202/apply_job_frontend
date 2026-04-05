import { ArrowLeft, Compass, SearchX, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-[#0a0c0b] flex items-center justify-center p-4 lg:p-8 font-sans overflow-hidden">
      <div className="relative w-full max-w-6xl rounded-[40px] border border-white/5 bg-[#121412] shadow-2xl overflow-hidden">
        {/* Glow background */}
        <div className="absolute top-1/3 left-1/4 w-[320px] h-[320px] bg-green-500/20 blur-[140px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[280px] h-[280px] bg-emerald-400/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[720px]">
          {/* LEFT */}
          <div className="relative p-8 lg:p-16 flex flex-col justify-between">
            <div>
              <p className="text-white font-bold text-xl mb-10">Job Portal</p>

              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300 mb-6">
                <SearchX size={16} />
                Page not found
              </div>

              <div className="space-y-4">
                <h1 className="text-[72px] lg:text-[110px] leading-none font-extrabold tracking-tight text-white">
                  404
                </h1>

                <h2 className="text-3xl lg:text-5xl font-semibold text-white leading-tight max-w-xl">
                  The page you are looking for does not exist.
                </h2>

                <p className="text-gray-400 text-base lg:text-lg leading-relaxed max-w-xl">
                  The link may be broken, the page may have been moved, or the
                  URL may be incorrect. Let’s get you back to a valid page.
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
                  onClick={() => navigate("/login")}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 text-white px-6 py-3 font-semibold hover:bg-white/10 transition cursor-pointer"
                >
                  <Compass size={18} />
                  Go to Login
                </button>
              </div>
            </div>

            <div className="mt-10 border-t border-white/5 pt-6">
              <p className="text-sm text-gray-500">
                Tip: Check the URL again or return to the homepage to continue
                browsing jobs.
              </p>
            </div>
          </div>

          {/* RIGHT */}
          <div className="hidden lg:block p-6">
            <div className="relative h-full w-full rounded-[32px] bg-primary overflow-hidden p-12 flex flex-col justify-between">
              {/* Corner shape */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#121412] rounded-bl-[40px]">
                <div className="absolute top-0 right-0 w-full h-full bg-primary rounded-tr-[32px]" />
              </div>

              <div className="relative z-10">
                <p className="text-[#0a0c0b]/70 text-sm font-semibold uppercase tracking-[0.2em] mb-4">
                  Oops, lost your way?
                </p>

                <h2 className="text-5xl font-bold text-[#0a0c0b] leading-tight max-w-[420px]">
                  Let’s help you get back on track.
                </h2>

                <p className="mt-8 text-[#0a0c0b]/80 text-lg leading-relaxed max-w-[420px]">
                  Browse jobs, manage candidates, and continue your work from a
                  valid route inside the system.
                </p>
              </div>

              <div className="relative z-10 flex justify-end">
                <div className="bg-white rounded-3xl p-5 shadow-xl max-w-[260px]">
                  <p className="text-xs font-bold text-gray-800 leading-tight">
                    Route unavailable
                  </p>
                  <p className="text-[12px] text-gray-500 mt-2 leading-relaxed">
                    The page may have been removed or the address is not valid.
                  </p>

                  <div className="mt-4 flex items-center gap-2">
                    <span className="inline-block h-2.5 w-2.5 rounded-full bg-red-500" />
                    <span className="text-[11px] font-medium text-gray-700">
                      Status: 404 Not Found
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

export default NotFoundPage;

import { useState, type RefObject } from "react";
import { useTranslation } from "react-i18next";
import {
  Camera,
  Mic,
  Play,
  CheckCircle2,
  ShieldAlert,
  HelpCircle,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface DeviceSetupViewProps {
  videoPreviewRef: RefObject<HTMLVideoElement | null>;
  hasPermission: boolean | null;
  audioLevel: number;
  onRetryPermission: () => void;
  onStartInterview: () => void;
}

export function DeviceSetupView({
  videoPreviewRef,
  hasPermission,
  audioLevel,
  onRetryPermission,
  onStartInterview,
}: DeviceSetupViewProps) {
  const { t, i18n } = useTranslation();
  const isVi = i18n.language.startsWith("vi");
  const [showTroubleshoot, setShowTroubleshoot] = useState(false);

  return (
    <main className="flex flex-1 items-center justify-center p-6 overflow-y-auto">
      <div className="grid w-full max-w-5xl gap-8 lg:grid-cols-12 items-center">
        {/* Cột trái: Khung soi Camera & Thước đo Mic */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-video overflow-hidden rounded-2xl border-2 border-slate-800 bg-slate-900 shadow-2xl">
            {hasPermission ? (
              <>
                <video
                  ref={videoPreviewRef}
                  autoPlay
                  playsInline
                  muted
                  className="size-full object-cover -scale-x-100"
                />
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div className="size-48 rounded-full border border-dashed border-white/20" />
                </div>
              </>
            ) : (
              <div className="flex size-full flex-col items-center justify-center p-6 text-center text-slate-400">
                <Camera className="size-12 mb-3 text-red-400/60" />
                <p className="font-semibold text-white">
                  {isVi
                    ? "Chưa cấp quyền Camera & Microphone"
                    : "Camera & Microphone Access Required"}
                </p>
                <p className="mt-1 text-xs max-w-xs text-slate-400">
                  {isVi
                    ? "Trình duyệt cần quyền truy cập thiết bị để tiến hành phỏng vấn."
                    : "The browser requires device permissions to conduct the interview."}
                </p>
                <Button
                  onClick={onRetryPermission}
                  variant="outline"
                  size="sm"
                  className="mt-4 gap-1.5 border-slate-700 bg-slate-800 text-white hover:bg-slate-700"
                >
                  <RefreshCw className="size-3.5" />
                  {isVi ? "Thử lại quyền truy cập" : "Retry Access"}
                </Button>
              </div>
            )}

            {/* Status Bar dưới góc Camera */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold backdrop-blur ${
                    hasPermission
                      ? "bg-black/60 text-emerald-400"
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  <Camera className="size-3.5" />
                  {hasPermission
                    ? isVi
                      ? "Cam OK"
                      : "Cam Ready"
                    : "Cam Off"}
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold backdrop-blur ${
                    hasPermission
                      ? "bg-black/60 text-emerald-400"
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  <Mic className="size-3.5" />
                  {hasPermission
                    ? isVi
                      ? "Mic OK"
                      : "Mic Ready"
                    : "Mic Off"}
                </span>
              </div>

              {hasPermission && (
                <div className="flex items-center gap-2 rounded-lg bg-black/60 px-3 py-1 backdrop-blur">
                  <span className="text-[11px] text-slate-400">
                    {isVi ? "Âm lượng:" : "Voice:"}
                  </span>
                  <div className="flex h-3 w-20 items-end gap-0.5">
                    {[20, 40, 60, 80, 100].map((step, idx) => (
                      <span
                        key={idx}
                        className={`flex-1 rounded-xs transition-all duration-75 ${
                          audioLevel >= step
                            ? audioLevel > 80
                              ? "bg-red-400"
                              : "bg-emerald-400"
                            : "bg-slate-700"
                        }`}
                        style={{ height: `${step}%` }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>
              {isVi
                ? "💡 Nói thử vào mic để kiểm tra vạch âm lượng."
                : "💡 Speak into your mic to test the volume meter."}
            </span>
            <button
              type="button"
              onClick={() => setShowTroubleshoot(!showTroubleshoot)}
              className="flex items-center gap-1 text-emerald-400 hover:underline"
            >
              <HelpCircle className="size-3.5" />
              {isVi ? "Không bật được Mic/Cam?" : "Mic/Cam not working?"}
            </button>
          </div>

          {showTroubleshoot && (
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-amber-200 space-y-2">
              <p className="font-bold flex items-center gap-1.5">
                <AlertCircle className="size-4 text-amber-400" />
                {isVi
                  ? "Cách mở lại quyền nếu bạn lỡ bấm Chặn (Block):"
                  : "How to unblock permissions:"}
              </p>
              <ol className="list-decimal pl-5 space-y-1 text-slate-300">
                <li>
                  {isVi
                    ? "Nhìn lên thanh địa chỉ trình duyệt, bấm vào biểu tượng Ổ khóa 🔒 hoặc Cài đặt trang web ở bên trái URL."
                    : "Click the Lock 🔒 or Site Settings icon on the left of your browser's address bar."}
                </li>
                <li>
                  {isVi
                    ? "Chuyển Camera và Microphone từ 'Chặn' sang 'Cho phép' (Allow)."
                    : "Switch Camera and Microphone from 'Block' to 'Allow'."}
                </li>
                <li>
                  {isVi
                    ? "Tải lại trang (F5) để hệ thống nhận thiết bị."
                    : "Reload the page (F5) to apply changes."}
                </li>
              </ol>
            </div>
          )}
        </div>

        {/* Cột phải: Quy chế thi & Bắt đầu */}
        <div className="lg:col-span-5 flex flex-col justify-center space-y-6">
          <div>
            <span className="inline-block rounded-md bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-400">
              {t("interviewRoom.instructions", "HƯỚNG DẪN THI")}
            </span>
            <h2 className="mt-2 text-2xl font-black tracking-tight">
              {t("interviewRoom.lobbyTitle", "Sẵn sàng cho buổi phỏng vấn AI")}
            </h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-300">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="size-4 shrink-0 text-emerald-400 mt-0.5" />
                <span>
                  {t(
                    "interviewRoom.rule1",
                    "Buổi phỏng vấn gồm 5 câu hỏi thực chiến bám sát CV của bạn.",
                  )}
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="size-4 shrink-0 text-emerald-400 mt-0.5" />
                <span>
                  {t(
                    "interviewRoom.rule2",
                    "Mỗi câu có thời gian đếm ngược. Trả lời xong có thể bấm nộp để sang câu tiếp theo.",
                  )}
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <ShieldAlert className="size-4 shrink-0 text-amber-400 mt-0.5" />
                <span>
                  {t(
                    "interviewRoom.rule3",
                    "Vui lòng giữ ánh sáng rõ ràng và nói to, rõ ràng vào microphone.",
                  )}
                </span>
              </li>
            </ul>
          </div>

          <Button
            size="lg"
            onClick={onStartInterview}
            disabled={!hasPermission}
            className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700 font-bold py-6 text-base disabled:opacity-50 cursor-pointer"
          >
            <Play className="size-5 fill-current" />
            {t("interviewRoom.startBtn", "Bắt đầu phỏng vấn ngay")}
          </Button>
        </div>
      </div>
    </main>
  );
}

import { useTranslation } from "react-i18next";
import {
  RotateCw,
  Video,
  ExternalLink,
  Bot,
  CheckCircle2,
  Clock,
  Sparkles,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { ResInterviewSessionDTO } from "@/types/interview";

interface InterviewEvaluatingCardProps {
  session: ResInterviewSessionDTO;
  onRetry?: () => void;
  isRetrying?: boolean;
  role?: "candidate" | "employer";
}

export function InterviewEvaluatingCard({
  session,
  onRetry,
  isRetrying = false,
  role: _role,
}: InterviewEvaluatingCardProps) {
  const { i18n } = useTranslation();
  const isVi = i18n.language.startsWith("vi");

  const hasVideo = Boolean(session.mediaRecordUrl);

  return (
    <Card className="overflow-hidden border border-amber-200/80 bg-gradient-to-br from-amber-50/40 via-white to-amber-50/20 p-6 shadow-sm">
      {/* ── TOP BADGE & LIVE STATUS ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-100/80 pb-4">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-amber-500" />
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100/80 px-3 py-1 text-xs font-bold text-amber-900 border border-amber-200">
            <Bot className="size-3.5 text-amber-700" />
            {isVi
              ? "AI ĐANG ĐÁNH GIÁ PHỎNG VẤN"
              : "AI INTERVIEW EVALUATION IN PROGRESS"}
          </span>
          <span className="text-xs font-medium text-slate-400">
            #{String(session.id).slice(0, 8)}
          </span>
        </div>

        {/* Retry Button */}
        {onRetry && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isRetrying}
            onClick={onRetry}
            className="h-8 gap-1.5 border-amber-300 bg-white text-xs font-semibold text-amber-800 shadow-xs hover:bg-amber-100 hover:text-amber-900 disabled:opacity-60 cursor-pointer"
          >
            <RotateCw
              className={`size-3.5 ${isRetrying ? "animate-spin" : ""}`}
            />
            {isRetrying
              ? isVi
                ? "Đang gửi yêu cầu..."
                : "Retrying..."
              : isVi
                ? "Chấm điểm lại"
                : "Retry Evaluation"}
          </Button>
        )}
      </div>

      {/* ── MAIN BANNER CONTENT ── */}
      <div className="mt-5 flex flex-col md:flex-row md:items-start justify-between gap-5">
        <div className="flex items-start gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 shadow-xs ring-4 ring-amber-50">
            <Sparkles className="size-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 sm:text-lg">
              {isVi
                ? "Hệ thống AI đang chấm điểm buổi phỏng vấn video"
                : "AI System is Evaluating Interview Video"}
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
              {isVi
                ? "Quá trình phân tích bao gồm bóc băng âm thanh (STT), dịch thuật thuật ngữ kỹ thuật và đối chiếu câu trả lời với bộ tiêu chí Rubric đánh giá năng lực ứng viên."
                : "The analysis process includes speech-to-text (STT) transcription, technical translation, and rubric scoring against job requirements."}
            </p>
          </div>
        </div>
      </div>

      {/* ── PROGRESS STEPS ── */}
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {/* Step 1 */}
        <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50/60 p-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white">
            <CheckCircle2 className="size-4" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-emerald-950">
              {isVi ? "1. Ghi hình hoàn tất" : "1. Video Recorded"}
            </p>
            <p className="text-[11px] text-emerald-700 truncate">
              {hasVideo
                ? isVi
                  ? "Đã lưu video an toàn trên Cloud"
                  : "Saved safely on Cloud"
                : isVi
                  ? "Đang xử lý tải video"
                  : "Uploading video"}
            </p>
          </div>
        </div>

        {/* Step 2 */}
        <div className="flex items-center gap-3 rounded-xl border border-amber-300 bg-amber-100/50 p-3 ring-2 ring-amber-300/40">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-amber-600 text-white animate-spin">
            <RotateCw className="size-4" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-amber-950">
              {isVi ? "2. Bóc băng & Rubric AI" : "2. STT & AI Rubric"}
            </p>
            <p className="text-[11px] text-amber-800 font-medium truncate">
              {isVi ? "Đang tiến hành chấm điểm..." : "Scoring in progress..."}
            </p>
          </div>
        </div>

        {/* Step 3 */}
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white/70 p-3 opacity-70">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-slate-200 text-slate-500">
            <Clock className="size-4" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-700">
              {isVi ? "3. Báo cáo đánh giá" : "3. Detailed Report"}
            </p>
            <p className="text-[11px] text-slate-500 truncate">
              {isVi
                ? "Tự động hiển thị khi hoàn tất"
                : "Auto-displayed when ready"}
            </p>
          </div>
        </div>
      </div>

      {/* ── CLOUD VIDEO & AUTO-REFRESH FOOTER ── */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-amber-100/80 pt-4 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          {hasVideo ? (
            <a
              href={session.mediaRecordUrl!}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-medium text-emerald-700 hover:text-emerald-800 hover:underline"
            >
              <Video className="size-3.5" />
              <span>
                {isVi
                  ? "Xem lại video phỏng vấn"
                  : "View submitted video interview"}
              </span>
              <ExternalLink className="size-3" />
            </a>
          ) : (
            <span className="text-slate-400">
              {isVi
                ? "Chưa có liên kết video lưu trữ"
                : "No recorded video link available"}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 text-slate-500">
          <Clock className="size-3.5 text-amber-600 animate-pulse" />
          <span>
            {isVi
              ? "Trang tự động cập nhật kết quả khi AI hoàn thành (khoảng 30-60 giây)."
              : "Page automatically refreshes when AI finishes (approx. 30-60s)."}
          </span>
        </div>
      </div>
    </Card>
  );
}

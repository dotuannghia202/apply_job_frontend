import { type RefObject } from "react";
import { useTranslation } from "react-i18next";
import { Clock, ArrowRight, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ResInterviewQuestionDTO } from "@/types/interview";

interface RecordingViewProps {
  currentQuestion: ResInterviewQuestionDTO;
  currentIdx: number;
  totalQuestions: number;
  timeLeft: number;
  audioLevel: number;
  videoPreviewRef: RefObject<HTMLVideoElement | null>;
  onNextQuestion: () => void;
}

export function RecordingView({
  currentQuestion,
  currentIdx,
  totalQuestions,
  timeLeft,
  audioLevel,
  videoPreviewRef,
  onNextQuestion,
}: RecordingViewProps) {
  const { t, i18n } = useTranslation();
  const isVi = i18n.language.startsWith("vi");

  const isUrgent = timeLeft <= 15;
  const isLastQuestion = currentIdx === totalQuestions - 1;

  // Resolve bilingual question text:
  const displayText = isVi
    ? currentQuestion.questionTextVi || currentQuestion.questionText
    : currentQuestion.questionTextEn || currentQuestion.questionText;

  return (
    <main className="grid flex-1 grid-cols-1 lg:grid-cols-12 p-6 gap-6 items-center">
      {/* Cột trái: Thông tin câu hỏi & Thời gian */}
      <div className="lg:col-span-5 flex flex-col justify-between h-full max-h-[580px] p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
        <div>
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/20">
              {currentQuestion.category}
            </span>
            <span className="text-xs font-semibold text-slate-400">
              {t("interviewRoom.questionLabel", "Câu hỏi")} {currentIdx + 1} / {totalQuestions}
            </span>
          </div>

          <h2 className="mt-6 text-xl md:text-2xl font-bold leading-relaxed text-slate-100">
            {displayText}
          </h2>
        </div>

        <div className="mt-8 border-t border-slate-800 pt-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`flex size-11 items-center justify-center rounded-xl ${
                isUrgent ? "bg-red-500/20 text-red-400" : "bg-slate-800 text-slate-300"
              }`}
            >
              <Clock className="size-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400">
                {t("interviewRoom.timeRemaining", "Thời gian còn lại")}
              </p>
              <p className={`text-xl font-black ${isUrgent ? "text-red-400 animate-pulse" : "text-white"}`}>
                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
              </p>
            </div>
          </div>

          <Button
            onClick={onNextQuestion}
            className="gap-2 bg-emerald-600 hover:bg-emerald-700 font-bold px-5 cursor-pointer"
          >
            {isLastQuestion
              ? t("interviewRoom.finishBtn", "Hoàn thành phỏng vấn")
              : t("interviewRoom.nextBtn", "Xong câu này")}
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </div>

      {/* Cột phải: Video Preview ghi hình */}
      <div className="lg:col-span-7 relative aspect-video h-full max-h-[580px] overflow-hidden rounded-2xl border border-slate-800 bg-black shadow-2xl">
        <video
          ref={videoPreviewRef}
          autoPlay
          playsInline
          muted
          className="size-full object-cover -scale-x-100"
        />

        {/* Thanh đo âm thanh góc màn hình để ứng viên biết mic đang hoạt động tốt */}
        <div className="absolute top-4 left-4 flex items-center gap-2 rounded-lg bg-black/60 px-3 py-1.5 text-xs text-slate-300 backdrop-blur">
          <Mic className="size-3.5 text-emerald-400 animate-pulse" />
          <span>{isVi ? "Mic đang thu..." : "Microphone active..."}</span>
          <div className="h-1.5 w-12 rounded-full bg-slate-700 overflow-hidden">
            <div
              className="h-full bg-emerald-400 transition-all duration-75"
              style={{ width: `${audioLevel}%` }}
            />
          </div>
        </div>
      </div>
    </main>
  );
}

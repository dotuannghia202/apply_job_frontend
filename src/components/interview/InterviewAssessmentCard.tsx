import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Play, Quote, Video, Globe2, Award, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ScoreRing from "@/components/PercentageCircle";
import type { ResInterviewSessionDTO } from "@/types/interview";

interface InterviewAssessmentCardProps {
  session: ResInterviewSessionDTO;
}

export function InterviewAssessmentCard({ session }: InterviewAssessmentCardProps) {
  const { t, i18n } = useTranslation();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [selectedQuestionIdx, setSelectedQuestionIdx] = useState(0);

  // Allow independent toggle between Vietnamese and English transcripts
  const [viewLanguage, setViewLanguage] = useState<"vi" | "en">(
    i18n.language.startsWith("vi") ? "vi" : "en",
  );

  if (!session || session.status !== "COMPLETED") return null;

  const questions = session.questions || [];
  const currentQ = questions[selectedQuestionIdx];

  const handleSeekToQuestion = (index: number) => {
    setSelectedQuestionIdx(index);
    const startSec = questions[index]?.startTimeSeconds ?? 0;
    if (videoRef.current) {
      videoRef.current.currentTime = startSec;
      videoRef.current.play().catch(() => {});
    }
  };

  const isViView = viewLanguage === "vi";

  // Resolve current bilingual values:
  const resolvedQuestionText = currentQ
    ? (isViView ? currentQ.questionTextVi : currentQ.questionTextEn) ||
      currentQ.questionText
    : "";

  const resolvedTranscript = currentQ
    ? (isViView ? currentQ.transcribedTextVi : currentQ.transcribedTextEn) ||
      currentQ.transcribedText
    : "";

  const resolvedFeedback = currentQ
    ? (isViView ? currentQ.feedbackVi : currentQ.feedbackEn) ||
      currentQ.feedback
    : "";

  const resolvedOverallFeedback =
    (isViView ? session.aiOverallFeedbackVi : session.aiOverallFeedbackEn) ||
    session.aiOverallFeedback;

  return (
    <Card className="overflow-hidden border-slate-200 bg-white p-6 shadow-sm">
      {/* ── TOP HEADER ── */}
      <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
              <Video className="size-3.5" />
              {t("interviewAssessment.badgeTitle", "KẾT QUẢ PHỎNG VẤN AI")}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setViewLanguage(isViView ? "en" : "vi")}
              className="h-7 text-xs text-slate-500 hover:text-slate-800 gap-1 border border-slate-200"
            >
              <Globe2 className="size-3" />
              {isViView ? "EN Version" : "Bản tiếng Việt"}
            </Button>
          </div>

          <h2 className="mt-2 text-xl font-bold text-slate-900">
            {t("interviewAssessment.assessmentTitle", "Đánh giá chi tiết buổi phỏng vấn")}
          </h2>
          {resolvedOverallFeedback && (
            <p className="mt-1 text-sm text-slate-500 max-w-2xl">
              {resolvedOverallFeedback}
            </p>
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-xs font-semibold uppercase text-slate-400">
              {t("interviewAssessment.totalScoreLabel", "ĐIỂM TỔNG KẾT")}
            </span>
          </div>
          <ScoreRing score={Math.round(session.totalScore || 0)} size={14} />
        </div>
      </div>

      {/* ── CONTENT GRID ── */}
      <div className="mt-6 grid gap-6 lg:grid-cols-12">
        {/* CỘT TRÁI: Video Player & Seek Navigation */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          <div className="aspect-video w-full overflow-hidden rounded-xl bg-black shadow">
            {session.mediaRecordUrl ? (
              <video
                ref={videoRef}
                src={session.mediaRecordUrl}
                controls
                className="size-full object-cover"
              />
            ) : (
              <div className="flex size-full items-center justify-center text-slate-500 text-sm">
                Không tìm thấy video ghi hình
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {questions.map((q, idx) => {
              const startSec = q.startTimeSeconds || 0;
              const minutes = Math.floor(startSec / 60);
              const seconds = (startSec % 60).toString().padStart(2, "0");

              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => handleSeekToQuestion(idx)}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                    selectedQuestionIdx === idx
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  <Play className="size-3 fill-current" />
                  {isViView ? "Câu" : "Q"} {idx + 1} ({minutes}:{seconds})
                </button>
              );
            })}
          </div>
        </div>

        {/* CỘT PHẢI: Lời thoại & Bằng chứng chống ảo giác */}
        {currentQ && (
          <div className="lg:col-span-5 flex flex-col justify-between rounded-xl border border-slate-100 bg-slate-50/60 p-5">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="bg-white">
                  {currentQ.category}
                </Badge>
                <div className="flex items-center gap-2">
                  {currentQ.speedFactor !== undefined && currentQ.speedFactor !== null && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500">
                      <Zap className="size-3 text-amber-500" />
                      Speed: {Math.round(currentQ.speedFactor * 100)}%
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 text-sm font-black text-emerald-600">
                    <Award className="size-4" />
                    {Math.round(currentQ.finalScore || 0)} / 100
                  </span>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase text-slate-400">
                  {t("interviewAssessment.questionLabel", "Câu hỏi:")}
                </p>
                <p className="mt-1 text-sm font-bold text-slate-900 leading-snug">
                  {resolvedQuestionText}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase text-slate-400">
                  {t("interviewAssessment.transcriptLabel", "Bản gỡ băng lời nói ứng viên:")}
                </p>
                <p className="mt-1 rounded-lg border border-slate-200/60 bg-white p-3 text-xs leading-relaxed text-slate-700 max-h-32 overflow-y-auto">
                  "{resolvedTranscript || t("interviewAssessment.noSpeechDetected", "Không có dữ liệu âm thanh")}"
                </p>
              </div>

              {currentQ.evidenceQuote && (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50/70 p-3 text-xs text-emerald-900">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                    <Quote className="size-3.5" />
                    {t(
                      "interviewAssessment.evidenceQuoteLabel",
                      "Bằng chứng AI trích dẫn thực tế (Zero-Hallucination):",
                    )}
                  </div>
                  <p className="mt-1 italic leading-relaxed">
                    "{currentQ.evidenceQuote}"
                  </p>
                </div>
              )}

              <div>
                <p className="text-xs font-semibold uppercase text-slate-400">
                  {t("interviewAssessment.aiFeedbackLabel", "Nhận xét của AI:")}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-slate-600">
                  {resolvedFeedback || "-"}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

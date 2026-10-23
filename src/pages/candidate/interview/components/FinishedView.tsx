import { CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

export function FinishedView() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isVi = i18n.language.startsWith("vi");

  return (
    <main className="flex flex-1 items-center justify-center p-6 text-center">
      <div className="max-w-md space-y-6">
        <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
          <CheckCircle2 className="size-10" />
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight">
          {t("interviewRoom.completedTitle", "Hoàn thành buổi phỏng vấn!")}
        </h2>
        <p className="text-sm leading-relaxed text-slate-400">
          {isVi
            ? "Video và câu trả lời của bạn đã được ghi lại thành công. AI đang bóc băng và đánh giá câu trả lời để chuyển đến nhà tuyển dụng."
            : "Your video and responses have been successfully recorded. AI is transcribing and evaluating your answers for the employer."}
        </p>
        <Button
          onClick={() => navigate("/applications")}
          className="w-full bg-slate-800 hover:bg-slate-700 font-semibold cursor-pointer"
        >
          {t("interviewRoom.backBtn", "Quay lại danh sách việc đã nộp")}
        </Button>
      </div>
    </main>
  );
}

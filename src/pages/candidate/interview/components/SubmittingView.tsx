import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

export function SubmittingView() {
  const { i18n } = useTranslation();
  const isVi = i18n.language.startsWith("vi");

  return (
    <main className="flex flex-1 flex-col items-center justify-center p-6 text-center">
      <Loader2 className="size-14 animate-spin text-emerald-400 mb-4" />
      <h2 className="text-2xl font-bold">
        {isVi
          ? "Đang tải video phỏng vấn lên hệ thống..."
          : "Uploading your interview video..."}
      </h2>
      <p className="mt-2 text-sm text-slate-400">
        {isVi
          ? "Vui lòng giữ kết nối và không đóng cửa sổ này."
          : "Please do not close or reload this window."}
      </p>
    </main>
  );
}

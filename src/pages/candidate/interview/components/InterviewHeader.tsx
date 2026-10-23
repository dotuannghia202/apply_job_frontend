import { Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import LanguageSwitch from "@/layouts/components/LanguageSwitch";

interface InterviewHeaderProps {
  sessionId?: string | number;
  isRecording: boolean;
}

export function InterviewHeader({ sessionId, isRecording }: InterviewHeaderProps) {
  const { t } = useTranslation();

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-800/80 px-6 backdrop-blur">
      <div className="flex items-center gap-3">
        <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
          <Sparkles className="size-5" />
        </div>
        <div>
          <h1 className="text-sm font-bold tracking-wide">
            {t("interviewRoom.headerTitle", "PHÒNG PHỎNG VẤN AI")}
          </h1>
          <p className="text-[11px] text-slate-400">Session ID: #{sessionId}</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <LanguageSwitch />
        {isRecording && (
          <div className="flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-400 animate-pulse">
            <span className="size-2 rounded-full bg-red-500" />
            {t("interviewRoom.recLive", "REC LIVE")}
          </div>
        )}
      </div>
    </header>
  );
}

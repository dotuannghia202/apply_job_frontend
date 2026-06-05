import { BadgeCheck, Clock3, MapPin, Send, Heart } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

type JobDetailHeaderProps = {
  title: string;
  salary: string;
  location: string;
  experience: string;
  deadlineLabel: string;
  timeLeftLabel: string;
  isSaved: boolean;
  isApplied: boolean;
  onApply: () => void;
  onToggleSave: () => void;
  isSaving?: boolean;
};

export function JobDetailHeader({
  title,
  salary,
  location,
  experience,
  deadlineLabel,
  timeLeftLabel,
  isSaved,
  isApplied,
  onApply,
  onToggleSave,
  isSaving = false,
}: JobDetailHeaderProps) {
  const { t } = useTranslation();

  return (
    <section className="bg-slate-50 rounded-xl p-6 md:p-8 flex flex-col gap-6 relative shadow-sm border">
      <div className="absolute top-0 right-0 w-24 h-24 linear-to-bl from-primary/20 to-transparent rounded-tr-xl" />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 z-10">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight tracking-tight max-w-3xl">
          {title}
        </h1>
        <BadgeCheck className="text-primary" size={28} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-200">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <span className="text-lg font-semibold">$</span>
          </div>
          <div>
            <p className="text-sm text-slate-500 mb-1">
              {t("jobDetail.header.salary")}
            </p>
            <p className="font-semibold text-slate-900 text-lg">{salary}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <MapPin size={20} />
          </div>
          <div>
            <p className="text-sm text-slate-500 mb-1">
              {t("jobDetail.header.location")}
            </p>
            <p className="font-semibold text-slate-900 text-lg">{location}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Clock3 size={20} />
          </div>
          <div>
            <p className="text-sm text-slate-500 mb-1">
              {t("jobDetail.header.experience")}
            </p>
            <p className="font-semibold text-slate-900 text-lg">{experience}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-4">
        <div className="text-sm text-slate-500">
          {deadlineLabel}{" "}
          <span className="font-semibold text-slate-900">{timeLeftLabel}</span>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <Button
            className="grow md:grow-0 bg-green-500 text-white hover:bg-green-50 hover:border hover:border-green-400 hover:text-green-500 px-8 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 "
            disabled={isApplied}
            onClick={onApply}
          >
            <Send size={18} />
            {isApplied
              ? t("jobDetail.header.applied")
              : t("jobDetail.header.applyNow")}
          </Button>
          <Button
            variant="outline"
            className={`bg-white  py-3 rounded-lg font-medium border  transition-colors flex items-center gap-2 ${isSaved ? "border-rose-200 bg-rose-50 text-rose-500 hover:bg-rose-100 hover:text-rose-600" : "border-green-400 text-green-500 hover:bg-green-50 hover:text-green-600"}`}
            onClick={onToggleSave}
            disabled={isSaving}
          >
            <Heart size={18} className={isSaved ? "fill-current" : undefined} />
            {isSaved
              ? t("jobDetail.header.unsave")
              : t("jobDetail.header.saveJob")}
          </Button>
        </div>
      </div>
    </section>
  );
}

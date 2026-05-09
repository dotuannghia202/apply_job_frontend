import { BadgeCheck, Clock3, MapPin, Send, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

type JobDetailHeaderProps = {
  title: string;
  salary: string;
  location: string;
  experience: string;
  deadlineLabel: string;
  timeLeftLabel: string;
  isSaved: boolean;
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
  onToggleSave,
  isSaving = false,
}: JobDetailHeaderProps) {
  return (
    <section className="bg-slate-50 rounded-xl p-6 md:p-8 flex flex-col gap-6 relative shadow-sm border border-slate-100">
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-primary/20 to-transparent rounded-tr-xl" />
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
            <p className="text-sm text-slate-500 mb-1">Salary</p>
            <p className="font-semibold text-slate-900 text-lg">{salary}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <MapPin size={20} />
          </div>
          <div>
            <p className="text-sm text-slate-500 mb-1">Location</p>
            <p className="font-semibold text-slate-900 text-lg">{location}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Clock3 size={20} />
          </div>
          <div>
            <p className="text-sm text-slate-500 mb-1">Experience</p>
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
          <Button className="flex-grow md:flex-grow-0 bg-gradient-to-r from-primary to-primary-hover text-white px-8 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-sm">
            <Send size={18} />
            Apply now
          </Button>
          <Button
            variant="outline"
            className="bg-white text-slate-800 px-6 py-3 rounded-lg font-medium border border-slate-200 hover:bg-primary-hover/10 hover:text-primary-hover transition-colors flex items-center gap-2"
            onClick={onToggleSave}
            disabled={isSaving}
          >
            <Heart size={18} className={isSaved ? "fill-current" : undefined} />
            {isSaved ? "Saved" : "Save job"}
          </Button>
        </div>
      </div>
    </section>
  );
}

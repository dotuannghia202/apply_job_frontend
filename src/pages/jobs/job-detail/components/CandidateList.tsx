import { Mail, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

const candidates = [
  {
    id: "cand-01",
    name: "Nguyen Quang Huy",
    titleKey: "jobDetail.candidates.items.seniorElectricalTechnician",
    location: "Ha Noi",
    appliedAtKey: "jobDetail.candidates.items.appliedTwoDaysAgo",
    stageKey: "jobDetail.candidates.stages.interview",
    score: "8.6",
    email: "huy.nguyen@email.com",
  },
  {
    id: "cand-02",
    name: "Tran Minh Chau",
    titleKey: "jobDetail.candidates.items.maintenanceEngineer",
    location: "Ha Noi",
    appliedAtKey: "jobDetail.candidates.items.appliedFourDaysAgo",
    stageKey: "jobDetail.candidates.stages.screening",
    score: "7.9",
    email: "chau.tran@email.com",
  },
  {
    id: "cand-03",
    name: "Do Thanh Phong",
    titleKey: "jobDetail.candidates.items.electricalTechnician",
    location: "Hai Phong",
    appliedAtKey: "jobDetail.candidates.items.appliedOneWeekAgo",
    stageKey: "jobDetail.candidates.stages.offer",
    score: "9.2",
    email: "phong.do@email.com",
  },
];

export function CandidateList() {
  const { t } = useTranslation();

  return (
    <section className="bg-white rounded-xl p-6 md:p-8 border border-border">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-900">
            {t("jobDetail.candidates.title")}
          </h3>
          <p className="text-sm text-slate-500">
            {t("jobDetail.candidates.subtitle")}
          </p>
        </div>
        <Button variant="outline" className="border-slate-200">
          {t("jobDetail.candidates.exportList")}
        </Button>
      </div>

      <div className="mt-6 space-y-4">
        {candidates.map((candidate) => (
          <div
            key={candidate.id}
            className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-slate-50/60 p-4 md:flex-row md:items-center md:justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold">
                {candidate.name
                  .split(" ")
                  .map((part) => part[0])
                  .slice(0, 2)
                  .join("")}
              </div>
              <div>
                <p className="font-semibold text-slate-900">{candidate.name}</p>
                <p className="text-sm text-slate-500">
                  {t(candidate.titleKey)}
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <MapPin size={12} />
                    {candidate.location}
                  </span>
                  <span>{t(candidate.appliedAtKey)}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-primary border border-primary/20">
                {t(candidate.stageKey)}
              </span>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 border border-slate-200">
                {t("jobDetail.candidates.score", {
                  score: candidate.score,
                })}
              </span>
              <Button
                variant="outline"
                className="border-slate-200 flex items-center gap-2"
              >
                <Mail size={14} />
                {t("jobDetail.candidates.contact")}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

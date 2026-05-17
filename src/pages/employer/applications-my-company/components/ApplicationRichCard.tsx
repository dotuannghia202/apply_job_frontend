import { CalendarDays, FileText, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ApplicationActionsPopover } from "@/pages/employer/applications-my-company/components/ApplicationActionsPopover";
import { ApplicationStatusBadge } from "@/pages/employer/applications-my-company/components/ApplicationStatusBadge";
import { AiFitScore } from "@/pages/employer/applications-my-company/components/AiFitScore";
import {
  formatApplicationDate,
  getCandidateInitials,
  getMatchScore,
} from "@/pages/employer/applications-my-company/helper";
import type { Application } from "@/types/application";

type ApplicationRichCardProps = {
  application: Application;
};

export function ApplicationRichCard({ application }: ApplicationRichCardProps) {
  const candidateName = application.candidate?.name || "Unknown candidate";
  const candidateEmail = application.candidate?.email || "No email available";
  const jobTitle = application.job?.name || "Untitled role";
  const appliedDate = formatApplicationDate(application.appliedAt);
  const score = getMatchScore(application);
  const resumeUrl = application.resume?.fileUrl ?? "";

  return (
    <Card className="overflow-hidden border-slate-200 bg-white p-0 shadow-[0_16px_42px_rgba(15,23,42,0.05)] transition hover:border-emerald-200 hover:shadow-[0_22px_55px_rgba(15,23,42,0.08)]">
      <div className="grid gap-5 p-5 lg:grid-cols-[minmax(260px,1.25fr)_minmax(220px,1fr)_minmax(180px,0.8fr)_minmax(150px,0.7fr)_minmax(220px,0.9fr)] lg:items-center">
        <div className="flex min-w-0 items-center gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-black text-emerald-700 ring-4 ring-emerald-50">
            {getCandidateInitials(candidateName, candidateEmail)}
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-base font-bold text-slate-950">
              {candidateName}
            </h3>
            <div className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
              <Mail className="size-3.5 shrink-0" aria-hidden="true" />
              <span className="truncate">{candidateEmail}</span>
            </div>
          </div>
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-slate-950">
            {jobTitle}
          </p>
          <div className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
            <CalendarDays className="size-3.5 shrink-0" aria-hidden="true" />
            <span>{appliedDate}</span>
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
            <FileText className="size-3.5 shrink-0" aria-hidden="true" />
            <span className="truncate">
              {application.resume?.fileName || "No CV attached"}
            </span>
          </div>
        </div>

        <AiFitScore score={score} />

        <div>
          <ApplicationStatusBadge status={application.status} />
        </div>

        <div className="flex items-center justify-start gap-2 lg:justify-end">
          <Button
            type="button"
            variant="outline"
            className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800"
            asChild={Boolean(resumeUrl)}
            disabled={!resumeUrl}
          >
            {resumeUrl ? (
              <a href={resumeUrl} target="_blank" rel="noreferrer">
                Review Profile
              </a>
            ) : (
              "Review Profile"
            )}
          </Button>
          <ApplicationActionsPopover application={application} />
        </div>
      </div>
    </Card>
  );
}

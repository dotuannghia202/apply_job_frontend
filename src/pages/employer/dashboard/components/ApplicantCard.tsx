// ApplicantCard.tsx
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import "react-circular-progressbar/dist/styles.css";
import PercentageCircle from "@/components/PercentageCircle";
import type { Application } from "@/types/application";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

interface Props {
  application: Application;
  highlighted?: boolean;
}

const getInitials = (name?: string | null, email?: string | null) => {
  const source = name?.trim() || email?.trim() || "Candidate";
  return source
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
};

const statusClassName: Record<Application["status"], string> = {
  PENDING: "bg-amber-100 text-amber-700",
  REVIEWING: "bg-sky-100 text-sky-700",
  INTERVIEW: "bg-purple-100 text-purple-700",
  ACCEPTED: "bg-emerald-100 text-emerald-700",
  REJECTED: "bg-slate-100 text-slate-600",
};

const normalizeScore = (score?: number | null) => {
  if (typeof score !== "number" || Number.isNaN(score)) return 0;
  return Math.min(100, Math.max(0, Math.round(score)));
};

export function ApplicantCard({ application, highlighted }: Props) {
  const candidateName = application.candidate?.name || "Unknown candidate";
  const candidateEmail = application.candidate?.email || "No email";
  const jobName = application.job?.name || "Unknown job";
  const score = normalizeScore(application.matchScore);
  const resumeUrl = application.resume?.fileUrl;

  return (
    <div
      className={cn(
        "bg-white p-5 rounded-lg shadow-sm border-l-4 transition-all",
        highlighted
          ? "border-primary"
          : "border-transparent hover:border-primary/40",
      )}
    >
      <div className="flex items-center gap-4 mb-4">
        <Avatar className="w-12 h-12">
          <AvatarFallback className="bg-emerald-50 font-bold text-emerald-700">
            {getInitials(candidateName, candidateEmail)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h5 className="font-bold text-[#2d3338] truncate">
            {candidateName}
          </h5>
          <p className="text-xs text-[#596065] truncate">{jobName}</p>
          <p className="text-[11px] text-slate-400 truncate">
            {candidateEmail}
          </p>
        </div>

        <PercentageCircle score={score} />
      </div>

      <Badge
        variant="secondary"
        className={cn(
          "mb-4 rounded-full border-0 text-[10px] font-bold",
          statusClassName[application.status],
        )}
      >
        {application.status}
      </Badge>

      <div className="flex gap-2">
        <Button
          variant="secondary"
          size="sm"
          className="flex-1 text-xs font-bold rounded-xs bg-slate-200 hover:bg-slate-300"
          disabled={!resumeUrl}
          asChild={!!resumeUrl}
        >
          {resumeUrl ? (
            <a href={resumeUrl} target="_blank" rel="noreferrer">
              View CV
            </a>
          ) : (
            "No CV"
          )}
        </Button>
        <Button
          size="sm"
          className="flex-1 text-xs font-bold bg-primary hover:bg-primary-hover text-white rounded-xs"
          asChild
        >
          <Link to="/employer/applicants">Review</Link>
        </Button>
      </div>
    </div>
  );
}

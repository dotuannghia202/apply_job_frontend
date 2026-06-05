import { Calendar, FileText, Link2 } from "lucide-react";
import { Link } from "react-router-dom";

import { useTranslation } from "react-i18next";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import type { ApplicationItem } from "@/pages/candidate/my-applications/components/types";
import ScoreRing from "@/components/PercentageCircle";

const statusStyles = {
  Pending: "bg-chart-4 text-white",
  Reviewing: "bg-secondary text-foreground/70",
  Interview: "bg-primary/15 text-primary",
  Accepted: "bg-emerald-100 text-emerald-700",
  Rejected: "bg-rose-100 text-rose-700",
} as const;

const ApplicationCard = ({ item }: { item: ApplicationItem }) => {
  const { t } = useTranslation();

  return (
    <Card className="flex flex-col gap-6 border-border p-6 shadow-[0_4px_32px_rgba(25,28,25,0.06)] lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-1 items-center gap-4">
        {item.logoUrl ? (
          <img
            src={item.logoUrl}
            alt={t("applicationCard.logoAlt", { company: item.company })}
            className="h-14 w-14 rounded-lg border border-border/50 object-cover"
          />
        ) : (
          <div className="h-14 w-14 rounded-lg bg-secondary" />
        )}
        <div>
          <h3 className="text-[1.375rem] font-bold text-foreground">
            {item.title}
          </h3>
          <p className="text-[14px] text-muted-foreground">
            {item.company} - {item.location}
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" aria-hidden="true" />
          {t("applicationCard.appliedOn")} {item.appliedOn}
        </div>
        <div className="flex items-center gap-2">
          <Link2 className="h-4 w-4 text-primary" aria-hidden="true" />
          {item.resumeUrl ? (
            <a
              href={`https://docs.google.com/viewer?url=${encodeURIComponent(item.resumeUrl)}`}
              className="font-medium text-primary hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              {item.resumeName}
            </a>
          ) : (
            <span className="font-medium text-muted-foreground">
              {item.resumeName}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <FileText className="h-4 w-4" aria-hidden="true" />

          {item.hasCoverLetter || item.coverLetter
            ? t("applicationCard.coverLetterAttached")
            : t("applicationCard.noCoverLetter")}
        </div>
        {item.coverLetter ? (
          <p className="line-clamp-2 text-xs text-muted-foreground">
            {item.coverLetter}
          </p>
        ) : null}
        {(item.candidateName || item.candidateEmail) && (
          <div className="text-xs text-muted-foreground">
            {t("applicationCard.candidate")}{" "}
            {item.candidateName ?? t("applicationCard.unknown")}
            {item.candidateEmail ? ` (${item.candidateEmail})` : ""}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4 flex-1 items-center justify-start">
        <span className="text-muted-foreground text-[1rem]">
          {t("applicationCard.aiFitScore")}
        </span>
        <ScoreRing score={item.fitScore} size={14} />
      </div>

      <div className="flex flex-1 flex-col items-center gap-4">
        <Badge
          className={`uppercase tracking-wider ${
            statusStyles[item.status] ?? "bg-muted text-muted-foreground"
          }`}
        >
          {t(
            `applicationCard.status.${item.status}`,
            item.statusLabel ?? item.status,
          )}
        </Badge>

        <Button asChild variant="default" className="w-full lg:w-auto">
          <Link to={`/applications/${item.id}`}>
            {t("applicationCard.viewDetail")}
          </Link>
        </Button>
      </div>
    </Card>
  );
};

export default ApplicationCard;

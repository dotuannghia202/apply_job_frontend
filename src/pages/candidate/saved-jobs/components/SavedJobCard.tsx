import { Building2, CircleX, Eye, Heart, MapPin, Palette } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { SavedJob } from "@/pages/candidate/saved-jobs/components/types";

const logoFallbackStyles = {
  building: "bg-secondary text-primary",
  creative: "bg-primary/15 text-primary",
};

type SavedJobCardProps = {
  job: SavedJob;
  isUnsaving?: boolean;
  onUnsave?: (jobId: string) => void;
};

const SavedJobCard = ({ job, isUnsaving, onUnsave }: SavedJobCardProps) => (
  <Card
    className={`group flex flex-col items-start justify-between gap-6 border-border p-6 shadow-[0_4px_32px_rgba(25,28,25,0.06)] transition-all duration-300 hover:shadow-[0_8px_40px_rgba(25,28,25,0.08)] sm:flex-row sm:items-center ${
      job.isClosed ? "bg-secondary/40" : "bg-card"
    }`}
  >
    <div className="flex w-full flex-1 items-start gap-4">
      {job.logoUrl ? (
        <img
          src={job.logoUrl}
          alt={job.logoAlt ?? `${job.company} logo`}
          className="h-16 w-16 rounded-lg border border-border/50 object-cover"
        />
      ) : (
        <div
          className={`flex h-16 w-16 items-center justify-center rounded-lg border border-border/40 ${
            job.logoFallback
              ? logoFallbackStyles[job.logoFallback]
              : "bg-secondary"
          }`}
        >
          {job.logoFallback === "creative" ? (
            <Palette className="h-8 w-8" aria-hidden="true" />
          ) : (
            <Building2 className="h-8 w-8" aria-hidden="true" />
          )}
        </div>
      )}
      <div className={job.isClosed ? "opacity-70" : undefined}>
        <span className="text-sm text-muted-foreground">{job.company}</span>
        <h3 className="mt-1 text-xl font-bold text-foreground group-hover:underline">
          {job.title}
        </h3>
        <div className="mt-2 flex flex-wrap items-center gap-4">
          <span className="text-base font-bold text-primary">{job.salary}</span>
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="mr-1 h-4 w-4" aria-hidden="true" />
            {job.location}
          </div>
        </div>
      </div>
    </div>

    <div className="flex w-full flex-col gap-4 sm:w-auto sm:items-end">
      {job.isClosed ? (
        <span className="flex items-center gap-2 text-sm font-semibold text-destructive">
          <CircleX className="h-4 w-4" aria-hidden="true" />
          Job closed
        </span>
      ) : (
        <span className="text-sm font-medium text-primary">
          {job.daysLeft} days left to apply
        </span>
      )}
      <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
        <Button
          asChild
          variant="outline"
          className="w-full whitespace-nowrap sm:w-auto"
        >
          <Link to={`/jobs/detail/${job.id}`}>
            <Eye className="mr-2 h-4 w-4" aria-hidden="true" />
            View details
          </Link>
        </Button>

        <div className="flex w-full items-center gap-3 sm:w-auto">
          <Button
            asChild={!job.isClosed && !job.isApplied}
            className="flex-1 whitespace-nowrap bg-gradient-to-r from-primary to-primary/70 text-primary-foreground sm:flex-none"
            disabled={job.isClosed || job.isApplied}
          >
            {job.isApplied ? (
              "Applied"
            ) : job.isClosed ? (
              "Apply now"
            ) : (
              <Link to={`/jobs/detail/${job.id}`}>Apply now</Link>
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive"
            aria-label="Unsave job"
            disabled={isUnsaving}
            onClick={() => onUnsave?.(job.id)}
          >
            <Heart className="h-4 w-4" fill="currentColor" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  </Card>
);

export default SavedJobCard;

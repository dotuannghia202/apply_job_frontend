import { Mail, MapPin, UserRound } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { CandidateProfile } from "@/pages/candidate/my-applications/components/types";

const statusToneStyles = {
  active: "bg-primary/15 text-primary",
  open: "bg-secondary text-foreground/70",
  hired: "bg-emerald-100 text-emerald-700",
} as const;

const CandidateProfileCard = ({ profile }: { profile: CandidateProfile }) => (
  <Card className="flex flex-col gap-6 border-border p-6 shadow-[0_12px_40px_rgba(25,28,25,0.08)]">
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="flex items-center gap-4">
        {profile.avatarUrl ? (
          <img
            src={profile.avatarUrl}
            alt={profile.name}
            className="h-20 w-20 rounded-2xl border border-border/50 object-cover"
          />
        ) : (
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-secondary text-primary">
            <UserRound className="h-10 w-10" aria-hidden="true" />
          </div>
        )}
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Candidate profile
          </p>
          <h1 className="text-2xl font-bold text-foreground">{profile.name}</h1>
          <p className="text-base text-muted-foreground">{profile.title}</p>
          <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" aria-hidden="true" />
            {profile.location}
          </div>
        </div>
      </div>

      <Badge
        className={`uppercase tracking-wider ${
          statusToneStyles[profile.statusTone] ??
          "bg-secondary text-foreground/70"
        }`}
      >
        {profile.statusLabel}
      </Badge>
    </div>

    <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
      <div className="rounded-full bg-secondary px-4 py-1.5">
        {profile.experienceYears}+ years experience
      </div>
      <div className="rounded-full bg-secondary px-4 py-1.5">
        {profile.noticePeriod}
      </div>
      <div className="rounded-full bg-secondary px-4 py-1.5">
        {profile.availability}
      </div>
    </div>

    <div className="flex flex-wrap gap-3">
      <Button className="gap-2">
        <Mail className="h-4 w-4" aria-hidden="true" />
        Contact
      </Button>
      <Button variant="secondary">Download CV</Button>
    </div>
  </Card>
);

export default CandidateProfileCard;

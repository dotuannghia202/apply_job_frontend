import { MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Card } from "@/components/ui/card";
import type { CandidateProfile } from "@/pages/candidate/my-applications/components/types";

const CandidateProfileCard = ({
  profile,
  cvUrl,
}: {
  profile: CandidateProfile;
  cvUrl: string;
}) => {
  const { t } = useTranslation();

  return (
    <Card className="flex flex-col gap-6 border-border p-6 shadow-[0_12px_40px_rgba(25,28,25,0.08)]">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded border border-border bg-white text-primary shadow-sm">
            <div className="absolute inset-0 z-10 bg-transparent" />

            <iframe
              src={`${cvUrl}#toolbar=0&navpanes=0&scrollbar=0&view=Fit`}
              title={t("myCVManagement.detail.profile.previewTitle")}
              className="pointer-events-none absolute left-0 top-0 h-[565%] w-[400%] origin-top-left scale-[0.25] border-none"
            />
          </div>

          <div>
            <h1 className="text-xl font-bold text-foreground">
              {profile.name}
            </h1>
            <p className="text-base text-muted-foreground">{profile.title}</p>
            <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" aria-hidden="true" />
              {profile.location}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
        <div className="rounded-full bg-secondary px-4 py-1.5">
          {t("myCVManagement.detail.profile.yearsExperience", {
            count: profile.experienceYears,
          })}
        </div>
        <div className="rounded-full bg-secondary px-4 py-1.5">
          {profile.noticePeriod}
        </div>
        <div className="rounded-full bg-secondary px-4 py-1.5">
          {profile.availability}
        </div>
      </div>
    </Card>
  );
};

export default CandidateProfileCard;

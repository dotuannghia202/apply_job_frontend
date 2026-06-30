import { Heart } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import type { Job } from "@/types/job";
import { formatSalaryRange, getCityFromAddress } from "../../helper";
import { JobPopup } from "@/pages/jobs/list-jobs/components/JobPopup";
import { useToggleSaveJob } from "@/api/users/user.queries";
import { ApplyJobModal } from "@/pages/jobs/components/ApplyJobModal";
import { NotificationPopup } from "@/components/NotificationPopup";
import { useAuthStore } from "@/store/auth.store";

type JobCardViewMode = "grid" | "list";

interface JobCardProps {
  job: Job;
  viewMode?: JobCardViewMode;
}

const JobCard = ({ job, viewMode = "grid" }: JobCardProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const anchorRef = useRef<HTMLElement | null>(null);
  const closeTimerRef = useRef<number | null>(null);
  const openTimerRef = useRef<number | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isAuthNoticeOpen, setIsAuthNoticeOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(job.isSaved);
  const toggleSaveMutation = useToggleSaveJob();

  const OPEN_DELAY_MS = 400;

  const companyName = job.company?.name ?? "Unknown";
  const companyLogo = job.company?.logo;
  const salaryText = formatSalaryRange(job.minSalary, job.maxSalary);
  const isSaving = toggleSaveMutation.isPending;

  useEffect(() => {
    setIsSaved(job.isSaved);
  }, [job.isSaved]);

  const handleToggleSave = async () => {
    if (!isAuthenticated) {
      setIsAuthNoticeOpen(true);
      return;
    }
    if (isSaving) return;

    try {
      const response = await toggleSaveMutation.mutateAsync(job.id);
      setIsSaved(Boolean(response.data));
    } catch (error) {
      console.error("Failed to toggle saved job", error);
    }
  };

  const openPopup = () => {
    if (openTimerRef.current) {
      window.clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setIsPopupOpen(true);
  };

  const scheduleOpenPopup = () => {
    if (isPopupOpen) return;

    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }

    if (openTimerRef.current) {
      window.clearTimeout(openTimerRef.current);
    }

    openTimerRef.current = window.setTimeout(() => {
      setIsPopupOpen(true);
      openTimerRef.current = null;
    }, OPEN_DELAY_MS);
  };

  const scheduleClosePopup = () => {
    if (openTimerRef.current) {
      window.clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
    }
    closeTimerRef.current = window.setTimeout(() => {
      setIsPopupOpen(false);
      closeTimerRef.current = null;
    }, 120);
  };

  const closePopup = () => {
    if (openTimerRef.current) {
      window.clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setIsPopupOpen(false);
  };

  const openApplyModal = () => {
    if (!isAuthenticated) {
      closePopup();
      setIsAuthNoticeOpen(true);
      return;
    }
    if (job.isApplied) return;

    closePopup();
    setIsApplyModalOpen(true);
  };

  return (
    <>
      <article
        ref={anchorRef}
        onMouseEnter={scheduleOpenPopup}
        onMouseLeave={scheduleClosePopup}
        className={cn(
          "flex rounded-2xl border bg-white shadow-sm transition-shadow hover:shadow-md",
          viewMode === "list"
            ? "items-start gap-6 p-5"
            : "items-center gap-4 p-4",
        )}
      >
        {/* Logo */}
        <div
          className={cn(
            "flex shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5",
            viewMode === "list" ? "size-20" : "size-16",
          )}
        >
          {companyLogo ? (
            <img
              src={companyLogo}
              alt={`${companyName} logo`}
              className="size-full object-contain"
            />
          ) : (
            <span className="text-lg font-bold text-slate-600">
              {companyName.slice(0, 1).toUpperCase()}
            </span>
          )}
        </div>

        {/* Content */}
        {viewMode === "list" ? (
          <div className="flex flex-col md:flex-row min-w-0 flex-1 items-center justify-start gap-6">
            <div className="min-w-[320px]">
              <div className="flex flex-wrap items-center gap-1.5">
                {/* {job.active && (
                  <Badge className="rounded-full bg-rose-600 px-2 py-0.5 text-[10px] font-bold text-white hover:bg-rose-600">
                    HOT
                  </Badge>
                )} */}
                <h3
                  className="min-w-0 flex-1 text-[15px] font-bold leading-snug text-slate-900"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                  title={job.name}
                >
                  {job.name}
                </h3>
              </div>
              <p
                className="mt-0.5 truncate text-[11.5px] font-medium uppercase tracking-wide text-slate-400"
                title={companyName}
              >
                {companyName}
              </p>
            </div>

            <div className="flex shrink-0 flex-col items-start gap-2 md:min-w-[220px]">
              <Badge
                variant="secondary"
                className="rounded-full bg-slate-100 px-4 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                {salaryText}
              </Badge>
              <Badge
                variant="secondary"
                className="rounded-full bg-slate-100 px-4 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                {getCityFromAddress(job.location)}
              </Badge>
            </div>
          </div>
        ) : (
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-3">
              <div className="min-w-0 flex-1">
                {/* HOT badge + Title */}
                <div className="flex flex-wrap items-center gap-1.5">
                  {/* {job.active && (
                    <Badge className="rounded-full bg-rose-600 px-2 py-0.5 text-[10px] font-bold text-white hover:bg-rose-600">
                      HOT
                    </Badge>
                  )} */}
                  <h3
                    className="min-w-0 flex-1 text-[15px] font-bold leading-snug text-slate-900"
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                    title={job.name}
                  >
                    {job.name}
                  </h3>
                </div>

                {/* Company name */}
                <p
                  className="mt-0.5 truncate text-[11.5px] font-medium uppercase tracking-wide text-slate-400"
                  title={companyName}
                >
                  {companyName}
                </p>
              </div>

              {/* Heart button */}
              <Button
                variant="ghost"
                size="icon"
                aria-label={`${isSaved ? "Unsave" : "Save"} ${job.name}`}
                disabled={isSaving}
                className={cn(
                  "size-9 shrink-0 rounded-full border transition-colors",
                  isSaved
                    ? "border-rose-200 bg-rose-50 text-rose-500 hover:bg-rose-100 hover:text-rose-600"
                    : "border-green-400 text-green-500 hover:bg-green-50 hover:text-green-600",
                )}
                onClick={handleToggleSave}
              >
                <Heart className={cn("size-4", isSaved && "fill-current")} />
              </Button>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <Badge
                variant="secondary"
                className="rounded-full bg-slate-100 px-4 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                {salaryText}
              </Badge>
              <Badge
                variant="secondary"
                className="rounded-full bg-slate-100 px-4 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                {getCityFromAddress(job.location)}
              </Badge>
            </div>
          </div>
        )}

        {viewMode === "list" ? (
          <Button
            variant="ghost"
            size="icon"
            aria-label={`${isSaved ? "Unsave" : "Save"} ${job.name}`}
            disabled={isSaving}
            className={cn(
              "size-9 shrink-0 rounded-full border transition-colors",
              isSaved
                ? "border-rose-200 bg-rose-50 text-rose-500 hover:bg-rose-100 hover:text-rose-600"
                : "border-green-400 text-green-500 hover:bg-green-50 hover:text-green-600",
            )}
            onClick={handleToggleSave}
          >
            <Heart className={cn("size-4", isSaved && "fill-current")} />
          </Button>
        ) : null}
      </article>

      {isPopupOpen && anchorRef.current ? (
        <JobPopup
          job={job}
          anchorRef={anchorRef}
          onClose={closePopup}
          onApply={openApplyModal}
          onMouseEnter={openPopup}
          onMouseLeave={scheduleClosePopup}
        />
      ) : null}

      {isApplyModalOpen ? (
        <ApplyJobModal
          job={job}
          open={isApplyModalOpen}
          onClose={() => setIsApplyModalOpen(false)}
        />
      ) : null}

      {isAuthNoticeOpen && (
        <NotificationPopup
          open={isAuthNoticeOpen}
          variant="confirm"
          title={t("authNotice.title")}
          message={t("authNotice.message")}
          confirmLabel={t("authNotice.loginBtn")}
          cancelLabel={t("authNotice.cancelBtn")}
          onConfirm={() => {
            setIsAuthNoticeOpen(false);
            navigate("/login");
          }}
          onCancel={() => setIsAuthNoticeOpen(false)}
          onDismiss={() => setIsAuthNoticeOpen(false)}
        />
      )}
    </>
  );
};

export default JobCard;

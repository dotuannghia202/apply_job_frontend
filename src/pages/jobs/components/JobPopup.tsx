import { useEffect, useRef } from "react";
import type { RefObject } from "react";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

import type { Job } from "@/types/job";
import { formatVND, getCityFromAddress } from "../helper";

interface JobPopupProps {
  job: Job;
  anchorRef: RefObject<HTMLElement | null>;
  onClose: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}
export const JobPopup = ({
  job,
  anchorRef,
  onClose,
  onMouseEnter,
  onMouseLeave,
}: JobPopupProps) => {
  const popupRef = useRef<HTMLDivElement>(null);
  const companyName = job.company?.name ?? "Unknown";
  const companyLogo = job.company?.logo;
  const salaryText = formatVND(job.salary);
  const city = getCityFromAddress(job.location);
  const specialization = job.specialization?.name;
  const levelsText = job.levels?.length ? job.levels.join(", ") : undefined;

  useEffect(() => {
    const popup = popupRef.current;
    const anchor = anchorRef.current;
    if (!popup || !anchor) return;

    let rafId = 0;

    const updatePosition = () => {
      const popupEl = popupRef.current;
      const anchorEl = anchorRef.current;
      if (!popupEl || !anchorEl) return;

      const anchorRect = anchorEl.getBoundingClientRect();
      const popupRect = popupEl.getBoundingClientRect();

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const gutter = 12;
      const safe = 16;

      const spaceRight = viewportWidth - anchorRect.right;
      const preferRight = spaceRight >= popupRect.width + gutter;

      const left = preferRight
        ? anchorRect.right + gutter
        : anchorRect.left - popupRect.width - gutter;

      const top = anchorRect.top;

      const clampedLeft = Math.min(
        Math.max(left, safe),
        viewportWidth - popupRect.width - safe,
      );
      const clampedTop = Math.min(
        Math.max(top, safe),
        viewportHeight - popupRect.height - safe,
      );

      popupEl.style.left = `${clampedLeft}px`;
      popupEl.style.top = `${clampedTop}px`;
    };

    rafId = window.requestAnimationFrame(updatePosition);
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [anchorRef, job.id]);

  return (
    <>
      <div
        ref={popupRef}
        role="dialog"
        aria-label={job.name}
        className="fixed z-50 flex w-95 flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        style={{ maxHeight: "calc(100vh - 32px)" }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave ?? onClose}
      >
        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">
          {/* Header */}
          <div className="p-5 pb-4">
            <div className="flex items-start gap-4">
              {/* Logo */}
              <div className="flex size-18 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white p-1">
                {companyLogo ? (
                  <img
                    src={companyLogo}
                    alt={`${companyName} logo`}
                    className="size-full object-contain"
                  />
                ) : (
                  <span className="text-2xl font-bold text-slate-600">
                    {companyName.slice(0, 1).toUpperCase()}
                  </span>
                )}
              </div>

              {/* Title block */}
              <div className="min-w-0 flex-1">
                <h2 className="text-[15px] font-bold leading-snug text-slate-900">
                  {job.name}
                </h2>
                <p className="mt-1 text-sm text-slate-500">{companyName}</p>
                <p className="mt-1.5 text-base font-bold text-green-600">
                  {salaryText}
                </p>
              </div>
            </div>

            {/* Meta badges */}
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600">
                <MapPin className="size-3.5 shrink-0 text-slate-400" />
                {city}
              </span>
              {specialization ? (
                <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600">
                  {specialization}
                </span>
              ) : null}
              {levelsText ? (
                <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600">
                  {levelsText}
                </span>
              ) : null}
            </div>
          </div>

          <div className="h-px bg-slate-100" />

          {/* Job description */}
          {job.description && (
            <div className="px-5 py-4">
              <h3 className="mb-3 flex items-center gap-2 text-[15px] font-bold text-slate-900">
                <span className="h-5 w-1 rounded-full bg-green-500" />
                Mô tả công việc
              </h3>
              <p className="text-sm leading-relaxed text-slate-700 whitespace-pre-line">
                {job.description}
              </p>
            </div>
          )}

          {/* Extra bottom padding so last content isn't hidden behind buttons */}
          <div className="h-4" />
        </div>

        {/* Sticky footer buttons */}
        <div className="border-t border-slate-100 bg-white p-4">
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1 rounded-xl border-green-500 font-semibold text-green-600 hover:bg-green-50 hover:text-green-700"
              onClick={() => {
                /* handle apply */
              }}
            >
              Ứng tuyển
            </Button>
            <Button
              className="flex-1 rounded-xl bg-green-500 font-semibold text-white hover:bg-green-600"
              onClick={() => {
                /* handle view detail */
              }}
            >
              Xem chi tiết
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

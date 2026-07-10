import { ArrowUpRight, FileText } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Card } from "@/components/ui/card";

interface ApplicationDocumentsCardProps {
  cvFileName?: string | null;
  cvFileUrl?: string | null;
  coverLetter?: string | null;
  role: "candidate" | "employer";
}

export function ApplicationDocumentsCard({
  cvFileName,
  cvFileUrl,
  coverLetter,
  role,
}: ApplicationDocumentsCardProps) {
  const { t } = useTranslation();
  const isCandidate = role === "candidate";

  const titleText = isCandidate
    ? t("myApplications.detail.documents.title")
    : t("employerApplications.documents.title", "Tài liệu ứng tuyển");

  const descriptionText = isCandidate
    ? t("myApplications.detail.documents.description")
    : t(
        "employerApplications.documents.description",
        "CV đính kèm và thư giới thiệu từ ứng viên.",
      );

  const cvLabel = isCandidate
    ? t("myApplications.detail.documents.pdfResume")
    : t("employerApplications.documents.pdfResume", "CV định dạng PDF");

  const viewFileText = t("myApplications.detail.documents.viewFile");
  const noFileUrlText = t("myApplications.detail.fallbacks.noFileUrl");

  const coverLetterTitle = isCandidate
    ? t("myApplications.detail.documents.coverLetter")
    : t(
        "employerApplications.documents.coverLetter",
        "Thư xin việc (Cover Letter)",
      );

  const noCoverLetterText = isCandidate
    ? t("myApplications.detail.documents.noCoverLetter")
    : t(
        "employerApplications.documents.noCoverLetter",
        "Ứng viên không gửi kèm thư ứng tuyển.",
      );

  const finalCvFileName =
    cvFileName || t("myApplications.detail.fallbacks.resume");

  return (
    <Card className="border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-slate-950">
          {titleText}
        </h2>
        <p className="mt-1 text-sm text-slate-500">{descriptionText}</p>
      </div>

      <div className="mt-2 rounded-xl border border-slate-200 bg-slate-50/80 p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-lg border border-red-100 bg-red-50 text-red-600">
              <FileText className="size-5" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-950">
                {finalCvFileName}
              </p>
              <p className="text-xs text-slate-500">{cvLabel}</p>
            </div>
          </div>

          {cvFileUrl ? (
            <a
              href={`https://docs.google.com/viewer?url=${encodeURIComponent(
                cvFileUrl,
              )}`}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-green-600 transition hover:text-green-700"
              target="_blank"
              rel="noreferrer"
            >
              {viewFileText}
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </a>
          ) : (
            <span className="text-sm font-medium text-slate-400">
              {noFileUrlText}
            </span>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <h3 className="text-sm font-bold uppercase text-slate-500">
          {coverLetterTitle}
        </h3>
        <p className="mt-3 text-sm leading-7 text-slate-700">
          {coverLetter || noCoverLetterText}
        </p>
      </div>
    </Card>
  );
}

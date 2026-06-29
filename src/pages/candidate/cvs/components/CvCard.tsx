import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Star, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useDeleteResume, useSetDefaultResume } from "@/api/resumes/resume.queries";
import CvActions from "@/pages/candidate/cvs/components/CvActions";
import type { CvItem } from "@/pages/candidate/cvs/components/types";

const downloadFile = (url: string, fileName: string) => {
  const link = document.createElement("a");
  link.href = `https://docs.google.com/viewer?url=${encodeURIComponent(url)}`;
  link.download = fileName;
  link.target = "_blank";
  link.rel = "noreferrer";
  document.body.appendChild(link);
  link.click();
  link.remove();
};

const CvCard = ({ item }: { item: CvItem }) => {
  const { t } = useTranslation();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const setDefaultResumeMutation = useSetDefaultResume();
  const deleteResumeMutation = useDeleteResume();
  const resumeId = Number(item.id);
  const isValidResumeId = Number.isFinite(resumeId);

  // console.log("Rendering CvCard with item:", item);

  const handleDownload = () => {
    if (!item.fileUrl) return;
    downloadFile(item.fileUrl, item.fileName);
  };

  const handleSetDefault = () => {
    if (!isValidResumeId || item.isDefault || setDefaultResumeMutation.isPending) {
      return;
    }

    setDefaultResumeMutation.mutate(resumeId);
  };

  const handleDelete = () => {
    if (!isValidResumeId || deleteResumeMutation.isPending) return;

    setDeleteError("");
    deleteResumeMutation.mutate(resumeId, {
      onSuccess: () => setIsDeleteOpen(false),
      onError: () => {
        setDeleteError(t("myCVManagement.card.deleteError"));
      },
    });
  };

  return (
    <>
      <Card className="h-full border-border shadow-[0_4px_24px_rgba(15,23,42,0.04)] transition-shadow duration-300 hover:shadow-[0_8px_32px_rgba(15,23,42,0.08)]">
        <CardContent className="flex h-full flex-1 flex-col gap-6">
          <div className="flex items-start gap-4">
            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-white shadow-sm">
              {/* Lớp phủ tàng hình chặn click */}
              <div className="absolute inset-0 z-10 bg-transparent" />

              <iframe
                src={`${item.fileUrl}#toolbar=0&navpanes=0&scrollbar=0&view=Fit`}
                className="absolute left-0 top-0 w-[400%] h-[565%] origin-top-left scale-[0.25] pointer-events-none border-none"
                title={t("myCVManagement.card.previewTitle", {
                  fileName: item.fileName,
                })}
              />
            </div>
            <div className="min-w-0 flex-1">
              <h3
                className="truncate text-base font-medium text-foreground"
                title={item.fileName}
              >
                {item.fileName}
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                {t("myCVManagement.card.updated", {
                  date: item.updatedAt,
                })}
              </p>
            </div>
          </div>

          <div className="flex-1">
            <p className="mb-3 text-[14px] text-muted-foreground">
              {t("myCVManagement.card.skillsTitle")}
            </p>
            <div className="flex flex-wrap gap-2">
              {item.skills.map((skill) => (
                <Badge
                  key={`${item.id}-${skill}`}
                  className="rounded-full bg-primary/10 text-primary"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          {item.isDefault ? (
            <Badge className="w-fit gap-1.5 bg-amber-50 border border-amber-200 px-3 py-1 text-amber-700 font-semibold shadow-none hover:bg-amber-50">
              <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" aria-hidden="true" />
              {t("myCVManagement.card.defaultCv")}
            </Badge>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="w-fit gap-1.5 text-muted-foreground hover:text-primary border-border h-7 px-3 py-1"
              disabled={setDefaultResumeMutation.isPending}
              onClick={handleSetDefault}
            >
              <Star className="h-3.5 w-3.5" aria-hidden="true" />
              {setDefaultResumeMutation.isPending
                ? t("myCVManagement.card.actions.saving")
                : t("myCVManagement.card.actions.setDefault")}
            </Button>
          )}
        </CardContent>
        <CardFooter className="justify-between border-t border-border">
          <CvActions
            item={item}
            onDownload={handleDownload}
          />
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive hover:bg-destructive/15 hover:text-destructive"
            title={t("myCVManagement.card.actions.delete")}
            type="button"
            disabled={deleteResumeMutation.isPending}
            onClick={() => setIsDeleteOpen(true)}
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
          </Button>
        </CardFooter>
      </Card>

      {isDeleteOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby={`delete-cv-title-${item.id}`}
        >
          <div className="w-full max-w-md rounded-xl border border-border bg-white p-6 shadow-2xl">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-destructive/15 text-destructive">
                <Trash2 className="h-5 w-5" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <h2
                  id={`delete-cv-title-${item.id}`}
                  className="text-lg font-semibold text-foreground"
                >
                  {t("myCVManagement.card.deleteTitle")}
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {t("myCVManagement.card.deleteDescription", {
                    fileName: item.fileName,
                  })}
                </p>
              </div>
            </div>

            {deleteError ? (
              <p className="mt-4 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {deleteError}
              </p>
            ) : null}

            <div className="mt-6 flex justify-end gap-3">
              <Button
                variant="outline"
                type="button"
                disabled={deleteResumeMutation.isPending}
                onClick={() => setIsDeleteOpen(false)}
              >
                {t("myCVManagement.card.actions.cancel")}
              </Button>
              <Button
                variant="destructive"
                type="button"
                disabled={deleteResumeMutation.isPending}
                onClick={handleDelete}
              >
                {deleteResumeMutation.isPending
                  ? t("myCVManagement.card.actions.deleting")
                  : t("myCVManagement.card.actions.deleteCv")}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default CvCard;

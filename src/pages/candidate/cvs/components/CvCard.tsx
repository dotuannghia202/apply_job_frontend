import { useState } from "react";
import { FileText, Star, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  useDeleteResume,
  useUpdateResume,
} from "@/api/resumes/resume.queries";
import CvActions from "@/pages/candidate/cvs/components/CvActions";
import type { CvItem } from "@/pages/candidate/cvs/components/types";

const downloadFile = (url: string, fileName: string) => {
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.target = "_blank";
  link.rel = "noreferrer";
  document.body.appendChild(link);
  link.click();
  link.remove();
};

const CvCard = ({ item }: { item: CvItem }) => {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const updateResumeMutation = useUpdateResume();
  const deleteResumeMutation = useDeleteResume();
  const resumeId = Number(item.id);
  const isValidResumeId = Number.isFinite(resumeId);

  const handleDownload = () => {
    if (!item.fileUrl) return;
    downloadFile(item.fileUrl, item.fileName);
  };

  const handleSetDefault = () => {
    if (!isValidResumeId || item.isDefault || updateResumeMutation.isPending) {
      return;
    }

    updateResumeMutation.mutate({
      id: resumeId,
      data: {
        active: true,
      },
    });
  };

  const handleDelete = () => {
    if (!isValidResumeId || deleteResumeMutation.isPending) return;

    setDeleteError("");
    deleteResumeMutation.mutate(resumeId, {
      onSuccess: () => setIsDeleteOpen(false),
      onError: () => {
        setDeleteError("Unable to delete this CV. Please try again.");
      },
    });
  };

  return (
    <>
      <Card className="h-full border-border shadow-[0_4px_24px_rgba(15,23,42,0.04)] transition-shadow duration-300 hover:shadow-[0_8px_32px_rgba(15,23,42,0.08)]">
        <CardContent className="flex h-full flex-1 flex-col gap-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-destructive/15 text-destructive">
              <FileText className="h-5 w-5" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <h3
                className="truncate text-base font-medium text-foreground"
                title={item.fileName}
              >
                {item.fileName}
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Updated: {item.updatedAt}
              </p>
            </div>
          </div>

          <div className="flex-1">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.05em] text-muted-foreground">
              AI skill analysis
            </p>
            <div className="flex flex-wrap gap-2">
              {item.skills.map((skill) => (
                <Badge
                  key={`${item.id}-${skill}`}
                  variant="secondary"
                  className="rounded-full bg-secondary text-muted-foreground"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          {item.isDefault ? (
            <Badge className="w-fit gap-1.5 bg-primary/10 px-3 py-1 text-primary">
              <Star className="h-3.5 w-3.5" aria-hidden="true" />
              Default CV
            </Badge>
          ) : (
            <div className="h-6" />
          )}
        </CardContent>
        <CardFooter className="mt-auto justify-between border-t border-border pt-4">
          <CvActions
            item={item}
            isUpdating={updateResumeMutation.isPending}
            onDownload={handleDownload}
            onSetDefault={handleSetDefault}
          />
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:bg-destructive/15 hover:text-destructive"
            title="Delete"
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
                  Are you sure you want to delete this CV?
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  This action cannot be undone. The CV "{item.fileName}" will be
                  permanently removed.
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
                Cancel
              </Button>
              <Button
                variant="destructive"
                type="button"
                disabled={deleteResumeMutation.isPending}
                onClick={handleDelete}
              >
                {deleteResumeMutation.isPending ? "Deleting..." : "Delete CV"}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default CvCard;

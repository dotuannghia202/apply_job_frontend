import axios from "axios";
import {
  FileText,
  LoaderCircle,
  Star,
  UploadCloud,
  X,
} from "lucide-react";
import {
  useEffect,
  useId,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";

import { useCreateApplication } from "@/api/applications/application.queries";
import { uploadResumeFile } from "@/api/files/file.api";
import {
  useCreateResume,
  useGetMyResumes,
} from "@/api/resumes/resume.queries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { Job } from "@/types/job";

type ApplyMessage = {
  type: "success" | "error";
  text: string;
};

type ApplyJobModalProps = {
  job: Job;
  open: boolean;
  onClose: () => void;
};

const getApiErrorMessage = (
  error: unknown,
  fallbackMessage: string,
): string => {
  if (axios.isAxiosError<{ message?: string | string[] }>(error)) {
    const message = error.response?.data?.message;

    if (Array.isArray(message)) {
      return message.join(" ");
    }

    if (message) {
      return message;
    }
  }

  return fallbackMessage;
};

const formatResumeDate = (value?: string | null) => {
  if (!value) return "No update date";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-GB").format(date);
};

export function ApplyJobModal({ job, open, onClose }: ApplyJobModalProps) {
  const titleId = useId();
  const fileInputId = useId();
  const coverLetterId = useId();
  const myResumesQuery = useGetMyResumes();
  const createApplicationMutation = useCreateApplication();
  const createResumeMutation = useCreateResume();
  const [selectedResumeId, setSelectedResumeId] = useState<number | null>(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [message, setMessage] = useState<ApplyMessage | null>(null);
  const [isUploadingResume, setIsUploadingResume] = useState(false);

  const resumes = myResumesQuery.data?.data ?? [];
  const isSubmitting = createApplicationMutation.isPending;
  const isLoadingResumes = myResumesQuery.isLoading || myResumesQuery.isFetching;
  const isBusy =
    isSubmitting || isUploadingResume || createResumeMutation.isPending;

  useEffect(() => {
    if (!open) return;

    setSelectedResumeId(null);
    setCoverLetter("");
    setMessage(null);
  }, [job.id, open]);

  useEffect(() => {
    if (!open) return;

    const currentSelectionStillExists = resumes.some(
      (resume) => resume.id === selectedResumeId,
    );

    if (currentSelectionStillExists) return;

    const defaultResume = resumes.find((resume) => resume.active) ?? resumes[0];
    setSelectedResumeId(defaultResume?.id ?? null);
  }, [open, resumes, selectedResumeId]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isBusy) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isBusy, onClose, open]);

  if (!open) {
    return null;
  }

  const handleUploadResume = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    const isPdf =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      setMessage({
        type: "error",
        text: "Please upload a PDF CV.",
      });
      return;
    }

    setIsUploadingResume(true);
    setMessage(null);

    try {
      const uploadResponse = await uploadResumeFile(file);
      const fileUrl = uploadResponse.data?.filePath;

      if (!fileUrl) {
        throw new Error("Upload CV failed");
      }

      const createResponse = await createResumeMutation.mutateAsync({
        fileName: file.name,
        fileUrl,
      });

      await myResumesQuery.refetch();

      if (createResponse.data) {
        setSelectedResumeId(createResponse.data.id);
      }

      setMessage({
        type: "success",
        text: "CV uploaded and selected.",
      });
    } catch (error) {
      console.error("Failed to upload CV", error);
      setMessage({
        type: "error",
        text: getApiErrorMessage(
          error,
          "Failed to upload your CV. Please try again.",
        ),
      });
    } finally {
      setIsUploadingResume(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedResumeId) {
      setMessage({
        type: "error",
        text: "Please select a CV before submitting.",
      });
      return;
    }

    const trimmedCoverLetter = coverLetter.trim();

    setMessage(null);

    try {
      await createApplicationMutation.mutateAsync({
        jobId: job.id,
        resumeId: selectedResumeId,
        coverLetter: trimmedCoverLetter || undefined,
      });

      setMessage({
        type: "success",
        text: "Your application has been submitted.",
      });
    } catch (error) {
      console.error("Failed to apply for job", error);
      setMessage({
        type: "error",
        text: getApiErrorMessage(
          error,
          "Failed to submit your application. Please try again.",
        ),
      });
    }
  };

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/55 px-4 py-6"
      onMouseDown={() => {
        if (!isBusy) onClose();
      }}
    >
      <form
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        onMouseDown={(event) => event.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
          <div className="min-w-0">
            <h2 id={titleId} className="text-xl font-bold text-slate-900">
              Apply for this job
            </h2>
            <p className="mt-1 truncate text-sm text-slate-500">{job.name}</p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Close apply modal"
            className="size-9 shrink-0 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-700"
            disabled={isBusy}
            onClick={onClose}
          >
            <X className="size-4" />
          </Button>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto px-6 py-5">
          <section className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-slate-900">
                Select your CV
              </h3>
              <div>
                <Input
                  id={fileInputId}
                  type="file"
                  accept="application/pdf"
                  className="sr-only"
                  disabled={isBusy}
                  onChange={handleUploadResume}
                />
                <Label
                  htmlFor={fileInputId}
                  className={cn(
                    "inline-flex h-9 cursor-pointer items-center justify-center rounded-lg border border-green-500 bg-white px-3 text-sm font-semibold text-green-600 shadow-xs transition-colors hover:bg-green-50",
                    isBusy && "pointer-events-none opacity-50",
                  )}
                >
                  {isUploadingResume ? (
                    <LoaderCircle className="size-4 animate-spin" />
                  ) : (
                    <UploadCloud className="size-4" />
                  )}
                  Upload new CV
                </Label>
              </div>
            </div>

            {isLoadingResumes ? (
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                <LoaderCircle className="size-4 animate-spin" />
                Loading your CVs...
              </div>
            ) : myResumesQuery.isError ? (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-600">
                Unable to load your CVs. Please try again.
              </div>
            ) : resumes.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-600">
                No CVs found. Upload a PDF CV to continue.
              </div>
            ) : (
              <fieldset className="space-y-3">
                {resumes.map((resume) => {
                  const isSelected = selectedResumeId === resume.id;

                  return (
                    <label
                      key={resume.id}
                      className={cn(
                        "flex cursor-pointer items-start gap-3 rounded-xl border bg-white p-4 transition-colors",
                        isSelected
                          ? "border-green-500 bg-green-50/60"
                          : "border-slate-200 hover:border-green-200 hover:bg-slate-50",
                      )}
                    >
                      <input
                        type="radio"
                        name="resumeId"
                        className="mt-1 size-4 accent-green-600"
                        checked={isSelected}
                        disabled={isBusy}
                        onChange={() => setSelectedResumeId(resume.id)}
                      />
                      <FileText className="mt-0.5 size-5 shrink-0 text-green-600" />
                      <span className="min-w-0 flex-1">
                        <span className="flex flex-wrap items-center gap-2">
                          <span className="truncate text-sm font-semibold text-slate-900">
                            {resume.fileName}
                          </span>
                          {resume.active ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
                              <Star className="size-3 fill-current" />
                              Default CV
                            </span>
                          ) : null}
                        </span>
                        <span className="mt-1 block text-xs text-slate-500">
                          Updated:{" "}
                          {formatResumeDate(
                            resume.updatedAt ?? resume.createdAt,
                          )}
                        </span>
                      </span>
                    </label>
                  );
                })}
              </fieldset>
            )}
          </section>

          <section className="space-y-2">
            <Label htmlFor={coverLetterId} className="text-sm text-slate-900">
              Cover Letter
            </Label>
            <Textarea
              id={coverLetterId}
              value={coverLetter}
              rows={5}
              className="resize-none border-slate-200 text-sm focus-visible:ring-green-500/30"
              placeholder="Write a short message to the employer..."
              disabled={isBusy}
              onChange={(event) => setCoverLetter(event.target.value)}
            />
          </section>

          {message ? (
            <div
              className={cn(
                "rounded-xl border p-3 text-sm font-medium",
                message.type === "success"
                  ? "border-green-200 bg-green-50 text-green-700"
                  : "border-red-200 bg-red-50 text-red-600",
              )}
            >
              {message.text}
            </div>
          ) : null}
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-white px-6 py-4 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            className="rounded-lg"
            disabled={isBusy}
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="rounded-lg bg-green-500 font-semibold text-white hover:bg-green-600"
            disabled={!selectedResumeId || isBusy || myResumesQuery.isError}
          >
            {isSubmitting ? (
              <>
                <LoaderCircle className="size-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit application"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

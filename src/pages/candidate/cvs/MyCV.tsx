import { useState } from "react";
import { useTranslation } from "react-i18next";

import { uploadResumeFile } from "@/api/files/file.api";
import { useCreateResume, useGetMyResumes } from "@/api/resumes/resume.queries";
import { Card } from "@/components/ui/card";
import {
  CreateResumeForm,
  type UploadedResumeDraft,
} from "@/pages/candidate/cvs/components/CreateResumeForm";
import CvCard from "@/pages/candidate/cvs/components/CvCard";
import UploadDropzone from "@/pages/candidate/cvs/components/UploadDropzone";
import type { CvItem } from "@/pages/candidate/cvs/components/types";

const formatDate = (value?: string | null, locale: string = "en-GB") => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString(locale);
};

const MyCV = () => {
  const { t, i18n } = useTranslation();
  const { data, isLoading, isError } = useGetMyResumes();
  const createResumeMutation = useCreateResume();

  const [uploadedDraft, setUploadedDraft] =
    useState<UploadedResumeDraft | null>(null);
  const [uploadError, setUploadError] = useState("");
  const [createError, setCreateError] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const resumes = data?.data ?? [];
  const currentLocale = i18n.language === "vi" ? "vi-VN" : "en-GB";

  const cvItems: CvItem[] = resumes.map((resume) => ({
    id: String(resume.id),
    fileName: resume.fileName,
    fileUrl: resume.fileUrl,
    updatedAt: formatDate(resume.updatedAt ?? resume.createdAt, currentLocale),
    skills: resume.skills ?? [],
    isDefault: resume.active,
  }));

  const handleUploadFile = async (file: File) => {
    const isPdf =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      setUploadError(t("myCVManagement.errors.notPdf"));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError(t("myCVManagement.errors.fileTooLarge"));
      return;
    }

    setIsUploading(true);
    setUploadError("");
    setCreateError("");

    try {
      const uploadResponse = await uploadResumeFile(file);
      const uploadedFile = uploadResponse.data;
      const fileUrl = uploadedFile?.filePath;

      if (!fileUrl) {
        throw new Error("Upload CV failed");
      }

      setUploadedDraft({
        fileName: uploadedFile.fileName || file.name,
        fileUrl,
      });
    } catch (error) {
      console.error("Failed to upload CV", error);
      setUploadError(t("myCVManagement.errors.uploadFailed"));
    } finally {
      setIsUploading(false);
    }
  };

  const handleCreateResume = async (data: {
    fileName: string;
    specializationId?: number;
    skillIds?: number[];
  }) => {
    if (!uploadedDraft || createResumeMutation.isPending) return;

    setCreateError("");

    try {
      await createResumeMutation.mutateAsync({
        fileName: data.fileName,
        fileUrl: uploadedDraft.fileUrl,
        specializationId: data.specializationId,
        skillIds: data.skillIds,
      });

      setUploadedDraft(null);
    } catch (error) {
      console.error("Failed to create CV", error);
      setCreateError(t("myCVManagement.errors.saveFailed"));
    }
  };

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <header className="mb-12">
        <h1 className="mb-2 text-[2rem] font-bold leading-tight tracking-[-0.02em] text-foreground">
          {t("myCVManagement.title")}
        </h1>
        <p className="max-w-2xl text-base text-muted-foreground">
          {t("myCVManagement.subtitle")}
        </p>
      </header>

      <section className="mb-12 space-y-6">
        <UploadDropzone
          isUploading={isUploading}
          onFileSelect={handleUploadFile}
        />

        {uploadError ? (
          <Card className="border-destructive/30 bg-destructive/10 p-4 text-sm font-medium text-destructive">
            {uploadError}
          </Card>
        ) : null}

        {uploadedDraft ? (
          <div className="space-y-3">
            <CreateResumeForm
              draft={uploadedDraft}
              isSubmitting={createResumeMutation.isPending}
              onCancel={() => {
                setUploadedDraft(null);
                setCreateError("");
              }}
              onSubmit={handleCreateResume}
            />
            {createError ? (
              <Card className="border-destructive/30 bg-destructive/10 p-4 text-sm font-medium text-destructive">
                {createError}
              </Card>
            ) : null}
          </div>
        ) : null}
      </section>

      <section>
        <h2 className="mb-6 text-xl font-medium text-foreground">
          {t("myCVManagement.uploadedCVs")}
        </h2>
        {isError ? (
          <p className="text-sm text-destructive">
            {t("myCVManagement.errors.loadFailed")}
          </p>
        ) : isLoading ? (
          <p className="text-sm text-muted-foreground">
            {t("myCVManagement.status.loading")}
          </p>
        ) : cvItems.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            {t("myCVManagement.status.empty")}
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {cvItems.map((item) => (
              <CvCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default MyCV;

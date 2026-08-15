import { useState } from "react";
import { useTranslation } from "react-i18next";

import { uploadResumeFile } from "@/api/files/file.api";
import { useCreateResume, useGetMyResumes } from "@/api/resumes/resume.queries";
import { NotificationPopup } from "@/components/NotificationPopup";
import { Card } from "@/components/ui/card";
import { CreateResumeForm } from "@/pages/candidate/cvs/components/CreateResumeForm";
import CvCard from "@/pages/candidate/cvs/components/CvCard";
import UploadDropzone from "@/pages/candidate/cvs/components/UploadDropzone";
import type { CvItem } from "@/pages/candidate/cvs/components/types";

import { formatDate, validatePdfFile } from "@/helper";

const MyCV = () => {
  const { t, i18n } = useTranslation();
  const { data, isLoading, isError } = useGetMyResumes();
  const createResumeMutation = useCreateResume();

  const [uploadError, setUploadError] = useState("");
  const [createError, setCreateError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [popup, setPopup] = useState<{
    open: boolean;
    variant: "success";
    title: string;
    message: string;
  }>({
    open: false,
    variant: "success",
    title: "",
    message: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const resumes = data?.data ?? [];
  const currentLocale = i18n.language === "vi" ? "vi-VN" : "en-GB";

  const cvItems: CvItem[] = resumes.map((resume) => ({
    id: String(resume.id),
    fileName: resume.fileName,
    fileUrl: resume.fileUrl,
    updatedAt: formatDate(resume.updatedAt ?? resume.createdAt, currentLocale),
    skills: resume.skills ?? [],
    isDefault: resume.isDefault,
  }));

  const handleSelectFile = (file: File) => {
    const { isValid, errorKey } = validatePdfFile(file);
    if (!isValid) {
      setUploadError(t(`myCVManagement.errors.${errorKey}`));
      return;
    }
    setUploadError("");
    setCreateError("");
    setSelectedFile(file);
  };

  const handleCreateResume = async (data: {
    fileName: string;
    specializationId?: number;
    skillIds?: number[];
  }) => {
    if (!selectedFile || isSubmitting || createResumeMutation.isPending) return;

    setIsSubmitting(true);
    setCreateError("");

    try {
      const uploadResponse = await uploadResumeFile(selectedFile);
      const uploadedFile = uploadResponse.data;
      const fileUrl = uploadedFile?.filePath;

      if (!fileUrl) {
        throw new Error("Upload CV failed");
      }

      await createResumeMutation.mutateAsync({
        fileName: data.fileName,
        fileUrl: fileUrl,
        specializationId: data.specializationId,
        skillIds: data.skillIds,
      });

      // Reset sau khi thành công
      setSelectedFile(null);
      setPopup({
        open: true,
        variant: "success",
        title: t("myCVManagement.notifications.createSuccessTitle"),
        message: t("myCVManagement.notifications.createSuccessMessage"),
      });
    } catch (error) {
      console.error("Failed to process CV", error);
      setCreateError(t("myCVManagement.errors.saveFailed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="main-wrapper">
      <header>
        <h1 className="mb-2 text-[1.5rem] font-bold leading-tight tracking-[-0.02em] text-foreground">
          {t("myCVManagement.title")}
        </h1>
        <p className="max-w-2xl text-base text-muted-foreground">
          {t("myCVManagement.subtitle")}
        </p>
      </header>

      <section className="space-y-6">
        <UploadDropzone isUploading={false} onFileSelect={handleSelectFile} />

        {uploadError ? (
          <Card className="border-destructive/30 bg-destructive/10 p-4 text-sm font-medium text-destructive">
            {uploadError}
          </Card>
        ) : null}

        {selectedFile ? (
          <div className="space-y-3">
            <CreateResumeForm
              file={selectedFile}
              isSubmitting={isSubmitting}
              onCancel={() => {
                setSelectedFile(null);
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
        <h2 className="mb-3 text-lg font-bold text-foreground">
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
      <NotificationPopup
        open={popup.open}
        variant={popup.variant}
        title={popup.title}
        message={popup.message}
        dismissLabel={t("myCVManagement.notifications.dismiss")}
        onDismiss={() => setPopup((prev) => ({ ...prev, open: false }))}
      />
    </main>
  );
};

export default MyCV;

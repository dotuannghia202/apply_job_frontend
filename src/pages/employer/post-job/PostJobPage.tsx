import { useState } from "react";
import { useLocation } from "react-router-dom";

import {
  PostJobForm,
  type PostJobFormData,
  type PostJobFormErrors,
} from "./components/PostJobForm";
import { PostJobPreview } from "./components/PostJobPreview";
import { useCreateJob } from "@/api/jobs/job.queries";
import { useAuthStore } from "@/store/auth.store";
import { toUtcMidnightIso } from "@/helper";
import { NotificationPopup } from "@/components/NotificationPopup";

export default function PostJobPage() {
  const location = useLocation();
  const prefill =
    (location.state as { generatedJob?: Partial<PostJobFormData> } | null)
      ?.generatedJob ?? null;

  const [formData, setFormData] = useState<PostJobFormData>(() => ({
    name: prefill?.name ?? "",
    location: prefill?.location ?? "",
    minSalary: prefill?.minSalary ?? "",
    maxSalary: prefill?.maxSalary ?? "",
    quantity: prefill?.quantity ?? "",
    description: prefill?.description ?? "",
    requirements: prefill?.requirements ?? [],
    levels: prefill?.levels ?? [],
    startDate: prefill?.startDate ?? "",
    endDate: prefill?.endDate ?? "",
    active: prefill?.active ?? true,
    benefits: prefill?.benefits ?? [],
    workingHours: prefill?.workingHours ?? "",
    industryId: prefill?.industryId ?? "",
    industryName: prefill?.industryName ?? "",
    specializationId: prefill?.specializationId ?? "",
    specializationName: prefill?.specializationName ?? "",
    skillIds: prefill?.skillIds ?? [],
    skillNames: prefill?.skillNames ?? [],
  }));
  const [errors, setErrors] = useState<PostJobFormErrors>({});
  const [popup, setPopup] = useState<{
    open: boolean;
    variant: "success" | "error";
    title: string;
    message?: string;
  }>({
    open: false,
    variant: "success",
    title: "",
    message: "",
  });
  const companyId = useAuthStore((state) => state.company?.id ?? null);
  const { mutateAsync: createJob } = useCreateJob();

  const validate = (): PostJobFormErrors => {
    const nextErrors: PostJobFormErrors = {};
    const todayIso = new Date(
      Date.now() - new Date().getTimezoneOffset() * 60000,
    )
      .toISOString()
      .slice(0, 10);

    if (formData.startDate && formData.startDate < todayIso) {
      nextErrors.startDate = "Start date cannot be in the past.";
    }

    if (!formData.description.trim()) {
      nextErrors.description = "Please enter a job description.";
    }
    if (!formData.requirements.length) {
      nextErrors.requirements = "Please add at least one requirement.";
    }
    if (!formData.benefits.length) {
      nextErrors.benefits = "Please add at least one benefit.";
    }

    if (!formData.endDate.trim()) {
      nextErrors.endDate = "Please select an end date.";
    } else if (formData.endDate < todayIso) {
      nextErrors.endDate = "End date cannot be in the past.";
    }
    if (!formData.workingHours.trim()) {
      nextErrors.workingHours = "Please enter working hours.";
    }
    if (!formData.industryId) {
      nextErrors.industryId = "Please select an industry.";
    }
    if (!formData.specializationId) {
      nextErrors.specializationId = "Please select a specialization.";
    }
    if (!formData.skillIds.length) {
      nextErrors.skillIds = "Please select at least one skill.";
    }

    return nextErrors;
  };

  const handleSubmit = async () => {
    if (!companyId) return;

    const nextErrors = validate();
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});

    try {
      await createJob({
        name: formData.name.trim(),
        location: formData.location.trim(),
        minSalary: formData.minSalary ? Number(formData.minSalary) : 0,
        maxSalary: formData.maxSalary ? Number(formData.maxSalary) : 0,
        quantity: formData.quantity ? Number(formData.quantity) : 1,
        description: formData.description.trim(),
        requirements: formData.requirements,
        levels: formData.levels,
        startDate: toUtcMidnightIso(formData.startDate),
        endDate: toUtcMidnightIso(formData.endDate),
        active: formData.active,
        benefits: formData.benefits,
        workingHours: formData.workingHours.trim() || undefined,
        companyId,
        specializationId: formData.specializationId
          ? Number(formData.specializationId)
          : undefined,
        skillIds: formData.skillIds,
      });
      setPopup({
        open: true,
        variant: "success",
        title: "Job created successfully",
        message: "Your job has been created.",
      });
    } catch (error) {
      console.error("Failed to create job", error);
      setPopup({
        open: true,
        variant: "error",
        title: "Job creation failed",
        message: "Please try again.",
      });
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f9fc] px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <PostJobForm
            value={formData}
            onChange={setFormData}
            onSubmit={handleSubmit}
            errors={errors}
          />
          <PostJobPreview value={formData} />
        </div>
      </div>
      <NotificationPopup
        open={popup.open}
        variant={popup.variant}
        title={popup.title}
        message={popup.message}
        onDismiss={() => setPopup((prev) => ({ ...prev, open: false }))}
      />
    </main>
  );
}

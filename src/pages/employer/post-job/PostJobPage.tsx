import { useState } from "react";

import { PostJobForm, type PostJobFormData } from "./components/PostJobForm";
import { PostJobPreview } from "./components/PostJobPreview";
import { useCreateJob } from "@/api/jobs/job.queries";
import { useAuthStore } from "@/store/auth.store";
import { toUtcMidnightIso } from "@/helper";

export default function PostJobPage() {
  const [formData, setFormData] = useState<PostJobFormData>({
    name: "",
    location: "",
    minSalary: "",
    maxSalary: "",
    quantity: "",
    description: "",
    requirements: [],
    levels: [],
    startDate: "",
    endDate: "",
    active: true,
    benefits: [],
    workingHours: "",
    industryId: "",
    industryName: "",
    specializationId: "",
    specializationName: "",
    skillIds: [],
    skillNames: [],
  });
  const companyId = useAuthStore((state) => state.company?.id ?? null);
  const { mutate: createJob, isPending } = useCreateJob();

  const handleSubmit = () => {
    if (!companyId) return;

    createJob({
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
  };

  return (
    <main className="min-h-screen bg-[#f7f9fc] px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <PostJobForm
            value={formData}
            onChange={setFormData}
            onSubmit={handleSubmit}
          />
          <PostJobPreview value={formData} />
        </div>
      </div>
    </main>
  );
}

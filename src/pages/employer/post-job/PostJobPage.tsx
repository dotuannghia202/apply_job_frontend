import { useState } from "react";
import { PageHero } from "./components/PageHero";
import { PostJobForm, type PostJobFormData } from "./components/PostJobForm";
import { PostJobPreview } from "./components/PostJobPreview";

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
    companyId: "",
    specializationId: "",
    skillIds: [],
  });

  return (
    <main className="min-h-screen bg-[#f7f9fc] px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <PageHero />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <PostJobForm value={formData} onChange={setFormData} />
          <PostJobPreview value={formData} />
        </div>
      </div>
    </main>
  );
}

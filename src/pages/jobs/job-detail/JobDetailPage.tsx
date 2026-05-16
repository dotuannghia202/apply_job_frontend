import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useGetJobById } from "@/api/jobs/job.queries";
import { useToggleSaveJob } from "@/api/users/user.queries";
import { ApplyJobModal } from "@/pages/jobs/components/ApplyJobModal";
import { CandidateList } from "./components/CandidateList";
import { JobDetailHeader } from "./components/JobDetailHeader";
import { JobDetailInfo } from "./components/JobDetailInfo";
import { JobDetailSidebar } from "./components/JobDetailSidebar";
import { formatSalaryRange, getCityFromAddress } from "../helper";

export default function JobDetailPage() {
  const { id } = useParams();
  const jobId = Number(id);
  const jobQuery = useGetJobById(jobId);
  const toggleSaveMutation = useToggleSaveJob();
  const job = jobQuery.data?.data;
  const [isSaved, setIsSaved] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  const deadlineLabel = "Application deadline:";
  const formatDateLabel = (value?: string | null) => {
    if (!value) return "Not specified";
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return "Not specified";

    return new Intl.DateTimeFormat("en-GB").format(parsed);
  };

  const getDaysLeftLabel = (value?: string | null) => {
    if (!value) return "";
    const end = new Date(value);
    if (Number.isNaN(end.getTime())) return "";
    const diffMs = end.getTime() - Date.now();
    const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    if (Number.isNaN(daysLeft)) return "";
    if (daysLeft < 0) return "(Expired)";
    if (daysLeft === 0) return "(Due today)";
    return `(${daysLeft} days left)`;
  };

  useEffect(() => {
    if (job) {
      setIsSaved(job.isSaved);
    }
  }, [job]);

  if (!id || Number.isNaN(jobId)) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 md:px-6 py-8 md:py-12">
        <div className="mx-auto w-full max-w-7xl">
          <div className="rounded-xl border border-slate-200 bg-white p-6 text-slate-600">
            Job not found.
          </div>
        </div>
      </main>
    );
  }

  if (jobQuery.isLoading) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 md:px-6 py-8 md:py-12">
        <div className="mx-auto w-full max-w-7xl">
          <div className="rounded-xl border border-slate-200 bg-white p-6 text-slate-600">
            Loading job details...
          </div>
        </div>
      </main>
    );
  }

  if (!job) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 md:px-6 py-8 md:py-12">
        <div className="mx-auto w-full max-w-7xl">
          <div className="rounded-xl border border-slate-200 bg-white p-6 text-slate-600">
            Job not found.
          </div>
        </div>
      </main>
    );
  }

  const handleToggleSave = async () => {
    if (toggleSaveMutation.isPending) return;

    try {
      const response = await toggleSaveMutation.mutateAsync(job.id);
      setIsSaved(Boolean(response.data));
    } catch (error) {
      console.error("Failed to toggle saved job", error);
    }
  };

  const salaryText = formatSalaryRange(job.minSalary, job.maxSalary);
  const city = getCityFromAddress(job.location) || job.location || "Unknown";
  const timeLeftLabel = `${formatDateLabel(job.endDate)} ${getDaysLeftLabel(
    job.endDate,
  )}`.trim();
  const requirements = job.requirements?.length
    ? job.requirements
    : ["No requirements"];
  const specialties = job.skills?.length
    ? job.skills
    : job.specialization?.name
      ? [job.specialization.name]
      : ["Not specified"];
  const benefits = job.benefits?.length ? job.benefits : ["Not specified"];
  const description = job.description || "Not specified";
  const workplace = job.location || "Not specified";
  const workType = "Full-time";
  const education = "Not specified";
  const level = job.levels?.length ? job.levels.join(", ") : "Not specified";
  const openings = job.quantity ? `${job.quantity} openings` : "Not specified";

  return (
    <main className="min-h-screen bg-slate-50 px-4 md:px-6 py-8 md:py-12">
      <div className="mx-auto w-full max-w-7xl flex flex-col gap-6">
        <JobDetailHeader
          title={job.name}
          salary={salaryText}
          location={city}
          experience="Not specified"
          deadlineLabel={deadlineLabel}
          timeLeftLabel={timeLeftLabel}
          isSaved={isSaved}
          isSaving={toggleSaveMutation.isPending}
          onApply={() => setIsApplyModalOpen(true)}
          onToggleSave={handleToggleSave}
        />

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-2/3 flex flex-col gap-6">
            <JobDetailInfo
              requirements={requirements}
              specialties={specialties}
              description={description}
              benefits={benefits}
              workplace={workplace}
              applyInstruction="Submit your profile online by clicking Apply now below."
              deadline={`Deadline: ${formatDateLabel(job.endDate)}`}
            />

            <CandidateList />
          </div>

          <JobDetailSidebar
            companyName={job.company?.name ?? "Unknown company"}
            companyLogo={job.company?.logo ?? ""}
            companySize="Not specified"
            companyField={job.specialization?.name ?? "Not specified"}
            companyLocation={job.location || "Not specified"}
            level={level}
            education={education}
            openings={openings}
            workType={workType}
            relatedCategories={specialties}
            regions={[city]}
          />
        </div>
      </div>
      {isApplyModalOpen ? (
        <ApplyJobModal
          job={job}
          open={isApplyModalOpen}
          onClose={() => setIsApplyModalOpen(false)}
        />
      ) : null}
    </main>
  );
}

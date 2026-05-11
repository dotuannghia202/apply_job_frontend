import SavedJobCard from "@/pages/candidate/saved-jobs/components/SavedJobCard";
import SavedJobEmptyState from "@/pages/candidate/saved-jobs/components/SavedJobEmptyState";
import SavedJobHeader from "@/pages/candidate/saved-jobs/components/SavedJobHeader";
import type { SavedJob } from "@/pages/candidate/saved-jobs/components/types";

const savedJobs: SavedJob[] = [
  {
    id: "job-1",
    company: "Tech Innovators Corp",
    title: "Senior Frontend Developer (React/Vue)",
    salary: "30 - 45 million",
    location: "Ho Chi Minh City",
    daysLeft: 15,
    logoUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDUXF6vpiSjlk3O_C02XnZGWq1jcFpxYqCpdu3Qj0rdaCoBrXATh4TVkqSZvts45RS4TpCSEptyZWPZaSOagCrVVLtY0F0OOqnmJAIFBX1Kvb9_tQviuYM6XYaE8tyS1804QNF3OszjSk21AvrcygWSlXVqMw3IxQGISoyfbWqO4I2S63bEEDKmb9HVETRLUW46_yTqq3zGvj6EFyW_WxmrAnzkz-zgMgmBc4gLxZ21QcM4XefMtyIEAgvNdPAGBp8hNcz0pWcCeSSL",
    logoAlt: "Tech Innovators logo",
  },
  {
    id: "job-2",
    company: "Green Energy Solutions",
    title: "Product Marketing Manager",
    salary: "25 - 35 million",
    location: "Ha Noi",
    daysLeft: 3,
    logoFallback: "building",
  },
  {
    id: "job-3",
    company: "Global FinTech Bank",
    title: "Data Scientist (Machine Learning)",
    salary: "Negotiable",
    location: "Da Nang",
    isClosed: true,
    logoUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCGAh07D2FqZNCUN4FN3DWeDuX0oVUI5Jxj_F0xYzrBBtkR3q_eLcCSn7W7R6Bp1VaSF8ab3vCrSXteBp_zj7nVW9WOjm2flN-Tt5o9YIv0Gdek8eRGN3VOTWl88dsE4OII5w-1uhVicREgEdjNetr0H0AV1zSAd4BJlJtgTCLdTN0pENtAuwyKv9fWPo3v-IU_iCi2SMhm7h8tdMP9dQklof-yu3w-V-0D-96yhrArw7O1a-CdX5ChshKkMgcIF9pHGD2eTAKXqBVk",
    logoAlt: "Global FinTech Bank logo",
  },
  {
    id: "job-4",
    company: "Creative Agency Co.",
    title: "UI/UX Designer (Figma/Webflow)",
    salary: "15 - 20 million",
    location: "Ha Noi",
    daysLeft: 20,
    logoFallback: "creative",
  },
];

const SavedJobPage = () => {
  const hasSavedJobs = savedJobs.length > 0;

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 py-12 sm:px-6 lg:px-8">
      <SavedJobHeader savedCount={savedJobs.length} />
      {!hasSavedJobs ? (
        <SavedJobEmptyState />
      ) : (
        <section className="flex flex-col gap-6">
          {savedJobs.map((job) => (
            <SavedJobCard key={job.id} job={job} />
          ))}
        </section>
      )}
    </main>
  );
};

export default SavedJobPage;

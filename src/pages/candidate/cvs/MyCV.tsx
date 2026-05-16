import CvCard from "@/pages/candidate/cvs/components/CvCard";
import UploadDropzone from "@/pages/candidate/cvs/components/UploadDropzone";
import type { CvItem } from "@/pages/candidate/cvs/components/types";
import { useGetMyResumes } from "@/api/resumes/resume.queries";

const formatDate = (value?: string | null) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-GB");
};

const MyCV = () => {
  const { data, isLoading, isError } = useGetMyResumes();
  const resumes = data?.data ?? [];

  const cvItems: CvItem[] = resumes.map((resume) => ({
    id: String(resume.id),
    fileName: resume.fileName,
    fileUrl: resume.fileUrl,
    updatedAt: formatDate(resume.updatedAt ?? resume.createdAt),
    skills: resume.skills ?? [],
    isDefault: resume.active,
  }));

  return (
    <main className="mx-auto max-w-7xl px-6 py-12 md:py-16">
      <header className="mb-12">
        <h1 className="mb-2 text-[2.75rem] font-semibold leading-tight tracking-[-0.02em] text-foreground">
          My CV Management
        </h1>
        <p className="max-w-2xl text-base text-muted-foreground">
          Our AI will analyze your CV to suggest the best matching jobs.
        </p>
      </header>

      <section className="mb-16">
        <UploadDropzone />
      </section>

      <section>
        <h2 className="mb-6 text-xl font-medium text-foreground">
          Uploaded CVs
        </h2>
        {isError ? (
          <p className="text-sm text-destructive">
            Unable to load CVs right now. Please try again.
          </p>
        ) : isLoading ? (
          <p className="text-sm text-muted-foreground">Loading CVs...</p>
        ) : cvItems.length === 0 ? (
          <p className="text-sm text-muted-foreground">No CVs uploaded yet.</p>
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

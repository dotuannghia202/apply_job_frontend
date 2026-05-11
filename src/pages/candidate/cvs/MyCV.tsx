import CvCard from "@/pages/candidate/cvs/components/CvCard";
import UploadDropzone from "@/pages/candidate/cvs/components/UploadDropzone";
import type { CvItem } from "@/pages/candidate/cvs/components/types";

const cvItems: CvItem[] = [
  {
    id: "cv-1",
    fileName: "CV_Do_Tuan_Nghia_Backend.pdf",
    updatedAt: "10/05/2026",
    skills: ["Java", "Spring Boot", "Microservices", "AWS"],
    isDefault: true,
  },
  {
    id: "cv-2",
    fileName: "Nghia_Do_Fullstack_Eng.pdf",
    updatedAt: "01/03/2026",
    skills: ["ReactJS", "Node.js", "TypeScript"],
  },
  {
    id: "cv-3",
    fileName: "Resume_DoTuanNghia_General.pdf",
    updatedAt: "15/12/2025",
    skills: ["Project Management", "Agile", "Scrum"],
  },
];

const MyCV = () => {
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
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cvItems.map((item) => (
            <CvCard key={item.id} item={item} />
          ))}
        </div>
      </section>
    </main>
  );
};

export default MyCV;

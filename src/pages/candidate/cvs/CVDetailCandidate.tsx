import AIProfileInsights from "@/pages/candidate/cvs/components/AIProfileInsights";
import AttachmentFiles from "@/pages/candidate/cvs/components/AttachmentFiles";
import CandidateProfileCard from "@/pages/candidate/cvs/components/CandidateProfileCard";
import EducationTimeline from "@/pages/candidate/cvs/components/EducationTimeline";
import RightRail from "@/pages/candidate/cvs/components/RightRail";
import SkillsMatrix from "@/pages/candidate/cvs/components/SkillsMatrix";
import WorkExperienceList from "@/pages/candidate/cvs/components/WorkExperienceList";
import type {
  AiInsightMetric,
  ApplicationInfo,
  AttachmentFile,
  CandidateProfile,
  EducationItem,
  InteractionNote,
  SkillItem,
  WorkExperienceItem,
} from "@/pages/candidate/my-applications/components/types";

const candidateProfile: CandidateProfile = {
  name: "Nguyen Van An",
  title: "Senior Fullstack Developer",
  location: "Ho Chi Minh City",
  experienceYears: 6,
  statusLabel: "Actively looking",
  statusTone: "active",
  noticePeriod: "Notice: 30 days",
  availability: "Available for remote",
  avatarUrl:
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&w=160&h=160",
};

const attachments: AttachmentFile[] = [
  {
    id: "file-01",
    name: "NguyenVanAn_CV_2026.pdf",
    size: "1.8 MB",
    type: "file",
  },
  {
    id: "file-02",
    name: "Portfolio_2026.pdf",
    size: "6.2 MB",
    type: "file",
  },
  {
    id: "file-03",
    name: "Certificates_Live_Link",
    size: "External",
    type: "link",
  },
];

const educationItems: EducationItem[] = [
  {
    id: "edu-01",
    school: "Ho Chi Minh University of Technology",
    degree: "BSc, Computer Science",
    period: "2014 - 2018",
    summary: "Focused on distributed systems and software architecture.",
  },
  {
    id: "edu-02",
    school: "FUNiX",
    degree: "Fullstack Engineering Program",
    period: "2019",
    summary: "Project-based training for modern web stacks.",
  },
];

const skills: SkillItem[] = [
  { id: "skill-01", name: "React / TypeScript", level: "Advanced", score: 92 },
  { id: "skill-02", name: "Node.js", level: "Advanced", score: 88 },
  { id: "skill-03", name: "System Design", level: "Intermediate", score: 78 },
  { id: "skill-04", name: "DevOps", level: "Intermediate", score: 72 },
  { id: "skill-05", name: "GraphQL", level: "Intermediate", score: 75 },
  { id: "skill-06", name: "Testing", level: "Advanced", score: 86 },
];

const experiences: WorkExperienceItem[] = [
  {
    id: "exp-01",
    role: "Senior Fullstack Developer",
    company: "TechNova",
    period: "2022 - Present",
    highlights: [
      "Led migration to micro-frontends for 3 product squads.",
      "Reduced API latency by 35% through caching strategy.",
      "Mentored 6 engineers on quality and release practices.",
    ],
  },
  {
    id: "exp-02",
    role: "Fullstack Engineer",
    company: "SageWorks",
    period: "2019 - 2022",
    highlights: [
      "Built hiring analytics dashboard adopted by 40+ clients.",
      "Designed reusable UI system with 25+ components.",
    ],
  },
];

const aiMetrics: AiInsightMetric[] = [
  {
    id: "ai-01",
    label: "Match",
    value: "85%",
    caption: "Alignment with role requirements",
  },
  {
    id: "ai-02",
    label: "Strengths",
    value: "System Design",
    caption: "Leadership in scalable architecture",
  },
  {
    id: "ai-03",
    label: "Risk",
    value: "Low",
    caption: "Stable tenure and strong reviews",
  },
];

const applicationInfo: ApplicationInfo = {
  position: "Senior Fullstack Java",
  company: "TechNova",
  appliedOn: "Apr 26, 2026",
  status: "Reviewing",
  stageHint: "Recruiter screening",
};

const interactions: InteractionNote[] = [
  {
    id: "note-01",
    title: "Intro call with recruiter",
    time: "May 02, 2026",
    summary: "Discussed current projects and preferred stack.",
  },
  {
    id: "note-02",
    title: "Technical interview scheduled",
    time: "May 10, 2026",
    summary: "Pair programming session (90 minutes).",
  },
];

const CVDetailCandidate = () => (
  <div className="space-y-8">
    <div className="rounded-2xl bg-secondary/30 p-6">
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
        Application detail
      </p>
      <h2 className="text-2xl font-semibold text-foreground">
        Candidate profile overview
      </h2>
      <p className="text-sm text-muted-foreground">
        Review candidate data, attachments, and AI insights in one place.
      </p>
    </div>

    <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
      <div className="space-y-6">
        <CandidateProfileCard profile={candidateProfile} />
        <WorkExperienceList items={experiences} />
        <EducationTimeline items={educationItems} />
        <SkillsMatrix skills={skills} />
        <AttachmentFiles files={attachments} />
      </div>

      <div className="space-y-6">
        <AIProfileInsights
          metrics={aiMetrics}
          summary="AI suggests a strong fit for senior backend-heavy roles."
        />
        <RightRail application={applicationInfo} interactions={interactions} />
      </div>
    </div>
  </div>
);

export default CVDetailCandidate;

// RecentTalent.tsx
import { Zap } from "lucide-react";
import { ApplicantCard } from "./ApplicantCard";
import type { Applicant } from "../../types";

const APPLICANTS: Applicant[] = [
  {
    id: 1,
    name: "Sarah Jenkins",
    role: "Senior UX Designer",
    avatarUrl: "https://i.pravatar.cc/48?img=47",
    matchScore: 98,
  },
  {
    id: 2,
    name: "David Chen",
    role: "Lead Data Scientist",
    avatarUrl: "https://i.pravatar.cc/48?img=12",
    matchScore: 85,
  },
  {
    id: 3,
    name: "Elena Rodriguez",
    role: "Senior UX Designer",
    avatarUrl: "https://i.pravatar.cc/48?img=32",
    matchScore: 72,
  },
];

export function RecentTalent() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="text-xl font-bold text-[#2d3338]">Recent Talent</h4>
        <span className="bg-[#6f26f6]/10 text-[#6f26f6] text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
          <Zap size={10} /> AI RANKED
        </span>
      </div>
      <div className="space-y-4">
        {APPLICANTS.map((a, i) => (
          <ApplicantCard key={a.id} applicant={a} highlighted={i === 0} />
        ))}
      </div>
    </div>
  );
}

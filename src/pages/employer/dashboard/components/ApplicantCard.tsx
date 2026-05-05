// ApplicantCard.tsx
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import "react-circular-progressbar/dist/styles.css";
import type { Applicant } from "../../types";
import PercentageCircle from "@/components/PercentageCircle";

interface Props {
  applicant: Applicant;
  highlighted?: boolean;
}

// function getScoreColor(score: number) {
//   if (score >= 90) return "text-primary border-primary/30";
//   if (score >= 80) return "text-primary-hover border-primary-hover/30";
//   return "text-[#596065] border-[#acb3b8]/30";
// }

export function ApplicantCard({ applicant, highlighted }: Props) {
  return (
    <div
      className={cn(
        "bg-white p-5 rounded-lg shadow-sm border-l-4 transition-all",
        highlighted
          ? "border-primary"
          : "border-transparent hover:border-primary/40",
      )}
    >
      <div className="flex items-center gap-4 mb-4">
        <Avatar className="w-12 h-12">
          <AvatarImage src={applicant.avatarUrl} alt={applicant.name} />
          <AvatarFallback>
            {applicant.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h5 className="font-bold text-[#2d3338] truncate">
            {applicant.name}
          </h5>
          <p className="text-xs text-[#596065] truncate">{applicant.role}</p>
        </div>

        <PercentageCircle score={applicant.matchScore} />
      </div>

      <div className="flex gap-2">
        <Button
          variant="secondary"
          size="sm"
          className="flex-1 text-xs font-bold rounded-xs bg-slate-200 hover:bg-slate-300"
        >
          View CV
        </Button>
        <Button
          size="sm"
          className="flex-1 text-xs font-bold bg-primary hover:bg-primary-hover text-white rounded-xs"
        >
          Accept
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-[#ac3434] hover:bg-[#ac3434]/10 w-8 h-8 shrink-0 rounded-xs"
        >
          <X size={14} />
        </Button>
      </div>
    </div>
  );
}

// RecentTalent.tsx
import { Zap } from "lucide-react";
import { ApplicantCard } from "./ApplicantCard";
import type { Application } from "@/types/application";

interface RecentTalentProps {
  applications: Application[];
  isLoading?: boolean;
  isError?: boolean;
}

export function RecentTalent({
  applications,
  isLoading,
  isError,
}: RecentTalentProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="text-xl font-bold text-[#2d3338]">Recent Talent</h4>
        <span className="bg-emerald-600/10 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
          <Zap size={10} /> AI RANKED
        </span>
      </div>
      <div className="space-y-4">
        {isLoading ? <RecentTalentSkeleton /> : null}
        {!isLoading && isError ? (
          <StateMessage message="Unable to load recent talent." />
        ) : null}
        {!isLoading && !isError && applications.length === 0 ? (
          <StateMessage message="No applications yet." />
        ) : null}
        {!isLoading && !isError
          ? applications.map((application, index) => (
              <ApplicantCard
                key={application.id}
                application={application}
                highlighted={index === 0}
              />
            ))
          : null}
      </div>
    </div>
  );
}

function RecentTalentSkeleton() {
  return (
    <>
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="rounded-lg border-l-4 border-transparent bg-white p-5 shadow-sm"
        >
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 animate-pulse rounded-full bg-slate-200" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />
              <div className="h-3 w-40 animate-pulse rounded bg-slate-200" />
            </div>
            <div className="h-10 w-10 animate-pulse rounded-full bg-slate-200" />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="h-8 animate-pulse rounded bg-slate-200" />
            <div className="h-8 animate-pulse rounded bg-slate-200" />
          </div>
        </div>
      ))}
    </>
  );
}

function StateMessage({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-200 bg-white px-4 py-10 text-center text-sm text-[#596065]">
      {message}
    </div>
  );
}

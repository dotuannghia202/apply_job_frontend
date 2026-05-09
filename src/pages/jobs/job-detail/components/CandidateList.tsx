import { Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const candidates = [
  {
    id: "cand-01",
    name: "Nguyen Quang Huy",
    title: "Senior Electrical Technician",
    location: "Ha Noi",
    appliedAt: "Applied 2 days ago",
    stage: "Interview",
    score: "8.6",
    email: "huy.nguyen@email.com",
  },
  {
    id: "cand-02",
    name: "Tran Minh Chau",
    title: "Maintenance Engineer",
    location: "Ha Noi",
    appliedAt: "Applied 4 days ago",
    stage: "Screening",
    score: "7.9",
    email: "chau.tran@email.com",
  },
  {
    id: "cand-03",
    name: "Do Thanh Phong",
    title: "Electrical Technician",
    location: "Hai Phong",
    appliedAt: "Applied 1 week ago",
    stage: "Offer",
    score: "9.2",
    email: "phong.do@email.com",
  },
];

export function CandidateList() {
  return (
    <section className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-slate-100">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-900">Candidates</h3>
          <p className="text-sm text-slate-500">
            Track applicants for this job in real time.
          </p>
        </div>
        <Button variant="outline" className="border-slate-200">
          Export list
        </Button>
      </div>

      <div className="mt-6 space-y-4">
        {candidates.map((candidate) => (
          <div
            key={candidate.id}
            className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-slate-50/60 p-4 md:flex-row md:items-center md:justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-semibold">
                {candidate.name
                  .split(" ")
                  .map((part) => part[0])
                  .slice(0, 2)
                  .join("")}
              </div>
              <div>
                <p className="font-semibold text-slate-900">{candidate.name}</p>
                <p className="text-sm text-slate-500">{candidate.title}</p>
                <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <MapPin size={12} />
                    {candidate.location}
                  </span>
                  <span>{candidate.appliedAt}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
                {candidate.stage}
              </span>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 border border-slate-200">
                Score {candidate.score}
              </span>
              <Button
                variant="outline"
                className="border-slate-200 flex items-center gap-2"
              >
                <Mail size={14} />
                Contact
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

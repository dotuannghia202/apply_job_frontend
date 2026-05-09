import { Bell } from "lucide-react";

const pillCls =
  "px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm font-medium border border-slate-200";

type JobDetailInfoProps = {
  requirements: string[];
  specialties: string[];
  description: string;
  qualifications: string[];
  benefits: string[];
  workplace: string;
  applyInstruction: string;
  deadline: string;
};

export function JobDetailInfo({
  requirements,
  specialties,
  description,
  qualifications,
  benefits,
  workplace,
  applyInstruction,
  deadline,
}: JobDetailInfoProps) {
  return (
    <section className="bg-white rounded-xl p-6 md:p-8 flex flex-col gap-8 shadow-sm border border-slate-100 relative">
      <div className="absolute left-0 top-8 bottom-8 w-1.5 bg-emerald-200 rounded-r-full" />
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-900">Job details</h2>
        <button className="text-emerald-600 text-sm font-medium flex items-center gap-1 hover:underline">
          <Bell size={14} />
          Send me similar jobs
        </button>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="text-sm font-semibold text-slate-900 min-w-[110px]">
            Requirements:
          </span>
          {requirements.map((item) => (
            <span key={item} className={pillCls}>
              {item}
            </span>
          ))}
        </div>
        <div className="flex items-start gap-4 flex-wrap">
          <span className="text-sm font-semibold text-slate-900 min-w-[110px] mt-1">
            Specialty:
          </span>
          <div className="flex flex-wrap gap-2 flex-grow">
            {specialties.map((item) => (
              <span key={item} className={pillCls}>
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="text-slate-600">
        <h3 className="text-lg font-bold text-slate-900 mb-3">
          Job description
        </h3>
        <p className="leading-relaxed whitespace-pre-line">{description}</p>

        <h3 className="text-lg font-bold text-slate-900 mt-8 mb-3">
          Candidate requirements
        </h3>
        <ul className="list-none space-y-2 mb-6">
          {qualifications.map((item) => (
            <li key={item} className="flex gap-2">
              <span className="text-emerald-600">-</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <h3 className="text-lg font-bold text-slate-900 mt-8 mb-3">Benefits</h3>
        <ul className="list-none space-y-2 mb-6">
          {benefits.map((item) => (
            <li key={item} className="flex gap-2">
              <span className="text-emerald-600">-</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <h3 className="text-lg font-bold text-slate-900 mt-8 mb-3">
          Workplace
        </h3>
        <p className="mb-6">{workplace}</p>

        <h3 className="text-lg font-bold text-slate-900 mt-8 mb-3">
          How to apply
        </h3>
        <p className="mb-4">{applyInstruction}</p>
        <p className="mb-2 text-sm text-slate-500">{deadline}</p>
      </div>
    </section>
  );
}

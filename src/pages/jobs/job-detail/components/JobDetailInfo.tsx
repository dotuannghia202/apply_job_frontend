type JobDetailInfoProps = {
  requirements: string[];
  specialties: string[];
  description: string;
  benefits: string[];
  workplace: string;
  applyInstruction: string;
  deadline: string;
};

export function JobDetailInfo({
  requirements,
  specialties,
  description,
  benefits,
  workplace,
  applyInstruction,
  deadline,
}: JobDetailInfoProps) {
  return (
    <section className="bg-white rounded-xl p-6 md:p-8 flex flex-col gap-8 shadow-sm border border-slate-100 relative">
      <div className="absolute left-0 top-8 bottom-8 w-1.5 bg-primary/20 rounded-r-full" />
      <div className="flex justify-between items-center">
        <h2 className="text-[20px] font-bold text-slate-900">Job details</h2>
      </div>

      <div className="flex flex-col gap-4 text-sm">
        <div className="flex items-start gap-4 flex-wrap">
          <span className="text-[16px] font-bold text-slate-900 min-w-[110px] mt-1">
            Specialty:
          </span>
          <div className="flex flex-wrap gap-2 flex-grow">
            {specialties.map((item) => (
              <span
                key={item}
                className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm font-medium border border-slate-200"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="text-slate-600 text-sm space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 mb-2">
            Job description
          </h3>
          <p className="leading-relaxed whitespace-pre-line">{description}</p>
        </div>

        <div>
          <h3 className="text-base font-bold text-slate-900 mb-2">
            Candidate requirements
          </h3>
          <ul className="list-none space-y-2">
            {requirements.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="text-primary">-</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-base font-bold text-slate-900 mb-2">Benefits</h3>
          <ul className="list-none space-y-2">
            {benefits.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="text-primary">-</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-base font-bold text-slate-900 mb-2">Workplace</h3>
          <p>{workplace}</p>
        </div>

        <div>
          <h3 className="text-base font-bold text-slate-900 mb-2">
            How to apply
          </h3>
          <p>{applyInstruction}</p>
          <p className="text-slate-500">{deadline}</p>
        </div>
      </div>
    </section>
  );
}

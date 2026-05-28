const featuredCompanies = [
  { name: "Nexus Labs", score: "92%" },
  { name: "Aurora Finance", score: "88%" },
  { name: "Mediverse", score: "84%" },
];

export default function QuickInsights() {
  return (
    <aside
      className="space-y-4 rounded-3xl bg-[#f1f4f7] p-5 shadow-sm"
      data-section="QuickInsights"
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Quick insights
        </p>
        <h3 className="mt-2 text-lg font-semibold text-slate-900">
          Cong ty noi bat
        </h3>
      </div>

      <div className="space-y-3">
        {featuredCompanies.map((company) => (
          <div
            key={company.name}
            className="flex items-center justify-between rounded-2xl bg-white px-4 py-3"
          >
            <div>
              <p className="text-sm font-semibold text-slate-900">
                {company.name}
              </p>
              <p className="text-xs text-slate-500">Top performance</p>
            </div>
            <span className="text-sm font-semibold text-slate-700">
              {company.score}
            </span>
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-white px-4 py-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Ty le duyet
        </p>
        <div className="mt-3 flex items-end justify-between">
          <p className="text-2xl font-semibold text-slate-900">86%</p>
          <p className="text-xs text-emerald-600">+4.1% thang nay</p>
        </div>
        <div className="mt-3 h-2 rounded-full bg-[#e3e9ee]">
          <div className="h-2 w-4/5 rounded-full bg-gradient-to-r from-[#2c5bb6] to-[#a8c0ff]" />
        </div>
      </div>
    </aside>
  );
}

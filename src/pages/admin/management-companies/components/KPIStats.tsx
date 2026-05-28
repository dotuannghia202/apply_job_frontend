import { Building2, CheckCircle2, ClipboardCheck } from "lucide-react";

const stats = [
  {
    label: "Total companies",
    value: "420",
    note: "+12% vs last month",
    icon: Building2,
    tone: "bg-emerald-50 text-emerald-700",
  },
  {
    label: "Pending approval",
    value: "18",
    note: undefined,
    icon: ClipboardCheck,
    tone: "bg-rose-50 text-rose-700",
  },
  {
    label: "Approved",
    value: "395",
    note: "High Trust",
    icon: CheckCircle2,
    tone: "bg-emerald-100 text-emerald-700",
  },
];

export default function KPIStats() {
  return (
    <section className="grid gap-4 md:grid-cols-3" data-section="KPIStats">
      {stats.map(({ label, value, note, icon: Icon, tone }) => (
        <article key={label} className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`flex size-10 items-center justify-center rounded-xl ${tone}`}
              >
                <Icon className="size-4" />
              </div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-500">
                {label}
              </p>
            </div>
            {note ? (
              <span className="text-xs font-semibold text-emerald-700">
                {note}
              </span>
            ) : null}
          </div>
          <div className="mt-4 flex items-center justify-between">
            <p className="text-3xl font-semibold text-slate-900">{value}</p>
          </div>
        </article>
      ))}
    </section>
  );
}

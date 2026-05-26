import { Switch } from "@/components/ui/switch";

type UserAccountStatusCardProps = {
  isActive: boolean;
};

export default function UserAccountStatusCard({
  isActive,
}: UserAccountStatusCardProps) {
  return (
    <section className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-slate-900">
          Account Status
        </h3>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            isActive
              ? "bg-emerald-100 text-emerald-700"
              : "bg-rose-100 text-rose-700"
          }`}
        >
          {isActive ? "ACTIVE" : "LOCKED"}
        </span>
      </div>

      <div className="mt-5 rounded-2xl bg-slate-50 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-800">
              Account Access
            </p>
            <p className="text-xs text-slate-500">User can log in and apply</p>
          </div>
          <Switch checked={isActive} aria-label="Toggle account access" />
        </div>
      </div>
    </section>
  );
}

import { Mail, UserX, KeyRound } from "lucide-react";

export default function UserGovernanceCard() {
  return (
    <section className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-sm">
      <h3 className="text-base font-semibold text-slate-900">
        Quick Governance
      </h3>
      <div className="mt-4 space-y-2">
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
        >
          <KeyRound className="size-4" />
          Reset Password
        </button>
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
        >
          <Mail className="size-4" />
          Send Notification
        </button>
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-2xl bg-rose-100/70 px-4 py-3 text-sm font-semibold text-rose-700 hover:bg-rose-100"
        >
          <UserX className="size-4" />
          Terminate User
        </button>
      </div>
    </section>
  );
}

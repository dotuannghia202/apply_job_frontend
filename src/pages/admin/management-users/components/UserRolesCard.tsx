type UserRolesCardProps = {
  roles: Array<"Candidate" | "Employer" | "Admin">;
};

const roleStyles: Record<UserRolesCardProps["roles"][number], string> = {
  Candidate: "bg-emerald-100 text-emerald-700",
  Employer: "bg-emerald-100 text-emerald-700",
  Admin: "bg-slate-100 text-slate-400",
};

export default function UserRolesCard({ roles }: UserRolesCardProps) {
  return (
    <section className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-sm">
      <h3 className="text-base font-semibold text-slate-900">Assigned Roles</h3>
      <div className="mt-4 flex flex-wrap gap-2">
        {roles.map((role) => (
          <span
            key={role}
            className={`rounded-lg px-3 py-1 text-xs font-semibold ${roleStyles[role]}`}
          >
            {role}
          </span>
        ))}
      </div>
      <button
        type="button"
        className="mt-4 text-xs font-semibold text-emerald-700 hover:underline"
      >
        Manage Permissions
      </button>
    </section>
  );
}

import { CheckCircle2, MapPin, Timer, Wallet } from "lucide-react";
import type { PostJobFormData } from "./PostJobForm";

function PreviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 text-sm">
      <span className="text-[#7b848a] font-semibold">{label}</span>
      <span className="text-[#2d3338] font-semibold text-right">{value}</span>
    </div>
  );
}

export function PostJobPreview({ value }: { value: PostJobFormData }) {
  const minSalary = value.minSalary ? Number(value.minSalary) : null;
  const maxSalary = value.maxSalary ? Number(value.maxSalary) : null;
  const salaryLabel =
    minSalary !== null || maxSalary !== null
      ? `${minSalary ?? 0} - ${maxSalary ?? 0}`
      : "Not set";

  return (
    <aside className="lg:col-span-5">
      <div className="relative group">
        <div className="absolute -inset-1 bg-linear-to-r from-[#72b183] via-[#6f26f6] to-[#006b60] opacity-10 blur transition duration-700 rounded-lg" />
        <div className="relative bg-white rounded-lg p-8 shadow-xl border border-[#eaeef3]/50 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-[#72b183] uppercase tracking-[0.2em] mb-2">
                Payload Preview
              </p>
              <h3 className="text-2xl font-extrabold text-[#2d3338]">
                {value.name || "Untitled Role"}
              </h3>
            </div>
            <span className="text-xs font-bold text-[#72b183] bg-[#e8f4ec] px-3 py-1 rounded-full">
              {value.active ? "Active" : "Inactive"}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center gap-2 text-sm text-[#596065]">
              <MapPin size={16} className="text-[#72b183]" />
              {value.location || "Location not set"}
            </div>
            <div className="flex items-center gap-2 text-sm text-[#596065]">
              <Wallet size={16} className="text-[#72b183]" />
              {salaryLabel}
            </div>
            <div className="flex items-center gap-2 text-sm text-[#596065]">
              <Timer size={16} className="text-[#72b183]" />
              {value.startDate && value.endDate
                ? `${value.startDate} - ${value.endDate}`
                : "Timeline not set"}
            </div>
          </div>

          <div className="space-y-3 border-t border-[#eaeef3] pt-4">
            <PreviewRow label="Quantity" value={value.quantity || "-"} />
            <PreviewRow
              label="Levels"
              value={value.levels.length ? value.levels.join(", ") : "-"}
            />
            <PreviewRow label="Industry ID" value={value.industryId || "-"} />
            <PreviewRow
              label="Specialization ID"
              value={value.specializationId || "-"}
            />
            <PreviewRow
              label="Skill IDs"
              value={value.skillIds.length ? value.skillIds.join(", ") : "-"}
            />
          </div>

          <div className="border-t border-[#eaeef3] pt-4">
            <p className="text-xs font-bold text-[#72b183] uppercase tracking-[0.2em] mb-2">
              Description
            </p>
            <p className="text-sm text-[#596065] leading-relaxed">
              {value.description || "No description"}
            </p>
          </div>

          <div className="space-y-3 border-t border-[#eaeef3] pt-4">
            <div>
              <p className="text-xs font-bold text-[#72b183] uppercase tracking-[0.2em] mb-2">
                Requirements
              </p>
              {value.requirements.length ? (
                <ul className="space-y-2">
                  {value.requirements.map((item, index) => (
                    <li key={`${item}-${index}`} className="flex gap-2 text-sm">
                      <CheckCircle2
                        size={14}
                        className="text-[#72b183] mt-0.5"
                      />
                      <span className="text-[#596065]">{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-[#7b848a]">No requirements</p>
              )}
            </div>

            <div>
              <p className="text-xs font-bold text-[#72b183] uppercase tracking-[0.2em] mb-2">
                Benefits
              </p>
              {value.benefits.length ? (
                <ul className="space-y-2">
                  {value.benefits.map((item, index) => (
                    <li
                      key={`${item}-${index}`}
                      className="text-sm text-[#596065]"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-[#7b848a]">No benefits</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

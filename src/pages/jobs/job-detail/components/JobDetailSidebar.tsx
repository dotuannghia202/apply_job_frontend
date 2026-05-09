import {
  Building2,
  Users,
  MapPin,
  Briefcase,
  GraduationCap,
  BadgeCheck,
} from "lucide-react";

const chipCls =
  "px-3 py-1.5 bg-white text-slate-600 rounded-lg text-sm font-medium border border-slate-200 hover:bg-primary-hover/10 hover:text-primary-hover transition-colors";

type JobDetailSidebarProps = {
  companyName: string;
  companyLogo: string;
  companySize: string;
  companyField: string;
  companyLocation: string;
  level: string;
  education: string;
  openings: string;
  workType: string;
  relatedCategories: string[];
  regions: string[];
};

export function JobDetailSidebar({
  companyName,
  companyLogo,
  companySize,
  companyField,
  companyLocation,
  level,
  education,
  openings,
  workType,
  relatedCategories,
  regions,
}: JobDetailSidebarProps) {
  return (
    <aside className="w-full lg:w-1/3 flex flex-col gap-6">
      <div className="bg-white rounded-xl p-6 shadow-sm flex flex-col gap-6 border border-slate-100">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-slate-100 rounded-lg flex items-center justify-center overflow-hidden border border-slate-200 flex-shrink-0">
            <img
              alt="Company logo"
              className="w-full h-full object-cover"
              src={companyLogo}
            />
          </div>
          <h3 className="text-lg font-bold text-slate-900">{companyName}</h3>
        </div>
        <div className="flex flex-col gap-4 text-sm">
          <div className="flex gap-3 text-slate-500">
            <Users className="text-slate-500" size={18} />
            <div className="flex flex-col">
              <span className="text-xs font-medium text-slate-400">
                Company size
              </span>
              <span className="text-slate-900 font-medium">{companySize}</span>
            </div>
          </div>
          <div className="flex gap-3 text-slate-500">
            <Building2 className="text-slate-500" size={18} />
            <div className="flex flex-col">
              <span className="text-xs font-medium text-slate-400">
                Industry
              </span>
              <span className="text-slate-900 font-medium">{companyField}</span>
            </div>
          </div>
          <div className="flex gap-3 text-slate-500">
            <MapPin className="text-slate-500" size={18} />
            <div className="flex flex-col">
              <span className="text-xs font-medium text-slate-400">
                Location
              </span>
              <span className="text-slate-900 font-medium">
                {companyLocation}
              </span>
            </div>
          </div>
        </div>
        <button className="text-primary font-semibold text-center mt-2 flex items-center justify-center gap-2 hover:text-primary-hover hover:underline">
          View company page
        </button>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm flex flex-col gap-6 border border-slate-100">
        <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
          General info
        </h3>
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
              <BadgeCheck size={18} />
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-0.5">Level</p>
              <p className="font-semibold text-slate-900 text-sm">{level}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
              <GraduationCap size={18} />
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-0.5">Education</p>
              <p className="font-semibold text-slate-900 text-sm">
                {education}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
              <Users size={18} />
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-0.5">Openings</p>
              <p className="font-semibold text-slate-900 text-sm">{openings}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
              <Briefcase size={18} />
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-0.5">Work type</p>
              <p className="font-semibold text-slate-900 text-sm">{workType}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm flex flex-col gap-4 border border-slate-100">
        <h3 className="text-lg font-bold text-slate-900">Related categories</h3>
        <div className="flex flex-wrap gap-2">
          {relatedCategories.map((item) => (
            <a key={item} href="#" className={chipCls}>
              {item}
            </a>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm flex flex-col gap-4 border border-slate-100">
        <h3 className="text-lg font-bold text-slate-900">Search by region</h3>
        <div className="flex flex-wrap gap-2">
          {regions.map((item) => (
            <a
              key={item}
              href="#"
              className={`${chipCls} ${item.length > 22 ? "w-full" : ""}`}
            >
              {item}
            </a>
          ))}
        </div>
      </div>
    </aside>
  );
}

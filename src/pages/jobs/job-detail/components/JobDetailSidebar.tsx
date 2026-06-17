import {
  Building2,
  Users,
  MapPin,
  Briefcase,
  GraduationCap,
  BadgeCheck,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const chipCls =
  "px-3 py-1.5 bg-white text-slate-600 rounded-lg text-sm font-medium border hover:bg-primary-hover/10 hover:text-primary-hover transition-colors";

type JobDetailSidebarProps = {
  companyId: number;
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
  companyId,
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
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <aside className="w-full lg:w-1/3 flex flex-col gap-6">
      <div className="bg-white rounded-xl p-6 flex flex-col gap-6 border ">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-slate-100 rounded-lg flex items-center justify-center overflow-hidden border border-slate-200 shrink-0">
            <img
              alt={t("jobDetail.sidebar.companyLogoAlt")}
              className="w-full h-full object-cover"
              src={companyLogo}
            />
          </div>
          <h3 className="text-[20px] font-bold text-slate-900">
            {companyName}
          </h3>
        </div>
        <div className="flex flex-col gap-4 text-sm">
          <div className="flex items-center gap-3 text-slate-500">
            <Users className="text-primary" size={18} />
            <div className="flex flex-col">
              <span className="text-xs font-medium text-slate-400">
                {t("jobDetail.sidebar.companySize")}
              </span>
              <span className="text-slate-900 font-medium">{companySize}</span>
            </div>
          </div>
          <div className="flex items-center gap-3 text-slate-500">
            <Building2 className="text-primary" size={18} />
            <div className="flex flex-col">
              <span className="text-xs font-medium text-slate-400">
                {t("jobDetail.sidebar.industry")}
              </span>
              <span className="text-slate-900 font-medium">{companyField}</span>
            </div>
          </div>
          <div className="flex items-center gap-3 text-slate-500">
            <MapPin className="text-primary" size={18} />
            <div className="flex flex-col">
              <span className="text-xs font-medium text-slate-400">
                {t("jobDetail.sidebar.location")}
              </span>
              <span className="text-slate-900 font-medium">
                {companyLocation}
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={() => navigate(`/company/detail/${companyId}`)}
          className="text-primary font-semibold text-center mt-2 flex items-center justify-center gap-2 hover:text-primary-hover hover:underline"
        >
          {t("jobDetail.sidebar.viewCompanyPage")}
        </button>
      </div>

      <div className="bg-white rounded-xl p-6 flex flex-col gap-6 border ">
        <h3 className="text-lg font-bold text-slate-900 border-b  pb-3">
          {t("jobDetail.sidebar.generalInfo")}
        </h3>
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full  flex items-center justify-center text-primary shrink-0">
              <BadgeCheck size={18} />
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-0.5">
                {t("jobDetail.sidebar.level")}
              </p>
              <p className="font-semibold text-slate-900 text-sm">{level}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full  flex items-center justify-center text-primary shrink-0">
              <GraduationCap size={18} />
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-0.5">
                {t("jobDetail.sidebar.education")}
              </p>
              <p className="font-semibold text-slate-900 text-sm">
                {education}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full  flex items-center justify-center text-primary shrink-0">
              <Users size={18} />
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-0.5">
                {t("jobDetail.sidebar.openings")}
              </p>
              <p className="font-semibold text-slate-900 text-sm">{openings}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full  flex items-center justify-center text-primary shrink-0">
              <Briefcase size={18} />
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-0.5">
                {t("jobDetail.sidebar.workType")}
              </p>
              <p className="font-semibold text-slate-900 text-sm">{workType}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 flex flex-col gap-4 border">
        <h3 className="text-lg font-bold text-slate-900">
          {t("jobDetail.sidebar.relatedCategories")}
        </h3>
        <div className="flex flex-wrap gap-2">
          {relatedCategories.map((item) => (
            <a key={item} href="#" className={chipCls}>
              {item}
            </a>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 flex flex-col gap-4 border">
        <h3 className="text-lg font-bold text-slate-900">
          {t("jobDetail.sidebar.searchByRegion")}
        </h3>
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

import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export function DashboardHeader() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <header className="flex justify-between items-center mb-10">
      <div className="flex flex-col">
        <h2 className="text-4xl font-extrabold tracking-tight text-[#2d3338]">
          {t("employerDashboard.header.title")}
        </h2>
        <p className="text-[#596065] mt-2 font-medium">
          {t("employerDashboard.header.subtitle")}
        </p>
      </div>
      <Button
        variant="outline"
        className="px-6 py-5 bg-primary hover:bg-primary-hover text-white text-sm font-semibold hover:text-white rounded-xs"
        onClick={() => navigate('/jobs/jd-generator')}
      >
        {t("employerDashboard.header.postJob")}
      </Button>
    </header>
  );
}

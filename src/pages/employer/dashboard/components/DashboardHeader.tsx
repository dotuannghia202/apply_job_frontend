import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

export function DashboardHeader() {
  const { t } = useTranslation();

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
      >
        {t("employerDashboard.header.postJob")}
      </Button>
    </header>
  );
}

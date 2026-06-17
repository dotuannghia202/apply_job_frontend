import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Factory, Layers } from "lucide-react";

import AppBreadcrumb from "@/components/AppBreadcrumb";

import IndustryTab from "./components/IndustryTab";
import SpecializationTab from "./components/SpecializationTab";

type TabKey = "industry" | "specialization";

const tabs: { key: TabKey; icon: typeof Factory }[] = [
  { key: "industry", icon: Factory },
  { key: "specialization", icon: Layers },
];

export default function SystemSettingPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabKey>("industry");

  return (
    <main className="min-h-screen bg-main-background">
      <div className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        {/* Breadcrumb */}
        <AppBreadcrumb
          items={[
            {
              label: t("systemSetting.breadcrumb.admin"),
              to: "/admin/dashboard",
            },
            { label: t("systemSetting.breadcrumb.systemSetting") },
          ]}
        />

        {/* Page Header */}
        <section className="flex flex-col gap-4" data-section="SystemSettingHeader">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">
                {t("systemSetting.header.title")}
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-500">
                {t("systemSetting.header.description")}
              </p>
            </div>
          </div>
        </section>

        {/* Tabs */}
        <div className="flex gap-1 rounded-lg bg-white p-1 shadow-sm">
          {tabs.map(({ key, icon: Icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveTab(key)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold transition-all ${
                activeTab === key
                  ? "bg-primary text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-50 hover:text-primary"
              }`}
            >
              <Icon className="size-4" />
              {t(`systemSetting.tabs.${key}`)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "industry" && <IndustryTab />}
        {activeTab === "specialization" && <SpecializationTab />}
      </div>
    </main>
  );
}

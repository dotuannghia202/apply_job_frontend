import { Button } from "@/components/ui/button";

export const applicationTabs = [
  "All",
  "Pending",
  "Reviewing",
  "Interview",
  "Accepted",
  "Rejected",
] as const;

export type ApplicationTab = (typeof applicationTabs)[number];

interface ApplicationsTabsProps {
  activeTab: ApplicationTab;
  onChange: (tab: ApplicationTab) => void;
}

const ApplicationsTabs = ({ activeTab, onChange }: ApplicationsTabsProps) => (
  <div className="flex gap-2 overflow-x-auto border-b border-border pb-px">
    {applicationTabs.map((tab) => (
      <Button
        key={tab}
        variant="ghost"
        className={`rounded-none px-4 py-2 text-sm font-medium hover:bg-transparent ${
          tab === activeTab
            ? "border-b-2 border-primary text-primary"
            : "text-muted-foreground hover:text-primary"
        }`}
        type="button"
        onClick={() => onChange(tab)}
      >
        {tab}
      </Button>
    ))}
  </div>
);

export default ApplicationsTabs;

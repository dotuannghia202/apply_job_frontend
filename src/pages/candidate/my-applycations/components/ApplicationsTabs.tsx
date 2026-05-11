import { Button } from "@/components/ui/button";

const tabs = ["All", "Pending", "Reviewing", "Interview", "Resolved"] as const;

const ApplicationsTabs = () => (
  <div className="flex gap-2 overflow-x-auto border-b border-border pb-[1px]">
    {tabs.map((tab, index) => (
      <Button
        key={tab}
        variant="ghost"
        className={`rounded-none px-4 py-2 text-sm font-medium ${
          index === 0
            ? "border-b-2 border-primary text-primary"
            : "text-muted-foreground hover:text-primary"
        }`}
        type="button"
      >
        {tab}
      </Button>
    ))}
  </div>
);

export default ApplicationsTabs;

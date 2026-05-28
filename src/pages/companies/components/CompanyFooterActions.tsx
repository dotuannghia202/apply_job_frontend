import { Button } from "@/components/ui/button";
import type { RoleName } from "@/types/auth";

interface CompanyFooterActionsProps {
  role: RoleName;
}

export default function CompanyFooterActions({
  role,
}: CompanyFooterActionsProps) {
  if (role !== "EMPLOYER") return null;

  return (
    <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-6">
      <span className="text-xs text-slate-400">Last saved: 2 hours ago</span>
      <div className="flex items-center gap-2">
        <Button variant="ghost" className="text-slate-600">
          Cancel
        </Button>
        <Button className="bg-[#16a34a] text-white hover:bg-[#15803d]">
          Save Changes
        </Button>
      </div>
    </footer>
  );
}

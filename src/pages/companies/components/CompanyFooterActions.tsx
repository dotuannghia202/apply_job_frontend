import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { RoleName } from "@/types/auth";

interface CompanyFooterActionsProps {
  role: RoleName;
  onSave?: () => void;
  onCancel?: () => void;
  isSaving?: boolean;
}

export default function CompanyFooterActions({
  role,
  onSave,
  onCancel,
  isSaving = false,
}: CompanyFooterActionsProps) {
  if (role !== "EMPLOYER") return null;

  return (
    <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-6">
      <span className="text-xs text-slate-400">Last saved: 2 hours ago</span>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          className="text-slate-600 hover:bg-slate-600 hover:text-white"
          onClick={onCancel}
          disabled={isSaving}
        >
          Cancel
        </Button>
        <Button
          className="bg-primary text-white hover:bg-[#15803d]"
          onClick={onSave}
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </footer>
  );
}

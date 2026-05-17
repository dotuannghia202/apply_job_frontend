import {
  CalendarPlus,
  Download,
  LoaderCircle,
  MoreHorizontal,
  XCircle,
} from "lucide-react";
import { useState } from "react";

import { useUpdateApplicationStatus } from "@/api/applications/application.queries";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { Application } from "@/types/application";

type ApplicationActionsPopoverProps = {
  application: Application;
};

export function ApplicationActionsPopover({
  application,
}: ApplicationActionsPopoverProps) {
  const [open, setOpen] = useState(false);
  const updateStatusMutation = useUpdateApplicationStatus();
  const resumeUrl = application.resume?.fileUrl ?? "";
  const isUpdating = updateStatusMutation.isPending;

  const updateStatus = (status: "INTERVIEW" | "REJECTED") => {
    updateStatusMutation.mutate(
      {
        id: application.id,
        data: { status },
      },
      {
        onSuccess: () => setOpen(false),
      },
    );
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-9 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-900"
          aria-label="Open application actions"
        >
          <MoreHorizontal className="size-4" aria-hidden="true" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-56 p-1">
        <div className="flex flex-col">
          <Button
            type="button"
            variant="ghost"
            className="justify-start gap-2 rounded-md px-3 text-slate-700"
            disabled={!resumeUrl || isUpdating}
            asChild={Boolean(resumeUrl)}
          >
            {resumeUrl ? (
              <a href={resumeUrl} target="_blank" rel="noreferrer">
                <Download className="size-4" aria-hidden="true" />
                Download CV
              </a>
            ) : (
              <>
                <Download className="size-4" aria-hidden="true" />
                Download CV
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="justify-start gap-2 rounded-md px-3 text-slate-700"
            disabled={isUpdating}
            onClick={() => updateStatus("INTERVIEW")}
          >
            {isUpdating ? (
              <LoaderCircle className="size-4 animate-spin" />
            ) : (
              <CalendarPlus className="size-4" aria-hidden="true" />
            )}
            Schedule Interview
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="justify-start gap-2 rounded-md px-3 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
            disabled={isUpdating}
            onClick={() => updateStatus("REJECTED")}
          >
            <XCircle className="size-4" aria-hidden="true" />
            Reject Candidate
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

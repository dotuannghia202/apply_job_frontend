import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type {
  ApplicationInfo,
  InteractionNote,
} from "@/pages/candidate/my-applications/components/types";

const RightRail = ({
  application,
  interactions,
}: {
  application: ApplicationInfo;
  interactions: InteractionNote[];
}) => (
  <div className="space-y-6">
    <Card className="border-border p-6 shadow-[0_12px_40px_rgba(25,28,25,0.08)]">
      <h3 className="text-base font-semibold text-foreground">
        Application info
      </h3>
      <div className="mt-4 space-y-3 text-sm text-muted-foreground">
        <div>
          <p className="text-xs uppercase tracking-[0.2em]">Position</p>
          <p className="text-base text-foreground">{application.position}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em]">Company</p>
          <p className="text-base text-foreground">{application.company}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em]">Applied</p>
          <p className="text-base text-foreground">{application.appliedOn}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-primary/10 text-primary">
            {application.status}
          </Badge>
          <span className="text-xs">{application.stageHint}</span>
        </div>
      </div>
    </Card>

    <Card className="border-border p-6 shadow-[0_12px_40px_rgba(25,28,25,0.08)]">
      <h3 className="text-base font-semibold text-foreground">
        Interaction history
      </h3>
      <div className="mt-4 space-y-3">
        {interactions.map((note) => (
          <div key={note.id} className="rounded-xl bg-secondary/40 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              {note.time}
            </p>
            <p className="text-sm text-foreground">{note.title}</p>
            <p className="text-xs text-muted-foreground">{note.summary}</p>
          </div>
        ))}
      </div>
    </Card>

    <Card className="border-border p-6 shadow-[0_12px_40px_rgba(25,28,25,0.08)]">
      <h3 className="text-base font-semibold text-foreground">Actions</h3>
      <div className="mt-4 grid gap-3">
        <Button className="w-full">Accept</Button>
        <Button variant="secondary" className="w-full">
          Schedule interview
        </Button>
        <Button variant="outline" className="w-full">
          Reject
        </Button>
      </div>
    </Card>
  </div>
);

export default RightRail;

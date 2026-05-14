import { Briefcase } from "lucide-react";

import { Card } from "@/components/ui/card";
import type { WorkExperienceItem } from "@/pages/candidate/my-applications/components/types";

const WorkExperienceList = ({ items }: { items: WorkExperienceItem[] }) => (
  <Card className="border-border p-6 shadow-[0_10px_32px_rgba(25,28,25,0.06)]">
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-lg font-semibold text-foreground">
          Work experience
        </h2>
        <p className="text-sm text-muted-foreground">Recent roles and impact</p>
      </div>
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-primary">
        <Briefcase className="h-5 w-5" aria-hidden="true" />
      </div>
    </div>

    <div className="mt-5 space-y-4">
      {items.map((item) => (
        <div key={item.id} className="rounded-xl bg-secondary/40 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {item.period}
          </p>
          <h3 className="text-base font-semibold text-foreground">
            {item.role}
          </h3>
          <p className="text-sm text-muted-foreground">{item.company}</p>
          <ul className="mt-3 list-disc space-y-1 pl-4 text-sm text-muted-foreground">
            {item.highlights.map((highlight, index) => (
              <li key={`${item.id}-${index}`}>{highlight}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </Card>
);

export default WorkExperienceList;

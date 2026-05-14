import { GraduationCap } from "lucide-react";

import { Card } from "@/components/ui/card";
import type { EducationItem } from "@/pages/candidate/my-applications/components/types";

const EducationTimeline = ({ items }: { items: EducationItem[] }) => (
  <Card className="border-border p-6 shadow-[0_10px_32px_rgba(25,28,25,0.06)]">
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Education</h2>
        <p className="text-sm text-muted-foreground">Academic background</p>
      </div>
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-primary">
        <GraduationCap className="h-5 w-5" aria-hidden="true" />
      </div>
    </div>

    <div className="mt-5 space-y-4">
      {items.map((item) => (
        <div key={item.id} className="rounded-xl bg-secondary/40 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {item.period}
          </p>
          <h3 className="text-base font-semibold text-foreground">
            {item.school}
          </h3>
          <p className="text-sm text-muted-foreground">{item.degree}</p>
          <p className="mt-2 text-sm text-muted-foreground">{item.summary}</p>
        </div>
      ))}
    </div>
  </Card>
);

export default EducationTimeline;

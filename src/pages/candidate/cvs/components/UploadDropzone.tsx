import { UploadCloud } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const UploadDropzone = () => (
  <Card className="group relative min-h-[240px] gap-0 border-2 border-dashed border-border bg-card py-0 shadow-none transition-colors duration-300 hover:border-primary">
    <Label
      htmlFor="cv-upload"
      className="relative flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl p-12 text-center"
    >
      <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-b from-primary/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-primary shadow-[0_8px_16px_rgba(10,45,22,0.08)] transition-transform duration-300 group-hover:scale-110">
        <UploadCloud className="h-8 w-8" aria-hidden="true" />
      </div>
      <span className="text-lg font-medium text-foreground">
        Drag and drop a PDF here or click to select
      </span>
      <span className="text-xs font-medium uppercase tracking-[0.05em] text-muted-foreground">
        PDF only, up to 5MB
      </span>
    </Label>
    <Input
      id="cv-upload"
      type="file"
      accept="application/pdf"
      className="sr-only"
    />
  </Card>
);

export default UploadDropzone;

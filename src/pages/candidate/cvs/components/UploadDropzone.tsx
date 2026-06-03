import type { ChangeEvent, DragEvent } from "react";
import { LoaderCircle, UploadCloud } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type UploadDropzoneProps = {
  isUploading?: boolean;
  onFileSelect: (file: File) => void;
};

const UploadDropzone = ({
  isUploading = false,
  onFileSelect,
}: UploadDropzoneProps) => {
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;
    onFileSelect(file);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    const file = event.dataTransfer.files?.[0];
    if (!file) return;

    onFileSelect(file);
  };

  return (
    <Card
      className="group relative min-h-45 gap-0 border-2 border-dashed border-border bg-card py-0 shadow-none transition-colors duration-300 hover:border-primary"
      onDrop={handleDrop}
      onDragOver={(event) => event.preventDefault()}
    >
      <Label
        htmlFor="cv-upload"
        className="relative flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl p-12 text-center"
      >
        <div className="pointer-events-none absolute inset-0 rounded-xl bg-linear-to-b from-primary/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-primary shadow-[0_8px_16px_rgba(10,45,22,0.08)] transition-transform duration-300 group-hover:scale-110">
          {isUploading ? (
            <LoaderCircle className="h-8 w-8 animate-spin" aria-hidden="true" />
          ) : (
            <UploadCloud className="h-8 w-8" aria-hidden="true" />
          )}
        </div>
        <span className="text-lg font-medium text-foreground">
          {isUploading
            ? "Uploading CV..."
            : "Drag and drop a PDF here or click to select"}
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
        disabled={isUploading}
        onChange={handleInputChange}
      />
    </Card>
  );
};

export default UploadDropzone;

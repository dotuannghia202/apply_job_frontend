import { FileText, Link2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { AttachmentFile } from "@/pages/candidate/my-applications/components/types";

const AttachmentFiles = ({ files }: { files: AttachmentFile[] }) => {
  const { t } = useTranslation();

  return (
    <Card className="border-border p-6 shadow-[0_10px_32px_rgba(25,28,25,0.06)]">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            {t("myCVManagement.detail.attachments.title")}
          </h2>
          <p className="text-sm text-muted-foreground">
            {t("myCVManagement.detail.attachments.subtitle")}
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {files.map((file) => (
          <div
            key={file.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-secondary/50 px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white">
                {file.type === "link" ? (
                  <Link2 className="h-5 w-5 text-primary" aria-hidden="true" />
                ) : (
                  <FileText
                    className="h-5 w-5 text-primary"
                    aria-hidden="true"
                  />
                )}
              </div>
              <div>
                <p className="font-medium text-foreground">{file.name}</p>
                <p className="text-xs text-muted-foreground">{file.size}</p>
              </div>
            </div>
            {file.url ? (
              <Button asChild variant="outline" size="sm">
                <a
                  href={`https://docs.google.com/viewer?url=${encodeURIComponent(file.url)}`}
                  download={file.name}
                  target="_blank"
                  rel="noreferrer"
                >
                  {t("myCVManagement.detail.attachments.download")}
                </a>
              </Button>
            ) : (
              <Button variant="outline" size="sm" disabled>
                {t("myCVManagement.detail.attachments.download")}
              </Button>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};

export default AttachmentFiles;

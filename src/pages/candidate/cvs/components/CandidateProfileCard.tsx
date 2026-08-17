import { useState } from "react";
import { Download, ExternalLink, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { openFileInNewTab, handleDownloadFile } from "@/helper";
import { NotificationPopup } from "@/components/NotificationPopup";

const CandidateProfileCard = ({
  fileName,
  cvUrl,
}: {
  fileName: string;
  cvUrl: string;
}) => {
  const { t } = useTranslation();
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState("");

  const handleDownloadCV = async () => {
    try {
      setIsDownloading(true);
      await handleDownloadFile(cvUrl, fileName);
    } catch (err) {
      setError(
        t(
          "myCVManagement.detail.status.downloadFailed",
          "Không thể tải xuống file. Vui lòng thử lại sau.",
        ),
      );
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <Card className="flex flex-col gap-4 border-border p-6 shadow-[0_12px_40px_rgba(25,28,25,0.08)]">
        <div className="flex items-center justify-between">
          <h2 className="text-[1.125rem] font-semibold text-foreground">
            {fileName}
          </h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <a
                href={openFileInNewTab(cvUrl)}
                target="_blank"
                rel="noreferrer"
              >
                <ExternalLink className="mr-1.5 h-4 w-4" />
                {t("myCVManagement.actions.openNewTab", "Mở tab mới")}
              </a>
            </Button>
            <Button
              size="sm"
              onClick={handleDownloadCV}
              disabled={isDownloading}
            >
              {isDownloading ? (
                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-1.5 h-4 w-4" />
              )}
              {t("myCVManagement.actions.download", "Tải xuống")}
            </Button>
          </div>
        </div>

        {/* Khung xem PDF gọn gàng, vừa vặn chiều cao và không bị khoảng thừa màu đen */}
        <div className="relative h-187.5 w-full overflow-hidden rounded-lg border border-border bg-slate-100 shadow-inner">
          <iframe
            src={`${cvUrl}#toolbar=1&navpanes=0&scrollbar=0&view=FitH`}
            title={t(
              "myCVManagement.detail.profile.previewTitle",
              "Xem trước CV",
            )}
            className="h-full w-[calc(100%+20px)] border-none"
          />
        </div>
      </Card>

      <NotificationPopup
        open={Boolean(error)}
        variant="error"
        title={t("common.notification", "Thông báo")}
        message={error}
        onDismiss={() => setError("")}
        dismissLabel={t("common.close", "Đóng")}
      />
    </div>
  );
};

export default CandidateProfileCard;

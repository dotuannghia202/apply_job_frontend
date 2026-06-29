import { Download, Eye } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import type { CvItem } from "@/pages/candidate/cvs/components/types";

type CvActionsProps = {
  item: CvItem;
  onDownload: () => void;
};

const CvActions = ({
  item,
  onDownload,
}: CvActionsProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-2">
      <Button
        asChild
        variant="ghost"
        size="icon"
        className="text-primary hover:text-primary"
        title={t("myCVManagement.card.actions.viewCv")}
      >
        <Link to={`/my-cv/${item.id}`}>
          <Eye className="h-4 w-4" aria-hidden="true" />
        </Link>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="text-muted-foreground"
        title={t("myCVManagement.card.actions.download")}
        type="button"
        disabled={!item.fileUrl}
        onClick={onDownload}
      >
        <Download className="h-4 w-4" aria-hidden="true" />
      </Button>
    </div>
  );
};

export default CvActions;

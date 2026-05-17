import { Download, Eye, Star } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import type { CvItem } from "@/pages/candidate/cvs/components/types";

type CvActionsProps = {
  item: CvItem;
  isUpdating?: boolean;
  onDownload: () => void;
  onSetDefault: () => void;
};

const CvActions = ({
  item,
  isUpdating,
  onDownload,
  onSetDefault,
}: CvActionsProps) => (
  <div className="flex items-center gap-2">
    <Button
      asChild
      variant="ghost"
      size="icon"
      className="text-muted-foreground hover:text-primary"
      title="View CV"
    >
      <Link to={`/my-cv/${item.id}`}>
        <Eye className="h-4 w-4" aria-hidden="true" />
      </Link>
    </Button>
    <Button
      variant="ghost"
      size="icon"
      className="text-muted-foreground hover:text-primary"
      title="Download"
      type="button"
      disabled={!item.fileUrl}
      onClick={onDownload}
    >
      <Download className="h-4 w-4" aria-hidden="true" />
    </Button>
    {!item.isDefault ? (
      <Button
        variant="outline"
        size="sm"
        className="gap-1 text-muted-foreground hover:text-primary"
        title="Set as default"
        type="button"
        disabled={isUpdating}
        onClick={onSetDefault}
      >
        <Star className="h-3.5 w-3.5" aria-hidden="true" />
        {isUpdating ? "Saving" : "Default"}
      </Button>
    ) : null}
  </div>
);

export default CvActions;

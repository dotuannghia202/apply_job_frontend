import { Download, Eye, Star } from "lucide-react";

import { Button } from "@/components/ui/button";

const CvActions = ({ isDefault }: { isDefault?: boolean }) => (
  <div className="flex items-center gap-2">
    <Button
      variant="ghost"
      size="icon"
      className="text-muted-foreground hover:text-primary"
      title="View CV"
      type="button"
    >
      <Eye className="h-4 w-4" aria-hidden="true" />
    </Button>
    {isDefault ? (
      <Button
        variant="ghost"
        size="icon"
        className="text-muted-foreground hover:text-primary"
        title="Download"
        type="button"
      >
        <Download className="h-4 w-4" aria-hidden="true" />
      </Button>
    ) : (
      <Button
        variant="outline"
        size="sm"
        className="gap-1 text-muted-foreground hover:text-primary"
        title="Set as default"
        type="button"
      >
        <Star className="h-3.5 w-3.5" aria-hidden="true" />
        Default
      </Button>
    )}
  </div>
);

export default CvActions;

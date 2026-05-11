import { FileText, Star, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import CvActions from "@/pages/candidate/cvs/components/CvActions";
import type { CvItem } from "@/pages/candidate/cvs/components/types";

const CvCard = ({ item }: { item: CvItem }) => (
  <Card className="h-full border-border shadow-[0_4px_24px_rgba(15,23,42,0.04)] transition-shadow duration-300 hover:shadow-[0_8px_32px_rgba(15,23,42,0.08)]">
    <CardContent className="flex h-full flex-1 flex-col gap-6">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-destructive/15 text-destructive">
          <FileText className="h-5 w-5" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <h3
            className="truncate text-base font-medium text-foreground"
            title={item.fileName}
          >
            {item.fileName}
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Updated: {item.updatedAt}
          </p>
        </div>
      </div>

      <div className="flex-1">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.05em] text-muted-foreground">
          AI skill analysis
        </p>
        <div className="flex flex-wrap gap-2">
          {item.skills.map((skill) => (
            <Badge
              key={`${item.id}-${skill}`}
              variant="secondary"
              className="rounded-full bg-secondary text-muted-foreground"
            >
              {skill}
            </Badge>
          ))}
        </div>
      </div>

      {item.isDefault ? (
        <Badge className="w-fit gap-1.5 bg-primary/10 px-3 py-1 text-primary">
          <Star className="h-3.5 w-3.5" aria-hidden="true" />
          Default CV
        </Badge>
      ) : (
        <div className="h-6" />
      )}
    </CardContent>
    <CardFooter className="mt-auto justify-between border-t border-border pt-4">
      <CvActions isDefault={item.isDefault} />
      <Button
        variant="ghost"
        size="icon"
        className="text-muted-foreground hover:bg-destructive/15 hover:text-destructive"
        title="Delete"
        type="button"
      >
        <Trash2 className="h-4 w-4" aria-hidden="true" />
      </Button>
    </CardFooter>
  </Card>
);

export default CvCard;

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const SavedJobEmptyState = () => (
  <Card className="flex flex-col items-center justify-center gap-4 px-6 py-16 text-center shadow-[0_4px_32px_rgba(25,28,25,0.06)]">
    <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary/15 to-secondary" />
    <div className="space-y-2">
      <h2 className="text-xl font-bold text-foreground">No saved jobs yet</h2>
      <p className="max-w-md text-muted-foreground">
        Explore opportunities that fit you and save them to apply later.
      </p>
    </div>
    <Button className="bg-gradient-to-r from-primary to-primary/70 text-primary-foreground">
      Explore jobs now
    </Button>
  </Card>
);

export default SavedJobEmptyState;

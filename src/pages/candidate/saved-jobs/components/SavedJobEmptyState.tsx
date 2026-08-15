import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const SavedJobEmptyState = () => {
  const { t } = useTranslation();

  return (
    <Card className="flex flex-col items-center justify-center gap-4 -mt-5 px-6 py-16 text-center shadow-[0_4px_32px_rgba(25,28,25,0.06)]">
      <div className="space-y-2">
        <h2 className="text-xl font-bold text-foreground">
          {t("savedJobs.empty.title")}
        </h2>
        <p className="max-w-md text-muted-foreground">
          {t("savedJobs.empty.description")}
        </p>
      </div>
      <Button className=" text-white">{t("savedJobs.empty.action")}</Button>
    </Card>
  );
};

export default SavedJobEmptyState;

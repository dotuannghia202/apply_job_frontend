import { useTranslation } from "react-i18next";

type SavedJobHeaderProps = {
  savedCount: number;
};

const SavedJobHeader = ({ savedCount }: SavedJobHeaderProps) => {
  const { t } = useTranslation();

  return (
    <header className="flex items-center justify-between -mt-6">
      <h1 className="text-[2rem] font-bold tracking-tight text-foreground">
        {t("savedJobs.header.title")}
      </h1>
      <p className="text-base text-muted-foreground">
        {t("savedJobs.header.savedCountStart")}{" "}
        <span className="font-bold text-primary">{savedCount}</span>{" "}
        {t("savedJobs.header.savedCountEnd", { count: savedCount })}
      </p>
    </header>
  );
};

export default SavedJobHeader;

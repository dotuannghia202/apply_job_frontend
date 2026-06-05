import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

export function PageHero() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <header className="mb-12">
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#2d3338] mb-4 leading-tight">
        {t("employerPostJob.aiHero.titlePrefix")}{" "}
        <span className="text-primary">
          {t("employerPostJob.aiHero.titleHighlight")}
        </span>
      </h1>
      <p className="text-lg text-[#596065] max-w-2xl leading-relaxed">
        {t("employerPostJob.aiHero.description")}
      </p>

      <Button
        variant="outline"
        size="lg"
        className="mt-8 rounded-lg font-bold text-primary border-primary hover:bg-primary hover:text-white"
        onClick={() => navigate("/jobs/publish")}
      >
        {t("employerPostJob.aiHero.postManually")}
      </Button>
    </header>
  );
}

import { useTranslation } from "react-i18next";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { SkillItem } from "@/pages/candidate/my-applications/components/types";

const SkillsMatrix = ({ skills }: { skills: SkillItem[] }) => {
  const { t } = useTranslation();

  return (
    <Card className="border-border p-6 shadow-[0_10px_32px_rgba(25,28,25,0.06)]">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            {t("myCVManagement.detail.skills.title")}
          </h2>
          <p className="text-sm text-muted-foreground">
            {t("myCVManagement.detail.skills.subtitle")}
          </p>
        </div>
        <Badge className="bg-primary/10 text-primary">
          {t("myCVManagement.detail.skills.topSkills")}
        </Badge>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {skills.map((skill) => (
          <div key={skill.id} className="rounded-xl bg-secondary/40 p-4">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-foreground">{skill.name}</p>
              <Badge variant="secondary" className="uppercase tracking-wider">
                {t(`myCVManagement.detail.skills.levels.${skill.level}`)}
              </Badge>
            </div>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-border">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${skill.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default SkillsMatrix;

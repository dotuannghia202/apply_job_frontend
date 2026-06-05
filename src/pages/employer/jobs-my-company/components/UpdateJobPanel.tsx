import { PencilLine, Save, X } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { useGetSkills } from "@/api/skills/skill.queries";
import { useGetSpecializations } from "@/api/specializations/specialization.queries";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";
import { FilterTextField } from "@/pages/employer/jobs-my-company/components/FilterTextField";
import { LevelToggleGroup } from "@/pages/employer/jobs-my-company/components/LevelToggleGroup";
import { ListEditor } from "@/pages/employer/jobs-my-company/components/ListEditor";
import {
  fieldClass,
  getJobSkillNames,
  type SelectedSkill,
  type UpdateJobFormState,
} from "@/pages/employer/jobs-my-company/helper";
import type { Job } from "@/types/job";

type UpdateJobPanelProps = {
  job: Job;
  form: UpdateJobFormState;
  onChange: (next: UpdateJobFormState) => void;
  onCancel: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
};

export function UpdateJobPanel({
  job,
  form,
  onChange,
  onCancel,
  onSubmit,
  isSubmitting,
}: UpdateJobPanelProps) {
  const { t } = useTranslation();
  const [skillSearch, setSkillSearch] = useState("");
  const debouncedSkillSearch = useDebounce(skillSearch);
  const specializationsQuery = useGetSpecializations({ page: 1, size: 100 });
  const skillsQuery = useGetSkills({
    page: 1,
    size: 8,
    name: debouncedSkillSearch || undefined,
  });

  const currentSkillNames = getJobSkillNames(job);
  const selectedSkillIds = new Set(
    form.selectedSkills.map((skill) => skill.id),
  );

  const update = (patch: Partial<UpdateJobFormState>) =>
    onChange({ ...form, ...patch });

  const addSkill = (skill: SelectedSkill) => {
    if (selectedSkillIds.has(skill.id)) return;
    update({ selectedSkills: [...form.selectedSkills, skill] });
  };

  const removeSkill = (id: number) => {
    update({
      selectedSkills: form.selectedSkills.filter((skill) => skill.id !== id),
    });
  };

  return (
    <Card className="border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
      <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 md:flex-row md:items-start">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-primary">
            <PencilLine className="size-4" aria-hidden="true" />
            {t("employerJobs.update.eyebrow")}
          </div>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-950">
            {job.name}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {t("employerJobs.update.description")}
          </p>
        </div>
        <Button type="button" variant="ghost" onClick={onCancel}>
          <X className="size-4" aria-hidden="true" />
          {t("employerJobs.update.close")}
        </Button>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)]">
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <FilterTextField
              label={t("employerJobs.update.fields.jobTitle")}
              value={form.name}
              onChange={(name) => update({ name })}
            />
            <FilterTextField
              label={t("employerJobs.update.fields.location")}
              value={form.location}
              onChange={(location) => update({ location })}
            />
            <FilterTextField
              label={t("employerJobs.update.fields.minSalary")}
              type="number"
              value={form.minSalary}
              onChange={(minSalary) => update({ minSalary })}
            />
            <FilterTextField
              label={t("employerJobs.update.fields.maxSalary")}
              type="number"
              value={form.maxSalary}
              onChange={(maxSalary) => update({ maxSalary })}
            />
            <FilterTextField
              label={t("employerJobs.update.fields.quantity")}
              type="number"
              value={form.quantity}
              onChange={(quantity) => update({ quantity })}
            />
            <FilterTextField
              label={t("employerJobs.update.fields.workingHours")}
              value={form.workingHours}
              onChange={(workingHours) => update({ workingHours })}
              placeholder={t("employerJobs.update.placeholders.workingHours")}
            />
            <FilterTextField
              label={t("employerJobs.update.fields.startDate")}
              type="date"
              value={form.startDate}
              onChange={(startDate) => update({ startDate })}
            />
            <FilterTextField
              label={t("employerJobs.update.fields.endDate")}
              type="date"
              value={form.endDate}
              onChange={(endDate) => update({ endDate })}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-sm font-semibold text-slate-700">
              {t("employerJobs.update.fields.description")}
            </Label>
            <Textarea
              value={form.description}
              onChange={(event) => update({ description: event.target.value })}
              rows={5}
              className="resize-none rounded-md border-slate-200 bg-white text-sm text-slate-800 shadow-none focus-visible:ring-primary/20"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <ListEditor
              label={t("employerJobs.update.fields.requirements")}
              placeholder={t("employerJobs.update.placeholders.requirement")}
              items={form.requirements}
              onChange={(requirements) => update({ requirements })}
            />
            <ListEditor
              label={t("employerJobs.update.fields.benefits")}
              placeholder={t("employerJobs.update.placeholders.benefit")}
              items={form.benefits}
              onChange={(benefits) => update({ benefits })}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold text-slate-700">
              {t("employerJobs.update.fields.levels")}
            </Label>
            <LevelToggleGroup
              value={form.levels}
              onChange={(levels) => update({ levels })}
            />
          </div>
        </div>

        <aside className="space-y-5">
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
              {t("employerJobs.update.fields.specialization")}
            </Label>
            <select
              value={form.specializationId}
              onChange={(event) =>
                update({ specializationId: event.target.value })
              }
              className={cn(fieldClass, "px-3")}
            >
              <option value="">
                {t("employerJobs.update.placeholders.keepCurrent")}
              </option>
              {(specializationsQuery.data?.data?.result ?? []).map(
                (specialization) => (
                  <option key={specialization.id} value={specialization.id}>
                    {specialization.name}
                  </option>
                ),
              )}
            </select>
          </div>

          <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
            <div>
              <Label className="text-sm font-semibold text-slate-700">
                {t("employerJobs.update.fields.skillIds")}
              </Label>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                {t("employerJobs.update.skillHelp")}
              </p>
            </div>

            {currentSkillNames.length ? (
              <div className="flex flex-wrap gap-2">
                {currentSkillNames.map((skill) => (
                  <Badge key={skill} variant="outline" className="bg-slate-50">
                    {skill}
                  </Badge>
                ))}
              </div>
            ) : null}

            {form.selectedSkills.length ? (
              <div className="flex flex-wrap gap-2">
                {form.selectedSkills.map((skill) => (
                  <span
                    key={skill.id}
                    className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
                  >
                    {skill.name}
                    <button
                      type="button"
                      aria-label={t("employerJobs.listEditor.removeItem", {
                        item: skill.name,
                      })}
                      onClick={() => removeSkill(skill.id)}
                    >
                      <X className="size-3" aria-hidden="true" />
                    </button>
                  </span>
                ))}
              </div>
            ) : null}

            <Input
              value={skillSearch}
              onChange={(event) => setSkillSearch(event.target.value)}
              placeholder={t("employerJobs.update.placeholders.searchSkills")}
              className={fieldClass}
            />

            <div className="max-h-44 space-y-1 overflow-y-auto">
              {(skillsQuery.data?.data?.result ?? []).map((skill) => {
                const isSelected = selectedSkillIds.has(skill.id);

                return (
                  <button
                    key={skill.id}
                    type="button"
                    disabled={isSelected}
                    onClick={() => addSkill({ id: skill.id, name: skill.name })}
                    className={cn(
                      "flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition",
                      isSelected
                        ? "bg-primary/10 text-primary"
                        : "text-slate-700 hover:bg-slate-100",
                    )}
                  >
                    {skill.name}
                    <span className="text-xs text-slate-400">#{skill.id}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              type="button"
              className="flex-1"
              disabled={isSubmitting}
              onClick={onSubmit}
            >
              <Save className="size-4" aria-hidden="true" />
              {isSubmitting
                ? t("employerJobs.update.saving")
                : t("employerJobs.update.saveChanges")}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              disabled={isSubmitting}
              onClick={onCancel}
            >
              {t("employerJobs.common.cancel")}
            </Button>
          </div>
        </aside>
      </div>
    </Card>
  );
}

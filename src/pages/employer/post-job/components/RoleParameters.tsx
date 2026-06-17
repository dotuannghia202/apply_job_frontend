"use client";

// RoleParametersForm.tsx
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Check,
  ChevronsUpDown,
  Sparkles,
  Lightbulb,
  PenLine,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useGetSkills } from "@/api/skills/skill.queries";
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";
import { SkillTag } from "../components/SkillTag";
import type { Skill } from "../../types";

const DEFAULT_SKILLS: Skill[] = [];

interface Props {
  onGenerate?: (data: {
    jobTitle: string;
    skills: Skill[];

    levels: string[];
  }) => void;
}

// Shared class for every input/textarea, matching the original HTML.
const inputCls =
  "w-full px-4 py-3 " +
  "bg-[#dde3e9] " +
  "border-0 shadow-none " +
  "rounded-md " +
  "focus-visible:ring-2 focus-visible:ring-[#72b183]/20 focus-visible:ring-offset-0 " +
  "transition-all " +
  "text-[#2d3338] placeholder:text-[#596065]/60 " +
  "text-sm font-normal";

const LEVEL_OPTIONS = [
  "INTERN",
  "JUNIOR",
  "MIDDLE",
  "SENIOR",
  "LEAD",
  "MANAGER",
];

export function RoleParametersForm({ onGenerate }: Props) {
  const { t } = useTranslation();
  const [jobTitle, setJobTitle] = useState("");
  const [skills, setSkills] = useState<Skill[]>(DEFAULT_SKILLS);
  const [skillSearch, setSkillSearch] = useState("");
  const [skillOpen, setSkillOpen] = useState(false);

  const [levels, setLevels] = useState<string[]>([]);

  const debouncedSkillSearch = useDebounce(skillSearch);
  const { data: skillsData } = useGetSkills(
    {
      page: 1,
      size: 8,
      name: debouncedSkillSearch || undefined,
    },
    { enabled: skillOpen },
  );
  const skillOptions = skillsData?.data?.result ?? [];

  function addSkillFromOption(skill: { id: number; name: string }) {
    if (skills.some((s) => s.label.toLowerCase() === skill.name.toLowerCase()))
      return;
    setSkills((prev) => [...prev, { id: String(skill.id), label: skill.name }]);
  }

  function toggleLevel(level: string) {
    if (levels.includes(level)) {
      setLevels((prev) => prev.filter((item) => item !== level));
      return;
    }
    setLevels((prev) => [...prev, level]);
  }

  return (
    <section className="lg:col-span-5 space-y-8">
      {/* ── Main form card ── */}
      <div className="bg-white rounded-xl p-8 space-y-6">
        {/* Heading */}
        <div className="flex items-center gap-3">
          <PenLine size={20} className="text-[#72b183]" />
          <h2 className="text-xl font-bold text-[#2d3338]">
            {t("employerPostJob.aiForm.title")}
          </h2>
        </div>

        <div className="space-y-4">
          {/* Job Title */}
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-semibold text-[#596065]">
              {t("employerPostJob.aiForm.jobTitle")}
            </Label>
            <Input
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder={t("employerPostJob.aiForm.jobTitlePlaceholder")}
              className={inputCls}
            />
          </div>

          {/* Key Skills */}
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-semibold text-[#596065]">
              {t("employerPostJob.aiForm.keySkills")}
            </Label>

            {skills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <SkillTag
                    key={skill.id}
                    skill={skill}
                    onRemove={(id) =>
                      setSkills((prev) => prev.filter((s) => s.id !== id))
                    }
                  />
                ))}
              </div>
            )}

            <Popover
              open={skillOpen}
              onOpenChange={(open) => {
                setSkillOpen(open);
                if (!open) setSkillSearch("");
              }}
            >
              <PopoverTrigger asChild>
                <div className="relative">
                  <Input
                    value={skillSearch}
                    onChange={(e) => {
                      setSkillSearch(e.target.value);
                      setSkillOpen(true);
                    }}
                    placeholder={t("employerPostJob.aiForm.searchSkills")}
                    className={`${inputCls} pr-10`}
                  />
                  <ChevronsUpDown className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#596065]/70" />
                </div>
              </PopoverTrigger>
              <PopoverContent
                className="w-[--radix-popover-trigger-width] p-0"
                align="start"
              >
                <Command>
                  <CommandInput
                    placeholder={t("employerPostJob.aiForm.searchSkills")}
                    value={skillSearch}
                    onValueChange={setSkillSearch}
                  />
                  <CommandEmpty>
                    {t("employerPostJob.aiForm.noSkills")}
                  </CommandEmpty>
                  <CommandList className="max-h-44">
                    <CommandGroup>
                      {skillOptions.map((skill) => {
                        const isSelected = skills.some(
                          (item) =>
                            item.label.toLowerCase() ===
                            skill.name.toLowerCase(),
                        );

                        return (
                          <CommandItem
                            key={skill.id}
                            value={skill.name}
                            onSelect={() => addSkillFromOption(skill)}
                          >
                            <Check
                              className={cn(
                                "mr-2 size-4",
                                isSelected ? "opacity-100" : "opacity-0",
                              )}
                            />
                            {skill.name}
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Levels */}
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-semibold text-[#596065]">
              {t("employerPostJob.aiForm.levels")}
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {LEVEL_OPTIONS.map((level) => (
                <label
                  key={level}
                  className={`flex items-center gap-2 rounded-md px-3 py-2 text-xs font-semibold border transition ${levels.includes(level)
                      ? "bg-[#72b183]/15 border-[#72b183] text-[#2d3338]"
                      : "bg-white border-[#eaeef3] text-[#596065]"
                    }`}
                >
                  <input
                    type="checkbox"
                    checked={levels.includes(level)}
                    onChange={() => toggleLevel(level)}
                    className="accent-[#72b183]"
                  />
                  {t(`employerPostJob.levels.${level}`)}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Generate button */}
        <Button
          onClick={() => onGenerate?.({ jobTitle, skills, levels })}
          className="w-full py-6 rounded-lg font-bold text-white shadow-lg hover:scale-[1.02] active:scale-95 transition-all border-0"
          style={{
            background: "linear-gradient(135deg, #72b183 0%, #aed6ba 100%)",
          }}
        >
          <Sparkles size={18} className="mr-2" fill="currentColor" />
          {t("employerPostJob.aiForm.generate")}
        </Button>
      </div>

      {/* ── AI Pro Tip card ── */}
      <div className="bg-[#6f26f6]/10 rounded-xl p-6 flex gap-4 items-start">
        <Lightbulb size={20} className="text-[#6f26f6] shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-[#4200a2] mb-1">
            {t("employerPostJob.aiForm.proTipTitle")}
          </p>
          <p className="text-xs text-[#4200a2]/80 leading-relaxed">
            {t("employerPostJob.aiForm.proTipDescription")}
          </p>
        </div>
      </div>
    </section>
  );
}

"use client";

// RoleParametersForm.tsx
import { useState, type KeyboardEvent } from "react";
import { Sparkles, Lightbulb, PenLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SkillTag } from "../components/SkillTag";
import type { Skill } from "../../types";

const DEFAULT_SKILLS: Skill[] = [
  { id: "1", label: "React" },
  { id: "2", label: "Node.js" },
  { id: "3", label: "AWS" },
];

interface Props {
  onGenerate?: (data: {
    jobTitle: string;
    skills: Skill[];
    culture: string;
  }) => void;
}

// Shared class cho mọi input/textarea — khớp với bản gốc HTML
const inputCls =
  "w-full px-4 py-3 " +
  "bg-[#dde3e9] " +
  "border-0 shadow-none " +
  "rounded-md " +
  "focus-visible:ring-2 focus-visible:ring-[#72b183]/20 focus-visible:ring-offset-0 " +
  "transition-all " +
  "text-[#2d3338] placeholder:text-[#596065]/60 " +
  "text-sm font-normal";

export function RoleParametersForm({ onGenerate }: Props) {
  const [jobTitle, setJobTitle] = useState("");
  const [skills, setSkills] = useState<Skill[]>(DEFAULT_SKILLS);
  const [skillInput, setSkillInput] = useState("");
  const [culture, setCulture] = useState("");

  function addSkill() {
    const trimmed = skillInput.trim();
    if (!trimmed) return;
    if (skills.some((s) => s.label.toLowerCase() === trimmed.toLowerCase()))
      return;
    setSkills((prev) => [
      ...prev,
      { id: Date.now().toString(), label: trimmed },
    ]);
    setSkillInput("");
  }

  function handleSkillKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSkill();
    }
  }

  return (
    <section className="lg:col-span-5 space-y-8">
      {/* ── Main form card ── */}
      <div className="bg-[#f1f4f7] rounded-xl p-8 space-y-6">
        {/* Heading */}
        <div className="flex items-center gap-3">
          <PenLine size={20} className="text-[#72b183]" />
          <h2 className="text-xl font-bold text-[#2d3338]">Role Parameters</h2>
        </div>

        <div className="space-y-4">
          {/* Job Title */}
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-semibold text-[#596065]">
              Job Title
            </Label>
            <Input
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g. Senior Full Stack Engineer"
              className={inputCls}
            />
          </div>

          {/* Key Skills */}
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-semibold text-[#596065]">
              Key Skills
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

            <Input
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleSkillKeyDown}
              onBlur={addSkill}
              placeholder="Add a skill..."
              className={inputCls}
            />
          </div>

          {/* Company Culture */}
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-semibold text-[#596065]">
              Company Culture
            </Label>
            <Textarea
              value={culture}
              onChange={(e) => setCulture(e.target.value)}
              placeholder="Describe the vibe, values, and team dynamic..."
              rows={4}
              className={`${inputCls} resize-none`}
            />
          </div>
        </div>

        {/* Generate button */}
        <Button
          onClick={() => onGenerate?.({ jobTitle, skills, culture })}
          className="w-full py-6 rounded-lg font-bold text-white shadow-lg hover:scale-[1.02] active:scale-95 transition-all border-0"
          style={{
            background: "linear-gradient(135deg, #72b183 0%, #aed6ba 100%)",
          }}
        >
          <Sparkles size={18} className="mr-2" fill="currentColor" />
          Generate Intelligence
        </Button>
      </div>

      {/* ── AI Pro Tip card ── */}
      <div className="bg-[#6f26f6]/10 rounded-xl p-6 flex gap-4 items-start">
        <Lightbulb size={20} className="text-[#6f26f6] shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-[#4200a2] mb-1">AI Pro Tip</p>
          <p className="text-xs text-[#4200a2]/80 leading-relaxed">
            Including mentions of mentorship or professional development budget
            increases application rates by 34% for senior roles.
          </p>
        </div>
      </div>
    </section>
  );
}

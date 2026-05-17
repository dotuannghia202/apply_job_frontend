import { Check, ChevronsUpDown, FileText, LoaderCircle, X } from "lucide-react";
import { useState, type FormEvent } from "react";

import { useGetSkills } from "@/api/skills/skill.queries";
import { useGetSpecializations } from "@/api/specializations/specialization.queries";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";
import type { Skill } from "@/types/skill";

export type UploadedResumeDraft = {
  fileName: string;
  fileUrl: string;
};

type SelectedSpecialization = {
  id: number;
  name: string;
} | null;

type CreateResumeFormProps = {
  draft: UploadedResumeDraft;
  isSubmitting: boolean;
  onCancel: () => void;
  onSubmit: (data: {
    fileName: string;
    specializationId?: number;
    skillIds?: number[];
  }) => void;
};

const inputClass =
  "h-11 rounded-md border-slate-200 bg-white text-sm text-slate-800 shadow-none focus-visible:ring-primary/20";

function SpecializationSelect({
  value,
  onChange,
}: {
  value: SelectedSpecialization;
  onChange: (next: SelectedSpecialization) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);
  const specializationsQuery = useGetSpecializations(
    {
      page: 1,
      size: 10,
      name: debouncedSearch || undefined,
    },
    { enabled: open },
  );

  const specializations = specializationsQuery.data?.data?.result ?? [];

  return (
    <div className="flex flex-col gap-2">
      <Label className="text-sm font-semibold text-slate-700">
        Specialization
      </Label>
      <Popover
        open={open}
        onOpenChange={(nextOpen) => {
          setOpen(nextOpen);
          if (!nextOpen) setSearch("");
        }}
      >
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="h-11 justify-between rounded-md border-slate-200 bg-white px-3 text-sm font-normal text-slate-800 shadow-none hover:bg-white"
            onFocus={() => setOpen(true)}
          >
            <span className={cn("truncate", !value && "text-slate-400")}>
              {value?.name ?? "Select specialization"}
            </span>
            <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-60" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
          <Command shouldFilter={false}>
            <CommandInput
              value={search}
              onValueChange={setSearch}
              placeholder="Search specialization..."
            />
            <CommandList>
              <CommandEmpty>
                {specializationsQuery.isFetching
                  ? "Loading specializations..."
                  : "No specialization found."}
              </CommandEmpty>
              <CommandGroup>
                {value ? (
                  <CommandItem
                    value="clear-specialization"
                    onSelect={() => {
                      onChange(null);
                      setOpen(false);
                    }}
                  >
                    <X className="mr-2 size-4 opacity-70" />
                    Clear specialization
                  </CommandItem>
                ) : null}
                {specializations.map((specialization) => (
                  <CommandItem
                    key={specialization.id}
                    value={specialization.name}
                    onSelect={() => {
                      onChange({
                        id: specialization.id,
                        name: specialization.name,
                      });
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 size-4",
                        value?.id === specialization.id
                          ? "opacity-100"
                          : "opacity-0",
                      )}
                    />
                    {specialization.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

function SkillSelect({
  value,
  onChange,
}: {
  value: Skill[];
  onChange: (next: Skill[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);
  const skillsQuery = useGetSkills(
    {
      page: 1,
      size: 10,
      name: debouncedSearch || undefined,
    },
    { enabled: open },
  );

  const skills = skillsQuery.data?.data?.result ?? [];
  const selectedIds = new Set(value.map((skill) => skill.id));

  const toggleSkill = (skill: Skill) => {
    if (selectedIds.has(skill.id)) {
      onChange(value.filter((item) => item.id !== skill.id));
      return;
    }

    onChange([...value, skill]);
  };

  return (
    <div className="flex flex-col gap-2">
      <Label className="text-sm font-semibold text-slate-700">Skills</Label>
      {value.length ? (
        <div className="flex flex-wrap gap-2">
          {value.map((skill) => (
            <Badge
              key={skill.id}
              variant="secondary"
              className="gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-primary"
            >
              {skill.name}
              <button
                type="button"
                aria-label={`Remove ${skill.name}`}
                onClick={() =>
                  onChange(value.filter((item) => item.id !== skill.id))
                }
              >
                <X className="size-3" />
              </button>
            </Badge>
          ))}
        </div>
      ) : null}

      <Popover
        open={open}
        onOpenChange={(nextOpen) => {
          setOpen(nextOpen);
          if (!nextOpen) setSearch("");
        }}
      >
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="h-11 justify-between rounded-md border-slate-200 bg-white px-3 text-sm font-normal text-slate-800 shadow-none hover:bg-white"
            onFocus={() => setOpen(true)}
          >
            <span className={cn("truncate", !value.length && "text-slate-400")}>
              {value.length ? `${value.length} skill(s) selected` : "Select skills"}
            </span>
            <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-60" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
          <Command shouldFilter={false}>
            <CommandInput
              value={search}
              onValueChange={setSearch}
              placeholder="Search skills..."
            />
            <CommandList>
              <CommandEmpty>
                {skillsQuery.isFetching ? "Loading skills..." : "No skill found."}
              </CommandEmpty>
              <CommandGroup>
                {skills.map((skill) => {
                  const selected = selectedIds.has(skill.id);

                  return (
                    <CommandItem
                      key={skill.id}
                      value={skill.name}
                      onSelect={() => toggleSkill(skill)}
                    >
                      <Check
                        className={cn(
                          "mr-2 size-4",
                          selected ? "opacity-100" : "opacity-0",
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
  );
}

export function CreateResumeForm({
  draft,
  isSubmitting,
  onCancel,
  onSubmit,
}: CreateResumeFormProps) {
  const [fileName, setFileName] = useState(draft.fileName);
  const [specialization, setSpecialization] =
    useState<SelectedSpecialization>(null);
  const [skills, setSkills] = useState<Skill[]>([]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedFileName = fileName.trim();
    if (!trimmedFileName) return;

    onSubmit({
      fileName: trimmedFileName,
      specializationId: specialization?.id,
      skillIds: skills.length ? skills.map((skill) => skill.id) : undefined,
    });
  };

  return (
    <Card className="border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 md:flex-row md:items-start">
          <div className="flex gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <FileText className="size-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-950">
                Complete CV information
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                File uploaded successfully. Add the metadata before saving it to
                your profile.
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            disabled={isSubmitting}
            onClick={onCancel}
          >
            <X className="size-4" />
            Cancel
          </Button>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
            Uploaded file URL
          </p>
          <a
            href={draft.fileUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-1 block truncate text-sm font-medium text-primary hover:underline"
          >
            {draft.fileUrl}
          </a>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="resume-file-name" className="text-sm font-semibold text-slate-700">
              File name
            </Label>
            <Input
              id="resume-file-name"
              value={fileName}
              disabled={isSubmitting}
              className={inputClass}
              onChange={(event) => setFileName(event.target.value)}
            />
          </div>

          <SpecializationSelect
            value={specialization}
            onChange={setSpecialization}
          />
        </div>

        <SkillSelect value={skills} onChange={setSkills} />

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting || !fileName.trim()}>
            {isSubmitting ? (
              <>
                <LoaderCircle className="size-4 animate-spin" />
                Saving CV...
              </>
            ) : (
              "Save CV"
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
}

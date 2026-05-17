import { Check, ChevronsUpDown, X } from "lucide-react";
import { useState } from "react";

import { useGetSkills } from "@/api/skills/skill.queries";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";

type SkillFilterPopoverProps = {
  value: string;
  onChange: (next: string) => void;
};

export function SkillFilterPopover({
  value,
  onChange,
}: SkillFilterPopoverProps) {
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

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) setSearch("");
  };

  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
        Skill
      </Label>
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="h-10 justify-between rounded-md border-slate-200 bg-white px-3 text-sm font-normal text-slate-800 shadow-none hover:bg-white"
            onFocus={() => setOpen(true)}
          >
            <span className={cn("truncate", !value && "text-slate-400")}>
              {value || "All skills"}
            </span>
            <ChevronsUpDown
              className="ml-2 size-4 shrink-0 opacity-60"
              aria-hidden="true"
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
          <Command shouldFilter={false}>
            <CommandInput
              value={search}
              onValueChange={setSearch}
              placeholder="Search skills..."
            />
            <CommandList className="max-h-56">
              <CommandEmpty>
                {skillsQuery.isFetching ? "Loading skills..." : "No skill found."}
              </CommandEmpty>
              <CommandGroup>
                {value ? (
                  <CommandItem
                    value="clear-skill-filter"
                    onSelect={() => {
                      onChange("");
                      setOpen(false);
                    }}
                  >
                    <X className="mr-2 size-4 opacity-70" aria-hidden="true" />
                    Clear skill filter
                  </CommandItem>
                ) : null}
                {skills.map((skill) => {
                  const selected = value === skill.name;

                  return (
                    <CommandItem
                      key={skill.id}
                      value={skill.name}
                      onSelect={() => {
                        onChange(skill.name);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 size-4",
                          selected ? "opacity-100" : "opacity-0",
                        )}
                        aria-hidden="true"
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

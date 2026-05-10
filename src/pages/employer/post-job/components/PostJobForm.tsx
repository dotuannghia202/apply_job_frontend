import { useMemo, useState, type KeyboardEvent } from "react";
import { Check, CheckCircle2, ChevronsUpDown, Plus, X } from "lucide-react";
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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import locationData from "@/assets/location-data/vietnam_provinces_wards_final.json";
import { useGetIndustries } from "@/api/industries/industry.queries";
import { useGetSpecializationsByIndustryId } from "@/api/specializations/specialization.queries";
import { useGetSkills } from "@/api/skills/skill.queries";
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";

export type PostJobFormData = {
  name: string;
  location: string;
  minSalary: string;
  maxSalary: string;
  quantity: string;
  description: string;
  requirements: string[];
  levels: string[];
  startDate: string;
  endDate: string;
  active: boolean;
  benefits: string[];
  workingHours: string;
  industryId: string;
  specializationId: string;
  skillIds: number[];
};

const LEVEL_OPTIONS = [
  "INTERN",
  "JUNIOR",
  "MIDDLE",
  "SENIOR",
  "LEAD",
  "MANAGER",
];

const inputCls =
  "w-full px-4 py-3 " +
  "bg-[#dde3e9] " +
  "border-0 shadow-none " +
  "rounded-md " +
  "focus-visible:ring-2 focus-visible:ring-[#72b183]/20 focus-visible:ring-offset-0 " +
  "transition-all " +
  "text-[#2d3338] placeholder:text-[#596065]/60 " +
  "text-sm font-normal";

type Props = {
  value: PostJobFormData;
  onChange: (next: PostJobFormData) => void;
  onSubmit?: () => void;
};

type Ward = {
  name: string;
  code: number;
};

type Province = {
  name: string;
  code: number;
  wards: Ward[];
};

function SectionHeader({ title, note }: { title: string; note?: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <h2 className="text-lg font-bold text-[#2d3338]">{title}</h2>
      {note ? (
        <span className="text-xs text-[#596065] font-semibold">{note}</span>
      ) : null}
    </div>
  );
}

function Tag({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="bg-[#8df5e4] text-[#005c53] px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 select-none">
      {label}
      <button
        onClick={onRemove}
        className="ml-0.5 hover:opacity-70 transition-opacity"
        aria-label={`Remove ${label}`}
        type="button"
      >
        <X size={12} strokeWidth={2.5} />
      </button>
    </span>
  );
}

function ListInput({
  label,
  placeholder,
  items,
  onAdd,
  onRemove,
  hint,
}: {
  label: string;
  placeholder: string;
  items: string[];
  onAdd: (value: string) => void;
  onRemove: (index: number) => void;
  hint?: string;
}) {
  const [value, setValue] = useState("");

  function addItem() {
    const trimmed = value.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setValue("");
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addItem();
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Label className="text-sm font-semibold text-[#596065]">{label}</Label>
      {hint ? <p className="text-xs text-[#7b848a]">{hint}</p> : null}
      {items.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {items.map((item, index) => (
            <Tag
              key={`${item}-${index}`}
              label={item}
              onRemove={() => onRemove(index)}
            />
          ))}
        </div>
      ) : null}
      <div className="flex gap-2">
        <Input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addItem}
          placeholder={placeholder}
          className={inputCls}
        />
        <Button
          type="button"
          variant="outline"
          className="rounded-md font-semibold border-[#72b183] text-[#2d3338]"
          onClick={addItem}
        >
          <Plus size={14} />
        </Button>
      </div>
    </div>
  );
}

type SearchableOption = {
  value: string;
  label: string;
};

function SearchableSelect({
  label,
  placeholder,
  searchPlaceholder,
  value,
  options,
  onChange,
  disabled,
  searchValue,
  onSearchChange,
  onOpenChange,
}: {
  label: string;
  placeholder: string;
  searchPlaceholder: string;
  value: string;
  options: SearchableOption[];
  onChange: (next: string) => void;
  disabled?: boolean;
  searchValue?: string;
  onSearchChange?: (next: string) => void;
  onOpenChange?: (open: boolean) => void;
}) {
  const [open, setOpen] = useState(false);
  const selected = options.find((item) => item.value === value);
  const commandInputProps = onSearchChange
    ? {
        value: searchValue ?? "",
        onValueChange: onSearchChange,
      }
    : undefined;

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    onOpenChange?.(nextOpen);
  };

  return (
    <div className="flex flex-col gap-2">
      <Label className="text-xs font-semibold text-[#7b848a]">{label}</Label>
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className={cn(
              "h-10 justify-between rounded-md border-0 bg-[#dde3e9] px-3 text-sm font-normal text-[#2d3338] shadow-none",
              disabled && "opacity-50",
            )}
          >
            {selected ? selected.label : placeholder}
            <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-60" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
          <Command>
            <CommandInput
              placeholder={searchPlaceholder}
              {...commandInputProps}
            />
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandList className="max-h-44">
              <CommandGroup>
                {options.map((item) => (
                  <CommandItem
                    key={item.value}
                    value={item.label}
                    onSelect={() => {
                      onChange(item.value);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 size-4",
                        item.value === value ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {item.label}
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

export function PostJobForm({ value, onChange, onSubmit }: Props) {
  const update = (patch: Partial<PostJobFormData>) =>
    onChange({ ...value, ...patch });

  const provinces = locationData as Province[];
  const [provinceCode, setProvinceCode] = useState("");
  const [wardCode, setWardCode] = useState("");
  const [street, setStreet] = useState("");
  const [industrySearch, setIndustrySearch] = useState("");
  const [skillSearch, setSkillSearch] = useState("");
  const [selectedSkillLabels, setSelectedSkillLabels] = useState<
    Record<number, string>
  >({});
  const provinceId = provinceCode ? Number(provinceCode) : null;
  const wardId = wardCode ? Number(wardCode) : null;
  const industryId = value.industryId ? Number(value.industryId) : 0;
  const debouncedIndustrySearch = useDebounce(industrySearch);
  const debouncedSkillSearch = useDebounce(skillSearch);

  const { data: industriesData } = useGetIndustries({
    page: 1,
    size: 8,
    name: debouncedIndustrySearch || undefined,
  });

  const { data: specializationsData } =
    useGetSpecializationsByIndustryId(industryId);

  const { data: skillsData } = useGetSkills({
    page: 1,
    size: 8,
    name: debouncedSkillSearch || undefined,
  });

  const selectedProvince = useMemo(
    () => provinces.find((item) => item.code === provinceId),
    [provinces, provinceId],
  );

  const selectedWard = useMemo(
    () => selectedProvince?.wards.find((ward) => ward.code === wardId),
    [selectedProvince, wardId],
  );

  const industryOptions = useMemo(
    () =>
      (industriesData?.data?.result ?? []).map((industry) => ({
        value: industry.id.toString(),
        label: industry.name,
      })),
    [industriesData],
  );

  const specializationOptions = useMemo(
    () =>
      (specializationsData?.data ?? []).map((specialization) => ({
        value: specialization.id.toString(),
        label: specialization.name,
      })),
    [specializationsData],
  );

  const skillOptions = useMemo(
    () => skillsData?.data?.result ?? [],
    [skillsData],
  );

  const skillOptionLabels = useMemo(() => {
    const map: Record<number, string> = {};
    skillOptions.forEach((skill) => {
      map[skill.id] = skill.name;
    });
    return map;
  }, [skillOptions]);

  function buildLocation(nextStreet: string, ward?: Ward, province?: Province) {
    const parts = [nextStreet, ward?.name, province?.name].filter(Boolean);
    return parts.join(", ");
  }

  function handleProvinceChange(next: string) {
    setProvinceCode(next);
    setWardCode("");
    setStreet("");
    const province = provinces.find((item) => item.code === Number(next));
    update({ location: buildLocation("", undefined, province) });
  }

  function handleWardChange(next: string) {
    setWardCode(next);
    const ward = selectedProvince?.wards.find(
      (item) => item.code === Number(next),
    );
    update({ location: buildLocation(street, ward, selectedProvince) });
  }

  function handleStreetChange(next: string) {
    setStreet(next);
    update({ location: buildLocation(next, selectedWard, selectedProvince) });
  }

  function handleIndustryChange(next: string) {
    update({ industryId: next, specializationId: "" });
  }

  function toggleLevel(level: string) {
    if (value.levels.includes(level)) {
      update({ levels: value.levels.filter((l) => l !== level) });
      return;
    }
    update({ levels: [...value.levels, level] });
  }

  function addSkill(id: number, label: string) {
    if (value.skillIds.includes(id)) return;
    update({ skillIds: [...value.skillIds, id] });
    setSelectedSkillLabels((prev) => ({ ...prev, [id]: label }));
  }

  function removeSkill(id: number) {
    update({ skillIds: value.skillIds.filter((skillId) => skillId !== id) });
    setSelectedSkillLabels((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }

  return (
    <section className="lg:col-span-7 space-y-8">
      <div className="bg-[#f1f4f7] rounded-xl p-8 space-y-6">
        <SectionHeader title="Job Basics" note="Required" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-semibold text-[#596065]">
              Job Title
            </Label>
            <Input
              value={value.name}
              onChange={(event) => update({ name: event.target.value })}
              placeholder="e.g. Senior Full Stack Engineer"
              className={inputCls}
            />
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <Label className="text-sm font-semibold text-[#596065]">
            Location
          </Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SearchableSelect
              label="Province / City"
              placeholder="Select province/city"
              searchPlaceholder="Search province..."
              value={provinceCode}
              options={provinces.map((province) => ({
                value: province.code.toString(),
                label: province.name,
              }))}
              onChange={handleProvinceChange}
            />
            <SearchableSelect
              label="Ward / Commune"
              placeholder="Select ward/commune"
              searchPlaceholder="Search ward..."
              value={wardCode}
              options={(selectedProvince?.wards ?? []).map((ward) => ({
                value: ward.code.toString(),
                label: ward.name,
              }))}
              onChange={handleWardChange}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-xs font-semibold text-[#7b848a]">
              Street / House No.
            </Label>
            <Input
              value={street}
              onChange={(event) => handleStreetChange(event.target.value)}
              placeholder="Enter house number, street, hamlet..."
              className={inputCls}
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Label className="text-sm font-semibold text-[#596065]">
            Job Description
          </Label>
          <Textarea
            value={value.description}
            onChange={(event) => update({ description: event.target.value })}
            placeholder="Describe the mission, scope, and expectations..."
            rows={5}
            className={`${inputCls} resize-none`}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl p-8 border border-[#eaeef3]/60 space-y-6">
        <SectionHeader title="Compensation" note="Required" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-semibold text-[#596065]">
              Min Salary
            </Label>
            <Input
              type="number"
              value={value.minSalary}
              min={0}
              onChange={(event) => update({ minSalary: event.target.value })}
              placeholder="0"
              className={inputCls}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-semibold text-[#596065]">
              Max Salary
            </Label>
            <Input
              type="number"
              min={0}
              value={value.maxSalary}
              onChange={(event) => update({ maxSalary: event.target.value })}
              placeholder="0"
              className={inputCls}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-semibold text-[#596065]">
              Quantity
            </Label>
            <Input
              type="number"
              min={1}
              value={value.quantity}
              onChange={(event) => update({ quantity: event.target.value })}
              placeholder="1"
              className={inputCls}
            />
          </div>
        </div>
      </div>

      <div className="bg-[#f1f4f7] rounded-xl p-8 space-y-6">
        <SectionHeader title="Schedule" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-semibold text-[#596065]">
              Start Date
            </Label>
            <Input
              type="date"
              value={value.startDate}
              onChange={(event) => update({ startDate: event.target.value })}
              className={inputCls}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-semibold text-[#596065]">
              End Date
            </Label>
            <Input
              type="date"
              value={value.endDate}
              onChange={(event) => update({ endDate: event.target.value })}
              className={inputCls}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-semibold text-[#596065]">
              Working Hours
            </Label>
            <Input
              value={value.workingHours}
              onChange={(event) => update({ workingHours: event.target.value })}
              placeholder="Mon-Fri, 9:00-18:00"
              className={inputCls}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-8 border border-[#eaeef3]/60 space-y-6">
        <SectionHeader title="Requirements & Benefits" />
        <ListInput
          label="Requirements"
          placeholder="Add requirement"
          items={value.requirements}
          onAdd={(item) =>
            update({ requirements: [...value.requirements, item] })
          }
          onRemove={(index) =>
            update({
              requirements: value.requirements.filter((_, i) => i !== index),
            })
          }
          hint="Minimum list for BE: at least 1 requirement"
        />
        <ListInput
          label="Benefits"
          placeholder="Add benefit"
          items={value.benefits}
          onAdd={(item) => update({ benefits: [...value.benefits, item] })}
          onRemove={(index) =>
            update({ benefits: value.benefits.filter((_, i) => i !== index) })
          }
        />
      </div>

      <div className="bg-[#f1f4f7] rounded-xl p-8 space-y-6">
        <SectionHeader title="Levels" note="Required" />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {LEVEL_OPTIONS.map((level) => (
            <label
              key={level}
              className={`flex items-center gap-2 rounded-md px-3 py-2 text-xs font-semibold border transition ${
                value.levels.includes(level)
                  ? "bg-[#72b183]/15 border-[#72b183] text-[#2d3338]"
                  : "bg-white border-[#eaeef3] text-[#596065]"
              }`}
            >
              <input
                type="checkbox"
                checked={value.levels.includes(level)}
                onChange={() => toggleLevel(level)}
                className="accent-[#72b183]"
              />
              {level}
            </label>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl p-8 border border-[#eaeef3]/60 space-y-6">
        <SectionHeader title="Industry & Specialization" note="Required" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SearchableSelect
            label="Industry"
            placeholder="Select industry"
            searchPlaceholder="Search industry..."
            value={value.industryId}
            options={industryOptions}
            onChange={handleIndustryChange}
            searchValue={industrySearch}
            onSearchChange={setIndustrySearch}
            onOpenChange={(open) => {
              if (!open) setIndustrySearch("");
            }}
          />
          <SearchableSelect
            label="Specialization"
            placeholder="Select specialization"
            searchPlaceholder="Search specialization..."
            value={value.specializationId}
            options={specializationOptions}
            onChange={(next) => update({ specializationId: next })}
            disabled={!value.industryId}
          />
        </div>
      </div>

      <div className="bg-[#f1f4f7] rounded-xl p-8 space-y-6">
        <SectionHeader title="Skills" note="Required" />
        <div className="flex flex-col gap-3">
          <Label className="text-sm font-semibold text-[#596065]">Skills</Label>
          {value.skillIds.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {value.skillIds.map((id) => (
                <Tag
                  key={id}
                  label={
                    selectedSkillLabels[id] ??
                    skillOptionLabels[id] ??
                    `Skill #${id}`
                  }
                  onRemove={() => removeSkill(id)}
                />
              ))}
            </div>
          ) : null}
          <Popover
            onOpenChange={(open) => {
              if (!open) setSkillSearch("");
            }}
          >
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className="justify-between rounded-md border-0 bg-[#dde3e9] px-3 text-sm font-normal text-[#2d3338] shadow-none"
              >
                {value.skillIds.length
                  ? `Selected ${value.skillIds.length} skill(s)`
                  : "Select skills"}
                <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-60" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
              <Command>
                <CommandInput
                  placeholder="Search skills..."
                  value={skillSearch}
                  onValueChange={setSkillSearch}
                />
                <CommandEmpty>No skills found.</CommandEmpty>
                <CommandList className="max-h-44">
                  <CommandGroup>
                    {skillOptions.map((skill) => {
                      const isSelected = value.skillIds.includes(skill.id);
                      return (
                        <CommandItem
                          key={skill.id}
                          value={skill.name}
                          onSelect={() => addSkill(skill.id, skill.name)}
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
          <p className="text-xs text-[#7b848a]">
            Type to search skills, then click to add.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-8 border border-[#eaeef3]/60 space-y-6">
        <SectionHeader title="Publishing" />
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-sm font-semibold text-[#596065]">
              Active
            </Label>
            <p className="text-xs text-[#7b848a]">
              If off, BE will store but not publish.
            </p>
          </div>
          <Switch
            checked={value.active}
            onCheckedChange={(checked) => update({ active: checked })}
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button
          type="button"
          onClick={onSubmit}
          className="rounded-full font-bold text-white px-6 shadow-md hover:shadow-lg transition-shadow"
          style={{
            background: "linear-gradient(135deg, #72b183 0%, #aed6ba 100%)",
          }}
        >
          <CheckCircle2 size={16} className="mr-2" />
          Create Job
        </Button>
        <span className="text-xs text-[#7b848a]">
          Make sure the required fields are filled.
        </span>
      </div>
    </section>
  );
}

import { useEffect, useMemo, useState, type KeyboardEvent } from "react";
import { useTranslation } from "react-i18next";
import { Check, ChevronsUpDown, Plus, Save, X } from "lucide-react";
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
import locationData from "@/assets/location-data/provinces.json";
import { useGetIndustries } from "@/api/industries/industry.queries";
import { useGetSpecializationsByIndustryId } from "@/api/specializations/specialization.queries";
import { useGetSkills } from "@/api/skills/skill.queries";
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";

export type PostJobFormData = {
  name: string;
  location: string;
  provinceCode: string;
  wardCode: string;
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
  industryName: string;
  specializationId: string;
  specializationName: string;
  skillIds: number[];
  skillNames: string[];
};

export type PostJobFormErrors = Partial<
  Record<
    | "name"
    | "provinceCode"
    | "wardCode"
    | "startDate"
    | "endDate"
    | "industryId"
    | "specializationId"
    | "workingHours"
    | "skillIds"
    | "description"
    | "requirements"
    | "benefits"
    | "levels",
    string
  >
>;

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
  errors?: PostJobFormErrors;
  resetKey?: number;
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
  const { t } = useTranslation();

  return (
    <span className="bg-[#8df5e4] text-[#005c53] px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 select-none">
      {label}
      <button
        onClick={onRemove}
        className="ml-0.5 hover:opacity-70 transition-opacity"
        aria-label={t("employerPostJob.common.removeItem", { item: label })}
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
  errorMessage,
}: {
  label: string;
  placeholder: string;
  items: string[];
  onAdd: (value: string) => void;
  onRemove: (index: number) => void;
  hint?: string;
  errorMessage?: string;
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
      {errorMessage ? (
        <p className="text-xs text-red-500">{errorMessage}</p>
      ) : null}
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
          className={cn(
            inputCls,
            errorMessage && "ring-2 ring-red-300 bg-red-50",
          )}
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
  errorMessage,
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
  errorMessage?: string;
}) {
  const { t } = useTranslation();
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
              errorMessage && "ring-2 ring-red-300 bg-red-50",
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
            <CommandEmpty>
              {t("employerPostJob.form.select.noResults")}
            </CommandEmpty>
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
      {errorMessage ? (
        <p className="text-xs text-red-500">{errorMessage}</p>
      ) : null}
    </div>
  );
}

export function PostJobForm({
  value,
  onChange,
  onSubmit,
  errors,
  resetKey = 0,
}: Props) {
  const { t } = useTranslation();
  const update = (patch: Partial<PostJobFormData>) =>
    onChange({ ...value, ...patch });
  const todayIso = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);

  const provinces = locationData as Province[];
  const [street, setStreet] = useState("");
  const [industrySearch, setIndustrySearch] = useState("");
  const [skillSearch, setSkillSearch] = useState("");
  const [selectedSkillLabels, setSelectedSkillLabels] = useState<
    Record<number, string>
  >({});
  const provinceId = value.provinceCode ? Number(value.provinceCode) : null;
  const wardId = value.wardCode ? Number(value.wardCode) : null;
  const industryId = value.industryId ? Number(value.industryId) : 0;
  const debouncedIndustrySearch = useDebounce(industrySearch);
  const debouncedSkillSearch = useDebounce(skillSearch);

  useEffect(() => {
    setStreet("");
  }, [resetKey]);

  const { data: industriesData } = useGetIndustries({
    page: 1,
    size: 1000,
    name: debouncedIndustrySearch || undefined,
  });

  const { data: specializationsData } =
    useGetSpecializationsByIndustryId(industryId);

  const { data: skillsData } = useGetSkills({
    page: 1,
    size: 1000,
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
    const province = provinces.find((item) => item.code === Number(next));
    update({
      provinceCode: next,
      wardCode: "",
      location: buildLocation("", undefined, province),
    });
    setStreet("");
  }

  function handleWardChange(next: string) {
    const ward = selectedProvince?.wards.find(
      (item) => item.code === Number(next),
    );
    update({
      wardCode: next,
      location: buildLocation(street, ward, selectedProvince),
    });
  }

  function handleStreetChange(next: string) {
    setStreet(next);
    update({ location: buildLocation(next, selectedWard, selectedProvince) });
  }

  function handleIndustryChange(next: string) {
    const selectedIndustry = industryOptions.find(
      (option) => option.value === next,
    );
    update({
      industryId: next,
      industryName: selectedIndustry?.label ?? "",
      specializationId: "",
      specializationName: "",
    });
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
    update({
      skillIds: [...value.skillIds, id],
      skillNames: [...value.skillNames, label],
    });
    setSelectedSkillLabels((prev) => ({ ...prev, [id]: label }));
  }

  function removeSkill(id: number) {
    const index = value.skillIds.findIndex((skillId) => skillId === id);
    const nextSkillIds = value.skillIds.filter((skillId) => skillId !== id);
    const nextSkillNames = value.skillNames.filter(
      (_name, nameIndex) => nameIndex !== index,
    );
    update({ skillIds: nextSkillIds, skillNames: nextSkillNames });
    setSelectedSkillLabels((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }

  return (
    <section className="lg:col-span-7 space-y-8">
      <div className="bg-[#f1f4f7] rounded-xl p-8 space-y-6">
        <SectionHeader
          title={t("employerPostJob.form.sections.jobBasics")}
          note={t("employerPostJob.form.required")}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-semibold text-[#596065]">
              {t("employerPostJob.form.fields.jobTitle")}
            </Label>
            <Input
              value={value.name}
              onChange={(event) => update({ name: event.target.value })}
              placeholder={t("employerPostJob.form.placeholders.jobTitle")}
              className={cn(
                inputCls,
                errors?.name && "ring-2 ring-red-300 bg-red-50",
              )}
            />
            {errors?.name ? (
              <p className="text-xs text-red-500">{errors.name}</p>
            ) : null}
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <Label className="text-sm font-semibold text-[#596065]">
            {t("employerPostJob.form.fields.location")}
          </Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SearchableSelect
              label={t("employerPostJob.form.fields.province")}
              placeholder={t("employerPostJob.form.placeholders.province")}
              searchPlaceholder={t(
                "employerPostJob.form.placeholders.searchProvince",
              )}
              value={value.provinceCode}
              options={provinces.map((province) => ({
                value: province.code.toString(),
                label: province.name,
              }))}
              onChange={handleProvinceChange}
              errorMessage={errors?.provinceCode}
            />
            <SearchableSelect
              label={t("employerPostJob.form.fields.ward")}
              placeholder={t("employerPostJob.form.placeholders.ward")}
              searchPlaceholder={t(
                "employerPostJob.form.placeholders.searchWard",
              )}
              value={value.wardCode}
              options={(selectedProvince?.wards ?? []).map((ward) => ({
                value: ward.code.toString(),
                label: ward.name,
              }))}
              onChange={handleWardChange}
              errorMessage={errors?.wardCode}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-xs font-semibold text-[#7b848a]">
              {t("employerPostJob.form.fields.street")}
            </Label>
            <Input
              value={street}
              onChange={(event) => handleStreetChange(event.target.value)}
              placeholder={t("employerPostJob.form.placeholders.street")}
              className={inputCls}
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Label className="text-sm font-semibold text-[#596065]">
            {t("employerPostJob.form.fields.description")}
          </Label>
          <Textarea
            value={value.description}
            onChange={(event) => update({ description: event.target.value })}
            placeholder={t("employerPostJob.form.placeholders.description")}
            rows={5}
            className={cn(
              `${inputCls} resize-none`,
              errors?.description && "ring-2 ring-red-300 bg-red-50",
            )}
          />
          {errors?.description ? (
            <p className="text-xs text-red-500">{errors.description}</p>
          ) : null}
        </div>
      </div>

      <div className="bg-white rounded-xl p-8 border border-[#eaeef3]/60 space-y-6">
        <SectionHeader
          title={t("employerPostJob.form.sections.compensation")}
          note={t("employerPostJob.form.required")}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-semibold text-[#596065]">
              {t("employerPostJob.form.fields.minSalary")}
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
              {t("employerPostJob.form.fields.maxSalary")}
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
              {t("employerPostJob.form.fields.quantity")}
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
        <SectionHeader title={t("employerPostJob.form.sections.schedule")} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-semibold text-[#596065]">
              {t("employerPostJob.form.fields.startDate")}
            </Label>
            <Input
              type="date"
              value={value.startDate}
              onChange={(event) => update({ startDate: event.target.value })}
              min={todayIso}
              className={cn(
                inputCls,
                errors?.startDate && "ring-2 ring-red-300 bg-red-50",
              )}
            />
            {errors?.startDate ? (
              <p className="text-xs text-red-500">{errors.startDate}</p>
            ) : null}
          </div>
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-semibold text-[#596065]">
              {t("employerPostJob.form.fields.endDate")}
            </Label>
            <Input
              type="date"
              value={value.endDate}
              onChange={(event) => update({ endDate: event.target.value })}
              min={todayIso}
              className={cn(
                inputCls,
                errors?.endDate && "ring-2 ring-red-300 bg-red-50",
              )}
            />
            {errors?.endDate ? (
              <p className="text-xs text-red-500">{errors.endDate}</p>
            ) : null}
          </div>
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-semibold text-[#596065]">
              {t("employerPostJob.form.fields.workingHours")}
            </Label>
            <Input
              value={value.workingHours}
              onChange={(event) => update({ workingHours: event.target.value })}
              placeholder={t("employerPostJob.form.placeholders.workingHours")}
              className={cn(
                inputCls,
                errors?.workingHours && "ring-2 ring-red-300 bg-red-50",
              )}
            />
            {errors?.workingHours ? (
              <p className="text-xs text-red-500">{errors.workingHours}</p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-8 border border-[#eaeef3]/60 space-y-6">
        <SectionHeader
          title={t("employerPostJob.form.sections.requirementsBenefits")}
        />
        <ListInput
          label={t("employerPostJob.form.fields.requirements")}
          placeholder={t("employerPostJob.form.placeholders.requirement")}
          items={value.requirements}
          onAdd={(item) =>
            update({ requirements: [...value.requirements, item] })
          }
          onRemove={(index) =>
            update({
              requirements: value.requirements.filter((_, i) => i !== index),
            })
          }
          hint={t("employerPostJob.form.hints.requirements")}
          errorMessage={errors?.requirements}
        />
        <ListInput
          label={t("employerPostJob.form.fields.benefits")}
          placeholder={t("employerPostJob.form.placeholders.benefit")}
          items={value.benefits}
          onAdd={(item) => update({ benefits: [...value.benefits, item] })}
          onRemove={(index) =>
            update({ benefits: value.benefits.filter((_, i) => i !== index) })
          }
          errorMessage={errors?.benefits}
        />
      </div>

      <div className="bg-[#f1f4f7] rounded-xl p-8 space-y-6">
        <SectionHeader
          title={t("employerPostJob.form.sections.levels")}
          note={t("employerPostJob.form.required")}
        />
        {errors?.levels ? (
          <p className="text-xs text-red-500">{errors.levels}</p>
        ) : null}
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
              {t(`employerPostJob.levels.${level}`)}
            </label>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl p-8 border border-[#eaeef3]/60 space-y-6">
        <SectionHeader
          title={t("employerPostJob.form.sections.industrySpecialization")}
          note={t("employerPostJob.form.required")}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SearchableSelect
            label={t("employerPostJob.form.fields.industry")}
            placeholder={t("employerPostJob.form.placeholders.industry")}
            searchPlaceholder={t(
              "employerPostJob.form.placeholders.searchIndustry",
            )}
            value={value.industryId}
            options={industryOptions}
            onChange={handleIndustryChange}
            searchValue={industrySearch}
            onSearchChange={setIndustrySearch}
            onOpenChange={(open) => {
              if (!open) setIndustrySearch("");
            }}
            errorMessage={errors?.industryId}
          />
          <SearchableSelect
            label={t("employerPostJob.form.fields.specialization")}
            placeholder={t("employerPostJob.form.placeholders.specialization")}
            searchPlaceholder={t(
              "employerPostJob.form.placeholders.searchSpecialization",
            )}
            value={value.specializationId}
            options={specializationOptions}
            onChange={(next) => {
              const selectedSpecialization = specializationOptions.find(
                (option) => option.value === next,
              );
              update({
                specializationId: next,
                specializationName: selectedSpecialization?.label ?? "",
              });
            }}
            disabled={!value.industryId}
            errorMessage={errors?.specializationId}
          />
        </div>
      </div>

      <div className="bg-[#f1f4f7] rounded-xl p-8 space-y-6">
        <SectionHeader
          title={t("employerPostJob.form.sections.skills")}
          note={t("employerPostJob.form.required")}
        />
        <div className="flex flex-col gap-3">
          <Label className="text-sm font-semibold text-[#596065]">
            {t("employerPostJob.form.fields.skills")}
          </Label>
          {value.skillIds.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {value.skillIds.map((id, index) => (
                <Tag
                  key={id}
                  label={
                    value.skillNames[index] ??
                    selectedSkillLabels[id] ??
                    skillOptionLabels[id] ??
                    t("employerPostJob.form.fallbacks.skillWithId", { id })
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
                className={cn(
                  "justify-between rounded-md border-0 bg-[#dde3e9] px-3 text-sm font-normal text-[#2d3338] shadow-none",
                  errors?.skillIds && "ring-2 ring-red-300 bg-red-50",
                )}
              >
                {value.skillIds.length
                  ? t("employerPostJob.form.selectedSkills", {
                      count: value.skillIds.length,
                    })
                  : t("employerPostJob.form.placeholders.skills")}
                <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-60" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
              <Command>
                <CommandInput
                  placeholder={t(
                    "employerPostJob.form.placeholders.searchSkills",
                  )}
                  value={skillSearch}
                  onValueChange={setSkillSearch}
                />
                <CommandEmpty>
                  {t("employerPostJob.form.select.noSkills")}
                </CommandEmpty>
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
          {errors?.skillIds ? (
            <p className="text-xs text-red-500">{errors.skillIds}</p>
          ) : null}
          <p className="text-xs text-[#7b848a]">
            {t("employerPostJob.form.hints.skills")}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-8 border border-[#eaeef3]/60 space-y-6">
        <SectionHeader title={t("employerPostJob.form.sections.publishing")} />
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-sm font-semibold text-[#596065]">
              {t("employerPostJob.form.fields.active")}
            </Label>
            <p className="text-xs text-[#7b848a]">
              {t("employerPostJob.form.hints.active")}
            </p>
          </div>
          <Switch
            checked={value.active}
            onCheckedChange={(checked) => update({ active: checked })}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          type="button"
          onClick={onSubmit}
          className="bg-primary hover:bg-primary-hover rounded-md px-6! font-bold text-white shadow-md hover:shadow-lg transition-shadow"
        >
          <Save size={16} className="mr-1" />
          {t("employerPostJob.form.publish")}
        </Button>
      </div>
    </section>
  );
}

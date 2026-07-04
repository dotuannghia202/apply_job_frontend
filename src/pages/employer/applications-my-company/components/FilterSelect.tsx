import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

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
import { cn } from "@/lib/utils";

type FilterSelectOption<TValue extends string> = {
  label: string;
  value: TValue;
};

type FilterSelectProps<TValue extends string> = {
  label: string;
  value: TValue;
  options: Array<FilterSelectOption<TValue>>;
  searchPlaceholder?: string;
  onChange: (next: TValue) => void;
};

export function FilterSelect<TValue extends string>({
  label,
  value,
  options,
  searchPlaceholder,
  onChange,
}: FilterSelectProps<TValue>) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const selected = options.find((option) => option.value === value);

  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-xs font-semibold uppercase  text-slate-500">
        {label}
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="h-10 justify-between rounded-md  bg-white px-3 text-sm font-normal text-slate-800 shadow-none hover:bg-white hover:text-slate-800"
          >
            <span className="truncate">
              {selected?.label ?? t("employerApplications.filters.select")}
            </span>
            <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-60" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
          <Command>
            {searchPlaceholder ? (
              <CommandInput placeholder={searchPlaceholder} />
            ) : null}
            <CommandList>
              <CommandEmpty>
                {t("employerApplications.filters.noOption")}
              </CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.label}
                    onSelect={() => {
                      onChange(option.value);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 size-4",
                        option.value === value ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {option.label}
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

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fieldClass } from "@/pages/employer/jobs-my-company/helper";

type FilterTextFieldProps = {
  label: string;
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
  type?: string;
  min?: number;
};

export function FilterTextField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  min,
}: FilterTextFieldProps) {
  const handleChange = (nextValue: string) => {
    if (typeof min === "number" && nextValue !== "") {
      const parsed = Number(nextValue);

      if (Number.isFinite(parsed) && parsed < min) {
        onChange(String(min));
        return;
      }
    }

    onChange(nextValue);
  };

  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-xs font-semibold uppercase text-slate-500">
        {label}
      </Label>
      <Input
        type={type}
        min={min}
        value={value}
        onChange={(event) => handleChange(event.target.value)}
        placeholder={placeholder}
        className={fieldClass}
      />
    </div>
  );
}

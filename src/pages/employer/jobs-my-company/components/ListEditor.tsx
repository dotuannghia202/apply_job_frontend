import { Plus, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fieldClass } from "@/pages/employer/jobs-my-company/helper";

type ListEditorProps = {
  label: string;
  placeholder: string;
  items: string[];
  onChange: (next: string[]) => void;
};

export function ListEditor({
  label,
  placeholder,
  items,
  onChange,
}: ListEditorProps) {
  const [draft, setDraft] = useState("");

  const addItem = () => {
    const value = draft.trim();
    if (!value) return;

    onChange([...items, value]);
    setDraft("");
  };

  return (
    <div className="flex flex-col gap-2">
      <Label className="text-sm font-semibold text-slate-700">{label}</Label>
      {items.length ? (
        <div className="flex flex-wrap gap-2">
          {items.map((item, index) => (
            <span
              key={`${item}-${index}`}
              className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700"
            >
              {item}
              <button
                type="button"
                aria-label={`Remove ${item}`}
                className="text-slate-400 transition hover:text-destructive"
                onClick={() => onChange(items.filter((_, i) => i !== index))}
              >
                <X className="size-3" aria-hidden="true" />
              </button>
            </span>
          ))}
        </div>
      ) : null}
      <div className="flex gap-2">
        <Input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              addItem();
            }
          }}
          placeholder={placeholder}
          className={fieldClass}
        />
        <Button type="button" variant="outline" onClick={addItem}>
          <Plus className="size-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}

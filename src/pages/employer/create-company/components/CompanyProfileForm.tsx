"use client";

import type { ChangeEvent, DragEvent } from "react";
import { Building2, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const inputCls =
  "w-full px-4 py-3 " +
  "bg-[#dde3e9] " +
  "border-0 shadow-none " +
  "rounded-md " +
  "focus-visible:ring-2 focus-visible:ring-[#72b183]/20 focus-visible:ring-offset-0 " +
  "transition-all " +
  "text-[#2d3338] placeholder:text-[#596065]/60 " +
  "text-sm font-normal";

type CompanyProfileFormProps = {
  companyName: string;
  address: string;
  description: string;
  logoPreviewUrl: string | null;
  isSubmitting: boolean;
  onCompanyNameChange: (value: string) => void;
  onAddressChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onLogoChange: (file: File) => void;
};

export function CompanyProfileForm({
  companyName,
  address,
  description,
  logoPreviewUrl,
  isSubmitting,
  onCompanyNameChange,
  onAddressChange,
  onDescriptionChange,
  onLogoChange,
}: CompanyProfileFormProps) {
  const handleLogoInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;
    onLogoChange(file);
  };

  const handleLogoDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    const file = event.dataTransfer.files?.[0];

    if (!file) return;
    onLogoChange(file);
  };

  return (
    <section className="lg:col-span-6 space-y-8">
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200/70 space-y-6">
        <div className="flex items-center gap-3">
          <Building2 size={20} className="text-[#72b183]" />
          <h2 className="text-xl font-bold text-[#2d3338]">
            Create a new company
          </h2>
        </div>

        <p className="text-sm text-[#596065]">
          Set up your company profile to start hiring talent faster.
        </p>

        <div className="space-y-4">
          <div className="flex flex-col gap-3">
            <Label className="text-sm font-semibold text-[#596065]">
              Company logo
            </Label>
            <div
              className="flex items-center gap-4 rounded-lg border border-dashed border-[#c9d4dd] bg-[#f7f9fc] p-4"
              onDrop={handleLogoDrop}
              onDragOver={(event) => event.preventDefault()}
            >
              <div className="size-16 overflow-hidden rounded-full bg-[#e3e8ee]">
                {logoPreviewUrl ? (
                  <img
                    src={logoPreviewUrl}
                    alt="Company logo preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-[#7a848b]">
                    No logo
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col gap-2">
                <span className="text-sm font-semibold text-[#2d3338]">
                  Drop a logo here or click to upload
                </span>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoInputChange}
                  className={inputCls}
                />
                <p className="text-xs text-[#7a848b]">PNG or JPG up to 10MB.</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-sm font-semibold text-[#596065]">
              Company name
            </Label>
            <Input
              value={companyName}
              onChange={(e) => onCompanyNameChange(e.target.value)}
              placeholder="Enter company name"
              className={inputCls}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-sm font-semibold text-[#596065]">
              Headquarters address
            </Label>
            <Input
              value={address}
              onChange={(e) => onAddressChange(e.target.value)}
              placeholder="Enter headquarters address"
              className={inputCls}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-sm font-semibold text-[#596065]">
              Company description
            </Label>
            <Textarea
              value={description}
              onChange={(e) => onDescriptionChange(e.target.value)}
              placeholder="Describe your company mission and culture..."
              rows={5}
              className={`${inputCls} resize-none`}
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full py-6 rounded-lg font-bold text-white shadow-lg hover:scale-[1.02] active:scale-95 transition-all border-0"
          disabled={isSubmitting}
          style={{
            background: "linear-gradient(135deg, #72b183 0%, #aed6ba 100%)",
          }}
        >
          <UploadCloud size={18} className="mr-2" />
          {isSubmitting ? "Creating..." : "Create company"}
        </Button>
      </div>
    </section>
  );
}

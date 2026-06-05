import type { ChangeEvent, DragEvent } from "react";
import { useTranslation } from "react-i18next";
import { Building2, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const inputCls =
  "w-full h-12 px-4 py-0 " +
  "bg-[#dde3e9] " +
  "border-0 shadow-none " +
  "rounded-md " +
  "focus-visible:ring-2 focus-visible:ring-[#72b183]/20 focus-visible:ring-offset-0 " +
  "transition-all " +
  "text-[#2d3338] placeholder:text-[#596065]/60 " +
  "text-sm font-normal";

const textareaCls =
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
  const { t } = useTranslation();

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
            {t("employerCreateCompany.profile.title")}
          </h2>
        </div>

        <p className="text-sm text-[#596065]">
          {t("employerCreateCompany.profile.description")}
        </p>

        <div className="space-y-4">
          <div className="flex flex-col gap-3">
            <Label className="text-sm font-semibold text-[#596065]">
              {t("employerCreateCompany.profile.logo")}
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
                    alt={t("employerCreateCompany.profile.logoPreviewAlt")}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-[#7a848b]">
                    {t("employerCreateCompany.profile.noLogo")}
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col gap-2">
                <span className="text-sm font-semibold text-[#2d3338]">
                  {t("employerCreateCompany.profile.logoUploadPrompt")}
                </span>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoInputChange}
                  className={`${inputCls} leading-[3rem] file:h-12 file:leading-[3rem] file:py-0`}
                />
                <p className="text-xs text-[#7a848b]">
                  {t("employerCreateCompany.profile.logoHint")}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-sm font-semibold text-[#596065]">
              {t("employerCreateCompany.profile.companyName")}
            </Label>
            <Input
              value={companyName}
              onChange={(e) => onCompanyNameChange(e.target.value)}
              placeholder={t(
                "employerCreateCompany.profile.companyNamePlaceholder",
              )}
              className={inputCls}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-sm font-semibold text-[#596065]">
              {t("employerCreateCompany.profile.address")}
            </Label>
            <Input
              value={address}
              onChange={(e) => onAddressChange(e.target.value)}
              placeholder={t("employerCreateCompany.profile.addressPlaceholder")}
              className={inputCls}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-sm font-semibold text-[#596065]">
              {t("employerCreateCompany.profile.companyDescription")}
            </Label>
            <Textarea
              value={description}
              onChange={(e) => onDescriptionChange(e.target.value)}
              placeholder={t(
                "employerCreateCompany.profile.descriptionPlaceholder",
              )}
              rows={5}
              className={`${textareaCls} resize-none`}
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
          {isSubmitting
            ? t("employerCreateCompany.profile.creating")
            : t("employerCreateCompany.profile.createCompany")}
        </Button>
      </div>
    </section>
  );
}

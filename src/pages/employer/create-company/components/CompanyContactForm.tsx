"use client";

import { MapPin, PhoneCall } from "lucide-react";
import { useTranslation } from "react-i18next";
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

type CompanyContactFormProps = {
  address: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  links: string;
  onAddressChange: (value: string) => void;
  onCityChange: (value: string) => void;
  onCountryChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onLinksChange: (value: string) => void;
};

export function CompanyContactForm({
  address,
  city,
  country,
  phone,
  email,
  links,
  onAddressChange,
  onCityChange,
  onCountryChange,
  onPhoneChange,
  onEmailChange,
  onLinksChange,
}: CompanyContactFormProps) {
  const { t } = useTranslation();

  return (
    <section className="lg:col-span-6 space-y-8">
      <div className="bg-[#f1f4f7] rounded-xl p-8 space-y-6">
        <div className="flex items-center gap-3">
          <MapPin size={20} className="text-[#72b183]" />
          <h2 className="text-xl font-bold text-[#2d3338]">
            {t("employerCreateCompany.contact.title")}
          </h2>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-semibold text-[#596065]">
              {t("employerCreateCompany.contact.address")}
            </Label>
            <Textarea
              value={address}
              onChange={(e) => onAddressChange(e.target.value)}
              placeholder={t(
                "employerCreateCompany.contact.addressPlaceholder",
              )}
              rows={3}
              className={`${inputCls} resize-none`}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-semibold text-[#596065]">
                {t("employerCreateCompany.contact.city")}
              </Label>
              <Input
                value={city}
                onChange={(e) => onCityChange(e.target.value)}
                placeholder={t("employerCreateCompany.contact.cityPlaceholder")}
                className={inputCls}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-sm font-semibold text-[#596065]">
                {t("employerCreateCompany.contact.country")}
              </Label>
              <Input
                value={country}
                onChange={(e) => onCountryChange(e.target.value)}
                placeholder={t(
                  "employerCreateCompany.contact.countryPlaceholder",
                )}
                className={inputCls}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-semibold text-[#596065]">
                {t("employerCreateCompany.contact.phone")}
              </Label>
              <Input
                value={phone}
                onChange={(e) => onPhoneChange(e.target.value)}
                placeholder={t("employerCreateCompany.contact.phonePlaceholder")}
                className={inputCls}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-sm font-semibold text-[#596065]">
                {t("employerCreateCompany.contact.email")}
              </Label>
              <Input
                value={email}
                onChange={(e) => onEmailChange(e.target.value)}
                placeholder="hr@yourcompany.com"
                className={inputCls}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-sm font-semibold text-[#596065]">
              {t("employerCreateCompany.contact.socialLinks")}
            </Label>
            <Textarea
              value={links}
              onChange={(e) => onLinksChange(e.target.value)}
              placeholder={t("employerCreateCompany.contact.linksPlaceholder")}
              rows={3}
              className={`${inputCls} resize-none`}
            />
          </div>
        </div>

        <div className="bg-[#6f26f6]/10 rounded-xl p-6 flex gap-4 items-start">
          <PhoneCall size={20} className="text-[#6f26f6] shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-[#4200a2] mb-1">
              {t("employerCreateCompany.contact.tipTitle")}
            </p>
            <p className="text-xs text-[#4200a2]/80 leading-relaxed">
              {t("employerCreateCompany.contact.tipDescription")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

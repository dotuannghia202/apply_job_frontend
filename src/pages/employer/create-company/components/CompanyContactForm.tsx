"use client";

import { MapPin, PhoneCall } from "lucide-react";
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
  return (
    <section className="lg:col-span-6 space-y-8">
      <div className="bg-[#f1f4f7] rounded-xl p-8 space-y-6">
        <div className="flex items-center gap-3">
          <MapPin size={20} className="text-[#72b183]" />
          <h2 className="text-xl font-bold text-[#2d3338]">Company Contact</h2>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-semibold text-[#596065]">
              Headquarters Address
            </Label>
            <Textarea
              value={address}
              onChange={(e) => onAddressChange(e.target.value)}
              placeholder="Street, building, district"
              rows={3}
              className={`${inputCls} resize-none`}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-semibold text-[#596065]">
                City
              </Label>
              <Input
                value={city}
                onChange={(e) => onCityChange(e.target.value)}
                placeholder="e.g. Ho Chi Minh"
                className={inputCls}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-sm font-semibold text-[#596065]">
                Country
              </Label>
              <Input
                value={country}
                onChange={(e) => onCountryChange(e.target.value)}
                placeholder="e.g. Vietnam"
                className={inputCls}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-semibold text-[#596065]">
                Phone
              </Label>
              <Input
                value={phone}
                onChange={(e) => onPhoneChange(e.target.value)}
                placeholder="e.g. +84 912 345 678"
                className={inputCls}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-sm font-semibold text-[#596065]">
                Email
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
              Social Links
            </Label>
            <Textarea
              value={links}
              onChange={(e) => onLinksChange(e.target.value)}
              placeholder="LinkedIn, Facebook, Github..."
              rows={3}
              className={`${inputCls} resize-none`}
            />
          </div>
        </div>

        <div className="bg-[#6f26f6]/10 rounded-xl p-6 flex gap-4 items-start">
          <PhoneCall size={20} className="text-[#6f26f6] shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-[#4200a2] mb-1">
              Recruiter Tip
            </p>
            <p className="text-xs text-[#4200a2]/80 leading-relaxed">
              Provide a direct contact email to speed up candidate response
              times and improve trust.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

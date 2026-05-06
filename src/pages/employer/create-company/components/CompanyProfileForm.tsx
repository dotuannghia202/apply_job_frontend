"use client";

import { useState } from "react";
import { Building2, Sparkles } from "lucide-react";
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

export function CompanyProfileForm() {
  const [companyName, setCompanyName] = useState("");
  const [website, setWebsite] = useState("");
  const [industry, setIndustry] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [about, setAbout] = useState("");

  return (
    <section className="lg:col-span-6 space-y-8">
      <div className="bg-[#f1f4f7] rounded-xl p-8 space-y-6">
        <div className="flex items-center gap-3">
          <Building2 size={20} className="text-[#72b183]" />
          <h2 className="text-xl font-bold text-[#2d3338]">Company Profile</h2>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-semibold text-[#596065]">
              Company Name
            </Label>
            <Input
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g. Stellar Labs"
              className={inputCls}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-sm font-semibold text-[#596065]">
              Website
            </Label>
            <Input
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://yourcompany.com"
              className={inputCls}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-semibold text-[#596065]">
                Industry
              </Label>
              <Input
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="e.g. Fintech"
                className={inputCls}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-sm font-semibold text-[#596065]">
                Company Size
              </Label>
              <Input
                value={companySize}
                onChange={(e) => setCompanySize(e.target.value)}
                placeholder="e.g. 51-200"
                className={inputCls}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-sm font-semibold text-[#596065]">
              About Company
            </Label>
            <Textarea
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              placeholder="Describe your mission, values, and what makes you unique..."
              rows={5}
              className={`${inputCls} resize-none`}
            />
          </div>
        </div>

        <Button
          className="w-full py-6 rounded-lg font-bold text-white shadow-lg hover:scale-[1.02] active:scale-95 transition-all border-0"
          style={{
            background: "linear-gradient(135deg, #72b183 0%, #aed6ba 100%)",
          }}
        >
          <Sparkles size={18} className="mr-2" fill="currentColor" />
          Save Company Profile
        </Button>
      </div>
    </section>
  );
}

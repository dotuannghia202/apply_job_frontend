export type JobBadgeTone = "primary" | "secondary";

export type JobCardItem = {
  id: string;
  title: string;
  company: string;
  location: string;
  companyLogo: string;
  workType: string;
  salary: string;
  isRemote?: boolean;
  badge?: {
    label: string;
    tone: JobBadgeTone;
  };
};

export function formatVND(value?: number | null): string {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "Agree on salary";
  }

  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
}

export function getCityFromAddress(address?: string | null): string {
  const safe = address?.trim();
  if (!safe) return "";

  const lastCommaIndex = safe.lastIndexOf(",");
  if (lastCommaIndex === -1) return safe;

  return safe.slice(lastCommaIndex + 1).trim();
}

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

export const industryFilters = [
  { label: "Technology", checked: false },
  { label: "AI & Data Science", checked: true },
  { label: "Creative & Design", checked: false },
];

export const experienceFilters = [
  { label: "Entry Level", checked: false },
  { label: "Senior (5+ years)", checked: true },
  { label: "Principal / Lead", checked: false },
];

export const jobTypeFilters = [
  { label: "Remote", active: true },
  { label: "Full-time", active: false },
  { label: "Contract", active: false },
];

export const jobCards: JobCardItem[] = [
  {
    id: "senior-product-designer",
    title: "Senior Product Designer",
    company: "Nexus Systems",
    location: "San Francisco, CA",
    companyLogo:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBXlrJqKBQpAbwEJAbn5Y8Jk7TfSjzxFjwtRopMqml5HEbukH9WUiie2HUXPbKZ-3I1F9a4ElPkyxufBJn96sHx8U6nNYQ__GgdKeUuSR-ZYaL3WHB3anS-dIp2GyZ2N_AqonCOWOvg_1mZLE_d0BB6gY_mrtAmZVEJY9JBVBUNxd4lz5K1vvOWpQOmCgFX6pikrBamUO-8Rh1A0e6ASmy4UmZEHKbGCmgyOUZ0BItUQX_9uFNWbdwOkjomJVdxy5trwzBYqVDMRYAg",
    workType: "Full-time",
    salary: "$140k - $190k",
    badge: {
      label: "High Match",
      tone: "primary",
    },
  },
  {
    id: "lead-ai-research-engineer",
    title: "Lead AI Research Engineer",
    company: "Aura Intelligence",
    location: "Remote",
    companyLogo:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDydPc_bO7Kx8BAjqEu7P5td8_xEx9DgiMp-BGoU3LDDgxIFY59jPTFOAX5OB_pqMYVLcRSIldwWvC0HPOtUHQimS3jcpOLYpWScIqMKv1E4JcjzEvsCI82FdIGsQ8E3Djf6rrtaa0MZxUKsIds97sPrPqumJm7rg98geLTxRu6UD1JLw27CzWD7QM4IRC6WZ6rXpEbn1Q1fnK8Y9PhZNuzBC0K_edeXbyDQQRJ61ImE6s6L8RoBGScrDVE9DsNxiDRHSLn5ZjVA2lQ",
    workType: "Remote",
    salary: "$180k - $250k",
    isRemote: true,
  },
  {
    id: "ux-researcher",
    title: "UX Researcher",
    company: "Vanguard Digital",
    location: "New York, NY",
    companyLogo:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDZ4juxusVMUd8iVTNzjz4yYi9uZHTKe4t6HEHm67ilY84FJPFNFS-CvT-NvqSzRkcpF_-M_KwuMs4FtZnM6MSDuEwId8kWK2c4fRXtTK0i6anO_ZduL3TWL4JkvzcFS8O9QdKy7T2rUegGhwJP_V38Je8xE4AyNCWtI07PRQcpd1_GFqXa0dWUWJC-g298O5MbsIN8b9L3RpVKy1XYJY79OxA58eXNk-m9pmgHcyD12h3X-DMUbEVrzMXwDItFeRiwt63IUZ5KFdj1",
    workType: "Contract",
    salary: "$90 - $120 / hr",
  },
  {
    id: "frontend-architect",
    title: "Frontend Architect",
    company: "Canvas Lab",
    location: "Austin, TX",
    companyLogo:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBU5-BSkIpAMKEqybAdJz9fqb4Nm4ScMaI9-h-l-3UMsU2oTjbTaX-wvjp2YX1jdKLQ9Bc7lZVWzhuySrOkgQbtzKfAYOmuBMWhXkENju6qvz7afnYrKdknBBh5mTaYVz3iER4PRFK78QaA-EOQAaF-Sx2mNIIPZHLRbHqpN_U9_97i59DRQFAgwny57EuYfZe_mzoPtQ7ABoOftcF6Cf9UnDWDtO7VTCDrZpIbdgnuycQFpwOoYiDbw9oVCPLL5E1DtMf1bzgJPT--",
    workType: "Full-time",
    salary: "$160k - $210k",
    badge: {
      label: "Rapid Hire",
      tone: "secondary",
    },
  },
];

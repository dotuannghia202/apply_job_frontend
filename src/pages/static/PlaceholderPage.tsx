import { Link } from "react-router-dom";
import {
  ShieldCheck,
  FileText,
  Cookie,
  Accessibility,
  LifeBuoy,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";

type PlaceholderPageType =
  | "privacy"
  | "terms"
  | "cookies"
  | "accessibility"
  | "support";

type PlaceholderPageProps = {
  type: PlaceholderPageType;
};

type PageSection = {
  heading: string;
  description: string;
};

type PageContent = {
  title: string;
  subtitle: string;
  label: string;
  icon: typeof ShieldCheck;
  sections: PageSection[];
};

const pageContent: Record<PlaceholderPageType, PageContent> = {
  privacy: {
    title: "Privacy Policy",
    subtitle:
      "Learn how Job Portal collects, uses, and protects your personal data.",
    label: "Data Protection",
    icon: ShieldCheck,
    sections: [
      {
        heading: "Personal Information",
        description:
          "We may collect your name, email address, phone number, CV, job applications, and profile information to provide recruitment services.",
      },
      {
        heading: "How We Use Your Data",
        description:
          "Your information is used to manage applications, recommend suitable jobs, improve platform experience, and support communication between candidates and employers.",
      },
      {
        heading: "Data Security",
        description:
          "We apply technical and organizational measures to help protect your account, CV files, and application history from unauthorized access.",
      },
    ],
  },
  terms: {
    title: "Terms of Service",
    subtitle:
      "Review the rules and conditions for using the Job Portal platform.",
    label: "Platform Rules",
    icon: FileText,
    sections: [
      {
        heading: "User Responsibilities",
        description:
          "Users are expected to provide accurate information, keep their account secure, and use the platform in a lawful and respectful manner.",
      },
      {
        heading: "Candidate Usage",
        description:
          "Candidates should only upload valid CVs and apply for jobs that match their profile, experience, and career interests.",
      },
      {
        heading: "Employer Usage",
        description:
          "Employers must publish truthful job information, respect applicant privacy, and avoid misleading recruitment content.",
      },
    ],
  },
  cookies: {
    title: "Cookie Settings",
    subtitle:
      "Manage how cookies are used to improve your experience on Job Portal.",
    label: "Preferences",
    icon: Cookie,
    sections: [
      {
        heading: "Essential Cookies",
        description:
          "These cookies are required for login, authentication, security, and basic platform functionality.",
      },
      {
        heading: "Analytics Cookies",
        description:
          "Analytics cookies help us understand how users interact with the platform and improve overall usability.",
      },
      {
        heading: "Preference Cookies",
        description:
          "Preference cookies remember your selected settings, such as language, theme, or display preferences.",
      },
    ],
  },
  accessibility: {
    title: "Accessibility",
    subtitle:
      "Our goal is to make Job Portal usable and accessible for all users.",
    label: "Inclusive Experience",
    icon: Accessibility,
    sections: [
      {
        heading: "Keyboard Navigation",
        description:
          "We aim to support keyboard-friendly navigation across forms, buttons, menus, and important actions.",
      },
      {
        heading: "Readable Interface",
        description:
          "The interface is designed with clear typography, spacing, contrast, and responsive layouts for different screen sizes.",
      },
      {
        heading: "Continuous Improvement",
        description:
          "We continue to improve accessibility based on user feedback, usability testing, and modern web standards.",
      },
    ],
  },
  support: {
    title: "Support",
    subtitle:
      "Need help? Contact our support team for account, CV, or job posting issues.",
    label: "Help Center",
    icon: LifeBuoy,
    sections: [
      {
        heading: "Account Support",
        description:
          "Get help with login issues, account access, role switching, profile updates, and security concerns.",
      },
      {
        heading: "Candidate Support",
        description:
          "Candidates can contact us for CV upload issues, job applications, saved jobs, or application tracking.",
      },
      {
        heading: "Employer Support",
        description:
          "Employers can request support for company setup, job posting, applicant management, and dashboard usage.",
      },
    ],
  },
};

export default function PlaceholderPage({ type }: PlaceholderPageProps) {
  const content = pageContent[type];
  const Icon = content.icon;

  return (
    <main className="min-h-screen bg-linear-to-b from-slate-50 via-white to-slate-100">
      <div className="mx-auto w-full max-w-6xl px-6 py-12">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition-colors hover:text-primary"
        >
          <ArrowLeft className="size-4" />
          Back to home
        </Link>

        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                <Icon className="size-4" />
                {content.label}
              </div>
              <h1 className="mt-4 text-3xl font-bold text-slate-900">
                {content.title}
              </h1>
              <p className="mt-2 text-sm text-slate-600">{content.subtitle}</p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-xs text-slate-500">
              Updated June 2026
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {content.sections.map((section, index) => (
              <div
                key={section.heading}
                className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center gap-2 text-xs font-semibold uppercase text-slate-400">
                  <CheckCircle2 className="size-4 text-primary" />
                  Section {index + 1}
                </div>
                <h3 className="mt-3 text-sm font-semibold text-slate-900">
                  {section.heading}
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  {section.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4 text-sm text-slate-600">
            This page is provided for demonstration purposes in the Job Portal
            system. For official support, please contact{" "}
            <a
              href="mailto:support@jobportal.com"
              className="font-semibold text-primary hover:underline"
            >
              support@jobportal.com
            </a>
            .
          </div>
        </div>
      </div>
    </main>
  );
}

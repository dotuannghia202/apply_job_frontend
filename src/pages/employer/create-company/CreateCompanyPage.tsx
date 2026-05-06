import { CompanyProfileForm } from "./components/CompanyProfileForm";
import { CompanyContactForm } from "./components/CompanyContactForm";

export default function CreateCompanyPage() {
  return (
    <main className="min-h-screen bg-[#f7f9fc] px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#2d3338] mb-4 leading-tight">
            Company Setup for <span className="text-primary">Employers</span>
          </h1>
          <p className="text-lg text-[#596065] max-w-2xl leading-relaxed">
            Configure your company profile so candidates can understand your
            mission, culture, and hiring team at a glance.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <CompanyProfileForm />
          <CompanyContactForm />
        </div>
      </div>
    </main>
  );
}

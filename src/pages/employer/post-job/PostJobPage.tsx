// PostJobPage.tsx — Root component (no nav/footer)
import { PageHero } from "./components/PageHero";
import { RoleParametersForm } from "./components/RoleParameters";
import { JDPreview } from "./components/JdPreview";

export default function PostJobPage() {
  return (
    <main className="min-h-screen bg-[#f7f9fc] px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <PageHero />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <RoleParametersForm />
          <JDPreview />
        </div>
      </div>
    </main>
  );
}

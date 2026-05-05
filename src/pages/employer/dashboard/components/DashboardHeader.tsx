import { Button } from "@/components/ui/button";

export function DashboardHeader() {
  return (
    <header className="flex justify-between items-center mb-10">
      <div className="flex flex-col">
        <h2 className="text-4xl font-extrabold tracking-tight text-[#2d3338]">
          Employer Dashboard
        </h2>
        <p className="text-[#596065] mt-2 font-medium">
          Welcome back, Talent Acquisition Team
        </p>
      </div>
      <Button
        variant="outline"
        className="px-6 py-5 bg-primary hover:bg-primary-hover text-white text-sm font-semibold hover:text-white rounded-xs"
      >
        Post a New Job
      </Button>
    </header>
  );
}

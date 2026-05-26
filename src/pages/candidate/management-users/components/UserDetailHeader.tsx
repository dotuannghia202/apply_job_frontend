import { ArrowLeft, PencilLine, RefreshCcw } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

export default function UserDetailHeader() {
  return (
    <section className="flex flex-col gap-4 rounded-3xl border border-slate-200/70 bg-white/90 p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-2">
        <Link
          to="/admin/users"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft className="size-4" />
          Back to Users
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          User Details
        </h1>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button variant="outline" className="gap-2 border-slate-200">
          <PencilLine className="size-4" />
          Edit User
        </Button>
        <Button className="gap-2">
          <RefreshCcw className="size-4" />
          Update Records
        </Button>
      </div>
    </section>
  );
}

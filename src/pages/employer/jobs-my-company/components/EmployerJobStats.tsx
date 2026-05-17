import { Card } from "@/components/ui/card";

type EmployerJobStatsProps = {
  total: number;
  activeCount: number;
  inactiveCount: number;
};

export function EmployerJobStats({
  total,
  activeCount,
  inactiveCount,
}: EmployerJobStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="border-slate-200 bg-white p-5">
        <p className="text-sm font-semibold text-slate-500">Total found</p>
        <p className="mt-2 text-3xl font-bold text-slate-950">{total}</p>
      </Card>
      <Card className="border-slate-200 bg-white p-5">
        <p className="text-sm font-semibold text-slate-500">
          Active on this page
        </p>
        <p className="mt-2 text-3xl font-bold text-green-700">
          {activeCount}
        </p>
      </Card>
      <Card className="border-slate-200 bg-white p-5">
        <p className="text-sm font-semibold text-slate-500">
          Inactive on this page
        </p>
        <p className="mt-2 text-3xl font-bold text-slate-700">
          {inactiveCount}
        </p>
      </Card>
    </div>
  );
}

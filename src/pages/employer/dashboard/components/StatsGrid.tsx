// StatsGrid.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Sparkles, Users } from "lucide-react";
import type { StatCard } from "../../types";
import { cn } from "@/lib/utils";

const STATS: StatCard[] = [
  {
    id: "jobs",
    label: "Total Active Jobs",
    value: "12",
    badge: "+2 this week",
    icon: "briefcase",
    variant: "default",
  },
  {
    id: "applicants",
    label: "Total Applicants",
    value: "1,482",
    badge: "+124 new",
    icon: "users",
    variant: "secondary",
  },
  {
    id: "match",
    label: "Avg. AI Match Rate",
    value: "88.4%",
    badge: "AI OPTIMIZED",
    icon: "sparkles",
    variant: "ai",
  },
];

export function StatsGrid() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      {STATS.map((stat) => (
        <StatCardItem key={stat.id} stat={stat} />
      ))}
    </section>
  );
}

function StatCardItem({ stat }: { stat: StatCard }) {
  const isAI = stat.variant === "ai";
  const isSecondary = stat.variant === "secondary";

  return (
    <Card
      className={cn(
        "h-40 border-transparent transition-all",
        isAI
          ? "bg-linear-to-br from-[#6f26f6] to-[#6302ea] text-white shadow-purple-200"
          : "hover:border-primary/30",
      )}
    >
      <CardContent className="flex flex-col justify-between h-full">
        <div className="flex justify-between items-start">
          <div
            className={cn(
              "p-2 rounded-lg",
              isAI
                ? "bg-white/20 text-white"
                : isSecondary
                  ? "bg-primary-hover/10 text-primary-hover"
                  : "bg-primary/10 text-primary",
            )}
          >
            <IconByName name={stat.icon} />
          </div>
          <Badge
            variant="secondary"
            className={cn(
              "text-[10px] font-bold uppercase",
              isAI
                ? "bg-white/20 text-white hover:bg-white/30"
                : isSecondary
                  ? "text-primary-hover"
                  : "text-primary",
            )}
          >
            {stat.badge}
          </Badge>
        </div>
        <div>
          <p
            className={cn(
              "text-sm font-medium",
              isAI ? "text-white/80" : "text-[#596065]",
            )}
          >
            {stat.label}
          </p>
          <h3 className="text-3xl font-extrabold mt-1">{stat.value}</h3>
        </div>
      </CardContent>
    </Card>
  );
}

function IconByName({ name }: { name: string }) {
  if (name === "briefcase") return <Briefcase size={20} />;
  if (name === "users") return <Users size={20} />;

  return <Sparkles size={20} />;
}

import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";

export type AppBreadcrumbItem = {
  label: string;
  to?: string;
};

type AppBreadcrumbProps = {
  items: AppBreadcrumbItem[];
  className?: string;
};

const AppBreadcrumb = ({ items, className }: AppBreadcrumbProps) => {
  if (!items.length) return null;

  return (
    <nav
      className={cn(
        "flex flex-wrap items-center gap-2 text-[14px] text-slate-500 sm:text-lg",
        className,
      )}
      aria-label="Breadcrumb"
    >
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li
              key={`${item.label}-${index}`}
              className="flex items-center gap-2"
            >
              {item.to && !isLast ? (
                <Link to={item.to} className="transition hover:text-slate-900">
                  {item.label}
                </Link>
              ) : (
                <span
                  className={cn(
                    isLast ? "font-semibold text-primary" : "text-slate-500",
                  )}
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}

              {!isLast ? (
                <ChevronRight
                  className="size-4 text-slate-500 sm:size-5"
                  aria-hidden="true"
                />
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default AppBreadcrumb;

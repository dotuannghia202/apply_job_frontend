import { useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronRight as ArrowRight,
  Banknote,
  MapPin,
  Search,
} from "lucide-react";
import { useGetIndustries } from "@/api/industries/industry.queries";
import { useGetSpecializationsByIndustryId } from "@/api/specializations/specialization.queries";
import type { Industry, Specialization } from "@/types/industry";
import Img1 from "@/assets/images/ImgSlide1.png";
import Img2 from "@/assets/images/ImgSlide2.png";
import Img3 from "@/assets/images/ImgSlide3.png";
import Img4 from "@/assets/images/ImgSlide4.png";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SubcategoryGroup {
  groupName: string;
  items: string[];
}

export interface JobCategory {
  id: string | number;
  name: string;
  subcategoryGroups: SubcategoryGroup[];
}

// ─── Slider images ─────────────────────────────────────────────────────────────

const SLIDER_IMAGES = [
  {
    src: Img1,
    alt: "Career opportunities hero",
  },
  {
    src: Img2,
    alt: "Career opportunities hero",
  },
  {
    src: Img3,
    alt: "Career opportunities hero",
  },
  {
    src: Img4,
    alt: "Career opportunities hero",
  },
];

// ─── Constants ────────────────────────────────────────────────────────────────

const PAGE_SIZE = 6;
const inputClassName =
  "w-full border-0 bg-transparent px-0 text-sm text-slate-800 placeholder:text-slate-500 focus-visible:ring-0 focus-visible:outline-none";

// ─── Sub-components ───────────────────────────────────────────────────────────

const ImageSlider = () => {
  const [current, setCurrent] = useState(0);
  const total = SLIDER_IMAGES.length;
  const intervalRef = useRef<number | null>(null);

  const startAuto = () => {
    intervalRef.current = window.setInterval(() => {
      setCurrent((prev) => (prev + 1) % total);
    }, 4000);
  };

  const stopAuto = () => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    startAuto();
    return stopAuto;
  }, []);

  const goTo = (dir: "prev" | "next") => {
    stopAuto();
    setCurrent((prev) =>
      dir === "next" ? (prev + 1) % total : (prev - 1 + total) % total,
    );
    startAuto();
  };

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl bg-slate-100">
      {SLIDER_IMAGES.map((img, i) => (
        <img
          key={i}
          src={img.src}
          alt={img.alt}
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
          style={{ opacity: i === current ? 1 : 0 }}
        />
      ))}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />

      {/* Navigation arrows */}
      <button
        type="button"
        onClick={() => goTo("prev")}
        className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-1.5 text-slate-700 shadow transition-all hover:bg-white hover:shadow-md"
        aria-label="Previous slide"
      >
        <ChevronLeft className="size-4" />
      </button>
      <button
        type="button"
        onClick={() => goTo("next")}
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-1.5 text-slate-700 shadow transition-all hover:bg-white hover:shadow-md"
        aria-label="Next slide"
      >
        <ChevronRight className="size-4" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
        {SLIDER_IMAGES.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setCurrent(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === current ? "w-5 bg-white" : "w-1.5 bg-white/50"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

interface SubcategoryPanelProps {
  industryName: string;
  specializations: Specialization[] | undefined;
  isLoading: boolean;
}

const SubcategoryPanel = ({
  industryName,
  specializations,
  isLoading,
}: SubcategoryPanelProps) => {
  if (isLoading) {
    return (
      <div className="h-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex items-center justify-center">
        <div className="text-slate-500 text-sm">Loading specializations...</div>
      </div>
    );
  }

  if (!specializations || specializations.length === 0) {
    return (
      <div className="h-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex items-center justify-center">
        <div className="text-slate-500 text-sm">
          No specializations available
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <p className="mb-2.5 text-[13px] font-bold text-slate-700">
          {industryName}
        </p>
        <div className="flex flex-wrap gap-2">
          {specializations.map((specialization) => (
            <button
              key={specialization.id}
              type="button"
              className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
            >
              {specialization.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

/**
 * JobCategoryHero
 *
 * Fetches real industries from API and specializations on hover.
 * Displays industries in a paginated list on the left, and shows specializations
 * in a detailed panel on the right when hovering over an industry.
 */
const JobCategoryHero = () => {
  const [categoryPage, setCategoryPage] = useState(1);
  const [hoveredIndustry, setHoveredIndustry] = useState<Industry | null>(null);
  const leaveTimerRef = useRef<number | null>(null);

  // Fetch industries from API
  const {
    data: industriesData,
    isLoading: industriesLoading,
    error: industriesError,
  } = useGetIndustries({
    page: categoryPage,
    pageSize: PAGE_SIZE,
  });

  // Fetch specializations for hovered industry
  const { data: specializationsData, isLoading: specializationsLoading } =
    useGetSpecializationsByIndustryId(hoveredIndustry?.id ?? 0);

  const allIndustries: Industry[] = industriesData?.data?.result ?? [];
  const totalItems = industriesData?.data?.meta.total ?? 0;
  const totalCategoryPages = Math.ceil(totalItems / PAGE_SIZE);

  const handleCategoryEnter = (industry: Industry) => {
    if (leaveTimerRef.current) {
      window.clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }
    setHoveredIndustry(industry);
  };

  const handleCategoryLeave = () => {
    leaveTimerRef.current = window.setTimeout(() => {
      setHoveredIndustry(null);
    }, 150);
  };

  const handleRightPanelEnter = () => {
    if (leaveTimerRef.current) {
      window.clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }
  };

  const handleRightPanelLeave = () => {
    leaveTimerRef.current = window.setTimeout(() => {
      setHoveredIndustry(null);
    }, 150);
  };

  return (
    <section className="mb-12">
      <div className="relative overflow-hidden ">
        {/* ── Search bar ── */}
        <div className="mb-6 flex flex-col gap-2 rounded-3xl border border-slate-200 bg-white/90 p-2 shadow-xl lg:flex-row lg:items-center">
          <div className="flex flex-1 items-center gap-3 rounded-2xl px-4 py-2">
            <Search className="size-4 text-primary" />
            <input
              type="text"
              placeholder="Job title, keywords, or company"
              className={inputClassName}
            />
          </div>
          <div className="hidden h-8 w-px bg-slate-200 lg:block" />
          <div className="flex flex-1 items-center gap-3 rounded-2xl px-4 py-2">
            <MapPin className="size-4 text-primary" />
            <input
              type="text"
              placeholder="City or remote"
              className={inputClassName}
            />
          </div>
          <div className="hidden h-8 w-px bg-slate-200 lg:block" />
          <div className="flex flex-1 items-center gap-3 rounded-2xl px-4 py-2">
            <Banknote className="size-4 text-primary" />
            <input
              type="text"
              placeholder="Salary range"
              className={inputClassName}
            />
          </div>
          <button
            type="button"
            className="rounded-full bg-primary px-8 py-3 text-sm font-bold text-white transition-colors hover:bg-primary/90"
          >
            Find Jobs
          </button>
        </div>

        {/* ── Category browser + right panel ── */}
        <div className="flex gap-4" style={{ minHeight: 340 }}>
          {/* Left: Category list */}
          <div className="flex w-64 shrink-0 flex-col rounded-2xl border border-slate-200 bg-white shadow-sm">
            <ul className="flex-1 divide-y divide-slate-100">
              {industriesLoading ? (
                <li className="flex items-center justify-center h-full">
                  <span className="text-slate-500 text-sm">
                    Loading industries...
                  </span>
                </li>
              ) : industriesError ? (
                <li className="flex items-center justify-center h-full">
                  <span className="text-red-500 text-sm">
                    Failed to load industries
                  </span>
                </li>
              ) : allIndustries.length === 0 ? (
                <li className="flex items-center justify-center h-full">
                  <span className="text-slate-500 text-sm">
                    No industries found
                  </span>
                </li>
              ) : (
                allIndustries.map((industry) => {
                  const isActive = hoveredIndustry?.id === industry.id;
                  return (
                    <li key={industry.id}>
                      <button
                        type="button"
                        onMouseEnter={() => handleCategoryEnter(industry)}
                        onMouseLeave={handleCategoryLeave}
                        className={`flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium transition-colors ${
                          isActive
                            ? "bg-primary/5 text-primary"
                            : "text-slate-700 hover:bg-slate-50 hover:text-primary"
                        }`}
                      >
                        <span className="line-clamp-2 leading-snug">
                          {industry.name}
                        </span>
                        <ArrowRight
                          className={`ml-2 size-4 shrink-0 transition-colors ${
                            isActive ? "text-primary" : "text-slate-400"
                          }`}
                        />
                      </button>
                    </li>
                  );
                })
              )}
            </ul>

            {/* Pagination */}
            <div className="flex items-center justify-between border-t border-slate-100 px-4 py-2.5">
              <span className="text-xs text-slate-400">
                {categoryPage}/{totalCategoryPages || 1}
              </span>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  disabled={categoryPage <= 1}
                  onClick={() => setCategoryPage((p) => Math.max(1, p - 1))}
                  className="rounded-full border border-slate-200 p-1 text-slate-500 transition-colors hover:border-primary/40 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Previous category page"
                >
                  <ChevronLeft className="size-3.5" />
                </button>
                <button
                  type="button"
                  disabled={categoryPage >= totalCategoryPages}
                  onClick={() =>
                    setCategoryPage((p) => Math.min(totalCategoryPages, p + 1))
                  }
                  className="rounded-full border border-primary/50 p-1 text-primary transition-colors hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Next category page"
                >
                  <ChevronRight className="size-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Right: Slider or specializations panel */}
          <div
            className="flex-1"
            onMouseEnter={handleRightPanelEnter}
            onMouseLeave={handleRightPanelLeave}
          >
            {hoveredIndustry ? (
              <SubcategoryPanel
                industryName={hoveredIndustry.name}
                specializations={specializationsData?.data ?? []}
                isLoading={specializationsLoading}
              />
            ) : (
              <ImageSlider />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default JobCategoryHero;

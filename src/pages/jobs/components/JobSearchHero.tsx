import { Banknote, MapPin, Search } from "lucide-react";

const heroImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAfsrMmkNAh2wy-9XvnFQBfUzGg627U1n2mpP8FWhUXGPRf6jq4HDGYOb6hT09yd-6y9jlWMJO2F0sRQEd3OkadHn9xuQU6wBIK38qWIvpG3Vt1rVG-TrhYm9TctuYlpYkBkmZxw_SFMGCr7HRCybW1qyEeMDeHCZX9HM5VIV8dtMbh0nBsjMf5SKeXdMtNacj0VrIOjjUqyS-B9MFjaKO1QXmHzSRvAIVRJrRkuxBfytNzA_4JvKnUExMdGaiYWlGiZIbFCsqa8HE8";

const inputClassName =
  "w-full border-0 bg-transparent px-0 text-sm text-slate-800 placeholder:text-slate-500 focus-visible:ring-0 focus-visible:outline-none";

const JobSearchHero = () => {
  return (
    <section className="mb-12">
      <div className="relative overflow-hidden rounded-[2rem] border border-slate-200/60 bg-white p-8 shadow-sm md:p-12">
        <img
          src={heroImage}
          alt="Abstract digital background"
          className="pointer-events-none absolute inset-y-0 right-0 hidden h-full w-1/3 object-cover opacity-10 lg:block"
        />

        <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
          Bridge the gap to your{" "}
          <span className="italic text-primary">next breakthrough.</span>
        </h1>

        <div className="mt-8 flex flex-col gap-2 rounded-3xl border border-slate-200 bg-white/90 p-2 shadow-xl lg:flex-row lg:items-center">
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
              placeholder="City, state, or remote"
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
            className="rounded-full bg-primary px-8 py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary-hover"
          >
            Find Jobs
          </button>
        </div>
      </div>
    </section>
  );
};

export default JobSearchHero;

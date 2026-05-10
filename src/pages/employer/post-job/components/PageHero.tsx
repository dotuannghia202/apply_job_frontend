import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function PageHero() {
  const navigate = useNavigate();

  return (
    <header className="mb-12">
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#2d3338] mb-4 leading-tight">
        Craft the Future of your{" "}
        <span className="text-primary">Engineering Team</span>
      </h1>
      <p className="text-lg text-[#596065] max-w-2xl leading-relaxed">
        Our AI analyzes your unique culture and technical needs to generate a
        high-performing Job Description that attracts elite talent.
      </p>

      <Button
        variant="outline"
        size="lg"
        className="mt-8 rounded-lg font-bold text-primary border-primary hover:bg-primary hover:text-white"
        onClick={() => navigate("/jobs/publish")}
      >
        Post job manually
      </Button>
    </header>
  );
}

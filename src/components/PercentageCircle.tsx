import { useState, useEffect } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export default function ScoreRing({ score }: { score: number }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setValue(score));
    return () => cancelAnimationFrame(raf);
  }, [score]);

  return (
    <div className="w-10 h-10">
      <CircularProgressbar
        value={value}
        text={`${score}%`}
        strokeWidth={5}
        styles={buildStyles({
          // Thời gian chạy animation
          pathTransitionDuration: 1.2,
          pathTransition: "stroke-dashoffset 0.9s cubic-bezier(0.4,0,0.2,1)",
          textSize: "24px",
        })}
      />
    </div>
  );
}

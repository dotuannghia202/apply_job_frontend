import { useState, useEffect } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export default function ScoreRing({
  score,
  size,
}: {
  score: number;
  size?: number;
}) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setValue(score));
    return () => cancelAnimationFrame(raf);
  }, [score]);

  return (
    <div className={`w-${size || 10} h-${size || 10}`}>
      <CircularProgressbar
        value={value}
        text={`${score}%`}
        strokeWidth={5}
        styles={buildStyles({
          // Animation duration
          pathTransitionDuration: 1.2,
          pathTransition: "stroke-dashoffset 0.9s cubic-bezier(0.4,0,0.2,1)",
          textSize: "24px",
        })}
      />
    </div>
  );
}

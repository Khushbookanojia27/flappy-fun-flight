import { memo } from "react";

interface GroundProps {
  offset: number;
}

const Ground = memo(({ offset }: GroundProps) => {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-24 overflow-hidden">
      {/* Ground top edge */}
      <div
        className="absolute top-0 left-0 right-0 h-4"
        style={{
          background: "hsl(120 50% 45%)",
          boxShadow: "0 -2px 4px rgba(0,0,0,0.2)",
        }}
      />
      {/* Ground pattern */}
      <div
        className="ground-pattern absolute top-4 left-0 h-20"
        style={{
          width: "200%",
          transform: `translateX(${-offset % 48}px)`,
        }}
      />
    </div>
  );
});

Ground.displayName = "Ground";

export default Ground;

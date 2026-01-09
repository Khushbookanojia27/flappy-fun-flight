import { memo } from "react";

interface BirdProps {
  y: number;
  velocity: number;
}

const Bird = memo(({ y, velocity }: BirdProps) => {
  const rotation = Math.min(Math.max(velocity * 3, -30), 90);

  return (
    <div
      className="absolute left-20 w-12 h-10 z-10"
      style={{
        top: y,
        transform: `rotate(${rotation}deg)`,
        transition: "transform 0.1s ease-out",
      }}
    >
      {/* Bird body */}
      <div className="bird-body w-full h-full rounded-full relative shadow-lg">
        {/* Eye */}
        <div className="absolute top-2 right-2 w-4 h-4 bg-white rounded-full">
          <div className="absolute top-1 right-1 w-2 h-2 bg-foreground rounded-full" />
        </div>
        {/* Beak */}
        <div
          className="absolute top-4 -right-2 w-4 h-3 rounded-r-full"
          style={{ background: "hsl(var(--bird-beak))" }}
        />
        {/* Wing */}
        <div
          className="absolute top-4 left-2 w-5 h-4 rounded-full"
          style={{
            background: "hsl(var(--bird-wing))",
            animation: velocity < 0 ? "flap 0.15s ease-in-out" : "none",
          }}
        />
      </div>
    </div>
  );
});

Bird.displayName = "Bird";

export default Bird;

import { memo } from "react";

interface CloudProps {
  x: number;
  y: number;
  size: number;
}

const Cloud = memo(({ x, y, size }: CloudProps) => {
  return (
    <div
      className="absolute opacity-80"
      style={{
        left: x,
        top: y,
        transform: `scale(${size})`,
      }}
    >
      <div className="relative">
        <div className="absolute w-12 h-8 bg-white rounded-full" style={{ left: 0, top: 8 }} />
        <div className="absolute w-16 h-12 bg-white rounded-full" style={{ left: 8, top: 0 }} />
        <div className="absolute w-14 h-10 bg-white rounded-full" style={{ left: 20, top: 6 }} />
        <div className="absolute w-10 h-8 bg-white rounded-full" style={{ left: 32, top: 10 }} />
      </div>
    </div>
  );
});

Cloud.displayName = "Cloud";

export default Cloud;

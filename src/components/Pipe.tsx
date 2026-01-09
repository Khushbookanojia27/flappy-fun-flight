import { memo } from "react";

interface PipeProps {
  x: number;
  gapY: number;
  gapHeight: number;
  gameHeight: number;
}

const PIPE_WIDTH = 60;
const CAP_HEIGHT = 30;
const CAP_OVERHANG = 8;

const Pipe = memo(({ x, gapY, gapHeight, gameHeight }: PipeProps) => {
  const topPipeHeight = gapY;
  const bottomPipeY = gapY + gapHeight;
  const bottomPipeHeight = gameHeight - bottomPipeY;

  return (
    <>
      {/* Top Pipe */}
      <div
        className="absolute"
        style={{
          left: x,
          top: 0,
          width: PIPE_WIDTH,
          height: topPipeHeight,
        }}
      >
        {/* Pipe body */}
        <div
          className="pipe-body absolute top-0 left-1"
          style={{
            width: PIPE_WIDTH - 8,
            height: Math.max(0, topPipeHeight - CAP_HEIGHT),
          }}
        />
        {/* Pipe cap */}
        <div
          className="pipe-cap absolute rounded-sm"
          style={{
            width: PIPE_WIDTH,
            height: CAP_HEIGHT,
            bottom: 0,
            left: -CAP_OVERHANG / 2,
            boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
          }}
        />
      </div>

      {/* Bottom Pipe */}
      <div
        className="absolute"
        style={{
          left: x,
          top: bottomPipeY,
          width: PIPE_WIDTH,
          height: bottomPipeHeight,
        }}
      >
        {/* Pipe cap */}
        <div
          className="pipe-cap absolute rounded-sm"
          style={{
            width: PIPE_WIDTH,
            height: CAP_HEIGHT,
            top: 0,
            left: -CAP_OVERHANG / 2,
            boxShadow: "0 -4px 8px rgba(0,0,0,0.3)",
          }}
        />
        {/* Pipe body */}
        <div
          className="pipe-body absolute left-1"
          style={{
            width: PIPE_WIDTH - 8,
            height: Math.max(0, bottomPipeHeight - CAP_HEIGHT),
            top: CAP_HEIGHT,
          }}
        />
      </div>
    </>
  );
});

Pipe.displayName = "Pipe";

export default Pipe;

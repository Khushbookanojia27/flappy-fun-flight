import { memo } from "react";

interface GameOverlayProps {
  gameState: "start" | "playing" | "gameover";
  score: number;
  bestScore: number;
  onStart: () => void;
}

const GameOverlay = memo(({ gameState, score, bestScore, onStart }: GameOverlayProps) => {
  if (gameState === "playing") return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/20">
      <div className="text-center">
        {gameState === "start" && (
          <>
            <h1 className="game-title text-4xl md:text-5xl text-secondary mb-8 leading-relaxed">
              FLAPPY<br />BIRD
            </h1>
            <p className="text-sm text-white mb-8 score-display">
              Best: {bestScore}
            </p>
          </>
        )}

        {gameState === "gameover" && (
          <>
            <h2 className="game-title text-3xl text-accent mb-6">
              GAME OVER
            </h2>
            <div className="bg-card/90 rounded-lg p-6 mb-6 shadow-xl">
              <p className="text-lg text-foreground mb-2">Score</p>
              <p className="text-3xl text-primary font-bold mb-4">{score}</p>
              <p className="text-sm text-muted-foreground">Best: {bestScore}</p>
            </div>
          </>
        )}

        <button
          onClick={onStart}
          className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-8 py-4 rounded-lg text-lg shadow-lg transform hover:scale-105 transition-transform active:scale-95"
        >
          {gameState === "start" ? "PLAY" : "RETRY"}
        </button>

        <p className="text-xs text-white/80 mt-6 score-display">
          Click, Tap, or Press Space
        </p>
      </div>
    </div>
  );
});

GameOverlay.displayName = "GameOverlay";

export default GameOverlay;

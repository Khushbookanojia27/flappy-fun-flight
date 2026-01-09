import { useState, useEffect, useCallback, useRef } from "react";
import Bird from "./Bird";
import Pipe from "./Pipe";
import Ground from "./Ground";
import Cloud from "./Cloud";
import GameOverlay from "./GameOverlay";
import useGameSounds from "@/hooks/useGameSounds";

const GAME_WIDTH = 400;
const GAME_HEIGHT = 600;
const GROUND_HEIGHT = 96;
const BIRD_SIZE = 40;
const BIRD_X = 80;
const GRAVITY = 0.5;
const JUMP_FORCE = -9;
const PIPE_WIDTH = 70;
const PIPE_GAP = 160;
const PIPE_SPEED = 3;
const PIPE_SPAWN_INTERVAL = 1800;

interface PipeData {
  id: number;
  x: number;
  gapY: number;
  scored: boolean;
}

interface CloudData {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
}

const FlappyBirdGame = () => {
  const [gameState, setGameState] = useState<"start" | "playing" | "gameover">("start");
  const [birdY, setBirdY] = useState(GAME_HEIGHT / 2 - BIRD_SIZE / 2);
  const [velocity, setVelocity] = useState(0);
  const [pipes, setPipes] = useState<PipeData[]>([]);
  const [clouds, setClouds] = useState<CloudData[]>([
    { id: 1, x: 100, y: 50, size: 0.8, speed: 0.5 },
    { id: 2, x: 280, y: 120, size: 0.6, speed: 0.3 },
    { id: 3, x: 450, y: 80, size: 1, speed: 0.4 },
  ]);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(() => {
    const saved = localStorage.getItem("flappyBestScore");
    return saved ? parseInt(saved, 10) : 0;
  });
  const [groundOffset, setGroundOffset] = useState(0);

  const gameLoopRef = useRef<number>();
  const pipeSpawnRef = useRef<number>();
  const pipeIdRef = useRef(0);

  const { playJump, playScore, playGameOver } = useGameSounds();

  const jump = useCallback(() => {
    if (gameState === "playing") {
      setVelocity(JUMP_FORCE);
      playJump();
    }
  }, [gameState, playJump]);

  const startGame = useCallback(() => {
    setBirdY(GAME_HEIGHT / 2 - BIRD_SIZE / 2);
    setVelocity(0);
    setPipes([]);
    setScore(0);
    setGameState("playing");
    pipeIdRef.current = 0;
  }, []);

  const endGame = useCallback(() => {
    setGameState("gameover");
    playGameOver();
    if (score > bestScore) {
      setBestScore(score);
      localStorage.setItem("flappyBestScore", score.toString());
    }
  }, [score, bestScore, playGameOver]);

  // Handle input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        if (gameState === "playing") {
          jump();
        } else {
          startGame();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState, jump, startGame]);

  // Game loop
  useEffect(() => {
    if (gameState !== "playing") return;

    const gameLoop = () => {
      setBirdY((prev) => {
        const newY = prev + velocity;
        return newY;
      });

      setVelocity((prev) => prev + GRAVITY);

      setPipes((prev) =>
        prev
          .map((pipe) => ({ ...pipe, x: pipe.x - PIPE_SPEED }))
          .filter((pipe) => pipe.x > -PIPE_WIDTH)
      );

      setClouds((prev) =>
        prev.map((cloud) => ({
          ...cloud,
          x: cloud.x - cloud.speed,
          ...(cloud.x < -100 && { x: GAME_WIDTH + 50 }),
        }))
      );

      setGroundOffset((prev) => prev + PIPE_SPEED);

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [gameState, velocity]);

  // Pipe spawning
  useEffect(() => {
    if (gameState !== "playing") return;

    const spawnPipe = () => {
      const minGapY = 80;
      const maxGapY = GAME_HEIGHT - GROUND_HEIGHT - PIPE_GAP - 80;
      const gapY = Math.random() * (maxGapY - minGapY) + minGapY;

      setPipes((prev) => [
        ...prev,
        {
          id: pipeIdRef.current++,
          x: GAME_WIDTH,
          gapY,
          scored: false,
        },
      ]);
    };

    spawnPipe();
    pipeSpawnRef.current = window.setInterval(spawnPipe, PIPE_SPAWN_INTERVAL);

    return () => {
      if (pipeSpawnRef.current) clearInterval(pipeSpawnRef.current);
    };
  }, [gameState]);

  // Collision detection and scoring
  useEffect(() => {
    if (gameState !== "playing") return;

    const playableHeight = GAME_HEIGHT - GROUND_HEIGHT;

    // Ground/ceiling collision
    if (birdY < 0 || birdY + BIRD_SIZE > playableHeight) {
      endGame();
      return;
    }

    // Pipe collision
    for (const pipe of pipes) {
      const birdRight = BIRD_X + BIRD_SIZE - 10;
      const birdLeft = BIRD_X + 10;
      const birdTop = birdY + 5;
      const birdBottom = birdY + BIRD_SIZE - 5;

      const pipeLeft = pipe.x;
      const pipeRight = pipe.x + PIPE_WIDTH;

      if (birdRight > pipeLeft && birdLeft < pipeRight) {
        if (birdTop < pipe.gapY || birdBottom > pipe.gapY + PIPE_GAP) {
          endGame();
          return;
        }
      }

      // Scoring
      if (!pipe.scored && pipe.x + PIPE_WIDTH < BIRD_X) {
        pipe.scored = true;
        setScore((prev) => prev + 1);
        playScore();
      }
    }
  }, [birdY, pipes, gameState, endGame, playScore]);

  const handleClick = () => {
    if (gameState === "playing") {
      jump();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-foreground p-4">
      <div
        className="game-container relative overflow-hidden rounded-2xl shadow-2xl cursor-pointer select-none"
        style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
        onClick={handleClick}
      >
        {/* Clouds */}
        {clouds.map((cloud) => (
          <Cloud key={cloud.id} x={cloud.x} y={cloud.y} size={cloud.size} />
        ))}

        {/* Pipes */}
        {pipes.map((pipe) => (
          <Pipe
            key={pipe.id}
            x={pipe.x}
            gapY={pipe.gapY}
            gapHeight={PIPE_GAP}
            gameHeight={GAME_HEIGHT - GROUND_HEIGHT}
          />
        ))}

        {/* Bird */}
        <Bird y={birdY} velocity={velocity} />

        {/* Ground */}
        <Ground offset={groundOffset} />

        {/* Score display during gameplay */}
        {gameState === "playing" && (
          <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20">
            <span className="score-display text-4xl text-white">{score}</span>
          </div>
        )}

        {/* Game overlay */}
        <GameOverlay
          gameState={gameState}
          score={score}
          bestScore={bestScore}
          onStart={startGame}
        />
      </div>
    </div>
  );
};

export default FlappyBirdGame;

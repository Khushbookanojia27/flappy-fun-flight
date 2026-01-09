import { useCallback, useRef } from "react";

const useGameSounds = () => {
  const audioContextRef = useRef<AudioContext | null>(null);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }
    return audioContextRef.current;
  }, []);

  const playTone = useCallback(
    (frequency: number, duration: number, type: OscillatorType = "square", volume = 0.3) => {
      const ctx = getAudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

      gainNode.gain.setValueAtTime(volume, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration);
    },
    [getAudioContext]
  );

  const playJump = useCallback(() => {
    playTone(400, 0.1, "square", 0.2);
    setTimeout(() => playTone(500, 0.1, "square", 0.15), 50);
  }, [playTone]);

  const playScore = useCallback(() => {
    playTone(600, 0.1, "square", 0.2);
    setTimeout(() => playTone(800, 0.15, "square", 0.2), 100);
  }, [playTone]);

  const playGameOver = useCallback(() => {
    playTone(400, 0.15, "square", 0.3);
    setTimeout(() => playTone(300, 0.15, "square", 0.25), 150);
    setTimeout(() => playTone(200, 0.3, "square", 0.2), 300);
  }, [playTone]);

  return { playJump, playScore, playGameOver };
};

export default useGameSounds;

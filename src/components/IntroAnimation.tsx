import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";

interface IntroAnimationProps {
  onComplete: () => void;
}

const DOT_COUNT = 18;
const DOT_GAP = 28;
const PACMAN_SIZE = 32;
const CHOMP_SPEED = 65; // ms per dot eaten

export default function IntroAnimation({ onComplete }: IntroAnimationProps) {
  const [eaten, setEaten] = useState(0);
  const [phase, setPhase] = useState<"chomp" | "logo" | "fadeout">("chomp");
  const completedRef = useRef(false);

  // Pac-Man eats dots
  useEffect(() => {
    if (phase !== "chomp") return;
    if (eaten >= DOT_COUNT) {
      setTimeout(() => setPhase("logo"), 200);
      return;
    }
    const t = setTimeout(() => setEaten((e) => e + 1), CHOMP_SPEED);
    return () => clearTimeout(t);
  }, [eaten, phase]);

  // Logo reveal → fade out
  useEffect(() => {
    if (phase === "logo") {
      const t = setTimeout(() => setPhase("fadeout"), 1000);
      return () => clearTimeout(t);
    }
  }, [phase]);

  const handleFadeComplete = () => {
    if (phase === "fadeout" && !completedRef.current) {
      completedRef.current = true;
      onComplete();
    }
  };

  const trackWidth = DOT_COUNT * DOT_GAP;
  const pacmanX = eaten * DOT_GAP;

  return (
    <motion.div
      className="fixed inset-0 z-[9999] bg-dark-950 flex items-center justify-center overflow-hidden"
      animate={phase === "fadeout" ? { opacity: 0 } : { opacity: 1 }}
      transition={phase === "fadeout" ? { duration: 0.5, ease: "easeInOut" } : {}}
      onAnimationComplete={handleFadeComplete}
    >
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(var(--accent-rgb),0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(var(--accent-rgb),0.4) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Content container */}
      <div className="relative z-10 flex flex-col items-center gap-10">
        {/* Pac-Man chase scene */}
        {phase === "chomp" && (
          <div className="relative" style={{ width: trackWidth + PACMAN_SIZE, height: 48 }}>
            {/* Dots */}
            {Array.from({ length: DOT_COUNT }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute top-1/2 -translate-y-1/2"
                style={{ left: i * DOT_GAP + PACMAN_SIZE / 2 + 8 }}
                initial={{ opacity: 1, scale: 1 }}
                animate={
                  i < eaten
                    ? { opacity: 0, scale: 0 }
                    : { opacity: [0.4, 0.8, 0.4], scale: 1 }
                }
                transition={
                  i < eaten
                    ? { duration: 0.1 }
                    : { duration: 1.5, repeat: Infinity, delay: i * 0.08 }
                }
              >
                {/* Alternate between small dots and power pellets */}
                {i % 6 === 5 ? (
                  <div className="w-3 h-3 rounded-full bg-accent-500 shadow-[0_0_8px_rgba(var(--accent-rgb),0.5)]" />
                ) : (
                  <div className="w-1.5 h-1.5 rotate-45 bg-accent-400/70" />
                )}
              </motion.div>
            ))}

            {/* Pac-Man */}
            <motion.div
              className="absolute top-1/2 -translate-y-1/2"
              style={{ left: pacmanX }}
              transition={{ type: "tween", duration: CHOMP_SPEED / 1000 }}
            >
              <svg width={PACMAN_SIZE} height={PACMAN_SIZE} viewBox="0 0 32 32">
                {/* Glow */}
                <circle cx="16" cy="16" r="16" fill="rgba(var(--accent-rgb),0.1)" />
                {/* Body with chomping mouth */}
                <motion.path
                  d="M16 16 L28 8 A14 14 0 1 1 28 24 Z"
                  fill="rgb(var(--accent-rgb))"
                  animate={{
                    d: [
                      "M16 16 L28 4 A14 14 0 1 1 28 28 Z",
                      "M16 16 L28 14 A14 14 0 1 1 28 18 Z",
                      "M16 16 L28 4 A14 14 0 1 1 28 28 Z",
                    ],
                  }}
                  transition={{ duration: 0.25, repeat: Infinity, ease: "easeInOut" }}
                />
                {/* Eye */}
                <circle cx="18" cy="10" r="2" fill="#09090B" />
              </svg>
            </motion.div>

            {/* Ghost chasing (cute pixel-art style) */}
            <motion.div
              className="absolute top-1/2 -translate-y-1/2"
              style={{ left: Math.max(pacmanX - 50, -40) }}
              animate={{ y: [-1, 1, -1] }}
              transition={{ duration: 0.3, repeat: Infinity, ease: "easeInOut" }}
            >
              <svg width="28" height="30" viewBox="0 0 28 30" fill="none">
                {/* Ghost body */}
                <path
                  d="M2 28V14C2 7.4 7.4 2 14 2s12 5.4 12 12v14l-4-3-4 3-4-3-4 3-4-3-4 3z"
                  fill="rgba(var(--accent-rgb),0.25)"
                  stroke="rgba(var(--accent-rgb),0.5)"
                  strokeWidth="1.5"
                />
                {/* Eyes */}
                <circle cx="10" cy="13" r="3" fill="rgba(var(--accent-rgb),0.6)" />
                <circle cx="18" cy="13" r="3" fill="rgba(var(--accent-rgb),0.6)" />
                <circle cx="11" cy="13" r="1.5" fill="#09090B" />
                <circle cx="19" cy="13" r="1.5" fill="#09090B" />
              </svg>
            </motion.div>

            {/* Second ghost */}
            <motion.div
              className="absolute top-1/2 -translate-y-1/2"
              style={{ left: Math.max(pacmanX - 90, -80) }}
              animate={{ y: [1, -1, 1] }}
              transition={{ duration: 0.35, repeat: Infinity, ease: "easeInOut" }}
            >
              <svg width="28" height="30" viewBox="0 0 28 30" fill="none">
                <path
                  d="M2 28V14C2 7.4 7.4 2 14 2s12 5.4 12 12v14l-4-3-4 3-4-3-4 3-4-3-4 3z"
                  fill="rgba(228,180,78,0.15)"
                  stroke="rgba(228,180,78,0.35)"
                  strokeWidth="1.5"
                />
                <circle cx="10" cy="13" r="3" fill="rgba(228,180,78,0.4)" />
                <circle cx="18" cy="13" r="3" fill="rgba(228,180,78,0.4)" />
                <circle cx="11" cy="13" r="1.5" fill="#09090B" />
                <circle cx="19" cy="13" r="1.5" fill="#09090B" />
              </svg>
            </motion.div>
          </div>
        )}

        {/* Loading text during chomp */}
        {phase === "chomp" && (
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-space text-dark-400 tracking-[0.3em] uppercase">
              Loading
            </span>
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-1 h-1 rounded-full bg-accent-500/60"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </div>
            {/* Progress percentage */}
            <span className="text-[11px] font-space text-accent-500/50 tabular-nums">
              {Math.round((eaten / DOT_COUNT) * 100)}%
            </span>
          </div>
        )}

        {/* Score display (fun touch) */}
        {phase === "chomp" && (
          <motion.div
            className="absolute top-0 right-0 text-[10px] font-space text-accent-500/30 tracking-wider"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            SCORE: {eaten * 100}
          </motion.div>
        )}

        {/* JC Logo reveal */}
        {phase !== "chomp" && (
          <motion.div
            className="flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 200, damping: 15 }}
          >
            <div className="relative">
              {/* Gold glow */}
              <motion.div
                className="absolute -inset-12 rounded-full blur-3xl"
                style={{ background: "radial-gradient(circle, rgba(var(--accent-rgb),0.3), transparent 70%)" }}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: [0, 1, 0.7], scale: [0.5, 1.3, 1] }}
                transition={{ duration: 0.8 }}
              />

              {/* Flash burst */}
              <motion.div
                className="absolute -inset-16 rounded-full"
                style={{ background: "radial-gradient(circle, rgba(228,180,78,0.2), transparent 60%)" }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: [0, 0.8, 0], scale: [0, 2, 2.5] }}
                transition={{ duration: 0.6 }}
              />

              <motion.svg
                width="100"
                height="100"
                viewBox="0 0 80 80"
                fill="none"
                className="relative z-10"
              >
                {/* J */}
                <motion.path
                  d="M20 15 L20 50 Q20 65 35 65"
                  stroke="rgb(var(--accent-rgb))"
                  strokeWidth="4"
                  strokeLinecap="round"
                  fill="none"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                />
                {/* C */}
                <motion.path
                  d="M70 25 Q70 15 60 15 L55 15 Q45 15 45 25 L45 55 Q45 65 55 65 L60 65 Q70 65 70 55"
                  stroke="rgb(var(--accent-rgb))"
                  strokeWidth="4"
                  strokeLinecap="round"
                  fill="none"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.15, ease: "easeOut" }}
                />

                {/* Shimmer pass */}
                <motion.rect
                  x="-10" y="0" width="20" height="80"
                  fill="url(#shimmer)"
                  initial={{ x: -20 }}
                  animate={{ x: 100 }}
                  transition={{ duration: 0.5, delay: 0.4, ease: "easeInOut" }}
                />
                <defs>
                  <linearGradient id="shimmer" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0" stopColor="#E4B44E" stopOpacity="0" />
                    <stop offset="0.5" stopColor="#E4B44E" stopOpacity="0.5" />
                    <stop offset="1" stopColor="#E4B44E" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </motion.svg>

              {/* Pac-Man winks goodbye (small, below logo) */}
              <motion.div
                className="absolute -bottom-6 left-1/2 -translate-x-1/2"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: [0, 0.5, 0], y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <svg width="16" height="16" viewBox="0 0 32 32">
                  <path d="M16 16 L28 8 A14 14 0 1 1 28 24 Z" fill="rgb(var(--accent-rgb))" opacity="0.4" />
                </svg>
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

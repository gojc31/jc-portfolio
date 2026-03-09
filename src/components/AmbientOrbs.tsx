import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";

interface AmbientOrbsProps {
  count?: number;
  color?: string;
  className?: string;
}

function getAccentRGB(): string {
  const raw = getComputedStyle(document.documentElement).getPropertyValue("--accent-rgb").trim();
  return raw || "212,160,60";
}

const COLOR_MAP: Record<string, string> = {
  accent: "212,160,60",
};

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export default function AmbientOrbs({
  count = 3,
  color = "accent",
  className,
}: AmbientOrbsProps) {
  const [rgb, setRgb] = useState(() => color === "accent" ? getAccentRGB() : (COLOR_MAP[color] ?? color));

  useEffect(() => {
    if (color !== "accent") return;
    const interval = setInterval(() => setRgb(getAccentRGB()), 500);
    return () => clearInterval(interval);
  }, [color]);

  const orbs = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const size = randomBetween(100, 300);
      const opacity = randomBetween(0.03, 0.06);
      const duration = randomBetween(20, 40);
      const startX = randomBetween(0, 100);
      const startY = randomBetween(0, 100);
      const driftX = randomBetween(-30, 30);
      const driftY = randomBetween(-30, 30);

      return { id: i, size, opacity, duration, startX, startY, driftX, driftY };
    });
  }, [count]);

  return (
    <div
      className={`pointer-events-none overflow-hidden ${className ?? ""}`}
      aria-hidden="true"
    >
      {orbs.map((orb) => (
        <motion.div
          key={orb.id}
          className="absolute rounded-full"
          style={{
            width: orb.size,
            height: orb.size,
            left: `${orb.startX}%`,
            top: `${orb.startY}%`,
            background: `radial-gradient(circle, rgba(${rgb},${orb.opacity}) 0%, transparent 70%)`,
            filter: "blur(40px)",
            willChange: "transform",
          }}
          animate={{
            x: [0, orb.driftX, -orb.driftX * 0.5, orb.driftX * 0.7, 0],
            y: [0, orb.driftY * 0.8, -orb.driftY, orb.driftY * 0.5, 0],
          }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}

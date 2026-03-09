import { useEffect, useRef, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";

const KONAMI_CODE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

const RAIN_CHARS = [
  "AI",
  "\u2192",
  "\u26A1",
  "\u25C6",
  "{}",
  "01",
  "fn",
  "\u03BB",
  "\u221E",
  "\u2630",
  "\u2B21",
];

const COLUMN_COUNT = 24;

interface RainDrop {
  id: number;
  char: string;
  column: number;
  speed: number;
  opacity: number;
  delay: number;
  fontSize: number;
}

function generateRainDrops(): RainDrop[] {
  const drops: RainDrop[] = [];
  let id = 0;
  for (let col = 0; col < COLUMN_COUNT; col++) {
    const dropsInColumn = 2 + Math.floor(Math.random() * 3);
    for (let i = 0; i < dropsInColumn; i++) {
      drops.push({
        id: id++,
        char: RAIN_CHARS[Math.floor(Math.random() * RAIN_CHARS.length)],
        column: col,
        speed: 1.5 + Math.random() * 2.5,
        opacity: 0.3 + Math.random() * 0.7,
        delay: Math.random() * 1.5,
        fontSize: 14 + Math.floor(Math.random() * 10),
      });
    }
  }
  return drops;
}

export default function EasterEgg() {
  const [active, setActive] = useState(false);
  const konamiIndex = useRef(0);
  const jcBuffer = useRef<{ key: string; time: number }[]>([]);
  const lastTriggered = useRef(0);

  const trigger = useCallback(() => {
    const now = Date.now();
    if (now - lastTriggered.current < 10000) return;
    lastTriggered.current = now;
    setActive(true);
    setTimeout(() => setActive(false), 3000);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key;

      // Konami code check
      if (key === KONAMI_CODE[konamiIndex.current]) {
        konamiIndex.current++;
        if (konamiIndex.current === KONAMI_CODE.length) {
          konamiIndex.current = 0;
          trigger();
        }
      } else {
        konamiIndex.current = key === KONAMI_CODE[0] ? 1 : 0;
      }

      // "jc" quick-type check
      const now = Date.now();
      jcBuffer.current.push({ key: key.toLowerCase(), time: now });
      // Keep only recent keys
      jcBuffer.current = jcBuffer.current.filter(
        (entry) => now - entry.time < 500
      );
      const keys = jcBuffer.current.map((entry) => entry.key).join("");
      if (keys.includes("jc")) {
        jcBuffer.current = [];
        trigger();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [trigger]);

  const [drops] = useState(generateRainDrops);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key="easter-egg-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden"
          style={{ backgroundColor: "rgba(9, 9, 11, 0.85)" }}
        >
          {/* Rain columns */}
          {drops.map((drop) => (
            <motion.span
              key={drop.id}
              initial={{ y: "-10%", opacity: 0 }}
              animate={{ y: "110vh", opacity: drop.opacity }}
              transition={{
                duration: drop.speed,
                delay: drop.delay,
                ease: "linear",
              }}
              className="absolute top-0 font-mono select-none"
              style={{
                left: `${(drop.column / COLUMN_COUNT) * 100}%`,
                color: "rgb(var(--accent-rgb))",
                fontSize: drop.fontSize,
                textShadow: "0 0 8px rgba(var(--accent-rgb), 0.5)",
              }}
            >
              {drop.char}
            </motion.span>
          ))}

          {/* Center reveal text */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 2, duration: 0.5, ease: "easeOut" }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <span
              className="text-2xl md:text-4xl font-bold select-none"
              style={{
                color: "rgb(var(--accent-rgb))",
                textShadow:
                  "0 0 20px rgba(var(--accent-rgb), 0.6), 0 0 40px rgba(var(--accent-rgb), 0.3)",
              }}
            >
              You found the secret! 🎮
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

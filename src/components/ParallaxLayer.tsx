import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface ParallaxSectionProps {
  children: React.ReactNode;
  variant?: "dots" | "grid" | "diamonds";
  intensity?: number;
}

interface FloatingElementProps {
  scrollYProgress: import("framer-motion").MotionValue<number>;
  intensity: number;
}

function DotElements({ scrollYProgress, intensity }: FloatingElementProps) {
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -60 * intensity]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 40 * intensity]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -90 * intensity]);
  const x1 = useTransform(scrollYProgress, [0, 1], [0, 20 * intensity]);
  const x2 = useTransform(scrollYProgress, [0, 1], [0, -30 * intensity]);

  return (
    <>
      {/* Dot cluster top-left */}
      <motion.div
        className="absolute top-[12%] left-[8%]"
        style={{ y: y1, x: x1 }}
      >
        <div className="flex gap-3">
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "rgb(var(--accent-rgb))", opacity: 0.06 }} />
          <div className="w-1 h-1 rounded-full" style={{ backgroundColor: "rgb(var(--accent-rgb))", opacity: 0.04 }} />
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "rgb(var(--accent-rgb))", opacity: 0.05 }} />
        </div>
        <div className="flex gap-4 mt-2 ml-2">
          <div className="w-1 h-1 rounded-full" style={{ backgroundColor: "rgb(var(--accent-rgb))", opacity: 0.05 }} />
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "rgb(var(--accent-rgb))", opacity: 0.04 }} />
        </div>
      </motion.div>

      {/* Dot cluster mid-right */}
      <motion.div
        className="absolute top-[45%] right-[6%]"
        style={{ y: y2, x: x2 }}
      >
        <div className="flex flex-col gap-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "rgb(var(--accent-rgb))", opacity: 0.05 }} />
          <div className="flex gap-3">
            <div className="w-1 h-1 rounded-full" style={{ backgroundColor: "rgb(var(--accent-rgb))", opacity: 0.06 }} />
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "rgb(var(--accent-rgb))", opacity: 0.04 }} />
          </div>
          <div className="w-1 h-1 rounded-full ml-4" style={{ backgroundColor: "rgb(var(--accent-rgb))", opacity: 0.05 }} />
        </div>
      </motion.div>

      {/* Dot cluster bottom-left */}
      <motion.div
        className="absolute bottom-[15%] left-[15%]"
        style={{ y: y3 }}
      >
        <div className="flex gap-2">
          <div className="w-1 h-1 rounded-full" style={{ backgroundColor: "rgb(var(--accent-rgb))", opacity: 0.07 }} />
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "rgb(var(--accent-rgb))", opacity: 0.04 }} />
        </div>
      </motion.div>

      {/* Subtle horizontal line */}
      <motion.div
        className="absolute top-[30%] left-[20%] h-px w-24"
        style={{ y: y2, x: x1, backgroundColor: "rgb(var(--accent-rgb))", opacity: 0.04 }}
      />
      <motion.div
        className="absolute bottom-[35%] right-[15%] h-px w-16"
        style={{ y: y1, x: x2, backgroundColor: "rgb(var(--accent-rgb))", opacity: 0.03 }}
      />
    </>
  );
}

function DiamondElements({ scrollYProgress, intensity }: FloatingElementProps) {
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -80 * intensity]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 50 * intensity]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -40 * intensity]);
  const y4 = useTransform(scrollYProgress, [0, 1], [0, 70 * intensity]);
  const x1 = useTransform(scrollYProgress, [0, 1], [0, -25 * intensity]);
  const x2 = useTransform(scrollYProgress, [0, 1], [0, 15 * intensity]);

  return (
    <>
      {/* Large diamond top-right */}
      <motion.div
        className="absolute top-[10%] right-[12%]"
        style={{ y: y1, x: x1 }}
      >
        <div
          className="w-8 h-8 rotate-45 border"
          style={{ borderColor: "rgb(var(--accent-rgb))", opacity: 0.05 }}
        />
      </motion.div>

      {/* Small diamond mid-left */}
      <motion.div
        className="absolute top-[40%] left-[5%]"
        style={{ y: y2, x: x2 }}
      >
        <div
          className="w-4 h-4 rotate-45 border"
          style={{ borderColor: "rgb(var(--accent-rgb))", opacity: 0.06 }}
        />
      </motion.div>

      {/* Tiny filled diamond */}
      <motion.div
        className="absolute top-[60%] right-[25%]"
        style={{ y: y3 }}
      >
        <div
          className="w-3 h-3 rotate-45"
          style={{ backgroundColor: "rgb(var(--accent-rgb))", opacity: 0.04 }}
        />
      </motion.div>

      {/* Diamond with dot cluster */}
      <motion.div
        className="absolute bottom-[20%] left-[20%]"
        style={{ y: y4, x: x1 }}
      >
        <div
          className="w-6 h-6 rotate-45 border"
          style={{ borderColor: "rgb(var(--accent-rgb))", opacity: 0.05 }}
        />
        <div className="flex gap-2 mt-3">
          <div className="w-1 h-1 rounded-full" style={{ backgroundColor: "rgb(var(--accent-rgb))", opacity: 0.04 }} />
          <div className="w-1 h-1 rounded-full" style={{ backgroundColor: "rgb(var(--accent-rgb))", opacity: 0.06 }} />
        </div>
      </motion.div>

      {/* Horizontal lines at different speeds */}
      <motion.div
        className="absolute top-[25%] left-[30%] h-px w-20"
        style={{ y: y2, backgroundColor: "rgb(var(--accent-rgb))", opacity: 0.04 }}
      />
      <motion.div
        className="absolute bottom-[40%] right-[10%] h-px w-14"
        style={{ y: y3, x: x2, backgroundColor: "rgb(var(--accent-rgb))", opacity: 0.03 }}
      />

      {/* Small circle accent */}
      <motion.div
        className="absolute top-[75%] right-[8%]"
        style={{ y: y1 }}
      >
        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "rgb(var(--accent-rgb))", opacity: 0.05 }} />
      </motion.div>
    </>
  );
}

function GridElements({ scrollYProgress, intensity }: FloatingElementProps) {
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -50 * intensity]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 70 * intensity]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -30 * intensity]);
  const x1 = useTransform(scrollYProgress, [0, 1], [0, 15 * intensity]);
  const x2 = useTransform(scrollYProgress, [0, 1], [0, -20 * intensity]);

  return (
    <>
      {/* Grid fragment top-left */}
      <motion.div
        className="absolute top-[8%] left-[10%]"
        style={{ y: y1, x: x1 }}
      >
        <div className="grid grid-cols-3 gap-4">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className="w-1 h-1 rounded-full"
              style={{
                backgroundColor: i % 2 === 0 ? "rgb(var(--accent-rgb))" : "rgb(var(--accent-rgb))",
                opacity: 0.03 + (i % 3) * 0.015,
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Intersecting lines mid-right */}
      <motion.div
        className="absolute top-[35%] right-[8%]"
        style={{ y: y2, x: x2 }}
      >
        <div className="relative w-16 h-16">
          <div className="absolute top-0 left-0 w-full h-px" style={{ backgroundColor: "rgb(var(--accent-rgb))", opacity: 0.04 }} />
          <div className="absolute top-4 left-0 w-full h-px" style={{ backgroundColor: "rgb(var(--accent-rgb))", opacity: 0.03 }} />
          <div className="absolute top-0 left-0 w-px h-full" style={{ backgroundColor: "rgb(var(--accent-rgb))", opacity: 0.04 }} />
          <div className="absolute top-0 left-4 w-px h-full" style={{ backgroundColor: "rgb(var(--accent-rgb))", opacity: 0.03 }} />
        </div>
      </motion.div>

      {/* Grid fragment bottom-left */}
      <motion.div
        className="absolute bottom-[18%] left-[25%]"
        style={{ y: y3 }}
      >
        <div className="grid grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full"
              style={{
                backgroundColor: "rgb(var(--accent-rgb))",
                opacity: 0.04 + (i % 2) * 0.02,
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Horizontal rules */}
      <motion.div
        className="absolute top-[55%] left-[5%] h-px w-32"
        style={{ y: y1, backgroundColor: "rgb(var(--accent-rgb))", opacity: 0.03 }}
      />
      <motion.div
        className="absolute top-[70%] right-[20%] h-px w-20"
        style={{ y: y2, x: x1, backgroundColor: "rgb(var(--accent-rgb))", opacity: 0.04 }}
      />

      {/* Small diamond accent */}
      <motion.div
        className="absolute top-[22%] right-[30%]"
        style={{ y: y3, x: x2 }}
      >
        <div className="w-3 h-3 rotate-45 border" style={{ borderColor: "rgb(var(--accent-rgb))", opacity: 0.04 }} />
      </motion.div>
    </>
  );
}

export default function ParallaxSection({
  children,
  variant = "dots",
  intensity = 0.3,
}: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const clampedIntensity = Math.max(0, Math.min(1, intensity));

  return (
    <div ref={ref} className="relative">
      {/* Parallax background layer */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {variant === "dots" && (
          <DotElements scrollYProgress={scrollYProgress} intensity={clampedIntensity} />
        )}
        {variant === "diamonds" && (
          <DiamondElements scrollYProgress={scrollYProgress} intensity={clampedIntensity} />
        )}
        {variant === "grid" && (
          <GridElements scrollYProgress={scrollYProgress} intensity={clampedIntensity} />
        )}
      </div>

      {/* Actual section content */}
      <div className="relative z-[1]">{children}</div>
    </div>
  );
}

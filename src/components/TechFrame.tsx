import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface TechFrameProps {
  children: React.ReactNode;
  className?: string;
  accentColor?: string;
  delay?: number;
}

function Corner({ position, color, delay }: { position: string; color: string; delay: number }) {
  const isTop = position.includes("top");
  const isLeft = position.includes("left");

  return (
    <motion.div
      className={`absolute ${isTop ? "top-0" : "bottom-0"} ${isLeft ? "left-0" : "right-0"} pointer-events-none`}
      initial={{ opacity: 0, scale: 0 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.4, ease: "easeOut" }}
    >
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className={`${!isTop ? "rotate-180" : ""} ${!isLeft && isTop ? "-scale-x-100" : ""} ${!isLeft && !isTop ? "scale-x-[-1]" : ""}`}>
        {/* L-shaped corner bracket */}
        <path
          d="M2 26V6C2 3.79 3.79 2 6 2H26"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
        {/* Small diamond accent */}
        <rect
          x="1" y="1" width="4" height="4"
          transform="rotate(45 3 3)"
          fill={color}
          opacity="0.6"
        />
      </svg>
    </motion.div>
  );
}

export default function TechFrame({ children, className = "", accentColor = "rgba(var(--accent-rgb), 0.4)", delay = 0 }: TechFrameProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <div ref={ref} className={`relative ${className}`}>
      {/* Corner accents */}
      <Corner position="top-left" color={accentColor} delay={delay} />
      <Corner position="top-right" color={accentColor} delay={delay + 0.05} />
      <Corner position="bottom-left" color={accentColor} delay={delay + 0.1} />
      <Corner position="bottom-right" color={accentColor} delay={delay + 0.15} />

      {/* Top decorative line */}
      <motion.div
        className="absolute top-0 left-7 right-7 h-px"
        style={{ background: `linear-gradient(90deg, ${accentColor}, transparent 30%, transparent 70%, ${accentColor})` }}
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : {}}
        transition={{ delay: delay + 0.1, duration: 0.8, ease: "easeOut" }}
      />
      {/* Bottom decorative line */}
      <motion.div
        className="absolute bottom-0 left-7 right-7 h-px"
        style={{ background: `linear-gradient(90deg, ${accentColor}, transparent 30%, transparent 70%, ${accentColor})` }}
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : {}}
        transition={{ delay: delay + 0.15, duration: 0.8, ease: "easeOut" }}
      />
      {/* Left decorative line */}
      <motion.div
        className="absolute top-7 bottom-7 left-0 w-px"
        style={{ background: `linear-gradient(180deg, ${accentColor}, transparent 30%, transparent 70%, ${accentColor})` }}
        initial={{ scaleY: 0 }}
        animate={isInView ? { scaleY: 1 } : {}}
        transition={{ delay: delay + 0.1, duration: 0.8, ease: "easeOut" }}
      />
      {/* Right decorative line */}
      <motion.div
        className="absolute top-7 bottom-7 right-0 w-px"
        style={{ background: `linear-gradient(180deg, ${accentColor}, transparent 30%, transparent 70%, ${accentColor})` }}
        initial={{ scaleY: 0 }}
        animate={isInView ? { scaleY: 1 } : {}}
        transition={{ delay: delay + 0.15, duration: 0.8, ease: "easeOut" }}
      />

      {/* Content */}
      <div className="relative z-[1]">
        {children}
      </div>
    </div>
  );
}

export function DiamondDivider({ className = "", delay = 0 }: { className?: string; delay?: number }) {
  return (
    <motion.div
      className={`flex items-center justify-center gap-3 ${className}`}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6 }}
    >
      <div className="h-px w-12 bg-gradient-to-r from-transparent to-accent-500/40" />
      <div className="w-2 h-2 rotate-45 bg-accent-500/50 shadow-[0_0_8px_rgba(var(--accent-rgb),0.3)]" />
      <div className="h-px w-12 bg-gradient-to-l from-transparent to-accent-500/40" />
    </motion.div>
  );
}

export function SectionDivider({ className = "" }: { className?: string }) {
  return (
    <motion.div
      className={`flex items-center justify-center gap-2 py-8 ${className}`}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="h-px w-16 bg-gradient-to-r from-transparent to-accent-500/30" />
      <div className="w-1.5 h-1.5 rotate-45 bg-accent-500/40" />
      <div className="h-px w-8 bg-accent-500/20" />
      <div className="w-2.5 h-2.5 rotate-45 border border-accent-500/40 flex items-center justify-center">
        <div className="w-1 h-1 rotate-45 bg-accent-500/60" />
      </div>
      <div className="h-px w-8 bg-accent-500/20" />
      <div className="w-1.5 h-1.5 rotate-45 bg-accent-500/40" />
      <div className="h-px w-16 bg-gradient-to-l from-transparent to-accent-500/30" />
    </motion.div>
  );
}

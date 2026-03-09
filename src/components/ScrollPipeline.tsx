import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import TextReveal from "./TextReveal";

/* ── Pipeline phase data ─────────────────────────────────────────── */

const phases = [
  {
    id: "capture",
    label: "CAPTURE",
    description: "Raw data flows in from multiple sources",
  },
  {
    id: "analyze",
    label: "ANALYZE",
    description: "AI processes and classifies data in real-time",
  },
  {
    id: "automate",
    label: "AUTOMATE",
    description: "Smart workflows trigger based on conditions",
  },
  {
    id: "integrate",
    label: "INTEGRATE",
    description: "Data syncs across all your platforms",
  },
  {
    id: "deliver",
    label: "DELIVER",
    description: "Results ship with zero human intervention",
  },
];

/* ── Real tech SVG icons ─────────────────────────────────────────── */

function PhaseIcon({ id, alpha }: { id: string; alpha: number }) {
  const color = `rgba(var(--accent-rgb),${Math.max(0.15, alpha * 0.9)})`;
  const stroke = `rgba(var(--accent-rgb),${Math.max(0.1, alpha * 0.7)})`;

  switch (id) {
    // Database / Data ingestion
    case "capture":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <ellipse cx="12" cy="5" rx="9" ry="3" />
          <path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
          <path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3" />
        </svg>
      );
    // Brain / AI analysis
    case "analyze":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z" />
          <path d="M10 21h4" />
          <path d="M12 17v4" />
          <circle cx="12" cy="9" r="2" fill={stroke} />
        </svg>
      );
    // Gear / Workflow automation
    case "automate":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      );
    // Plug / API integration
    case "integrate":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 12h4" />
          <path d="M16 12h4" />
          <rect x="8" y="6" width="8" height="12" rx="2" />
          <path d="M12 6V2" stroke={stroke} />
          <path d="M12 22v-4" stroke={stroke} />
          <circle cx="12" cy="10" r="1" fill={color} />
          <circle cx="12" cy="14" r="1" fill={color} />
        </svg>
      );
    // Rocket / Deploy
    case "deliver":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
          <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
          <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
          <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
        </svg>
      );
    default:
      return null;
  }
}

/* ── Main component ──────────────────────────────────────────────── */

export default function ScrollPipeline() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: false, margin: "-60px" });
  const rafRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const [progress, setProgress] = useState(0);

  const TOTAL_MS = 3500; // faster: 3.5s total animation
  const PAUSE_MS = 1800; // shorter pause
  const CYCLE_MS = TOTAL_MS + PAUSE_MS;

  const tick = useCallback(
    (now: number) => {
      if (!startTimeRef.current) startTimeRef.current = now;
      const elapsed = (now - startTimeRef.current) % CYCLE_MS;

      if (elapsed <= TOTAL_MS) {
        const t = elapsed / TOTAL_MS;
        const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        setProgress(eased);
      } else {
        setProgress(1);
      }

      rafRef.current = requestAnimationFrame(tick);
    },
    [CYCLE_MS, TOTAL_MS]
  );

  useEffect(() => {
    if (isInView) {
      startTimeRef.current = 0;
      rafRef.current = requestAnimationFrame(tick);
    } else {
      cancelAnimationFrame(rafRef.current);
      setProgress(0);
    }
    return () => cancelAnimationFrame(rafRef.current);
  }, [isInView, tick]);

  const getNodeAlpha = (index: number) => {
    const nodeStart = index / phases.length;
    const nodeEnd = (index + 0.6) / phases.length; // faster fill per node
    return Math.max(0, Math.min(1, (progress - nodeStart) / (nodeEnd - nodeStart)));
  };

  const getLineWidth = (index: number) => {
    const start = (index + 0.35) / phases.length;
    const end = (index + 0.95) / phases.length;
    return Math.max(0, Math.min(100, ((progress - start) / (end - start)) * 100));
  };

  const activeIndex = Math.min(Math.floor(progress * phases.length), phases.length - 1);
  const allDone = progress >= 0.99;

  return (
    <section
      ref={sectionRef}
      className="relative py-24 md:py-32 bg-dark-950 overflow-hidden"
    >
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(var(--accent-rgb),0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(var(--accent-rgb),0.3) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="max-w-4xl mx-auto px-6 md:px-10">
        {/* Header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-accent-500/30" />
            <span className="text-[10px] lg:text-xs font-space uppercase tracking-[0.3em] text-accent-500/70">
              The Pipeline
            </span>
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-accent-500/30" />
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-[-0.02em]">
            <TextReveal>How Automation</TextReveal>{" "}
            <span className="text-accent-400">
              <TextReveal delay={0.15}>Works</TextReveal>
            </span>
          </h2>
        </motion.div>

        {/* Pipeline nodes */}
        <div className="flex items-start justify-between w-full gap-0">
          {phases.map((phase, i) => {
            const alpha = getNodeAlpha(i);
            const isActive = alpha > 0.05;
            const isCurrent = i === activeIndex;
            const lineW = i < phases.length - 1 ? getLineWidth(i) : 0;

            return (
              <div key={phase.id} className="flex items-start flex-1 min-w-0">
                {/* Node column */}
                <div className="flex flex-col items-center w-full">
                  {/* Icon container */}
                  <div
                    className="relative"
                    style={{
                      transform: `scale(${isCurrent ? 1.15 : isActive ? 1 : 0.8})`,
                      transition: "transform 0.35s cubic-bezier(0.25,0.46,0.45,0.94)",
                    }}
                  >
                    {/* Pulse ring */}
                    {isCurrent && (
                      <motion.div
                        className="absolute -inset-4 rounded-full border border-accent-500/20"
                        animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0, 0.4] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                      />
                    )}

                    {/* Outer ring */}
                    <div
                      className="absolute -inset-3 rounded-full border"
                      style={{
                        borderColor: `rgba(var(--accent-rgb),${alpha * 0.25})`,
                        opacity: isActive ? 1 : 0,
                        transition: "all 0.35s ease",
                      }}
                    />

                    {/* Glow */}
                    <div
                      className="absolute -inset-5 rounded-full"
                      style={{
                        boxShadow: isCurrent
                          ? "0 0 24px rgba(var(--accent-rgb),0.15)"
                          : "0 0 0px transparent",
                        transition: "box-shadow 0.4s ease",
                      }}
                    />

                    {/* Icon circle */}
                    <div
                      className="relative z-10 w-12 h-12 rounded-full flex items-center justify-center"
                      style={{
                        backgroundColor: `rgba(var(--accent-rgb),${alpha * 0.1})`,
                        border: `1.5px solid rgba(var(--accent-rgb),${Math.max(0.08, alpha * 0.3)})`,
                        opacity: Math.max(0.25, alpha),
                        transition: "all 0.3s ease",
                      }}
                    >
                      <PhaseIcon id={phase.id} alpha={alpha} />
                    </div>
                  </div>

                  {/* Label */}
                  <span
                    className="mt-3 text-[9px] sm:text-[10px] lg:text-xs font-space uppercase tracking-[0.2em]"
                    style={{
                      color: isActive ? "rgb(var(--accent-rgb))" : "rgba(var(--accent-rgb),0.18)",
                      transition: "color 0.35s ease",
                    }}
                  >
                    {phase.label}
                  </span>

                  {/* Description */}
                  <p
                    className="text-[10px] lg:text-xs text-center max-w-[120px] lg:max-w-[140px] mt-1.5 leading-relaxed h-8"
                    style={{
                      color: "rgba(161,161,170,0.85)",
                      opacity: isCurrent ? 1 : 0,
                      transform: `translateY(${isCurrent ? 0 : 3}px)`,
                      transition: "all 0.3s ease",
                    }}
                  >
                    {phase.description}
                  </p>
                </div>

                {/* Connection line */}
                {i < phases.length - 1 && (
                  <div className="flex items-center self-center mt-0.5 flex-shrink-0 w-6 sm:w-10 lg:w-14">
                    <div className="relative h-[2px] w-full overflow-visible">
                      <div className="absolute inset-0 rounded-full" style={{ backgroundColor: "rgba(var(--accent-rgb),0.06)" }} />
                      <div
                        className="absolute left-0 top-0 h-full rounded-full"
                        style={{
                          width: `${lineW}%`,
                          background: "linear-gradient(to right, rgba(var(--accent-rgb),0.7), rgba(var(--accent-rgb),0.45))",
                        }}
                      />
                      {lineW > 50 && (
                        <motion.div
                          className="absolute rounded-full"
                          style={{
                            width: 4,
                            height: 4,
                            top: "50%",
                            y: "-50%",
                            backgroundColor: "rgb(var(--accent-rgb))",
                            boxShadow: "0 0 6px rgba(var(--accent-rgb),0.5)",
                          }}
                          animate={{ left: ["-2px", "calc(100% + 2px)"] }}
                          transition={{
                            duration: 0.5,
                            repeat: Infinity,
                            repeatDelay: 0.2,
                            ease: "linear",
                          }}
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom status */}
        <motion.div
          className="flex flex-col items-center mt-10 gap-2.5"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-1.5">
            {phases.map((_, i) => (
              <motion.div
                key={i}
                className="rounded-full"
                animate={{
                  width: i === activeIndex ? 18 : 5,
                  height: 5,
                  backgroundColor: i <= activeIndex ? "rgb(var(--accent-rgb))" : "rgba(var(--accent-rgb),0.12)",
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <motion.div
              className="w-1.5 h-1.5 rounded-full"
              animate={{
                backgroundColor: "rgb(var(--accent-rgb))",
                boxShadow: allDone
                  ? "0 0 10px rgba(var(--accent-rgb),0.6)"
                  : "0 0 5px rgba(var(--accent-rgb),0.3)",
              }}
              transition={{ duration: 0.3 }}
            />
            <span className="text-[10px] font-space text-accent-500/50 uppercase tracking-[0.2em]">
              {allDone ? "Pipeline complete" : `Phase ${activeIndex + 1} of ${phases.length}`}
            </span>
            <div className="w-14 h-[2px] rounded-full overflow-hidden" style={{ backgroundColor: "rgba(var(--accent-rgb),0.08)" }}>
              <div
                className="h-full rounded-full"
                style={{
                  width: `${progress * 100}%`,
                  backgroundColor: "rgb(var(--accent-rgb))",
                }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

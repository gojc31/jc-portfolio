import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";

interface BeforeAfterSliderProps {
  className?: string;
}

/* ── Icon SVGs ─────────────────────────────────────────────────── */

function EmailIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M22 4L12 13 2 4" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
    </svg>
  );
}

function SpreadsheetIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18M3 15h18M9 3v18M15 3v18" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

function GearIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  );
}

function DeployIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 2L11 13" />
      <path d="M22 2L15 22 11 13 2 9z" />
    </svg>
  );
}

function DataIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4.03 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
    </svg>
  );
}

function AIIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a7 7 0 017 7c0 2.38-1.19 4.47-3 5.74V17a2 2 0 01-2 2h-4a2 2 0 01-2-2v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 017-7z" />
      <path d="M10 21h4" />
      <circle cx="12" cy="9" r="2" fill="currentColor" opacity="0.3" />
    </svg>
  );
}

/* ── Before Side ──────────────────────────────────────────────── */

const beforeIcons = [
  { Icon: EmailIcon, x: "12%", y: "18%", label: "Email" },
  { Icon: SpreadsheetIcon, x: "62%", y: "12%", label: "Sheets" },
  { Icon: PhoneIcon, x: "28%", y: "58%", label: "Calls" },
  { Icon: CalendarIcon, x: "72%", y: "55%", label: "Calendar" },
];

const beforeLabels = [
  { text: "4h manual entry", x: "15%", y: "42%" },
  { text: "Error-prone", x: "55%", y: "38%" },
  { text: "Slow response", x: "35%", y: "78%" },
];

function BeforeSide() {
  return (
    <div className="absolute inset-0 bg-dark-950">
      <div className="absolute inset-0 bg-red-500/[0.04]" />
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 40% 40%, rgba(239,68,68,0.06) 0%, transparent 70%)" }} />

      <div className="absolute top-5 left-6 flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-red-500/60" />
        <span className="text-[10px] font-space uppercase tracking-[0.2em] text-red-400/70">Before</span>
      </div>

      <div className="absolute top-14 left-1/2 -translate-x-1/2">
        <span className="text-xs font-space text-dark-400/60 uppercase tracking-widest">Manual Process</span>
      </div>

      <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
        <line x1="20%" y1="25%" x2="68%" y2="18%" stroke="rgba(239,68,68,0.12)" strokeWidth="1" strokeDasharray="6 4" />
        <line x1="20%" y1="25%" x2="35%" y2="64%" stroke="rgba(239,68,68,0.12)" strokeWidth="1" strokeDasharray="6 4" />
        <line x1="68%" y1="18%" x2="78%" y2="62%" stroke="rgba(239,68,68,0.12)" strokeWidth="1" strokeDasharray="6 4" />
        <line x1="35%" y1="64%" x2="78%" y2="62%" stroke="rgba(239,68,68,0.10)" strokeWidth="1" strokeDasharray="6 4" />
      </svg>

      {beforeIcons.map(({ Icon, x, y, label }, i) => (
        <div key={label} className="absolute flex flex-col items-center gap-1.5" style={{ left: x, top: y, transform: `rotate(${-4 + i * 3}deg)` }}>
          <div className="p-2.5 rounded-lg bg-dark-900/80 border border-red-500/10 text-dark-400/70 shadow-lg shadow-red-500/[0.03]">
            <Icon />
          </div>
          <span className="text-[9px] font-space text-dark-500 uppercase tracking-wider">{label}</span>
        </div>
      ))}

      {beforeLabels.map(({ text, x, y }) => (
        <div key={text} className="absolute" style={{ left: x, top: y }}>
          <span className="text-[10px] font-space text-red-400/40 bg-red-500/[0.05] px-2 py-0.5 rounded border border-red-500/10">{text}</span>
        </div>
      ))}
    </div>
  );
}

/* ── After Side ───────────────────────────────────────────────── */

const afterNodes = [
  { Icon: DataIcon, label: "Ingest" },
  { Icon: AIIcon, label: "AI" },
  { Icon: GearIcon, label: "Process" },
  { Icon: DeployIcon, label: "Deploy" },
];

const afterLabels = [
  { text: "Instant", x: "18%", y: "78%" },
  { text: "99.9% accurate", x: "42%", y: "78%" },
  { text: "24/7", x: "72%", y: "78%" },
];

function AfterSide() {
  return (
    <div className="absolute inset-0 bg-dark-950">
      <div className="absolute inset-0 bg-accent-500/[0.03]" />
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(var(--accent-rgb),0.06) 0%, transparent 70%)" }} />

      <div className="absolute top-5 right-6 flex items-center gap-2">
        <span className="text-[10px] font-space uppercase tracking-[0.2em] text-accent-400/70">After</span>
        <div className="w-1.5 h-1.5 rotate-45 bg-accent-500/60 shadow-[0_0_6px_rgba(var(--accent-rgb),0.4)]" />
      </div>

      <div className="absolute top-14 left-1/2 -translate-x-1/2">
        <span className="text-xs font-space text-accent-400/50 uppercase tracking-widest">Automated Flow</span>
      </div>

      <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
        {[0, 1, 2].map((i) => {
          const x1 = `${17 + i * 22}%`;
          const x2 = `${39 + i * 22}%`;
          return (
            <g key={i}>
              <line x1={x1} y1="50%" x2={x2} y2="50%" stroke="rgba(var(--accent-rgb),0.25)" strokeWidth="1.5" />
              <motion.circle
                r="3"
                fill="rgba(228,180,78,0.6)"
                initial={{ cx: x1, cy: "50%", opacity: 0 }}
                animate={{ cx: [x1, x2], cy: ["50%", "50%"], opacity: [0, 1, 1, 0] }}
                transition={{ delay: 0.5 + i * 0.4, duration: 1, repeat: Infinity, repeatDelay: 1.5, ease: "easeInOut" }}
              />
            </g>
          );
        })}
      </svg>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-0 w-[85%]">
        {afterNodes.map(({ Icon, label }) => (
          <div key={label} className="flex items-center flex-1 justify-center">
            <div className="flex flex-col items-center gap-2">
              <div className="relative p-3 rounded-xl bg-dark-900/80 border border-accent-500/20 text-accent-400/80 shadow-lg shadow-accent-500/[0.05]">
                <div className="absolute -top-0.5 -left-0.5 w-1.5 h-1.5 rotate-45 bg-accent-500/30" />
                <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rotate-45 bg-accent-500/30" />
                <Icon />
              </div>
              <span className="text-[9px] font-space text-accent-400/60 uppercase tracking-wider">{label}</span>
            </div>
          </div>
        ))}
      </div>

      {afterLabels.map(({ text, x, y }) => (
        <div key={text} className="absolute" style={{ left: x, top: y }}>
          <span className="text-[10px] font-space text-accent-400/50 bg-accent-500/[0.06] px-2 py-0.5 rounded border border-accent-500/10">{text}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Main Component ────────────────────────────────────────────── */

export default function BeforeAfterSlider({ className = "" }: BeforeAfterSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: false, margin: "-60px" });
  const [position, setPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const rafRef = useRef<number>(0);
  const startRef = useRef<number>(0);

  // Auto-animate: sweep 25% → 75% → 25% in a smooth loop
  useEffect(() => {
    if (!isInView || isDragging) return;

    const CYCLE = 4000; // 4s per full sweep cycle

    const tick = (now: number) => {
      if (!startRef.current) startRef.current = now;
      const t = ((now - startRef.current) % CYCLE) / CYCLE;
      // Sine wave: smoothly oscillates between 20 and 80
      const val = 50 + 30 * Math.sin(t * Math.PI * 2);
      setPosition(val);
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isInView, isDragging]);

  // Resume auto-animation after drag release (with delay)
  useEffect(() => {
    if (!isDragging) {
      const t = setTimeout(() => {
        startRef.current = 0; // reset so animation resumes smoothly
      }, 2000);
      return () => clearTimeout(t);
    }
  }, [isDragging]);

  const updatePosition = useCallback((clientX: number) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = clientX - rect.left;
    setPosition(Math.max(5, Math.min(95, (x / rect.width) * 100)));
  }, []);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setIsDragging(true);
    cancelAnimationFrame(rafRef.current);
    updatePosition(e.clientX);
  }, [updatePosition]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return;
    updatePosition(e.clientX);
  }, [isDragging, updatePosition]);

  const onPointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  return (
    <div ref={sectionRef} className={className}>
      <motion.div
        ref={containerRef}
        className="relative w-full aspect-[16/9] md:aspect-[2/1] rounded-2xl overflow-hidden border border-dark-700/30 bg-dark-950 select-none"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        style={{ touchAction: "none" }}
      >
        {/* After side (full, behind) */}
        <AfterSide />

        {/* Before side (clipped) */}
        <div className="absolute inset-0 overflow-hidden" style={{ width: `${position}%` }}>
          <div className="absolute inset-0" style={{ width: `${(100 / position) * 100}%` }}>
            <BeforeSide />
          </div>
        </div>

        {/* Divider */}
        <div className="absolute top-0 bottom-0 z-10" style={{ left: `${position}%` }}>
          <div className="absolute top-0 bottom-0 left-0 w-[2px] -translate-x-1/2 bg-accent-500/40">
            <motion.div
              className="absolute inset-0 bg-gradient-to-b from-accent-400/0 via-accent-400/50 to-accent-400/0"
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>

          {/* Handle */}
          <div onPointerDown={onPointerDown} className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 cursor-ew-resize touch-none">
            <motion.div
              className="w-9 h-9 rounded-full bg-dark-900 border-2 border-accent-500/50 flex items-center justify-center shadow-[0_0_16px_rgba(var(--accent-rgb),0.2)]"
              animate={isDragging ? {} : { scale: [1, 1.08, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              whileHover={{ scale: 1.15, borderColor: "rgba(var(--accent-rgb),0.7)" }}
              whileTap={{ scale: 0.95 }}
            >
              <svg width="16" height="16" viewBox="0 0 18 18" fill="none" className="text-accent-400">
                <path d="M6 5L2 9L6 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 5L16 9L12 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

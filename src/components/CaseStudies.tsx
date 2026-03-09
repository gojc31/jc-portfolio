import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import { useRef, useEffect, useState, useCallback } from "react";
import TextReveal from "./TextReveal";
import BeforeAfterSlider from "./BeforeAfterSlider";

/* ─── Enhanced case study data ─────────────────────────────────── */

interface CaseResult {
  metric: string;
  value: number;
  suffix: string;
}

interface CaseStudy {
  tag: string;
  title: string;
  client: string;
  metric: string;
  metricLabel: string;
  desc: string;
  steps: string[];
  problem: string;
  solution: string;
  results: CaseResult[];
  tools: string[];
}

const projects: CaseStudy[] = [
  {
    tag: "Voice AI",
    title: "Advanced AI Voice Receptionist & Dynamic Appointment Manager",
    client: "HVAC Services Company",
    metric: "80%",
    metricLabel: "cost reduction",
    desc: "A complex n8n workflow triggered by VAPI to handle inbound voice calls. Dynamically manages all appointment actions and logs all call data and recordings into Airtable for comprehensive tracking.",
    steps: ["Inbound Call", "AI Classify", "Book/Update", "Log Data"],
    problem:
      "The client's manual call handling was restricted to business hours, resulting in missed opportunities and high overhead. No automated way to book, update, or cancel appointments from phone calls.",
    solution:
      "Engineered a fully autonomous inbound call system using VAPI triggers within n8n. The workflow dynamically manages calendar appointments (Book/Update/Cancel), integrates with Google/Outlook APIs, and logs all recordings to Airtable, achieving 100% data accuracy.",
    results: [
      { metric: "Call Coverage", value: 24, suffix: "/7" },
      { metric: "Data Accuracy", value: 100, suffix: "%" },
      { metric: "Cost Reduction", value: 80, suffix: "%" },
    ],
    tools: ["n8n", "VAPI", "Airtable", "Calendar APIs", "Webhooks"],
  },
  {
    tag: "Sales Automation",
    title: "Sales Lifecycle Execution Automation",
    client: "Multi-Service Agency",
    metric: "40h",
    metricLabel: "saved per week",
    desc: "Sophisticated multi-path workflow triggered by Asana task statuses. Automatically sends customized emails, creates project folders in Google Drive, and initiates service-specific subtasks.",
    steps: ["Status Change", "Route Logic", "Execute Actions", "Notify Team"],
    problem:
      "The sales team needed strict adherence to processes for different lead stages and service lines, which was previously error-prone. Manual folder creation and email sending caused delays and inconsistency.",
    solution:
      "Designed a complex, multi-path routing architecture triggered by Asana task statuses. The system ensures process compliance by automatically generating client Google Drive folders, sending stage-specific emails, and assigning subtasks based on service type.",
    results: [
      { metric: "Hours Saved Weekly", value: 40, suffix: "h" },
      { metric: "Process Compliance", value: 100, suffix: "%" },
      { metric: "Folder Creation Time", value: 3, suffix: "s" },
    ],
    tools: ["Zapier", "Asana", "Gmail", "Google Drive"],
  },
  {
    tag: "Lead Generation",
    title: "Instant Lead Capture & Multi-Channel Nurturing",
    client: "Coaching Business",
    metric: "5",
    metricLabel: "min speed-to-lead",
    desc: "Implements instantaneous lead capture launching sequenced, multi-step campaigns across SMS, email, and automated call tasks with conditional wait steps based on engagement.",
    steps: ["Capture", "Enrich", "Nurture", "Qualify"],
    problem:
      "The sales team struggled with consistent initial outreach. Leads went cold waiting for follow-up, and there was no systematic multi-channel nurturing in place.",
    solution:
      "Built a speed-to-lead system that triggers multi-channel nurturing (SMS/Email/Call) instantly upon capture (<5 min latency). Implemented 'Smart Tagging' logic to detect reply sentiment, automatically cleanse stale leads, and ensure 100% pipeline accuracy.",
    results: [
      { metric: "Speed to Lead", value: 5, suffix: " min" },
      { metric: "Engagement Rate", value: 25, suffix: "% up" },
      { metric: "Response Rate", value: 15, suffix: "% up" },
    ],
    tools: ["GoHighLevel", "SMS", "Email", "Call Automation"],
  },
  {
    tag: "Financial Ops",
    title: "Enterprise E-Commerce & Accounting Synchronization",
    client: "Wholesale Distributor",
    metric: "100%",
    metricLabel: "financial accuracy",
    desc: "Highly complex Make.com scenario automating financial reporting for a high-volume wholesale distributor. Synchronizes orders, customers, and inventory between SellerCloud and QuickBooks Online.",
    steps: ["Watch Orders", "Find/Create", "Sync Items", "Reconcile"],
    problem:
      "The client processed thousands of orders manually, leading to ledger errors and duplicate customer profiles. Manual data entry between e-commerce and accounting was unsustainable at scale.",
    solution:
      "Built a Make.com automation that 'watches' for shipped orders, applies smart logic to find or create customers and items, updates prices dynamically, and ensures 100% reconciliation without human intervention using DataStore for deduplication.",
    results: [
      { metric: "Financial Accuracy", value: 100, suffix: "%" },
      { metric: "Manual Entry", value: 0, suffix: " hrs" },
      { metric: "Order Volume", value: 1000, suffix: "+/mo" },
    ],
    tools: ["Make", "QuickBooks Online", "SellerCloud API", "JSON", "DataStore"],
  },
];

/* ─── Animated counter (reused in cards & modal) ───────────────── */

function AnimatedCounter({
  value,
  suffix = "",
  trigger = true,
}: {
  value: string;
  suffix?: string;
  trigger?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const numericPart = parseFloat(value);
  const hasDecimal = value.includes(".");

  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { stiffness: 50, damping: 20 });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (trigger && isInView) {
      motionValue.set(numericPart);
    }
  }, [trigger, isInView, motionValue, numericPart]);

  useEffect(() => {
    const unsubscribe = spring.on("change", (v) => {
      setDisplay(hasDecimal ? v.toFixed(1) : Math.round(v).toString());
    });
    return unsubscribe;
  }, [spring, hasDecimal]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

/* ─── Modal counter that starts on mount ───────────────────────── */

function ModalCounter({
  value,
  suffix,
  delay,
}: {
  value: number;
  suffix: string;
  delay: number;
}) {
  const hasDecimal = String(value).includes(".");
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { stiffness: 40, damping: 18 });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    const timeout = setTimeout(() => motionValue.set(value), delay * 1000);
    return () => clearTimeout(timeout);
  }, [motionValue, value, delay]);

  useEffect(() => {
    const unsubscribe = spring.on("change", (v) => {
      setDisplay(hasDecimal ? v.toFixed(1) : Math.round(v).toString());
    });
    return unsubscribe;
  }, [spring, hasDecimal]);

  return (
    <span className="text-3xl md:text-4xl font-bold text-accent-400 font-space leading-none">
      {display}
      {suffix}
    </span>
  );
}

/* ─── Corner bracket accents for modal ─────────────────────────── */

function CornerBrackets() {
  const color = "rgb(var(--accent-rgb))";
  const positions: { className: string; rotate: string }[] = [
    { className: "top-4 left-4", rotate: "" },
    { className: "top-4 right-4", rotate: "scale(-1,1)" },
    { className: "bottom-4 left-4", rotate: "scale(1,-1)" },
    { className: "bottom-4 right-4", rotate: "scale(-1,-1)" },
  ];

  return (
    <>
      {positions.map((pos, i) => (
        <motion.svg
          key={i}
          className={`absolute ${pos.className} pointer-events-none`}
          width="36"
          height="36"
          viewBox="0 0 36 36"
          fill="none"
          style={{ transform: pos.rotate }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 + i * 0.05, duration: 0.4 }}
        >
          <path
            d="M2 34V8C2 4.686 4.686 2 8 2H34"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.6"
          />
          <rect
            x="1"
            y="1"
            width="4"
            height="4"
            transform="rotate(45 3 3)"
            fill={color}
            opacity="0.5"
          />
        </motion.svg>
      ))}
    </>
  );
}

/* ─── Phase component for the timeline ─────────────────────────── */

function TimelinePhase({
  label,
  children,
  delay,
  isLast,
}: {
  label: string;
  children: React.ReactNode;
  delay: number;
  isLast: boolean;
}) {
  return (
    <motion.div
      className="relative flex gap-6"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.5, ease: "easeOut" }}
    >
      {/* Vertical gold line + dot */}
      <div className="flex flex-col items-center flex-shrink-0">
        <motion.div
          className="w-3 h-3 rounded-full border-2 border-accent-500 bg-dark-900 z-10"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: delay + 0.1, type: "spring", stiffness: 200 }}
        />
        {!isLast && (
          <motion.div
            className="w-[2px] flex-1 bg-gradient-to-b from-accent-500/60 to-accent-500/10"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: delay + 0.2, duration: 0.4 }}
            style={{ transformOrigin: "top" }}
          />
        )}
      </div>

      {/* Content */}
      <div className={`pb-8 ${isLast ? "pb-0" : ""}`}>
        <span className="text-[11px] font-space uppercase tracking-widest text-accent-400/80 mb-2 block">
          {label}
        </span>
        {children}
      </div>
    </motion.div>
  );
}

/* ─── Case Study Modal ─────────────────────────────────────────── */

function CaseStudyModal({
  project,
  onClose,
}: {
  project: CaseStudy;
  onClose: () => void;
}) {
  // Body scroll lock (works cross-browser including iOS)
  useEffect(() => {
    const scrollY = window.scrollY;
    const body = document.body;
    const html = document.documentElement;

    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.overflow = "hidden";
    html.style.overflow = "hidden";

    return () => {
      body.style.position = "";
      body.style.top = "";
      body.style.left = "";
      body.style.right = "";
      body.style.overflow = "";
      html.style.overflow = "";
      requestAnimationFrame(() => {
        window.scrollTo({ top: scrollY, behavior: "instant" });
      });
    };
  }, []);

  // Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[300] flex items-center justify-center p-4 md:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-dark-950/90 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Modal panel */}
      <motion.div
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-dark-900/95 border border-dark-700/40 shadow-2xl"
        initial={{ scale: 0.9, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Corner brackets */}
        <CornerBrackets />

        {/* Close button */}
        <motion.button
          className="absolute top-5 right-5 z-20 w-10 h-10 rounded-full border border-dark-700/50 bg-dark-800/80 flex items-center justify-center text-dark-300 hover:text-accent-400 hover:border-accent-500/40 transition-colors duration-200"
          onClick={onClose}
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M2 2L14 14M14 2L2 14" />
          </svg>
        </motion.button>

        {/* Modal content */}
        <div className="p-8 md:p-12 pt-10 md:pt-14">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-10"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-1.5 h-1.5 rotate-45 bg-accent-500/70 shadow-[0_0_6px_rgba(var(--accent-rgb),0.4)]" />
              <span className="text-xs font-space uppercase tracking-widest text-accent-400/80">
                {project.tag}
              </span>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-dark-50 mb-2">
              {project.title}
            </h3>
            <p className="text-sm font-space text-dark-400">
              Client: {project.client}
            </p>
          </motion.div>

          {/* Timeline: Problem → Solution → Results */}
          <div className="flex flex-col">
            {/* Problem */}
            <TimelinePhase label="Problem" delay={0.25} isLast={false}>
              <p className="text-dark-300 text-sm leading-relaxed max-w-xl">
                {project.problem}
              </p>
            </TimelinePhase>

            {/* Solution */}
            <TimelinePhase label="Solution" delay={0.45} isLast={false}>
              <p className="text-dark-300 text-sm leading-relaxed max-w-xl mb-4">
                {project.solution}
              </p>
              {/* Tools */}
              <div className="flex flex-wrap gap-2">
                {project.tools.map((tool, i) => (
                  <motion.span
                    key={tool}
                    className="text-[10px] font-space text-dark-400 uppercase tracking-wider px-3 py-1.5 rounded-lg border border-dark-700/40 bg-dark-800/60"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.55 + i * 0.05 }}
                  >
                    {tool}
                  </motion.span>
                ))}
              </div>
            </TimelinePhase>

            {/* Results */}
            <TimelinePhase label="Results" delay={0.65} isLast>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-1">
                {project.results.map((r, i) => (
                  <motion.div
                    key={r.metric}
                    className="relative px-5 py-4 rounded-xl bg-dark-800/50 border border-accent-500/15 text-center"
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      delay: 0.8 + i * 0.1,
                      type: "spring",
                      stiffness: 120,
                    }}
                  >
                    {/* Corner diamonds */}
                    <div className="absolute -top-1 -left-1 w-2 h-2 rotate-45 border border-accent-500/30 bg-dark-900" />
                    <div className="absolute -top-1 -right-1 w-2 h-2 rotate-45 border border-accent-500/30 bg-dark-900" />
                    <div className="absolute -bottom-1 -left-1 w-2 h-2 rotate-45 border border-accent-500/30 bg-dark-900" />
                    <div className="absolute -bottom-1 -right-1 w-2 h-2 rotate-45 border border-accent-500/30 bg-dark-900" />

                    <ModalCounter
                      value={r.value}
                      suffix={r.suffix}
                      delay={0.9 + i * 0.15}
                    />
                    <span className="block text-[10px] font-space text-dark-400 uppercase tracking-wider mt-1.5">
                      {r.metric}
                    </span>
                  </motion.div>
                ))}
              </div>
            </TimelinePhase>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── 3D Carousel Card ─────────────────────────────────────────── */

function CaseCard({
  project,
  isActive,
  position,
  onClick,
}: {
  project: CaseStudy;
  isActive: boolean;
  position: number; // -2, -1, 0, 1, 2 etc. 0 = center
  onClick: () => void;
}) {
  const absPos = Math.abs(position);
  const rotateY = position * -20;
  const translateX = position * 280;
  const cardScale = isActive ? 1 : Math.max(0.75, 0.85 - absPos * 0.05);
  const cardOpacity = isActive ? 1 : Math.max(0.3, 0.6 - absPos * 0.15);
  const zIndex = 10 - absPos;

  return (
    <motion.div
      className="absolute top-0 left-1/2 w-[460px] max-w-[85vw] cursor-pointer select-none"
      style={{ zIndex }}
      animate={{
        x: translateX - 230,
        rotateY,
        scale: cardScale,
        opacity: cardOpacity,
      }}
      transition={{
        type: "spring",
        stiffness: 120,
        damping: 20,
        mass: 0.8,
      }}
      onClick={onClick}
      whileHover={isActive ? { scale: 1.02 } : {}}
    >
      <div
        className={`relative rounded-2xl overflow-hidden transition-all duration-500 ${
          isActive
            ? "bg-dark-900/90 border border-accent-500/30 shadow-[0_0_40px_rgba(var(--accent-rgb),0.08)]"
            : "bg-dark-900/70 border border-dark-700/30"
        }`}
      >
        {/* Active card glow */}
        {isActive && (
          <div className="absolute inset-0 pointer-events-none rounded-2xl">
            <div className="absolute inset-0 bg-gradient-to-b from-accent-500/[0.04] via-transparent to-accent-500/[0.02]" />
            <div className="absolute -inset-px rounded-2xl border border-accent-500/10" />
          </div>
        )}

        {/* Animated left accent line */}
        <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-dark-700/20 overflow-hidden z-[2]">
          <motion.div
            className="w-full h-10 bg-gradient-to-b from-transparent via-accent-500/60 to-transparent"
            animate={{ y: ["-40px", "400px"] }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              repeatDelay: 3,
              ease: "easeInOut",
            }}
          />
        </div>

        <div className="p-6 md:p-8">
          {/* Tag badge */}
          <div className="flex items-center gap-2 mb-5">
            <div className="w-1.5 h-1.5 rotate-45 bg-accent-500/70 shadow-[0_0_6px_rgba(var(--accent-rgb),0.4)]" />
            <span className="text-[10px] font-space uppercase tracking-[0.15em] text-accent-400/80 px-2 py-0.5 rounded border border-accent-500/15 bg-accent-500/[0.05]">
              {project.tag}
            </span>
          </div>

          {/* Metric display */}
          <div className="mb-4">
            <span className="text-4xl md:text-5xl font-bold text-accent-400 font-space leading-none">
              <AnimatedCounter
                value={project.metric.replace(/[^0-9.]/g, "")}
                suffix={project.metric.replace(/[0-9.]/g, "")}
                trigger={isActive}
              />
            </span>
            <span className="block text-[10px] font-space text-dark-400 uppercase tracking-wider mt-1.5">
              {project.metricLabel}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-lg md:text-xl font-semibold text-dark-50 mb-2 leading-tight">
            {project.title}
          </h3>

          {/* Description */}
          <p className="text-dark-300 text-sm leading-relaxed mb-5 line-clamp-3">
            {project.desc}
          </p>

          {/* Tools row */}
          <div className="flex flex-wrap gap-1.5">
            {project.tools.map((tool) => (
              <span
                key={tool}
                className="text-[9px] font-space text-dark-400 uppercase tracking-wider px-2.5 py-1 rounded-md border border-dark-700/40 bg-dark-800/60"
              >
                {tool}
              </span>
            ))}
          </div>

          {/* View details hint on active card */}
          {isActive && (
            <motion.div
              className="mt-5 flex items-center gap-2 text-accent-400/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <span className="text-[10px] font-space uppercase tracking-widest">
                Click to explore
              </span>
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2 6h8M7 3l3 3-3 3" />
              </svg>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Carousel Arrow Button ────────────────────────────────────── */

function CarouselArrow({
  direction,
  onClick,
}: {
  direction: "left" | "right";
  onClick: () => void;
}) {
  return (
    <motion.button
      className="absolute top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full border border-dark-700/50 bg-dark-800/80 backdrop-blur-sm flex items-center justify-center text-dark-300 hover:text-accent-400 hover:border-accent-500/40 transition-colors duration-200"
      style={{ [direction === "left" ? "left" : "right"]: "1rem" }}
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label={`Go to ${direction === "left" ? "previous" : "next"} card`}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {direction === "left" ? (
          <path d="M10 3L5 8L10 13" />
        ) : (
          <path d="M6 3L11 8L6 13" />
        )}
      </svg>
    </motion.button>
  );
}

/* ─── 3D Perspective Carousel ──────────────────────────────────── */

function Carousel3D() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Touch/swipe state
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const total = projects.length;

  const goTo = useCallback(
    (index: number) => {
      setActiveIndex(((index % total) + total) % total);
    },
    [total]
  );

  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);
  const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);

  // Auto-advance every 5 seconds, pauses on hover
  useEffect(() => {
    if (isHovered || modalOpen) return;
    const interval = setInterval(goNext, 5000);
    return () => clearInterval(interval);
  }, [goNext, isHovered, modalOpen]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (modalOpen) return;
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [goNext, goPrev, modalOpen]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goNext();
      else goPrev();
    }
  };

  const handleCardClick = (index: number) => {
    if (index === activeIndex) {
      setModalOpen(true);
    } else {
      goTo(index);
    }
  };

  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
  }, []);

  // Calculate position offset for each card relative to active
  const getPosition = (index: number): number => {
    let diff = index - activeIndex;
    // Wrap around for circular navigation feel
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    return diff;
  };

  return (
    <>
      {/* Desktop carousel */}
      <div
        ref={containerRef}
        className="relative hidden md:block"
        style={{ perspective: "1200px" }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Carousel track */}
        <div
          className="relative w-full"
          style={{
            height: "420px",
            transformStyle: "preserve-3d",
          }}
        >
          {projects.map((project, index) => {
            const position = getPosition(index);
            // Only render cards that are close enough to be visible
            if (Math.abs(position) > 2) return null;
            return (
              <CaseCard
                key={project.title}
                project={project}
                isActive={index === activeIndex}
                position={position}
                onClick={() => handleCardClick(index)}
              />
            );
          })}
        </div>

        {/* Arrow buttons */}
        <CarouselArrow direction="left" onClick={goPrev} />
        <CarouselArrow direction="right" onClick={goNext} />

        {/* Dot indicators */}
        <div className="flex items-center justify-center gap-2.5 mt-8">
          {projects.map((_, index) => (
            <button
              key={index}
              onClick={() => goTo(index)}
              aria-label={`Go to slide ${index + 1}`}
              className="group relative p-1"
            >
              <motion.div
                className="rounded-full"
                animate={{
                  width: index === activeIndex ? 24 : 8,
                  height: 8,
                  backgroundColor:
                    index === activeIndex ? "rgb(var(--accent-rgb))" : "#27272A",
                }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
              />
              {index === activeIndex && (
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{
                    boxShadow: "0 0 12px rgba(var(--accent-rgb),0.3)",
                  }}
                  layoutId="activeDot"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile stack layout */}
      <div
        className="md:hidden relative"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="relative overflow-hidden"
          style={{ perspective: "1000px" }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              className="w-full"
              initial={{ opacity: 0, x: 80 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -80 }}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
            >
              <div
                className="relative rounded-2xl overflow-hidden bg-dark-900/90 border border-accent-500/25 shadow-[0_0_30px_rgba(var(--accent-rgb),0.06)]"
                onClick={() => setModalOpen(true)}
              >
                {/* Glow */}
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-accent-500/[0.04] via-transparent to-accent-500/[0.02]" />

                {/* Accent line */}
                <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-dark-700/20 overflow-hidden z-[2]">
                  <motion.div
                    className="w-full h-10 bg-gradient-to-b from-transparent via-accent-500/60 to-transparent"
                    animate={{ y: ["-40px", "400px"] }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      repeatDelay: 3,
                      ease: "easeInOut",
                    }}
                  />
                </div>

                <div className="p-6">
                  {/* Tag */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1.5 h-1.5 rotate-45 bg-accent-500/70 shadow-[0_0_6px_rgba(var(--accent-rgb),0.4)]" />
                    <span className="text-[10px] font-space uppercase tracking-[0.15em] text-accent-400/80 px-2 py-0.5 rounded border border-accent-500/15 bg-accent-500/[0.05]">
                      {projects[activeIndex].tag}
                    </span>
                  </div>

                  {/* Metric */}
                  <div className="mb-3">
                    <span className="text-4xl font-bold text-accent-400 font-space leading-none">
                      <AnimatedCounter
                        value={projects[activeIndex].metric.replace(
                          /[^0-9.]/g,
                          ""
                        )}
                        suffix={projects[activeIndex].metric.replace(
                          /[0-9.]/g,
                          ""
                        )}
                      />
                    </span>
                    <span className="block text-[10px] font-space text-dark-400 uppercase tracking-wider mt-1">
                      {projects[activeIndex].metricLabel}
                    </span>
                  </div>

                  {/* Title & desc */}
                  <h3 className="text-lg font-semibold text-dark-50 mb-2">
                    {projects[activeIndex].title}
                  </h3>
                  <p className="text-dark-300 text-sm leading-relaxed mb-4 line-clamp-3">
                    {projects[activeIndex].desc}
                  </p>

                  {/* Tools */}
                  <div className="flex flex-wrap gap-1.5">
                    {projects[activeIndex].tools.map((tool) => (
                      <span
                        key={tool}
                        className="text-[9px] font-space text-dark-400 uppercase tracking-wider px-2.5 py-1 rounded-md border border-dark-700/40 bg-dark-800/60"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>

                  {/* Tap hint */}
                  <div className="mt-4 flex items-center gap-2 text-accent-400/50">
                    <span className="text-[10px] font-space uppercase tracking-widest">
                      Tap to explore
                    </span>
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M2 6h8M7 3l3 3-3 3" />
                    </svg>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Mobile arrows */}
        <div className="flex items-center justify-center gap-4 mt-6">
          <motion.button
            className="w-10 h-10 rounded-full border border-dark-700/50 bg-dark-800/80 flex items-center justify-center text-dark-300 hover:text-accent-400 hover:border-accent-500/40 transition-colors"
            onClick={goPrev}
            whileTap={{ scale: 0.9 }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M10 3L5 8L10 13" />
            </svg>
          </motion.button>

          {/* Dots */}
          <div className="flex items-center gap-2">
            {projects.map((_, index) => (
              <button
                key={index}
                onClick={() => goTo(index)}
                aria-label={`Go to slide ${index + 1}`}
              >
                <motion.div
                  className="rounded-full"
                  animate={{
                    width: index === activeIndex ? 20 : 6,
                    height: 6,
                    backgroundColor:
                      index === activeIndex ? "rgb(var(--accent-rgb))" : "#27272A",
                  }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                />
              </button>
            ))}
          </div>

          <motion.button
            className="w-10 h-10 rounded-full border border-dark-700/50 bg-dark-800/80 flex items-center justify-center text-dark-300 hover:text-accent-400 hover:border-accent-500/40 transition-colors"
            onClick={goNext}
            whileTap={{ scale: 0.9 }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M6 3L11 8L6 13" />
            </svg>
          </motion.button>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && (
          <CaseStudyModal
            project={projects[activeIndex]}
            onClose={handleCloseModal}
          />
        )}
      </AnimatePresence>
    </>
  );
}

/* ─── Section ──────────────────────────────────────────────────── */

export default function CaseStudies() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const headingY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <section id="work" ref={sectionRef} className="relative py-28 md:py-36">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        <motion.div style={{ y: headingY }} className="mb-16">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-2 h-2 rotate-45 bg-accent-500/60 shadow-[0_0_8px_rgba(var(--accent-rgb),0.3)]" />
            <span className="text-sm font-space text-accent-400/70 tracking-widest uppercase">
              Featured Work
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-accent-500/20 to-transparent" />
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-[-0.02em]">
            <TextReveal>Case</TextReveal>{" "}
            <span className="text-accent-400">
              <TextReveal delay={0.15}>studies.</TextReveal>
            </span>
          </h2>
        </motion.div>

        {/* Before / After comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <p className="text-center text-xs font-space text-dark-400/60 tracking-[0.2em] uppercase mb-4">
            Drag to compare
          </p>
          <BeforeAfterSlider className="max-w-3xl mx-auto" />
        </motion.div>

        {/* 3D Perspective Carousel */}
        <Carousel3D />
      </div>
    </section>
  );
}

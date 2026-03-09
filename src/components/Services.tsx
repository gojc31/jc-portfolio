import { motion, AnimatePresence, useInView } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import { Bot, Workflow, Database, Plug, Lightbulb, Sparkles } from "lucide-react";
import GlowCard from "./GlowCard";
import AnimatedCounter from "./AnimatedCounter";
import TextReveal from "./TextReveal";

/* ── Service data ────────────────────────────────────────────────── */

const services = [
  {
    icon: Bot,
    title: "AI Chatbots & Assistants",
    desc: "Custom conversational AI powered by LLMs — trained on your data, deployed on your channels.",
    tag: "NLP",
  },
  {
    icon: Workflow,
    title: "Workflow Automation",
    desc: "End-to-end process automation with Make, n8n, and custom integrations that run 24/7.",
    tag: "OPS",
  },
  {
    icon: Database,
    title: "AI Data Pipelines",
    desc: "Intelligent ETL and data processing that learns and adapts.",
    tag: "ETL",
  },
  {
    icon: Plug,
    title: "Custom Integrations",
    desc: "Connect any tool to any platform with bulletproof APIs.",
    tag: "API",
  },
  {
    icon: Lightbulb,
    title: "AI Strategy & Consulting",
    desc: "Roadmaps for AI adoption that align with your business goals.",
    tag: "GTM",
  },
  {
    // Empty slot — the "hole" in the sliding puzzle
    icon: Sparkles,
    title: "",
    desc: "",
    tag: "",
    empty: true,
  },
];

type ServiceItem = (typeof services)[number];

/* ── Grid layout: 2 rows × 3 cols = 6 slots ─────────────────────── */

const COLS = 3;
const ROWS = 2;

function getRowCol(slotIndex: number) {
  return { row: Math.floor(slotIndex / COLS), col: slotIndex % COLS };
}

function areAdjacent(a: number, b: number) {
  const posA = getRowCol(a);
  const posB = getRowCol(b);
  const dr = Math.abs(posA.row - posB.row);
  const dc = Math.abs(posA.col - posB.col);
  return (dr === 1 && dc === 0) || (dr === 0 && dc === 1);
}

function getAdjacentSlots(slot: number): number[] {
  const { row, col } = getRowCol(slot);
  const adj: number[] = [];
  if (row > 0) adj.push((row - 1) * COLS + col);
  if (row < ROWS - 1) adj.push((row + 1) * COLS + col);
  if (col > 0) adj.push(row * COLS + (col - 1));
  if (col < COLS - 1) adj.push(row * COLS + (col + 1));
  return adj;
}

/* ── Terminal Typer ──────────────────────────────────────────────── */

function TerminalTyper() {
  const phrases = [
    "initializing services...",
    "loading AI modules...",
    "connecting pipelines...",
    "systems operational ✓",
  ];
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const phrase = phrases[phraseIdx];
    let timer: ReturnType<typeof setTimeout>;
    if (!deleting && text.length < phrase.length) {
      timer = setTimeout(() => setText(phrase.slice(0, text.length + 1)), 40 + Math.random() * 30);
    } else if (!deleting && text.length === phrase.length) {
      timer = setTimeout(() => setDeleting(true), 1800);
    } else if (deleting && text.length > 0) {
      timer = setTimeout(() => setText(text.slice(0, -1)), 20);
    } else {
      setDeleting(false);
      setPhraseIdx((phraseIdx + 1) % phrases.length);
    }
    return () => clearTimeout(timer);
  }, [text, deleting, phraseIdx]);

  return (
    <span className="text-accent-400 font-space text-xs">
      {text}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ repeat: Infinity, duration: 0.8 }}
        className="inline-block w-[6px] h-[14px] bg-accent-500/60 ml-0.5 align-middle"
      />
    </span>
  );
}

/* ── Border Trace ────────────────────────────────────────────────── */

function BorderTrace({ hovered }: { hovered: boolean }) {
  return (
    <AnimatePresence>
      {hovered && (
        <>
          <motion.div
            className="absolute top-0 left-0 h-[1px] bg-gradient-to-r from-accent-500/80 to-transparent"
            initial={{ width: 0 }} animate={{ width: "100%" }} exit={{ width: 0, transition: { duration: 0.2 } }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
          <motion.div
            className="absolute top-0 left-0 w-[1px] bg-gradient-to-b from-accent-500/80 to-transparent"
            initial={{ height: 0 }} animate={{ height: "100%" }} exit={{ height: 0, transition: { duration: 0.2 } }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
          />
          <motion.div
            className="absolute -top-1 -left-1 w-3 h-3 rounded-full"
            initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.3 }}
            style={{ background: "radial-gradient(circle, rgba(var(--accent-rgb),0.6) 0%, transparent 70%)" }}
          />
        </>
      )}
    </AnimatePresence>
  );
}

/* ── Puzzle Card ──────────────────────────────────────────────────── */

function PuzzleCard({
  service,
  canSlide,
  onSlide,
  inView,
}: {
  service: ServiceItem;
  canSlide: boolean;
  onSlide: () => void;
  inView: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const isEmpty = "empty" in service && service.empty;

  if (isEmpty) {
    return (
      <div className="w-full h-full rounded-2xl border border-dashed border-accent-500/10 bg-dark-900/20 flex items-center justify-center">
        <motion.div
          className="w-2 h-2 rotate-45 bg-accent-500/15"
          animate={{ rotate: [45, 225, 405], scale: [1, 0.8, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    );
  }

  return (
    <motion.div
      className={`w-full h-full ${canSlide ? "cursor-pointer" : ""}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={canSlide ? onSlide : undefined}
      whileHover={canSlide ? { scale: 1.02 } : {}}
      whileTap={canSlide ? { scale: 0.97 } : {}}
    >
      <GlowCard className="h-full">
        <div className="p-5 h-full flex flex-col justify-between group relative overflow-hidden">
          <BorderTrace hovered={hovered} />

          {/* Slide hint arrow — shows when adjacent to empty */}
          {canSlide && hovered && (
            <motion.div
              className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="px-3 py-1 rounded-full bg-accent-500/10 border border-accent-500/20 text-accent-400 text-[10px] font-space uppercase tracking-wider">
                Slide
              </div>
            </motion.div>
          )}

          {/* Tag */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-accent-500/60"
              animate={inView ? { opacity: [0.4, 1, 0.4] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-[9px] font-space text-accent-500/40 uppercase tracking-widest">
              {service.tag}
            </span>
          </div>

          {/* Scan line on hover */}
          <AnimatePresence>
            {hovered && (
              <motion.div
                className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent-400/30 to-transparent pointer-events-none"
                initial={{ top: 0, opacity: 0 }}
                animate={{ top: "100%", opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: "linear" }}
              />
            )}
          </AnimatePresence>

          <motion.div
            className="w-10 h-10 rounded-lg bg-dark-800 border border-accent-500/15 flex items-center justify-center mb-3 relative"
            whileHover={{ scale: 1.2, rotate: 10, borderColor: "rgba(var(--accent-rgb),0.4)" }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
          >
            <service.icon size={18} className="text-accent-400/70 group-hover:text-accent-400 transition-colors duration-300" />
          </motion.div>

          <div>
            <h3 className="text-sm font-semibold mb-1.5 text-dark-50 group-hover:text-white transition-colors">
              {service.title}
            </h3>
            <p className="text-dark-400 text-xs leading-relaxed group-hover:text-dark-300 transition-colors duration-300 line-clamp-3">
              {service.desc}
            </p>
          </div>
        </div>
      </GlowCard>
    </motion.div>
  );
}

/* ── Main Component ──────────────────────────────────────────────── */

export default function Services() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: false, margin: "-60px" });

  // Puzzle state: array of 6 items in slot order
  const [grid, setGrid] = useState<ServiceItem[]>(() => [...services]);
  const [isSliding, setIsSliding] = useState(false);

  const emptyIndex = grid.findIndex((s) => "empty" in s && s.empty);

  // Slide a card into the empty slot
  const slideCard = useCallback(
    (cardSlot: number) => {
      if (isSliding) return;
      if (!areAdjacent(cardSlot, emptyIndex)) return;

      setIsSliding(true);
      setGrid((prev) => {
        const next = [...prev];
        [next[cardSlot], next[emptyIndex]] = [next[emptyIndex], next[cardSlot]];
        return next;
      });
      setTimeout(() => setIsSliding(false), 350);
    },
    [emptyIndex, isSliding]
  );

  // Auto-shuffle: periodically slide a random adjacent card
  useEffect(() => {
    if (!isInView) return;

    const interval = setInterval(() => {
      setGrid((prev) => {
        const ei = prev.findIndex((s) => "empty" in s && s.empty);
        const neighbors = getAdjacentSlots(ei);
        const pick = neighbors[Math.floor(Math.random() * neighbors.length)];
        const next = [...prev];
        [next[pick], next[ei]] = [next[ei], next[pick]];
        return next;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isInView]);

  return (
    <section id="services" ref={sectionRef} className="relative py-28 md:py-36 overflow-hidden">
      {/* Blueprint grid background */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(var(--accent-rgb),0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(var(--accent-rgb),0.3) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        {isInView && (
          <motion.div
            className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-500/20 to-transparent"
            initial={{ top: "0%" }}
            animate={{ top: "100%" }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          />
        )}
      </div>

      <div className="max-w-5xl mx-auto px-6 md:px-10 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <span className="text-sm font-space text-accent-500/70 tracking-widest uppercase block mb-3">
            Services
          </span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-[-0.02em]">
            <TextReveal>What I</TextReveal>{" "}
            <span className="text-accent-400">
              <TextReveal delay={0.15}>build.</TextReveal>
            </span>
          </h2>
          <div className="mt-4 h-5">
            {isInView && <TerminalTyper />}
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-12 flex flex-wrap justify-center gap-10 md:gap-16"
        >
          <div className="text-center">
            <span className="text-2xl md:text-3xl font-bold font-space text-accent-500">
              <AnimatedCounter end={200} suffix="+" duration={2200} />
            </span>
            <span className="block mt-1 text-[11px] tracking-widest uppercase text-dark-400">Automations Built</span>
          </div>
          <div className="text-center">
            <span className="text-2xl md:text-3xl font-bold font-space text-accent-500">
              <AnimatedCounter end={3.5} suffix="x" decimals={1} duration={1800} />
            </span>
            <span className="block mt-1 text-[11px] tracking-widest uppercase text-dark-400">Avg ROI</span>
          </div>
          <div className="text-center">
            <span className="text-2xl md:text-3xl font-bold font-space text-accent-500">
              <AnimatedCounter end={99.9} suffix="%" decimals={1} duration={2000} />
            </span>
            <span className="block mt-1 text-[11px] tracking-widest uppercase text-dark-400">Uptime</span>
          </div>
        </motion.div>

        {/* Sliding puzzle hint */}
        <motion.p
          className="text-center text-[10px] font-space text-dark-400/40 uppercase tracking-[0.2em] mb-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
        >
          Click adjacent cards to slide
        </motion.p>

        {/* Puzzle grid: 3 cols × 2 rows */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 auto-rows-[200px] sm:auto-rows-[190px]">
          {grid.map((service, slotIndex) => {
            const canSlide = areAdjacent(slotIndex, emptyIndex);

            return (
              <motion.div
                key={service.tag || "empty"}
                layout
                transition={{
                  layout: { type: "spring", stiffness: 300, damping: 28 },
                }}
                className="relative"
              >
                <PuzzleCard
                  service={service}
                  canSlide={canSlide}
                  onSlide={() => slideCard(slotIndex)}
                  inView={isInView}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

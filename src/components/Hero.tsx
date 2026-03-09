import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MagneticButton from "./MagneticButton";
import NetworkCanvas from "./NetworkCanvas";

/* ═══════════════════════════════════════════════════════════════════
   PIXEL AGENT SCENE
   Gold/dark themed pixel bots with click interactions
   ═══════════════════════════════════════════════════════════════════ */

function getAccentHex(): string {
  const rgb = getComputedStyle(document.documentElement).getPropertyValue("--accent-rgb").trim();
  if (!rgb) return "#D4A03C";
  const [r, g, b] = rgb.split(",").map((s) => parseInt(s.trim(), 10));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

/* ── Bot greetings ─────────────────────────────────────────────── */
const botGreetings = [
  "Hi!", "Hello!", "Hey!", "Yo!", "Hola!", "Beep!", "Boop!",
  "Sup!", "*wave*", "Oi!", "Howdy!", "Heya!", ":D", "^_^",
  "01001000 01101001!", "Need help?", "Working hard!",
];

/* ── Pixel bot sprite ──────────────────────────────────────────── */
function PixelBot({
  color,
  variant = 0,
  onClick,
  isExcited,
  greeting,
}: {
  color: string;
  variant?: number;
  onClick?: () => void;
  isExcited?: boolean;
  greeting?: string | null;
}) {
  const bodies: Record<number, string[][]> = {
    0: [
      // round bot
      ["  ", "██", "██", "  "],
      ["██", "▓▓", "▓▓", "██"],
      ["██", "░░", "░░", "██"],
      ["  ", "██", "██", "  "],
      ["██", "  ", "  ", "██"],
    ],
    1: [
      // antenna bot
      ["  ", "░░", "░░", "  "],
      ["██", "▓▓", "▓▓", "██"],
      ["██", "██", "██", "██"],
      ["  ", "██", "██", "  "],
      ["  ", "██", "██", "  "],
    ],
    2: [
      // wide bot
      ["██", "██", "██", "██"],
      ["██", "░░", "░░", "██"],
      ["██", "▓▓", "▓▓", "██"],
      ["██", "██", "██", "██"],
      ["  ", "██", "██", "  "],
    ],
  };

  const grid = bodies[variant % 3];
  const px = 3;

  return (
    <div className="relative">
      {/* Speech bubble */}
      <AnimatePresence>
        {greeting && (
          <motion.div
            initial={{ opacity: 0, y: 2, scale: 0.5 }}
            animate={{ opacity: 1, y: -18, scale: 1 }}
            exit={{ opacity: 0, y: -26, scale: 0.8 }}
            transition={{ duration: 0.3, ease: "backOut" }}
            className="absolute left-1/2 -translate-x-1/2 -top-1 z-50 pointer-events-none"
          >
            <div className="relative px-1.5 py-0.5 rounded bg-dark-50 whitespace-nowrap">
              <span className="text-[8px] font-space font-bold text-dark-950 leading-none">{greeting}</span>
              {/* Speech bubble tail */}
              <div className="absolute left-1/2 -translate-x-1/2 -bottom-[3px] w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-t-[3px] border-t-dark-50" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bot body with jump */}
      <motion.div
        className="relative cursor-pointer"
        style={{ width: grid[0].length * px, height: grid.length * px, imageRendering: "pixelated" }}
        onClick={onClick}
        animate={isExcited ? { y: [0, -10, 0], scale: [1, 1.3, 1] } : {}}
        transition={isExcited ? { duration: 0.4, ease: "easeOut" } : undefined}
      >
        {grid.map((row, y) =>
          row.map((cell, x) => {
            if (cell === "  ") return null;
            let bg = "";
            if (cell === "██") bg = color;
            if (cell === "▓▓") bg = "#18181B";
            if (cell === "░░") bg = isExcited ? getAccentHex() : "#FAFAFA";
            return (
              <div
                key={`${y}-${x}`}
                className="absolute"
                style={{
                  left: x * px,
                  top: y * px,
                  width: px,
                  height: px,
                  backgroundColor: bg,
                }}
              />
            );
          })
        )}
      </motion.div>

      {/* Landing shadow when jumping */}
      <AnimatePresence>
        {isExcited && (
          <motion.div
            className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full bg-dark-50/10"
            initial={{ width: 8, height: 2, opacity: 0.4 }}
            animate={{ width: [8, 4, 10, 8], height: 2, opacity: [0.4, 0.1, 0.5, 0] }}
            transition={{ duration: 0.4 }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Pixel data packet ─────────────────────────────────────────── */
function DataPacketPixel({ color }: { color: string }) {
  return (
    <div
      className="rotate-45"
      style={{
        width: 5,
        height: 5,
        backgroundColor: color,
        boxShadow: `0 0 6px ${color}`,
        imageRendering: "pixelated",
      }}
    />
  );
}

/* ── Click burst particles (no text — speech bubble handles it) ── */
function ClickBurst({ x, y, color }: { x: number; y: number; color: string }) {
  const particles = Array.from({ length: 6 }, (_, i) => {
    const angle = (i / 6) * Math.PI * 2;
    return { dx: Math.cos(angle) * 18, dy: Math.sin(angle) * 18 };
  });

  return (
    <div className="absolute pointer-events-none" style={{ left: x, top: y, zIndex: 50 }}>
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rotate-45"
          style={{ backgroundColor: color }}
          initial={{ x: 0, y: 0, opacity: 1 }}
          animate={{ x: p.dx, y: p.dy, opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

/* ── Service node (clickable) ──────────────────────────────────── */
function ServiceNode({
  label,
  icon,
  onClick,
  tooltip,
}: {
  label: string;
  icon: string;
  onClick?: () => void;
  tooltip?: string;
}) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [pulsing, setPulsing] = useState(false);

  const handleClick = () => {
    setPulsing(true);
    onClick?.();
    setTimeout(() => setPulsing(false), 600);
  };

  return (
    <div
      className="flex flex-col items-center gap-1.5 cursor-pointer"
      onClick={handleClick}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <motion.div
        className="relative w-10 h-10 rounded-lg border border-accent-500/20 bg-dark-800/80 flex items-center justify-center text-sm"
        whileHover={{ scale: 1.15, borderColor: "rgba(var(--accent-rgb),0.5)" }}
        whileTap={{ scale: 0.9 }}
        animate={pulsing ? {
          boxShadow: [
            "0 0 0px rgba(var(--accent-rgb),0)",
            "0 0 20px rgba(var(--accent-rgb),0.4)",
            "0 0 0px rgba(var(--accent-rgb),0)",
          ],
        } : {}}
        transition={pulsing ? { duration: 0.6 } : { duration: 0.2 }}
        style={{ imageRendering: "pixelated" }}
      >
        <span style={{ fontSize: 16 }}>{icon}</span>

        {/* Pulse ring on click */}
        <AnimatePresence>
          {pulsing && (
            <motion.div
              className="absolute inset-0 rounded-lg border border-accent-500/40"
              initial={{ opacity: 0.8, scale: 1 }}
              animate={{ opacity: 0, scale: 1.8 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
            />
          )}
        </AnimatePresence>
      </motion.div>

      <span className="text-[8px] font-space text-dark-500 uppercase tracking-[0.15em]">{label}</span>

      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && tooltip && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            className="absolute -bottom-9 whitespace-nowrap px-2 py-1 text-[9px] font-space text-dark-200 bg-dark-800 border border-dark-700/50 rounded-md z-40"
          >
            {tooltip}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Animated bot running between two points ───────────────────── */
function RunningBot({
  from,
  to,
  color,
  variant,
  delay,
  duration,
  onBotClick,
  botId,
  isExcited,
  greeting,
}: {
  from: { x: number; y: number };
  to: { x: number; y: number };
  color: string;
  variant: number;
  delay: number;
  duration: number;
  onBotClick: (id: number, x: number, y: number) => void;
  botId: number;
  isExcited: boolean;
  greeting: string | null;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const parent = ref.current.offsetParent as HTMLElement;
      const parentRect = parent?.getBoundingClientRect();
      onBotClick(
        botId,
        rect.left - (parentRect?.left ?? 0) + 6,
        rect.top - (parentRect?.top ?? 0) + 6
      );
    }
  };

  return (
    <motion.div
      ref={ref}
      className="absolute flex flex-col items-center gap-0.5 z-10"
      style={{ left: from.x, top: from.y }}
      animate={{
        left: [from.x, to.x, to.x, from.x, from.x],
        top: [from.y, to.y, to.y, from.y, from.y],
      }}
      transition={{
        duration: duration,
        delay,
        repeat: Infinity,
        ease: "linear",
        times: [0, 0.35, 0.5, 0.85, 1],
      }}
    >
      {/* Packet being carried */}
      <motion.div
        animate={{ opacity: [1, 1, 0, 0, 1] }}
        transition={{
          duration: duration,
          delay,
          repeat: Infinity,
          times: [0, 0.34, 0.35, 0.99, 1],
        }}
      >
        <DataPacketPixel color="rgb(var(--accent-rgb))" />
      </motion.div>
      {/* Bobbing animation */}
      <motion.div
        animate={{ y: [0, -2, 0, -2, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
      >
        <PixelBot color={color} variant={variant} onClick={handleClick} isExcited={isExcited} greeting={greeting} />
      </motion.div>
    </motion.div>
  );
}

/* ── Bot color shades from the portfolio palette ───────────────── */
function getBotColors() {
  const s = getComputedStyle(document.documentElement);
  return {
    gold: s.getPropertyValue("--color-accent-500").trim() || "#D4A03C",
    lightGold: s.getPropertyValue("--color-accent-400").trim() || "#E4B44E",
    warmGold: s.getPropertyValue("--color-accent-300").trim() || "#F0CC7A",
    muted: "#A1A1AA",
    dim: "#71717A",
  };
}

/* ── Main pixel scene ──────────────────────────────────────────── */
function PixelAgentScene() {
  const [active, setActive] = useState(false);
  const [bursts, setBursts] = useState<{ id: number; x: number; y: number; color: string }[]>([]);
  const [excitedBots, setExcitedBots] = useState<Set<number>>(new Set());
  const [botGreetingMap, setBotGreetingMap] = useState<Record<number, string | null>>({});
  const [clickCount, setClickCount] = useState(0);
  const burstId = useRef(0);
  const botColors = getBotColors();

  useEffect(() => {
    const t = setTimeout(() => setActive(true), 2000);
    return () => clearTimeout(t);
  }, []);

  const handleBotClick = (botId: number, x: number, y: number) => {
    const id = burstId.current++;
    const greeting = botGreetings[Math.floor(Math.random() * botGreetings.length)];
    setBursts((prev) => [...prev, { id, x, y, color: botColors.gold }]);
    setExcitedBots((prev) => new Set(prev).add(botId));
    setBotGreetingMap((prev) => ({ ...prev, [botId]: greeting }));
    setClickCount((c) => c + 1);

    setTimeout(() => {
      setBursts((prev) => prev.filter((b) => b.id !== id));
      setExcitedBots((prev) => {
        const next = new Set(prev);
        next.delete(botId);
        return next;
      });
      setBotGreetingMap((prev) => ({ ...prev, [botId]: null }));
    }, 1000);
  };

  const handleNodeClick = (x: number, y: number) => {
    const id = burstId.current++;
    setBursts((prev) => [...prev, { id, x: x + 20, y: y + 20, color: botColors.lightGold }]);
    setTimeout(() => setBursts((prev) => prev.filter((b) => b.id !== id)), 700);
  };

  const nodes = {
    email: { x: 16, y: 20 },
    ai: { x: 155, y: 20 },
    crm: { x: 295, y: 20 },
    slack: { x: 75, y: 130 },
    sheets: { x: 225, y: 130 },
    deploy: { x: 155, y: 220 },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: active ? 1 : 0 }}
      transition={{ duration: 0.8 }}
      className="relative w-[340px] h-[290px] mx-auto lg:mx-0"
    >
      {/* Grid floor — gold tinted */}
      <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.04 }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 40} x2="340" y2={i * 40} stroke="rgb(var(--accent-rgb))" strokeWidth="1" />
        ))}
        {Array.from({ length: 10 }).map((_, i) => (
          <line key={`v${i}`} x1={i * 40} y1="0" x2={i * 40} y2="290" stroke="rgb(var(--accent-rgb))" strokeWidth="1" />
        ))}
      </svg>

      {/* Connection lines — gold dashed */}
      <svg className="absolute inset-0 w-full h-full">
        {[
          [nodes.email, nodes.ai],
          [nodes.ai, nodes.crm],
          [nodes.email, nodes.slack],
          [nodes.ai, nodes.sheets],
          [nodes.ai, nodes.deploy],
          [nodes.crm, nodes.sheets],
          [nodes.slack, nodes.deploy],
          [nodes.sheets, nodes.deploy],
        ].map(([a, b], i) => (
          <motion.line
            key={i}
            x1={a.x + 20} y1={a.y + 20}
            x2={b.x + 20} y2={b.y + 20}
            stroke="rgba(var(--accent-rgb),0.1)"
            strokeWidth="1"
            strokeDasharray="4 4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 2.2 + i * 0.1, duration: 0.6 }}
          >
            <animate
              attributeName="stroke-dashoffset"
              from="0"
              to="-16"
              dur="2s"
              repeatCount="indefinite"
            />
          </motion.line>
        ))}
      </svg>

      {/* Service nodes — all use portfolio accent colors */}
      {([
        { key: "email", label: "Email", icon: "📧", tooltip: "Incoming data source" },
        { key: "ai", label: "AI", icon: "🧠", tooltip: "LLM processing" },
        { key: "crm", label: "CRM", icon: "📊", tooltip: "Deal management" },
        { key: "slack", label: "Slack", icon: "💬", tooltip: "Team notifications" },
        { key: "sheets", label: "Sheets", icon: "📋", tooltip: "Data storage" },
        { key: "deploy", label: "Deploy", icon: "🚀", tooltip: "Ship to production" },
      ] as const).map((node, i) => (
        <motion.div
          key={node.key}
          className="absolute"
          style={{ left: nodes[node.key].x, top: nodes[node.key].y }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 2.0 + i * 0.1, type: "spring", stiffness: 200 }}
        >
          <ServiceNode
            label={node.label}
            icon={node.icon}
            tooltip={node.tooltip}
            onClick={() => handleNodeClick(nodes[node.key].x, nodes[node.key].y)}
          />
        </motion.div>
      ))}

      {/* Running bots — gold/amber palette */}
      {active && (
        <>
          <RunningBot
            botId={0}
            from={{ x: nodes.email.x + 12, y: nodes.email.y + 45 }}
            to={{ x: nodes.ai.x + 12, y: nodes.ai.y + 45 }}
            color={botColors.gold}
            variant={0}
            delay={2.8}
            duration={4}
            onBotClick={handleBotClick}
            isExcited={excitedBots.has(0)}
            greeting={botGreetingMap[0] ?? null}
          />
          <RunningBot
            botId={1}
            from={{ x: nodes.ai.x + 18, y: nodes.ai.y + 50 }}
            to={{ x: nodes.crm.x + 12, y: nodes.crm.y + 50 }}
            color={botColors.lightGold}
            variant={1}
            delay={3.5}
            duration={5}
            onBotClick={handleBotClick}
            isExcited={excitedBots.has(1)}
            greeting={botGreetingMap[1] ?? null}
          />
          <RunningBot
            botId={2}
            from={{ x: nodes.email.x + 15, y: nodes.email.y + 55 }}
            to={{ x: nodes.slack.x + 12, y: nodes.slack.y - 5 }}
            color={botColors.warmGold}
            variant={2}
            delay={3.0}
            duration={4.5}
            onBotClick={handleBotClick}
            isExcited={excitedBots.has(2)}
            greeting={botGreetingMap[2] ?? null}
          />
          <RunningBot
            botId={3}
            from={{ x: nodes.ai.x + 8, y: nodes.ai.y + 55 }}
            to={{ x: nodes.sheets.x + 8, y: nodes.sheets.y - 5 }}
            color={botColors.muted}
            variant={0}
            delay={4.0}
            duration={5.5}
            onBotClick={handleBotClick}
            isExcited={excitedBots.has(3)}
            greeting={botGreetingMap[3] ?? null}
          />
          <RunningBot
            botId={4}
            from={{ x: nodes.ai.x + 15, y: nodes.ai.y + 58 }}
            to={{ x: nodes.deploy.x + 15, y: nodes.deploy.y - 5 }}
            color={botColors.dim}
            variant={1}
            delay={4.5}
            duration={6}
            onBotClick={handleBotClick}
            isExcited={excitedBots.has(4)}
            greeting={botGreetingMap[4] ?? null}
          />
        </>
      )}

      {/* Click burst effects */}
      <AnimatePresence>
        {bursts.map((b) => (
          <ClickBurst key={b.id} x={b.x} y={b.y} color={b.color} />
        ))}
      </AnimatePresence>

      {/* Status badge */}
      <motion.div
        className="absolute -top-2 -right-2 px-2.5 py-1 rounded-full bg-dark-800/90 border border-dark-700/40 flex items-center gap-1.5"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 3.0, duration: 0.5 }}
      >
        <motion.span
          className="w-1.5 h-1.5 rounded-full bg-accent-400"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <span className="text-[9px] font-space text-dark-300">5 agents active</span>
      </motion.div>

      {/* Throughput counter + click score */}
      <motion.div
        className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg bg-dark-800/90 border border-dark-700/40 flex items-center gap-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3.5, duration: 0.5 }}
      >
        <ThroughputCounter />
        <AnimatePresence>
          {clickCount > 0 && (
            <motion.span
              key={clickCount}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-[9px] font-space text-accent-400 border-l border-dark-700/40 pl-3"
            >
              {clickCount} booped
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Hint text */}
      <motion.span
        className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[9px] font-space text-dark-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.6, 0] }}
        transition={{ delay: 5, duration: 3, repeat: 2 }}
      >
        click the bots :)
      </motion.span>
    </motion.div>
  );
}

/* ── Live throughput counter ───────────────────────────────────── */
function ThroughputCounter() {
  const [count, setCount] = useState(1247);

  useEffect(() => {
    const id = setInterval(() => {
      setCount((c) => c + Math.floor(Math.random() * 3) + 1);
    }, 2000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="text-[10px] font-space text-dark-300 flex items-center gap-2 tabular-nums">
      <span className="text-accent-400 font-bold">{count.toLocaleString()}</span>
      tasks today
    </span>
  );
}

/* ── Metric counter animation ──────────────────────────────────── */
function AnimatedStat({ value, label, suffix = "" }: { value: number; label: string; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const steps = 30;
          const increment = value / steps;
          let current = 0;
          const id = setInterval(() => {
            current += increment;
            if (current >= value) {
              setCount(value);
              clearInterval(id);
            } else {
              setCount(Math.round(current));
            }
          }, 1200 / steps);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={ref} className="flex flex-col">
      <span className="text-xl md:text-2xl font-bold text-dark-50 tracking-tight tabular-nums">
        {count}{suffix}
      </span>
      <span className="text-[10px] font-space text-dark-400 uppercase tracking-wider">{label}</span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   HERO SECTION
   ═══════════════════════════════════════════════════════════════════ */
export default function Hero() {
  return (
    <section id="hero" className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      <NetworkCanvas />

      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-dark-950 to-transparent z-[1]" />
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-dark-950/50 to-transparent z-[1]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 pt-28 pb-16 w-full">
        {/* Main grid */}
        <div className="flex flex-col lg:flex-row items-start gap-10 lg:gap-16">
          <div className="flex-1 max-w-2xl">
            <h1 className="text-4xl sm:text-5xl md:text-[4.2rem] font-bold leading-[1.05] tracking-[-0.03em] mb-6">
              <span className="block">
                {"Your workflows".split(" ").map((w, i) => (
                  <motion.span
                    key={`h0-${i}`}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.3 + i * 0.08, duration: 0.6, ease: "easeOut" }}
                    className="inline-block mr-[0.3em] text-dark-50"
                  >
                    {w}
                  </motion.span>
                ))}
              </span>
              <span className="block">
                {"should run themselves.".split(" ").map((w, i) => (
                  <motion.span
                    key={`h1-${i}`}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5 + i * 0.08, duration: 0.6, ease: "easeOut" }}
                    className="inline-block mr-[0.3em] text-accent-300/80"
                  >
                    {w}
                  </motion.span>
                ))}
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.9, duration: 0.6 }}
              className="text-dark-300 text-lg md:text-xl max-w-lg mb-8 leading-relaxed"
            >
              I build AI agents that handle your repetitive operations end-to-end — from lead intake to invoicing — so nothing falls through the cracks.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.1, duration: 0.6 }}
              className="flex flex-wrap items-center gap-4 mb-12"
            >
              <MagneticButton href="#contact">
                <span className="group relative inline-flex items-center gap-2.5 px-7 py-3.5 text-[15px] font-medium bg-accent-500 text-dark-950 rounded-full overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(var(--accent-rgb),0.25)]">
                  <span className="relative z-10">Deploy Your Agent</span>
                  <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">→</span>
                  <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                </span>
              </MagneticButton>

              <MagneticButton href="#case-studies">
                <span className="inline-flex items-center gap-2 px-5 py-3.5 text-sm font-space text-dark-300 hover:text-dark-50 border border-dark-700/40 rounded-full transition-colors duration-300 hover:border-dark-600/60">
                  See what it does
                </span>
              </MagneticButton>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.5, duration: 0.7 }}
              className="flex items-center gap-8 md:gap-10"
            >
              <AnimatedStat value={82} suffix="%" label="faster ops" />
              <div className="w-px h-8 bg-dark-700/40" />
              <AnimatedStat value={14} suffix="h" label="saved / week" />
              <div className="w-px h-8 bg-dark-700/40" />
              <AnimatedStat value={95} suffix="%" label="accuracy" />
            </motion.div>
          </div>

          {/* Pixel agent scene */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8, duration: 0.8, ease: "easeOut" }}
            className="flex-shrink-0 w-full lg:w-auto lg:mt-4"
          >
            <PixelAgentScene />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

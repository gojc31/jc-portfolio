import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";

/* ─── Floating element types ─── */
type Shape = "diamond" | "circle" | "hexagon";

interface Particle {
  id: number;
  x: number; // % position
  y: number; // % position
  size: number;
  opacity: number;
  shape: Shape;
  floatDuration: number; // seconds for idle float
  floatDelay: number;
}

/* ─── Shape SVGs ─── */
function ShapeSVG({ shape, size }: { shape: Shape; size: number }) {
  const stroke = "rgba(var(--accent-rgb), 0.5)";
  const fill = "rgba(var(--accent-rgb), 0.08)";

  if (shape === "diamond") {
    const half = size / 2;
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <polygon
          points={`${half},1 ${size - 1},${half} ${half},${size - 1} 1,${half}`}
          stroke={stroke}
          strokeWidth="1"
          fill={fill}
        />
      </svg>
    );
  }

  if (shape === "circle") {
    const r = size / 2 - 1;
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={r} stroke={stroke} strokeWidth="1" fill={fill} />
      </svg>
    );
  }

  // hexagon
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 1;
  const pts = Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 3) * i - Math.PI / 2;
    return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
  }).join(" ");

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <polygon points={pts} stroke={stroke} strokeWidth="1" fill={fill} />
    </svg>
  );
}

/* ─── Generate particles ─── */
function generateParticles(count: number): Particle[] {
  const shapes: Shape[] = ["diamond", "circle", "hexagon"];
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 10 + Math.random() * 18,
    opacity: 0.15 + Math.random() * 0.4,
    shape: shapes[i % 3],
    floatDuration: 4 + Math.random() * 6,
    floatDelay: Math.random() * -10,
  }));
}

/* ─── Corner bracket (TechFrame style) ─── */
function CornerBracket({ position }: { position: string }) {
  const isTop = position.includes("top");
  const isLeft = position.includes("left");
  const color = "rgba(var(--accent-rgb), 0.45)";

  return (
    <motion.div
      className={`absolute ${isTop ? "top-4" : "bottom-4"} ${isLeft ? "left-4" : "right-4"} pointer-events-none`}
      initial={{ opacity: 0, scale: 0 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.3, duration: 0.4, ease: "easeOut" }}
    >
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        className={`${!isTop ? "rotate-180" : ""} ${!isLeft && isTop ? "-scale-x-100" : ""} ${!isLeft && !isTop ? "scale-x-[-1]" : ""}`}
      >
        <path
          d="M2 30V6C2 3.79 3.79 2 6 2H30"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
        <rect
          x="1"
          y="1"
          width="4"
          height="4"
          transform="rotate(45 3 3)"
          fill={color}
          opacity="0.7"
        />
      </svg>
    </motion.div>
  );
}

/* ─── Main component ─── */
export default function MagneticCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const particleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const animFrameRef = useRef<number>(0);
  const mousePos = useRef({ x: -9999, y: -9999 });
  const particleHome = useRef<{ x: number; y: number }[]>([]);
  const particleCurrent = useRef<{ x: number; y: number }[]>([]);

  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [particleCount, setParticleCount] = useState(20);
  const [particles] = useState<Particle[]>(() => generateParticles(30)); // generate max, slice later

  // Cursor glow motion values
  const cursorX = useMotionValue(-200);
  const cursorY = useMotionValue(-200);
  const smoothX = useSpring(cursorX, { stiffness: 80, damping: 25 });
  const smoothY = useSpring(cursorY, { stiffness: 80, damping: 25 });
  const glowBackground = useTransform(
    [smoothX, smoothY],
    ([x, y]: number[]) =>
      `radial-gradient(600px circle at ${x}px ${y}px, rgba(var(--accent-rgb), 0.06), transparent 60%)`
  );

  /* ─── Detect touch & responsive particle count ─── */
  useEffect(() => {
    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    setIsTouchDevice(isTouch);

    const updateCount = () => {
      setParticleCount(window.innerWidth < 640 ? 8 : window.innerWidth < 1024 ? 14 : 20);
    };
    updateCount();
    window.addEventListener("resize", updateCount);
    return () => window.removeEventListener("resize", updateCount);
  }, []);

  /* ─── Store home positions once DOM is ready ─── */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const rect = section.getBoundingClientRect();
    const homes: { x: number; y: number }[] = [];
    const currents: { x: number; y: number }[] = [];

    particleRefs.current.forEach((el, i) => {
      if (!el) return;
      const p = particles[i];
      const hx = (p.x / 100) * rect.width;
      const hy = (p.y / 100) * rect.height;
      homes[i] = { x: hx, y: hy };
      currents[i] = { x: hx, y: hy };
    });

    particleHome.current = homes;
    particleCurrent.current = currents;
  }, [particles, particleCount]);

  /* ─── Mouse tracking ─── */
  useEffect(() => {
    if (isTouchDevice) return;

    const section = sectionRef.current;
    if (!section) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      mousePos.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
      cursorX.set(e.clientX - rect.left);
      cursorY.set(e.clientY - rect.top);
    };

    const handleMouseLeave = () => {
      mousePos.current = { x: -9999, y: -9999 };
      cursorX.set(-200);
      cursorY.set(-200);
    };

    section.addEventListener("mousemove", handleMouseMove);
    section.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      section.removeEventListener("mousemove", handleMouseMove);
      section.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isTouchDevice, cursorX, cursorY]);

  /* ─── RAF magnetic physics loop ─── */
  useEffect(() => {
    if (isTouchDevice) return;

    const RADIUS = 250;
    const STRENGTH = 0.06;
    const RETURN_STRENGTH = 0.04;

    const tick = () => {
      const mx = mousePos.current.x;
      const my = mousePos.current.y;

      particleRefs.current.forEach((el, i) => {
        if (!el || !particleHome.current[i] || !particleCurrent.current[i]) return;

        const home = particleHome.current[i];
        const cur = particleCurrent.current[i];
        const dx = mx - cur.x;
        const dy = my - cur.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        let targetX = home.x;
        let targetY = home.y;

        if (dist < RADIUS && mx > -9000) {
          // Pull toward cursor
          const force = (1 - dist / RADIUS) * STRENGTH;
          targetX = cur.x + dx * force;
          targetY = cur.y + dy * force;

          // Also still pull back to home gently
          targetX += (home.x - cur.x) * RETURN_STRENGTH * 0.3;
          targetY += (home.y - cur.y) * RETURN_STRENGTH * 0.3;
        } else {
          // Spring back home
          targetX = cur.x + (home.x - cur.x) * RETURN_STRENGTH;
          targetY = cur.y + (home.y - cur.y) * RETURN_STRENGTH;
        }

        cur.x = targetX;
        cur.y = targetY;

        el.style.transform = `translate(${cur.x}px, ${cur.y}px)`;
      });

      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [isTouchDevice, particleCount]);

  const visibleParticles = particles.slice(0, particleCount);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[80vh] flex items-center justify-center overflow-hidden"
      style={{ background: "#09090B" }}
    >
      {/* ─── Grid pattern ─── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(var(--accent-rgb), 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(var(--accent-rgb), 0.03) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* ─── Radial glow following cursor ─── */}
      {!isTouchDevice && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ background: glowBackground }}
        />
      )}

      {/* ─── Corner brackets ─── */}
      <CornerBracket position="top-left" />
      <CornerBracket position="top-right" />
      <CornerBracket position="bottom-left" />
      <CornerBracket position="bottom-right" />

      {/* ─── Decorative border lines ─── */}
      <motion.div
        className="absolute top-4 left-10 right-10 h-px"
        style={{
          background:
            "linear-gradient(90deg, rgba(var(--accent-rgb),0.3), transparent 30%, transparent 70%, rgba(var(--accent-rgb),0.3))",
        }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4, duration: 0.8 }}
      />
      <motion.div
        className="absolute bottom-4 left-10 right-10 h-px"
        style={{
          background:
            "linear-gradient(90deg, rgba(var(--accent-rgb),0.3), transparent 30%, transparent 70%, rgba(var(--accent-rgb),0.3))",
        }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.45, duration: 0.8 }}
      />
      <motion.div
        className="absolute top-10 bottom-10 left-4 w-px"
        style={{
          background:
            "linear-gradient(180deg, rgba(var(--accent-rgb),0.3), transparent 30%, transparent 70%, rgba(var(--accent-rgb),0.3))",
        }}
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4, duration: 0.8 }}
      />
      <motion.div
        className="absolute top-10 bottom-10 right-4 w-px"
        style={{
          background:
            "linear-gradient(180deg, rgba(var(--accent-rgb),0.3), transparent 30%, transparent 70%, rgba(var(--accent-rgb),0.3))",
        }}
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.45, duration: 0.8 }}
      />

      {/* ─── Floating particles ─── */}
      <div className="absolute inset-0 pointer-events-none">
        {visibleParticles.map((p, i) => (
          <div
            key={p.id}
            ref={(el) => {
              particleRefs.current[i] = el;
            }}
            className="absolute left-0 top-0 will-change-transform"
            style={{
              opacity: p.opacity,
              // Initial position set via transform, RAF takes over
              transform: `translate(${(p.x / 100) * 100}%, ${(p.y / 100) * 100}%)`,
            }}
          >
            {/* Idle floating animation wrapper */}
            <motion.div
              animate={{
                y: [0, -8, 0, 6, 0],
                x: [0, 4, 0, -3, 0],
                rotate: [0, 5, 0, -5, 0],
              }}
              transition={{
                duration: p.floatDuration,
                repeat: Infinity,
                ease: "easeInOut",
                delay: p.floatDelay,
              }}
            >
              <ShapeSVG shape={p.shape} size={p.size} />
            </motion.div>
          </div>
        ))}
      </div>

      {/* ─── Content ─── */}
      <div className="relative z-10 flex flex-col items-center text-center px-6">
        {/* Monospace label */}
        <motion.p
          className="font-space text-sm tracking-widest mb-8"
          style={{ color: "rgb(var(--accent-rgb))" }}
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.span
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          >
            {"// what's next?"}
          </motion.span>
        </motion.p>

        {/* Heading */}
        <motion.h2
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-4"
          style={{ color: "#FAFAFA" }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          Ready to automate?
        </motion.h2>

        {/* Subtext */}
        <motion.p
          className="text-lg sm:text-xl md:text-2xl mb-12 max-w-xl"
          style={{ color: "#A1A1AA" }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          Let's build something extraordinary.
        </motion.p>

        {/* Diamond divider */}
        <motion.div
          className="flex items-center gap-3 mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.35, duration: 0.6 }}
        >
          <div
            className="h-px w-12"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(var(--accent-rgb),0.4))",
            }}
          />
          <div
            className="w-2 h-2 rotate-45"
            style={{
              background: "rgba(var(--accent-rgb),0.5)",
              boxShadow: "0 0 8px rgba(var(--accent-rgb),0.3)",
            }}
          />
          <div
            className="h-px w-12"
            style={{
              background: "linear-gradient(90deg, rgba(var(--accent-rgb),0.4), transparent)",
            }}
          />
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <motion.a
            href="#contact"
            className="group relative inline-flex items-center gap-3 px-10 py-4 text-lg font-semibold rounded-sm overflow-hidden transition-colors duration-300"
            style={{
              color: "#09090B",
              background: "linear-gradient(135deg, rgb(var(--accent-rgb)), rgba(var(--accent-rgb), 0.8))",
            }}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 0 40px rgba(var(--accent-rgb), 0.35), 0 0 80px rgba(var(--accent-rgb), 0.15)",
            }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            {/* Shimmer overlay */}
            <span
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background:
                  "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.2) 50%, transparent 60%)",
                backgroundSize: "200% 100%",
                animation: "shimmer 1.5s infinite",
              }}
            />
            <span className="relative z-10">Start a Project</span>
            <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">
              &rarr;
            </span>
          </motion.a>
        </motion.div>
      </div>

      {/* ─── Shimmer keyframes ─── */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </section>
  );
}

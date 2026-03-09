import { useEffect, useRef } from "react";

function getAccentRGB(): { r: number; g: number; b: number } {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue("--accent-rgb")
    .trim();
  if (raw) {
    const [r, g, b] = raw.split(",").map((s) => parseInt(s.trim(), 10));
    if (!isNaN(r) && !isNaN(g) && !isNaN(b)) return { r, g, b };
  }
  return { r: 139, g: 92, b: 246 };
}

const TRAIL_LENGTH = 20;
const TAU = Math.PI * 2;

export default function MouseSpotlight() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const colorRef = useRef(getAccentRGB());

  const state = useRef({
    mx: -200,
    my: -200,
    gx: -200,
    gy: -200,
    visible: false,
    hovering: false,
    trail: [] as { x: number; y: number }[],
    frameCount: 0,
  });

  useEffect(() => {
    const s = state.current;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const onMove = (e: MouseEvent) => {
      s.mx = e.clientX;
      s.my = e.clientY;
      if (!s.visible) s.visible = true;
      const t = e.target as HTMLElement;
      s.hovering = !!t.closest("a, button, [role='button'], input, textarea, select");
    };
    const onLeave = () => { s.visible = false; };
    const onEnter = () => { s.visible = true; };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    let raf: number;

    const tick = () => {
      if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Refresh accent color periodically
      s.frameCount++;
      if (s.frameCount % 60 === 0) colorRef.current = getAccentRGB();
      const C = colorRef.current;

      // Update ambient glow
      s.gx += (s.mx - s.gx) * 0.04;
      s.gy += (s.my - s.gy) * 0.04;
      if (glowRef.current) {
        glowRef.current.style.background = `radial-gradient(circle, rgba(${C.r},${C.g},${C.b},0.7) 0%, rgba(${C.r},${C.g},${C.b},0.15) 30%, transparent 65%)`;
        glowRef.current.style.transform = `translate(${s.gx}px, ${s.gy}px) translate(-50%, -50%)`;
        glowRef.current.style.opacity = s.visible ? "0.04" : "0";
      }

      if (!s.visible) {
        raf = requestAnimationFrame(tick);
        return;
      }

      // Add current position to trail
      s.trail.unshift({ x: s.mx, y: s.my });
      if (s.trail.length > TRAIL_LENGTH) s.trail.length = TRAIL_LENGTH;

      // Draw trail (smooth fading tail)
      for (let i = s.trail.length - 1; i >= 1; i--) {
        const p = s.trail[i];
        const prev = s.trail[i - 1];
        const t = 1 - i / s.trail.length;
        const alpha = t * 0.6;
        const width = t * (s.hovering ? 3 : 2);

        ctx.beginPath();
        ctx.moveTo(prev.x, prev.y);
        ctx.lineTo(p.x, p.y);
        ctx.strokeStyle = `rgba(${C.r},${C.g},${C.b},${alpha})`;
        ctx.lineWidth = width;
        ctx.lineCap = "round";
        ctx.stroke();
      }

      // Draw fading dots along trail
      for (let i = 0; i < s.trail.length; i++) {
        const p = s.trail[i];
        const t = 1 - i / s.trail.length;
        const alpha = t * 0.4;
        const size = t * 1.5;

        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, TAU);
        ctx.fillStyle = `rgba(${C.r},${C.g},${C.b},${alpha})`;
        ctx.fill();
      }

      // Draw cursor dot
      const dotR = s.hovering ? 10 : 5;
      const innerR = s.hovering ? 4 : 2.5;

      // Outer glow
      const grad = ctx.createRadialGradient(s.mx, s.my, 0, s.mx, s.my, dotR * 3);
      grad.addColorStop(0, `rgba(${C.r},${C.g},${C.b},0.25)`);
      grad.addColorStop(1, `rgba(${C.r},${C.g},${C.b},0)`);
      ctx.beginPath();
      ctx.arc(s.mx, s.my, dotR * 3, 0, TAU);
      ctx.fillStyle = grad;
      ctx.fill();

      // Ring (hover state)
      if (s.hovering) {
        ctx.beginPath();
        ctx.arc(s.mx, s.my, dotR, 0, TAU);
        ctx.strokeStyle = `rgba(${C.r},${C.g},${C.b},0.6)`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Core dot
      ctx.beginPath();
      ctx.arc(s.mx, s.my, innerR, 0, TAU);
      ctx.fillStyle = `rgba(${C.r},${C.g},${C.b},0.9)`;
      ctx.fill();

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[9998] hidden md:block">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      <div
        ref={glowRef}
        className="absolute rounded-full"
        style={{ width: 500, height: 500, opacity: 0, willChange: "transform" }}
      />
    </div>
  );
}

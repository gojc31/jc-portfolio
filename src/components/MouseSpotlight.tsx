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

const TRAIL_LENGTH = 30;
const TAU = Math.PI * 2;

/* ── Shape generators ─────────────────────────────────────────── */
function hexagon(cx: number, cy: number, r: number, rot: number): [number, number][] {
  return Array.from({ length: 6 }, (_, i) => {
    const a = rot + (i * TAU) / 6;
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r] as [number, number];
  });
}
function diamond(cx: number, cy: number, r: number, rot: number): [number, number][] {
  return Array.from({ length: 4 }, (_, i) => {
    const a = rot + (i * TAU) / 4;
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r] as [number, number];
  });
}
function triangle(cx: number, cy: number, r: number, rot: number): [number, number][] {
  return Array.from({ length: 3 }, (_, i) => {
    const a = rot + (i * TAU) / 3 - Math.PI / 2;
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r] as [number, number];
  });
}

function lerpShapes(a: [number, number][], b: [number, number][], t: number): [number, number][] {
  const maxLen = Math.max(a.length, b.length);
  const result: [number, number][] = [];
  for (let i = 0; i < maxLen; i++) {
    const pa = a[i % a.length];
    const pb = b[i % b.length];
    result.push([pa[0] + (pb[0] - pa[0]) * t, pa[1] + (pb[1] - pa[1]) * t]);
  }
  return result;
}

function drawBracket(
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number, size: number,
  rot: number, cornerAngle: number, alpha: number,
  c: { r: number; g: number; b: number }
) {
  const len = size * 0.3;
  const cos = Math.cos(cornerAngle + rot);
  const sin = Math.sin(cornerAngle + rot);
  const px = cx + cos * size;
  const py = cy + sin * size;
  const perpCos = Math.cos(cornerAngle + rot + Math.PI / 2);
  const perpSin = Math.sin(cornerAngle + rot + Math.PI / 2);

  ctx.beginPath();
  ctx.moveTo(px - cos * len, py - sin * len);
  ctx.lineTo(px, py);
  ctx.lineTo(px + perpCos * len, py + perpSin * len);
  ctx.strokeStyle = `rgba(${c.r},${c.g},${c.b},${alpha})`;
  ctx.lineWidth = 1.2;
  ctx.stroke();
}

export default function MouseSpotlight() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const colorRef = useRef(getAccentRGB());

  const state = useRef({
    mx: -200, my: -200,
    gx: -200, gy: -200,
    visible: false,
    hovering: false,
    clicking: false,
    time: 0,
    shapePhase: 0,
    clickShapeIdx: 0,
    scanPulse: 0,
    clickFlash: 0,
    trail: [] as { x: number; y: number }[],
    particles: [] as { x: number; y: number; vx: number; vy: number; life: number; size: number }[],
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
    const onDown = () => {
      s.clicking = true;
      s.scanPulse = 1;
      s.clickFlash = 1;
      s.clickShapeIdx = (s.clickShapeIdx + 1) % 3;
      s.shapePhase = s.clickShapeIdx * 3;
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * TAU + Math.random() * 0.4;
        const speed = 1.5 + Math.random() * 2.5;
        s.particles.push({
          x: s.mx, y: s.my,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          size: 1 + Math.random() * 2,
        });
      }
    };
    const onUp = () => { s.clicking = false; };
    const onLeave = () => { s.visible = false; };
    const onEnter = () => { s.visible = true; };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    let raf: number;
    const shapes = [hexagon, diamond, triangle];
    const shapeDuration = 3;
    const morphDuration = 0.8;

    const tick = () => {
      if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      s.frameCount++;
      if (s.frameCount % 30 === 0) colorRef.current = getAccentRGB();
      const C = colorRef.current;

      // Ambient glow
      s.gx += (s.mx - s.gx) * 0.04;
      s.gy += (s.my - s.gy) * 0.04;
      if (glowRef.current) {
        glowRef.current.style.background = `radial-gradient(circle, rgba(${C.r},${C.g},${C.b},0.8) 0%, rgba(${C.r},${C.g},${C.b},0.2) 25%, transparent 65%)`;
        glowRef.current.style.transform = `translate(${s.gx}px, ${s.gy}px) translate(-50%, -50%)`;
        glowRef.current.style.opacity = s.visible ? "0.035" : "0";
      }

      if (!s.visible) { raf = requestAnimationFrame(tick); return; }

      s.time += 1 / 60;
      const { mx, my, hovering, clicking, time } = s;
      const coreR = clicking ? 4 : hovering ? 8 : 6;

      /* ══════════════════════════════════════════════════════════
         1. LASER TRAIL — bright, glowing tail line
         ══════════════════════════════════════════════════════════ */
      s.trail.unshift({ x: mx, y: my });
      if (s.trail.length > TRAIL_LENGTH) s.trail.length = TRAIL_LENGTH;

      if (s.trail.length > 2) {
        // Outer glow pass (thicker, semi-transparent)
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        for (let i = s.trail.length - 1; i >= 1; i--) {
          const p = s.trail[i];
          const prev = s.trail[i - 1];
          const t = 1 - i / s.trail.length;
          ctx.beginPath();
          ctx.moveTo(prev.x, prev.y);
          ctx.lineTo(p.x, p.y);
          // Glow layer
          ctx.strokeStyle = `rgba(${C.r},${C.g},${C.b},${t * 0.15})`;
          ctx.lineWidth = t * 8;
          ctx.stroke();
          // Core bright line
          ctx.beginPath();
          ctx.moveTo(prev.x, prev.y);
          ctx.lineTo(p.x, p.y);
          ctx.strokeStyle = `rgba(${C.r},${C.g},${C.b},${t * 0.7})`;
          ctx.lineWidth = t * 2.5;
          ctx.stroke();
          // Hot white center
          ctx.beginPath();
          ctx.moveTo(prev.x, prev.y);
          ctx.lineTo(p.x, p.y);
          ctx.strokeStyle = `rgba(255,255,255,${t * 0.25})`;
          ctx.lineWidth = t * 0.8;
          ctx.stroke();
        }
      }

      /* ══════════════════════════════════════════════════════════
         2. SHAPE-MORPHING CORE CURSOR
         ══════════════════════════════════════════════════════════ */
      s.shapePhase += 1 / 60;
      const totalCycle = shapeDuration * shapes.length;
      const cycleTime = s.shapePhase % totalCycle;
      const currentIdx = Math.floor(cycleTime / shapeDuration);
      const nextIdx = (currentIdx + 1) % shapes.length;
      const elapsed = cycleTime - currentIdx * shapeDuration;
      const morphT = elapsed > shapeDuration - morphDuration
        ? (elapsed - (shapeDuration - morphDuration)) / morphDuration : 0;
      const eased = morphT > 0 ? morphT * morphT * (3 - 2 * morphT) : 0;

      const rot1 = time * 0.5;
      const rot2 = time * 0.5 + 0.3;
      const shapeA = shapes[currentIdx](mx, my, coreR, rot1);
      const shapeB = shapes[nextIdx](mx, my, coreR, rot2);
      const currentShape = eased > 0 ? lerpShapes(shapeA, shapeB, eased) : shapeA;

      // Filled core shape
      if (currentShape.length > 1) {
        ctx.beginPath();
        ctx.moveTo(currentShape[0][0], currentShape[0][1]);
        for (let i = 1; i < currentShape.length; i++) ctx.lineTo(currentShape[i][0], currentShape[i][1]);
        ctx.closePath();
        ctx.fillStyle = `rgba(${C.r},${C.g},${C.b},0.9)`;
        ctx.fill();
        ctx.strokeStyle = `rgba(255,255,255,0.5)`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      // Core radial glow
      const grad = ctx.createRadialGradient(mx, my, 0, mx, my, coreR * 4);
      grad.addColorStop(0, `rgba(${C.r},${C.g},${C.b},0.35)`);
      grad.addColorStop(0.5, `rgba(${C.r},${C.g},${C.b},0.08)`);
      grad.addColorStop(1, `rgba(${C.r},${C.g},${C.b},0)`);
      ctx.beginPath();
      ctx.arc(mx, my, coreR * 4, 0, TAU);
      ctx.fillStyle = grad;
      ctx.fill();

      // Outer ghost shape (counter-rotating)
      const outerR = hovering ? 16 : 12;
      const outerShape = shapes[(currentIdx + 1) % shapes.length](mx, my, outerR, -time * 0.3);
      if (outerShape.length > 1) {
        ctx.beginPath();
        ctx.moveTo(outerShape[0][0], outerShape[0][1]);
        for (let i = 1; i < outerShape.length; i++) ctx.lineTo(outerShape[i][0], outerShape[i][1]);
        ctx.closePath();
        ctx.strokeStyle = `rgba(${C.r},${C.g},${C.b},${hovering ? 0.25 : 0.12})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      /* ══════════════════════════════════════════════════════════
         3. SCANNING BRACKETS + ARCS
         ══════════════════════════════════════════════════════════ */
      const bracketDist = hovering ? 28 : 20;
      const bracketAlpha = hovering ? 0.7 : 0.4;
      const bracketRot = time * 0.4;
      for (let i = 0; i < 4; i++) {
        drawBracket(ctx, mx, my, bracketDist, bracketRot, (i * TAU) / 4, bracketAlpha, C);
      }

      // Data arc segments
      const arcR = hovering ? 34 : 24;
      for (let i = 0; i < 3; i++) {
        const startA = time * 0.8 + (i * TAU) / 3;
        const span = 0.4 + Math.sin(time * 2 + i) * 0.15;
        ctx.beginPath();
        ctx.arc(mx, my, arcR, startA, startA + span);
        ctx.strokeStyle = `rgba(${C.r},${C.g},${C.b},${0.15 + Math.sin(time * 3 + i) * 0.1})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Arc end dot
        const dx = mx + Math.cos(startA + span) * arcR;
        const dy = my + Math.sin(startA + span) * arcR;
        ctx.beginPath();
        ctx.arc(dx, dy, 1.5, 0, TAU);
        ctx.fillStyle = `rgba(${C.r},${C.g},${C.b},0.5)`;
        ctx.fill();
      }

      /* ══════════════════════════════════════════════════════════
         4. CLICK EFFECTS
         ══════════════════════════════════════════════════════════ */
      // Scan pulse ring
      if (s.scanPulse > 0) {
        const pulseR = (1 - s.scanPulse) * 60;
        ctx.beginPath();
        ctx.arc(mx, my, pulseR, 0, TAU);
        ctx.strokeStyle = `rgba(${C.r},${C.g},${C.b},${s.scanPulse * 0.5})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        s.scanPulse -= 0.02;
        if (s.scanPulse < 0) s.scanPulse = 0;
      }

      // Click flash
      if (s.clickFlash > 0) {
        const flashGrad = ctx.createRadialGradient(mx, my, 0, mx, my, 25);
        flashGrad.addColorStop(0, `rgba(255,255,255,${s.clickFlash * 0.3})`);
        flashGrad.addColorStop(0.5, `rgba(${C.r},${C.g},${C.b},${s.clickFlash * 0.2})`);
        flashGrad.addColorStop(1, `rgba(${C.r},${C.g},${C.b},0)`);
        ctx.beginPath();
        ctx.arc(mx, my, 25, 0, TAU);
        ctx.fillStyle = flashGrad;
        ctx.fill();
        s.clickFlash -= 0.04;
        if (s.clickFlash < 0) s.clickFlash = 0;
      }

      // Burst particles
      for (let i = s.particles.length - 1; i >= 0; i--) {
        const p = s.particles[i];
        p.x += p.vx; p.y += p.vy;
        p.vx *= 0.96; p.vy *= 0.96;
        p.life -= 0.025;
        if (p.life <= 0) { s.particles.splice(i, 1); continue; }

        const pAlpha = p.life * 0.8;
        const pSize = p.size * p.life;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(s.time * 2 + i);
        ctx.beginPath();
        ctx.moveTo(0, -pSize);
        ctx.lineTo(pSize, 0);
        ctx.lineTo(0, pSize);
        ctx.lineTo(-pSize, 0);
        ctx.closePath();
        ctx.fillStyle = `rgba(${C.r},${C.g},${C.b},${pAlpha})`;
        ctx.fill();
        ctx.restore();
      }

      // Hover pulse ring
      if (hovering) {
        const pulseSize = 22 + Math.sin(time * 4) * 4;
        ctx.beginPath();
        ctx.arc(mx, my, pulseSize, 0, TAU);
        ctx.strokeStyle = `rgba(${C.r},${C.g},${C.b},${0.08 + Math.sin(time * 4) * 0.04})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      // Shape label indicators
      const shapeNames = ["HEX", "RHB", "TRI"];
      ctx.font = "7px 'Space Grotesk', monospace";
      ctx.textAlign = "center";
      const labelAlpha = 0.15 + Math.sin(time * 2) * 0.05;
      ctx.fillStyle = `rgba(${C.r},${C.g},${C.b},${hovering ? labelAlpha + 0.15 : labelAlpha})`;
      ctx.fillText(shapeNames[s.clickShapeIdx], mx - 42, my - 8);
      ctx.fillText("AI", mx + 32, my - 8);

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
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

import { useEffect, useRef } from "react";

interface CircuitLinesProps {
  className?: string;
}

export default function CircuitLines({ className = "" }: CircuitLinesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animId = useRef(0);
  const isVisible = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;

    const resize = () => {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });

    // Pause animation when not visible
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible.current = entry.isIntersecting;
        if (entry.isIntersecting) draw();
      },
      { threshold: 0.1 }
    );
    observer.observe(canvas);

    interface Signal {
      path: { x: number; y: number }[];
      progress: number;
      speed: number;
      length: number;
      totalLen: number;
      segLengths: number[];
    }

    const signals: Signal[] = [];

    const createSignal = () => {
      if (signals.length > 3) return;
      const points: { x: number; y: number }[] = [];
      let x = -10;
      let y = h * (0.2 + Math.random() * 0.6);
      points.push({ x, y });

      while (x < w + 10) {
        const segLen = 40 + Math.random() * 120;
        x += segLen;
        points.push({ x, y });
        if (Math.random() > 0.5) {
          const turnLen = 15 + Math.random() * 40;
          y += (Math.random() > 0.5 ? 1 : -1) * turnLen;
          y = Math.max(5, Math.min(h - 5, y));
          points.push({ x, y });
        }
      }

      // Pre-compute path lengths
      let totalLen = 0;
      const segLengths: number[] = [];
      for (let i = 1; i < points.length; i++) {
        const dx = points[i].x - points[i - 1].x;
        const dy = points[i].y - points[i - 1].y;
        const len = Math.sqrt(dx * dx + dy * dy);
        segLengths.push(len);
        totalLen += len;
      }

      signals.push({
        path: points,
        progress: 0,
        speed: 0.002 + Math.random() * 0.003,
        length: 0.05 + Math.random() * 0.08,
        totalLen,
        segLengths,
      });
    };

    const getPointAt = (path: { x: number; y: number }[], segLengths: number[], dist: number) => {
      let accumulated = 0;
      for (let i = 0; i < segLengths.length; i++) {
        if (accumulated + segLengths[i] >= dist) {
          const t = (dist - accumulated) / segLengths[i];
          return {
            x: path[i].x + (path[i + 1].x - path[i].x) * t,
            y: path[i].y + (path[i + 1].y - path[i].y) * t,
          };
        }
        accumulated += segLengths[i];
      }
      return path[path.length - 1];
    };

    const draw = () => {
      if (!isVisible.current) return;
      ctx.clearRect(0, 0, w, h);

      if (Math.random() < 0.02) createSignal();

      for (let s = signals.length - 1; s >= 0; s--) {
        const sig = signals[s];
        sig.progress += sig.speed;

        if (sig.progress > 1 + sig.length) {
          signals.splice(s, 1);
          continue;
        }

        // Draw faint trace
        ctx.beginPath();
        ctx.moveTo(sig.path[0].x, sig.path[0].y);
        for (let i = 1; i < sig.path.length; i++) {
          ctx.lineTo(sig.path[i].x, sig.path[i].y);
        }
        ctx.strokeStyle = "rgba(255, 255, 255, 0.03)";
        ctx.lineWidth = 1;
        ctx.stroke();

        // Draw signal — fewer steps (10 instead of 20)
        const headDist = sig.progress * sig.totalLen;
        const tailDist = (sig.progress - sig.length) * sig.totalLen;
        const steps = 10;
        for (let i = 0; i < steps; i++) {
          const t = i / steps;
          const dist = tailDist + (headDist - tailDist) * t;
          if (dist < 0 || dist > sig.totalLen) continue;
          const pt = getPointAt(sig.path, sig.segLengths, dist);
          const alpha = Math.sin(t * Math.PI) * 0.5;

          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
          ctx.fill();
        }

        // Bright head
        if (headDist > 0 && headDist < sig.totalLen) {
          const head = getPointAt(sig.path, sig.segLengths, headDist);
          ctx.beginPath();
          ctx.arc(head.x, head.y, 4, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
          ctx.fill();

          ctx.beginPath();
          ctx.arc(head.x, head.y, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
          ctx.fill();
        }
      }

      animId.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      observer.disconnect();
      cancelAnimationFrame(animId.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full pointer-events-none ${className}`}
      style={{ height: "60px" }}
    />
  );
}

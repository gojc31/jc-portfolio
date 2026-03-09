import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
}

export default function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const animId = useRef(0);
  const isActive = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });

    let lastSpawn = 0;
    let idleTimeout: ReturnType<typeof setTimeout>;

    const startLoop = () => {
      if (isActive.current) return;
      isActive.current = true;
      animate();
    };

    const onMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastSpawn > 50 && particles.current.length < 12) {
        lastSpawn = now;
        particles.current.push({
          x: e.clientX,
          y: e.clientY,
          vx: (Math.random() - 0.5) * 1,
          vy: (Math.random() - 0.5) * 1 + 0.3,
          life: 0,
          maxLife: 35 + Math.random() * 20,
          size: 1.5 + Math.random() * 1,
        });
      }
      startLoop();
      clearTimeout(idleTimeout);
      idleTimeout = setTimeout(() => {
        // Will stop naturally when particles die out
      }, 2000);
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.current = particles.current.filter((p) => {
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.015;

        const progress = p.life / p.maxLife;
        const alpha = 1 - progress;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (1 - progress * 0.5), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.35})`;
        ctx.fill();

        return p.life < p.maxLife;
      });

      if (particles.current.length > 0) {
        animId.current = requestAnimationFrame(animate);
      } else {
        isActive.current = false;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(animId.current);
      clearTimeout(idleTimeout);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-50"
      style={{ mixBlendMode: "screen" }}
    />
  );
}

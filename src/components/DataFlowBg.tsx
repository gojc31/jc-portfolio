import { useEffect, useRef } from "react";

/**
 * A subtle background animation showing vertical data streams
 * flowing downward — like data being processed through a pipeline.
 */
export default function DataFlowBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animId = useRef(0);

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
    window.addEventListener("resize", resize);

    interface Stream {
      x: number;
      chars: { y: number; char: string; speed: number; alpha: number }[];
    }

    const streams: Stream[] = [];
    const STREAM_COUNT = 12;
    const chars = "01αβγδ→←↓↑∞∑∏≈≠≤≥∧∨⊕⊗".split("");

    for (let i = 0; i < STREAM_COUNT; i++) {
      const x = (w / STREAM_COUNT) * i + Math.random() * (w / STREAM_COUNT);
      const stream: Stream = { x, chars: [] };
      const charCount = 3 + Math.floor(Math.random() * 6);
      for (let j = 0; j < charCount; j++) {
        stream.chars.push({
          y: Math.random() * h,
          char: chars[Math.floor(Math.random() * chars.length)],
          speed: 0.3 + Math.random() * 0.7,
          alpha: 0.03 + Math.random() * 0.06,
        });
      }
      streams.push(stream);
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.font = "12px 'Space Grotesk', monospace";

      for (const stream of streams) {
        for (const c of stream.chars) {
          c.y += c.speed;
          if (c.y > h + 20) {
            c.y = -20;
            c.char = chars[Math.floor(Math.random() * chars.length)];
          }

          ctx.fillStyle = `rgba(255, 255, 255, ${c.alpha})`;
          ctx.fillText(c.char, stream.x, c.y);
        }
      }

      animId.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animId.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.6 }}
    />
  );
}

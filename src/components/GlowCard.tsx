import { useRef, useState, useCallback } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface GlowCardProps {
  children: React.ReactNode;
  className?: string;
  tiltStrength?: number;
}

export default function GlowCard({
  children,
  className = "",
  tiltStrength = 8,
}: GlowCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [glowPos, setGlowPos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const rafRef = useRef(0);

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springRotateX = useSpring(rotateX, { stiffness: 200, damping: 25 });
  const springRotateY = useSpring(rotateY, { stiffness: 200, damping: 25 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      setGlowPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      rotateX.set((py - 0.5) * -tiltStrength);
      rotateY.set((px - 0.5) * tiltStrength);
    });
  }, [rotateX, rotateY, tiltStrength]);

  const handleMouseLeave = () => {
    setIsHovered(false);
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: springRotateX,
        rotateY: springRotateY,
        transformPerspective: 800,
        transformStyle: "preserve-3d",
      }}
      className={`relative overflow-hidden rounded-2xl bg-dark-900 border border-dark-700/50 transition-colors duration-300 hover:border-dark-600/80 ${className}`}
    >
      {/* Moving border shimmer */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-500"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `conic-gradient(from 180deg at ${glowPos.x}px ${glowPos.y}px, transparent 0%, rgba(255,255,255,0.12) 10%, transparent 20%, transparent 50%, rgba(255,255,255,0.08) 60%, transparent 70%)`,
        }}
      />
      {/* Radial glow at cursor */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(400px circle at ${glowPos.x}px ${glowPos.y}px, rgba(255,255,255,0.07), transparent 50%)`,
        }}
      />
      {/* Inner fill to mask the glow from card content area */}
      <div
        className="absolute inset-[1px] rounded-2xl bg-dark-900 z-[1] pointer-events-none"
        style={{ opacity: isHovered ? 0.96 : 1 }}
      />
      <div className="relative z-[2]" style={{ transform: "translateZ(20px)" }}>
        {children}
      </div>
    </motion.div>
  );
}

import { motion } from "framer-motion";

/**
 * Animated concentric pulse rings — used as decorative elements
 * to suggest signal/data transmission.
 */
interface PulseRingProps {
  className?: string;
  delay?: number;
  size?: number;
}

export default function PulseRing({ className = "", delay = 0, size = 200 }: PulseRingProps) {
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-full border border-white/[0.06]"
          initial={{ scale: 0.3, opacity: 0 }}
          animate={{
            scale: [0.3, 1.2],
            opacity: [0.3, 0],
          }}
          transition={{
            duration: 3,
            delay: delay + i * 0.8,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      ))}
      <div className="absolute inset-[45%] rounded-full bg-white/[0.08]" />
    </div>
  );
}

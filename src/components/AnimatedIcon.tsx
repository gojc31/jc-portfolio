import { motion } from "framer-motion";

type IconType = "loop" | "network" | "rocket";

interface AnimatedIconProps {
  type: IconType;
  className?: string;
}

export default function AnimatedIcon({ type, className = "" }: AnimatedIconProps) {
  if (type === "loop") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={className} width="22" height="22">
        {/* Animated circular arrows */}
        <motion.path
          d="M12 3C7.02944 3 3 7.02944 3 12C3 14.3456 3.89413 16.4824 5.36168 18.0648"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop", ease: "easeInOut" }}
        />
        <motion.path
          d="M12 21C16.9706 21 21 16.9706 21 12C21 9.65442 20.1059 7.51756 18.6383 5.9352"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, delay: 0.3, repeat: Infinity, repeatType: "loop", ease: "easeInOut" }}
        />
        {/* Arrowheads */}
        <motion.path
          d="M5 15L5.36 18.06L8.4 17.7"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <motion.path
          d="M19 9L18.64 5.94L15.6 6.3"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, delay: 0.3, repeat: Infinity }}
        />
      </svg>
    );
  }

  if (type === "network") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={className} width="22" height="22">
        {/* Center node */}
        <motion.circle
          cx="12" cy="12" r="2.5"
          stroke="currentColor"
          strokeWidth="1.5"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Outer nodes */}
        {[
          { cx: 5, cy: 5 },
          { cx: 19, cy: 5 },
          { cx: 5, cy: 19 },
          { cx: 19, cy: 19 },
        ].map((pos, i) => (
          <motion.circle
            key={i}
            cx={pos.cx} cy={pos.cy} r="1.5"
            fill="currentColor"
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 1.5, delay: i * 0.3, repeat: Infinity }}
          />
        ))}
        {/* Connection lines */}
        {[
          "M12 9.5L5 5", "M12 9.5L19 5",
          "M12 14.5L5 19", "M12 14.5L19 19",
        ].map((d, i) => (
          <motion.path
            key={i}
            d={d}
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: [0, 1, 0] }}
            transition={{ duration: 2.5, delay: i * 0.2, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </svg>
    );
  }

  // Rocket
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} width="22" height="22">
      <motion.g
        animate={{ y: [0, -2, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <path
          d="M12 2C12 2 7 8 7 14L12 17L17 14C17 8 12 2 12 2Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="11" r="1.5" fill="currentColor" />
      </motion.g>
      {/* Exhaust particles */}
      {[0, 1, 2].map((i) => (
        <motion.circle
          key={i}
          cx={11 + i * 0.5}
          cy={19}
          r={1}
          fill="currentColor"
          animate={{
            y: [0, 4, 8],
            opacity: [0.6, 0.3, 0],
            scale: [1, 0.6, 0.2],
          }}
          transition={{
            duration: 0.8,
            delay: i * 0.2,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      ))}
    </svg>
  );
}

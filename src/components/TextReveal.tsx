import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface TextRevealProps {
  children: string;
  className?: string;
  delay?: number;
  once?: boolean;
}

/**
 * Splits text into characters and reveals them with a staggered wave animation.
 */
export default function TextReveal({
  children,
  className = "",
  delay = 0,
  once = true,
}: TextRevealProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once, amount: 0.5 });

  const words = children.split(" ");

  return (
    <span ref={ref} className={className}>
      {words.map((word, wi) => (
        <span key={wi} className="inline-block mr-[0.3em]">
          {word.split("").map((char, ci) => {
            const totalIndex = words.slice(0, wi).join("").length + ci;
            return (
              <motion.span
                key={`${wi}-${ci}`}
                className="inline-block"
                initial={{ opacity: 0, y: 40, rotateX: -90 }}
                animate={
                  inView
                    ? { opacity: 1, y: 0, rotateX: 0 }
                    : { opacity: 0, y: 40, rotateX: -90 }
                }
                transition={{
                  delay: delay + totalIndex * 0.03,
                  duration: 0.5,
                  ease: [0.215, 0.61, 0.355, 1],
                }}
                style={{ transformOrigin: "bottom" }}
              >
                {char}
              </motion.span>
            );
          })}
        </span>
      ))}
    </span>
  );
}

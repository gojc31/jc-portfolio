import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

type ScrollRevealVariant = "fade-up" | "fade-slide" | "clip-reveal";

interface ScrollRevealProps {
  children: ReactNode;
  variant?: ScrollRevealVariant;
  delay?: number;
  className?: string;
}

const ease = [0.25, 0.46, 0.45, 0.94];

const variants: Record<ScrollRevealVariant, Variants> = {
  "fade-up": {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  },
  "fade-slide": {
    hidden: { opacity: 0, x: -60 },
    visible: { opacity: 1, x: 0 },
  },
  "clip-reveal": {
    hidden: { clipPath: "inset(10% 0% 10% 0%)" },
    visible: { clipPath: "inset(0% 0% 0% 0%)" },
  },
};

export default function ScrollReveal({
  children,
  variant = "fade-up",
  delay = 0,
  className,
}: ScrollRevealProps) {
  return (
    <motion.div
      variants={variants[variant]}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

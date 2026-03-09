import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TextReveal from "./TextReveal";

const testimonials = [
  {
    quote:
      "JC built our entire CRM automation and chatbot marketing system from scratch. Lead qualification that used to take our team hours now runs on autopilot through GoHighLevel and ManyChat.",
    name: "Pure Tropix",
    role: "CRM & Conversational Marketing Automation",
  },
  {
    quote:
      "Our revenue operations were scattered across five different tools with no sync between them. JC wired Close.io, Hyros, and ActiveCampaign into a single pipeline — attribution tracking finally works.",
    name: "10xDigital Solutions",
    role: "RevOps Automation & Integration",
  },
  {
    quote:
      "JC designed our AI-powered coaching workflows — RAG pipelines, vector search, automated lifecycle CRM. What took our team a full day of manual work now runs in the background 24/7.",
    name: "ODA Skool LLC",
    role: "AI Automation for Healthcare Coaching",
  },
];

const slideVariants = {
  enter: (d: number) => ({
    x: d > 0 ? 80 : -80,
    opacity: 0,
    scale: 0.95,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (d: number) => ({
    x: d > 0 ? -80 : 80,
    opacity: 0,
    scale: 0.95,
  }),
};

function TypingText({ text, speed = 20 }: { text: string; speed?: number }) {
  const [displayedCount, setDisplayedCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const prevTextRef = useRef(text);

  useEffect(() => {
    // Reset when text changes
    if (prevTextRef.current !== text) {
      setDisplayedCount(0);
      setIsComplete(false);
      prevTextRef.current = text;
    }
  }, [text]);

  useEffect(() => {
    if (displayedCount < text.length) {
      const timer = setTimeout(() => {
        setDisplayedCount((c) => c + 1);
      }, speed);
      return () => clearTimeout(timer);
    } else if (displayedCount === text.length && text.length > 0) {
      setIsComplete(true);
    }
  }, [displayedCount, text, speed]);

  return (
    <span className="font-body">
      {text.slice(0, displayedCount)}
      {!isComplete && (
        <span
          className="inline-block w-[2px] h-[1em] align-middle ml-[1px] bg-accent-500"
          style={{
            animation: "typingCursorBlink 0.8s ease-in-out infinite",
          }}
        />
      )}
      <style>{`
        @keyframes typingCursorBlink {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
      `}</style>
    </span>
  );
}

function TestimonialContent({
  current,
  direction,
  goTo,
}: {
  current: number;
  direction: number;
  goTo: (i: number) => void;
}) {
  const [clicked, setClicked] = useState(false);

  const handleQuoteClick = () => {
    setClicked(true);
    setTimeout(() => setClicked(false), 600);
  };

  return (
    <div className="relative min-h-[250px] flex flex-col items-center justify-center">
      {/* Giant quote mark */}
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2 text-[160px] leading-none font-serif text-accent-500/10 select-none pointer-events-none"
        animate={{ opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        &ldquo;
      </motion.div>

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={current}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.5, ease: [0.215, 0.61, 0.355, 1] as const }}
          className="relative z-10"
          onClick={handleQuoteClick}
        >
          <motion.div
            animate={clicked ? { rotate: [0, -1, 1, -0.5, 0], scale: [1, 1.02, 0.98, 1] } : {}}
            transition={clicked ? { duration: 0.4 } : undefined}
            className="relative"
          >
            {/* Click scan effect */}
            {clicked && (
              <motion.div
                className="absolute inset-0 pointer-events-none rounded-xl"
                initial={{ opacity: 0.2 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                style={{
                  background: "radial-gradient(ellipse at center, rgba(var(--accent-rgb),0.1) 0%, transparent 70%)",
                }}
              />
            )}
            <p className="text-lg md:text-xl text-dark-100 leading-relaxed mb-8 max-w-2xl mx-auto font-light italic">
              &ldquo;<TypingText text={testimonials[current].quote} />&rdquo;
            </p>
          </motion.div>
          <motion.p
            className="text-sm font-semibold text-dark-50"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {testimonials[current].name}
          </motion.p>
          <motion.p
            className="text-xs text-dark-400 font-space mt-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {testimonials[current].role}
          </motion.p>
        </motion.div>
      </AnimatePresence>

      {/* Dots */}
      <div className="flex gap-3 mt-10">
        {testimonials.map((_, i) => (
          <motion.button
            key={i}
            onClick={() => goTo(i)}
            whileTap={{ scale: 0.8, boxShadow: "0 0 15px rgba(var(--accent-rgb),0.3)" }}
            className={`h-2 rounded-full border-none transition-all duration-500 cursor-pointer ${
              i === current
                ? "bg-accent-500 w-8"
                : "bg-dark-600 hover:bg-accent-500/40 w-2"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1);
      setCurrent((c) => (c + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const goTo = (i: number) => {
    setDirection(i > current ? 1 : -1);
    setCurrent(i);
  };

  return (
    <section className="relative py-28 md:py-36">
      <div className="max-w-4xl mx-auto px-6 md:px-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <span className="text-sm font-space text-accent-500/70 tracking-widest uppercase block mb-3">
            Client Work
          </span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-[-0.02em]">
            <TextReveal>Real projects,</TextReveal>{" "}
            <span className="text-accent-400">
              <TextReveal delay={0.3}>real results.</TextReveal>
            </span>
          </h2>
        </motion.div>

        <TestimonialContent
          current={current}
          direction={direction}
          goTo={goTo}
        />
      </div>
    </section>
  );
}

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MouseSpotlight from "./components/MouseSpotlight";
import { SectionDivider } from "./components/TechFrame";
import { SoundProvider } from "./components/SoundManager";
import EasterEgg from "./components/EasterEgg";
import ParallaxSection from "./components/ParallaxLayer";
import ScrollReveal from "./components/ScrollReveal";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Services from "./components/Services";
import Portfolio from "./components/Portfolio";
import ClientMarquee from "./components/ClientMarquee";
import Testimonials from "./components/Testimonials";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import AmbientOrbs from "./components/AmbientOrbs";

/* ═══════════════════════════════════════════════════════════════════
   BOOT SEQUENCE — The signature moment
   Site "initializes" like a system coming online.
   Gold accent spreads as elements activate.
   ═══════════════════════════════════════════════════════════════════ */
function BootSequence({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 100),   // Dot appears
      setTimeout(() => setPhase(2), 600),   // Line expands
      setTimeout(() => setPhase(3), 1000),  // Text materializes
      setTimeout(() => setPhase(4), 1400),  // Status indicators
      setTimeout(() => setPhase(5), 1800),  // Fade out
      setTimeout(() => {
        sessionStorage.setItem("jc-booted", "1");
        onComplete();
      }, 2400),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  // Skip on click or keypress
  useEffect(() => {
    const skip = () => {
      sessionStorage.setItem("jc-booted", "1");
      onComplete();
    };
    window.addEventListener("click", skip, { once: true });
    window.addEventListener("keydown", skip, { once: true });
    return () => {
      window.removeEventListener("click", skip);
      window.removeEventListener("keydown", skip);
    };
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] bg-dark-950 flex items-center justify-center"
      animate={phase >= 5 ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      {/* Central gold dot */}
      <motion.div
        className="absolute"
        initial={{ scale: 0, opacity: 0 }}
        animate={
          phase >= 2
            ? { scale: 0, opacity: 0 }
            : phase >= 1
            ? { scale: 1, opacity: 1 }
            : { scale: 0, opacity: 0 }
        }
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <div className="w-2 h-2 rounded-full bg-accent-500" />
        <motion.div
          className="absolute inset-0 rounded-full bg-accent-500"
          animate={{ scale: [1, 2.5, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      {/* Expanding horizontal line */}
      <motion.div
        className="absolute h-[1px] bg-gradient-to-r from-transparent via-accent-500 to-transparent"
        initial={{ width: 0, opacity: 0 }}
        animate={
          phase >= 2
            ? { width: 200, opacity: 1 }
            : { width: 0, opacity: 0 }
        }
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Name + Title */}
      <div className="absolute flex flex-col items-center gap-3">
        <motion.h1
          className="font-space text-xl md:text-2xl font-bold tracking-tight text-dark-50"
          initial={{ opacity: 0, y: 8 }}
          animate={phase >= 3 ? { opacity: 1, y: -16 } : { opacity: 0, y: 8 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          JC
        </motion.h1>

        <motion.div
          className="h-[1px] bg-accent-500/60"
          initial={{ width: 0 }}
          animate={phase >= 3 ? { width: 120 } : { width: 0 }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
        />

        <motion.p
          className="font-space text-[11px] uppercase tracking-[0.3em] text-dark-400"
          initial={{ opacity: 0, y: -8 }}
          animate={phase >= 3 ? { opacity: 1, y: 8 } : { opacity: 0, y: -8 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.15 }}
        >
          AI Automation Architect
        </motion.p>
      </div>

      {/* Skip hint */}
      <motion.span
        className="absolute bottom-[28%] text-[9px] font-space text-dark-600 tracking-widest uppercase"
        initial={{ opacity: 0 }}
        animate={phase >= 2 ? { opacity: 0.5 } : { opacity: 0 }}
        transition={{ duration: 0.4 }}
      >
        click or press any key to skip
      </motion.span>

      {/* Status indicators — bottom */}
      <motion.div
        className="absolute bottom-[38%] flex items-center gap-6"
        initial={{ opacity: 0 }}
        animate={phase >= 4 ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4 }}
      >
        {["systems", "agents", "status"].map((label, i) => (
          <motion.div
            key={label}
            className="flex items-center gap-1.5"
            initial={{ opacity: 0, x: -10 }}
            animate={phase >= 4 ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
            transition={{ duration: 0.3, delay: i * 0.08 }}
          >
            <motion.span
              className="w-1 h-1 rounded-full bg-accent-500"
              animate={phase >= 4 ? { opacity: [0, 1] } : {}}
              transition={{ duration: 0.15, delay: i * 0.08 }}
            />
            <span className="font-space text-[9px] uppercase tracking-widest text-dark-500">
              {label}
            </span>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}

function App() {
  const [booted, setBooted] = useState(() => sessionStorage.getItem("jc-booted") === "1");

  return (
    <SoundProvider>
      <AnimatePresence>
        {!booted && <BootSequence onComplete={() => setBooted(true)} />}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={booted ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <EasterEgg />
        <MouseSpotlight />
        <Navbar />

        <main>
          <AmbientOrbs count={2} className="fixed inset-0 z-0" />
          <Hero />
          <SectionDivider />
          <ParallaxSection variant="dots" intensity={0.3}>
            <ScrollReveal variant="fade-up">
              <About />
            </ScrollReveal>
          </ParallaxSection>
          <SectionDivider />
          <ParallaxSection variant="diamonds" intensity={0.3}>
            <ScrollReveal variant="fade-slide" delay={0.1}>
              <Services />
            </ScrollReveal>
          </ParallaxSection>
          <SectionDivider />
          <ParallaxSection variant="grid" intensity={0.3}>
            <ScrollReveal variant="fade-up" delay={0.1}>
              <Portfolio />
            </ScrollReveal>
          </ParallaxSection>
          <SectionDivider />
          <ClientMarquee />
          <SectionDivider />
          <ScrollReveal variant="fade-slide">
            <Testimonials />
          </ScrollReveal>
          <ScrollReveal variant="fade-up">
            <Contact />
          </ScrollReveal>
        </main>

        <Footer />
      </motion.div>
    </SoundProvider>
  );
}

export default App;

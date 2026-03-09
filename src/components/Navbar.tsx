import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { Menu, X } from "lucide-react";
import MagneticButton from "./MagneticButton";
import { SoundToggle } from "./SoundManager";

function ThemeToggle() {
  const [isViolet, setIsViolet] = useState(true);

  const toggle = useCallback(() => {
    const next = !isViolet;
    setIsViolet(next);
    document.documentElement.setAttribute(
      "data-theme",
      next ? "" : "grey"
    );
  }, [isViolet]);

  return (
    <button
      onClick={toggle}
      aria-label={isViolet ? "Switch to indigo theme" : "Switch to violet theme"}
      className="relative w-9 h-5 rounded-full border border-dark-700/50 bg-dark-800/80 flex items-center px-0.5 cursor-pointer transition-colors duration-300 hover:border-dark-600/60"
    >
      <motion.div
        className="w-4 h-4 rounded-full"
        animate={{
          x: isViolet ? 14 : 0,
          backgroundColor: isViolet ? "#8B5CF6" : "#6366F1",
          boxShadow: isViolet
            ? "0 0 8px rgba(139,92,246,0.5)"
            : "0 0 6px rgba(99,102,241,0.4)",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
      />
    </button>
  );
}

const links = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Work", href: "#work" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [isScrolling, setIsScrolling] = useState(false);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    let lastY = 0;
    let scrollTimer: ReturnType<typeof setTimeout>;
    const handler = () => {
      const y = window.scrollY;
      setHidden(y > 100 && y > lastY);
      setScrolled(y > 50);
      setIsScrolling(true);
      lastY = y;

      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => setIsScrolling(false), 150);

      // Track active section
      const sections = links.map((l) => l.href.replace("#", ""));
      let found = false;
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.getBoundingClientRect().top <= 200) {
          setActiveSection(sections[i]);
          found = true;
          break;
        }
      }
      if (!found && y < 200) setActiveSection("");
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => {
      window.removeEventListener("scroll", handler);
      clearTimeout(scrollTimer);
    };
  }, []);

  return (
    <>
      {/* Scroll progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-accent-500/80 via-accent-400/60 to-accent-500/80 z-[101] origin-left"
        style={{ scaleX }}
      />

      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: hidden ? -100 : 0 }}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className={`fixed top-0 left-0 right-0 z-[100] px-6 md:px-10 py-4 flex items-center justify-between transition-all duration-300 ${
          scrolled
            ? "backdrop-blur-2xl bg-dark-950/70 border-b border-dark-700/30"
            : "bg-transparent"
        }`}
      >
        <a
          href="#"
          className="font-space text-xl font-bold tracking-tight text-dark-50 hover:text-white transition-colors"
        >
          JC
        </a>

        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => {
            const isActive = activeSection === link.href.replace("#", "");
            return (
              <a
                key={link.href}
                href={link.href}
                className={`relative text-sm font-medium transition-colors duration-200 px-3 py-1.5 rounded-full ${
                  isActive ? "text-accent-400" : "text-dark-300 hover:text-dark-50"
                }`}
              >
                {isActive && !isScrolling && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-accent-500/[0.08] border border-accent-500/20"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </a>
            );
          })}
          <ThemeToggle />
          <SoundToggle />
          <MagneticButton href="#contact">
            <span className="inline-block px-5 py-2 text-sm font-medium text-dark-50 border border-accent-500/40 rounded-full hover:bg-accent-500 hover:text-dark-950 transition-all duration-300">
              Let's Talk
            </span>
          </MagneticButton>
        </div>

        <button
          onClick={() => setMobileOpen(true)}
          className="md:hidden text-dark-50 bg-transparent border-none"
        >
          <Menu size={24} />
        </button>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[200] bg-dark-950/98 backdrop-blur-3xl flex flex-col items-center justify-center"
          >
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-6 right-6 text-dark-50 bg-transparent border-none"
            >
              <X size={28} />
            </button>
            <div className="flex flex-col items-center gap-8">
              {links.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  className="text-3xl font-semibold text-dark-50 hover:text-accent-400 transition-colors"
                >
                  {link.label}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

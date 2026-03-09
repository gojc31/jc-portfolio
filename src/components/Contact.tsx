import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Linkedin, Github, Twitter } from "lucide-react";
import MagneticButton from "./MagneticButton";
import TextReveal from "./TextReveal";

function TerminalPrompt() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [text, setText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const full = "> initializing contact protocol...";

  useEffect(() => {
    if (!inView) return;
    let i = 0;
    const id = setInterval(() => {
      i++;
      setText(full.slice(0, i));
      if (i >= full.length) clearInterval(id);
    }, 25);
    return () => clearInterval(id);
  }, [inView]);

  useEffect(() => {
    const id = setInterval(() => setShowCursor((c) => !c), 530);
    return () => clearInterval(id);
  }, []);

  return (
    <div ref={ref} className="flex items-center justify-center gap-1 mb-4">
      <span className="text-xs font-space text-accent-500/50 tracking-wider">
        {text}
        <span className={`inline-block w-[6px] h-[14px] ml-0.5 -mb-[2px] bg-accent-400/70 transition-opacity duration-75 ${showCursor ? "opacity-100" : "opacity-0"}`} />
      </span>
    </div>
  );
}

const CALENDLY_URL = "https://calendly.com/gojc31/30min";

export default function Contact() {
  // Load the Calendly widget script once
  useEffect(() => {
    const existing = document.querySelector(
      'script[src="https://assets.calendly.com/assets/external/widget.js"]'
    );
    if (existing) return;

    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.head.appendChild(script);
  }, []);

  return (
    <section id="contact" className="relative py-28 md:py-36 border-t border-accent-500/10">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <TerminalPrompt />
          <span className="text-sm font-space text-accent-500/70 tracking-widest uppercase block mb-3">
            Contact
          </span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-[-0.02em] mb-4">
            <TextReveal>Ready to</TextReveal>{" "}
            <span className="text-accent-400">
              <TextReveal delay={0.2}>automate?</TextReveal>
            </span>
          </h2>
          <p className="text-dark-300 leading-relaxed max-w-lg mx-auto">
            Pick a time that works for you. Let's talk about turning your manual
            processes into intelligent workflows.
          </p>
        </motion.div>

        {/* Calendly embed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="relative max-w-md mx-auto rounded-2xl overflow-hidden border border-dark-700/30 bg-dark-900/50"
        >
          <div
            className="calendly-inline-widget"
            data-url={`${CALENDLY_URL}?hide_gdpr_banner=1&background_color=0e0e10&text_color=f5f5f5&primary_color=dba550`}
            style={{ minWidth: 280, height: 480, width: "100%" }}
          />
        </motion.div>

        {/* Bottom info */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-between gap-6 mt-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <a
            href="mailto:hello@workwithjc.dev"
            className="text-dark-300 hover:text-white transition-colors font-space text-sm"
          >
            hello@workwithjc.dev
          </a>

          <div className="flex gap-4">
            {[
              { icon: Linkedin, href: "#" },
              { icon: Github, href: "#" },
              { icon: Twitter, href: "#" },
            ].map(({ icon: Icon, href }, i) => (
              <MagneticButton key={i} href={href}>
                <span className="inline-flex w-11 h-11 items-center justify-center rounded-xl border border-accent-500/20 bg-dark-900 text-dark-400 hover:text-accent-400 hover:border-accent-500/40 transition-all duration-300">
                  <Icon size={18} />
                </span>
              </MagneticButton>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

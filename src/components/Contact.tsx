import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Linkedin, Mail, Phone } from "lucide-react";
import MagneticButton from "./MagneticButton";
import TextReveal from "./TextReveal";
import GlowCard from "./GlowCard";

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

function UpworkIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.561 13.158c-1.102 0-2.135-.467-3.074-1.227l.228-1.076.008-.042c.207-1.143.849-3.06 2.839-3.06 1.492 0 2.703 1.212 2.703 2.703-.001 1.489-1.212 2.702-2.704 2.702zm0-8.14c-2.539 0-4.51 1.649-5.31 4.366-1.22-1.834-2.148-4.036-2.687-5.892H7.828v7.112c-.002 1.406-1.141 2.546-2.547 2.548-1.405-.002-2.543-1.143-2.545-2.548V3.492H0v7.112c0 2.914 2.37 5.303 5.281 5.303 2.913 0 5.283-2.389 5.283-5.303v-1.19c.529 1.107 1.182 2.229 1.974 3.221l-1.673 7.873h2.797l1.213-5.71c1.063.679 2.285 1.109 3.686 1.109 3 0 5.439-2.452 5.439-5.45 0-3-2.439-5.439-5.439-5.439z" />
    </svg>
  );
}

function OnlineJobsIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 6H16V4C16 2.89 15.11 2 14 2H10C8.89 2 8 2.89 8 4V6H4C2.89 6 2 6.89 2 8V19C2 20.11 2.89 21 4 21H20C21.11 21 22 20.11 22 19V8C22 6.89 21.11 6 20 6ZM10 4H14V6H10V4ZM20 19H4V8H20V19ZM12 10C10.34 10 9 11.34 9 13C9 14.66 10.34 16 12 16C13.66 16 15 14.66 15 13C15 11.34 13.66 10 12 10Z" />
    </svg>
  );
}

const CALENDLY_URL = "https://calendly.com/gojc31/30min";

const SOCIAL_LINKS = [
  { icon: Linkedin, href: "https://www.linkedin.com/in/john-christian-go31/", title: "LinkedIn" },
  { icon: OnlineJobsIcon, href: "https://v2.onlinejobs.ph/jobseekers/info/1987281", title: "OnlineJobs.ph" },
  { icon: UpworkIcon, href: "https://upwork.com/freelancers/~013152e40b8a05bc4c", title: "Upwork" },
];

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
            <TextReveal>Let's Build Your</TextReveal>{" "}
            <span className="text-accent-400">
              <TextReveal delay={0.2}>Automation</TextReveal>
            </span>
          </h2>
          <p className="text-dark-300 leading-relaxed max-w-lg mx-auto">
            Ready to optimize your operations? Reach out directly.
          </p>
        </motion.div>

        {/* Two-column card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <GlowCard className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              {/* Left Column - Contact Details */}
              <div className="p-8 md:p-10 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white font-syne mb-8">
                    Contact Details
                  </h3>

                  <div className="space-y-6">
                    <a
                      href="mailto:gojc31@gmail.com"
                      className="flex items-center gap-4 group"
                    >
                      <span className="inline-flex w-10 h-10 items-center justify-center rounded-full border border-accent-500/20 bg-dark-900 text-dark-400 group-hover:text-accent-400 group-hover:border-accent-500/40 transition-all duration-300">
                        <Mail size={16} />
                      </span>
                      <span className="text-dark-300 group-hover:text-white transition-colors">
                        gojc31@gmail.com
                      </span>
                    </a>

                    <a
                      href="tel:+639957505336"
                      className="flex items-center gap-4 group"
                    >
                      <span className="inline-flex w-10 h-10 items-center justify-center rounded-full border border-accent-500/20 bg-dark-900 text-dark-400 group-hover:text-accent-400 group-hover:border-accent-500/40 transition-all duration-300">
                        <Phone size={16} />
                      </span>
                      <span className="text-dark-300 group-hover:text-white transition-colors">
                        +63 995 750 5336
                      </span>
                    </a>
                  </div>

                  {/* Social links */}
                  <div className="mt-10 pt-8 border-t border-dark-700/20">
                    <div className="flex items-center gap-3">
                      {SOCIAL_LINKS.map(({ icon: Icon, href, title }) => (
                        <MagneticButton key={title} href={href}>
                          <span
                            className="inline-flex w-10 h-10 items-center justify-center rounded-full border border-accent-500/20 bg-dark-900 text-dark-400 hover:text-accent-400 hover:border-accent-500/40 transition-all duration-300"
                            title={title}
                          >
                            <Icon size={16} />
                          </span>
                        </MagneticButton>
                      ))}
                    </div>
                  </div>
                </div>

                <p className="text-dark-400/60 text-sm italic mt-10">
                  "I translate complex operational bottlenecks into scalable,
                  automated systems."
                </p>
              </div>

              {/* Right Column - Calendly Embed */}
              <div className="border-t lg:border-t-0 lg:border-l border-dark-700/20 min-h-[480px]">
                <div
                  className="calendly-inline-widget w-full h-full"
                  data-url={`${CALENDLY_URL}?hide_landing_page_details=1&hide_gdpr_banner=1&background_color=0e0e10&text_color=f5f5f5&primary_color=dba550`}
                  style={{ minWidth: 280, minHeight: 480, width: "100%" }}
                />
              </div>
            </div>
          </GlowCard>
        </motion.div>
      </div>
    </section>
  );
}

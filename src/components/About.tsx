import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import GlowCard from "./GlowCard";
import AnimatedIcon from "./AnimatedIcon";
import AnimatedCounter from "./AnimatedCounter";
import PulseRing from "./PulseRing";
import TextReveal from "./TextReveal";

const stats = [
  { end: 50, suffix: "+", label: "Projects Delivered" },
  { end: 14, suffix: "+", label: "Hours Saved / Week", decimals: 0 },
  { end: 95, suffix: "%", label: "Client Satisfaction" },
];

const cards = [
  {
    iconType: "loop" as const,
    title: "Automate the Repetitive",
    desc: "Free your team from soul-crushing manual tasks. I build systems that handle the busywork while humans focus on creative, high-impact decisions.",
  },
  {
    iconType: "network" as const,
    title: "Architect for Scale",
    desc: "No duct-tape solutions. Every automation I build is designed to grow with your business — modular, maintainable, and production-ready.",
  },
  {
    iconType: "rocket" as const,
    title: "Ship Fast, Iterate Faster",
    desc: "Get to market in weeks, not months. Rapid prototyping, real-world testing, and continuous improvement baked into every engagement.",
  },
];

const experience = [
  {
    role: "Automation & CRM Specialist",
    company: "Pure Tropix · Freelance",
    period: "Dec 2025 – Present",
    description:
      "Build CRM automation and conversational marketing workflows using GoHighLevel and ManyChat. Design lead qualification funnels, chatbot marketing automation, and marketing integrations via Make.com, Zapier, and Webhook APIs.",
    tags: ["GoHighLevel", "ManyChat", "Make.com", "Zapier", "Stripe"],
  },
  {
    role: "RevOps Automation & Integration Engineer",
    company: "10xDigital Solutions · Freelance",
    period: "Dec 2025 – Present",
    description:
      "Build revenue operations automation across CRM, attribution tracking, and marketing systems. Develop pipeline automation using Close.io, attribution QA with Hyros, lifecycle email automation with ActiveCampaign, and lead ingestion pipelines.",
    tags: ["Close.io", "Hyros", "ActiveCampaign", "Make.com", "REST APIs"],
  },
  {
    role: "AI Automation & Workflow Systems Specialist",
    company: "ODA Skool LLC · Freelance",
    period: "Dec 2025 – Feb 2026",
    description:
      "Designed production-grade AI automation for healthcare coaching operations. Built RAG pipelines, AI Agents, and LLM orchestration using n8n, Supabase Vector Storage, and OpenAI APIs. Built CRM lifecycle automation with GoHighLevel.",
    tags: ["n8n", "OpenAI API", "RAG", "Supabase", "GoHighLevel", "Python"],
  },
  {
    role: "Logistics Automation & AI Workflow Specialist",
    company: "Priority Haulage",
    period: "Dec 2025 – Feb 2026",
    description:
      "Designed automation workflows for logistics and trucking operations. Built Make.com integrations with fleet management software via APIs, operational reporting with Notion, and AI-assisted workflows using OpenAI API.",
    tags: ["Make.com", "OpenAI API", "Notion", "REST APIs", "Webhooks"],
  },
  {
    role: "Microsoft AI Automation & Internal Chatbot Developer",
    company: "Merkeley Ventures · Contract",
    period: "Dec 2025",
    description:
      "Deployed AI-driven automation for real estate operations using Microsoft Power Automate, SharePoint, and Microsoft 365. Developed an internal AI chatbot using Microsoft Copilot and OpenAI APIs.",
    tags: ["Power Automate", "Microsoft Copilot", "SharePoint", "OpenAI API"],
  },
  {
    role: "Associate — Content Integrity & Policies (Tech Integration)",
    company: "Booking.com · Full-time",
    period: "Oct 2023 – Jan 2026",
    description:
      "Developed process automations using Google Apps Script, Slack, Zapier, and n8n — reducing manual tracking by 30%. Built automation projects including Slack-Spreadsheet integration, Drive folder generators, and cross-department workflows. Led AI enablement, improving knowledge retrieval by 40%.",
    tags: ["Google Apps Script", "Zapier", "n8n", "Slack", "AI Enablement"],
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.2 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 60, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, ease: [0.215, 0.61, 0.355, 1] as const },
  },
};

function AboutCard({ card }: { card: (typeof cards)[0] }) {
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    setClicked(true);
    setTimeout(() => setClicked(false), 600);
  };

  return (
    <motion.div
      variants={cardVariants}
      onClick={handleClick}
      whileTap={{ scale: 0.97 }}
      animate={
        clicked
          ? { rotate: [0, -1.5, 1.5, -1, 0.5, 0], y: [0, -4, 0] }
          : {}
      }
      transition={clicked ? { duration: 0.5, ease: "easeOut" } : undefined}
    >
      <GlowCard className="h-full">
        <div className="p-7 md:p-8 relative overflow-hidden">
          {clicked && (
            <>
              <motion.div
                className="absolute inset-0 pointer-events-none"
                initial={{ opacity: 0.15 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                style={{
                  background:
                    "radial-gradient(ellipse at center, rgba(var(--accent-rgb),0.12) 0%, transparent 70%)",
                }}
              />
              <motion.div
                className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent-500/40 to-transparent pointer-events-none"
                initial={{ top: "50%", opacity: 1 }}
                animate={{ top: "0%", opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
              <motion.div
                className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent-500/40 to-transparent pointer-events-none"
                initial={{ top: "50%", opacity: 1 }}
                animate={{ top: "100%", opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            </>
          )}
          <div className="w-11 h-11 rounded-xl bg-dark-800 border border-accent-500/20 flex items-center justify-center mb-5 text-accent-400/70 group-hover:text-accent-400 group-hover:border-accent-500/40 transition-colors">
            <AnimatedIcon type={card.iconType} />
          </div>
          <h3 className="text-lg font-semibold mb-3 text-dark-50">
            {card.title}
          </h3>
          <p className="text-dark-300 text-sm leading-relaxed">{card.desc}</p>
        </div>
      </GlowCard>
    </motion.div>
  );
}

function TimelineItem({
  item,
  index,
}: {
  item: (typeof experience)[0];
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className="relative pl-8 pb-8 last:pb-0 group"
    >
      {/* Timeline line */}
      <div className="absolute left-[7px] top-3 bottom-0 w-px bg-gradient-to-b from-accent-500/40 to-dark-700/30 group-last:bg-gradient-to-b group-last:from-accent-500/40 group-last:to-transparent" />
      {/* Timeline dot */}
      <div className="absolute left-0 top-[6px] w-[15px] h-[15px] rounded-full border-2 border-accent-500/50 bg-dark-950 flex items-center justify-center">
        <div className="w-[5px] h-[5px] rounded-full bg-accent-400" />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-3 mb-1">
        <h4 className="text-[15px] font-semibold text-dark-50">{item.role}</h4>
        <span className="text-[11px] font-space text-accent-500/70 tracking-wider">
          {item.period}
        </span>
      </div>
      <p className="text-[13px] font-space text-dark-400 mb-2">
        {item.company}
      </p>
      <p className="text-sm text-dark-300 leading-relaxed mb-3">
        {item.description}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {item.tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-0.5 text-[10px] font-space tracking-wide uppercase rounded-full border border-dark-700/50 text-dark-400 bg-dark-800/50"
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

export default function About() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);

  return (
    <section id="about" ref={sectionRef} className="relative py-28 md:py-36">
      {/* Decorative pulse rings */}
      <div className="absolute top-20 right-10 opacity-30 pointer-events-none hidden lg:block">
        <PulseRing size={150} delay={0} />
      </div>
      <div className="absolute bottom-20 left-10 opacity-20 pointer-events-none hidden lg:block">
        <PulseRing size={100} delay={1.5} />
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-10">
        {/* ── About Me: Image + Bio ── */}
        <motion.div style={{ y }} className="mb-20">
          <span className="text-sm font-space text-accent-500/70 tracking-widest uppercase block mb-3">
            About Me
          </span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-[-0.02em] mb-12">
            <TextReveal>The person behind</TextReveal>{" "}
            <span className="text-accent-400">
              <TextReveal delay={0.4}>the automation.</TextReveal>
            </span>
          </h2>

          <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">
            {/* Portrait */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="flex-shrink-0 mx-auto lg:mx-0"
            >
              <div className="relative group">
                {/* Glow behind image */}
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-accent-500/20 via-accent-400/10 to-transparent blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative w-56 h-64 md:w-64 md:h-72 rounded-2xl overflow-hidden border border-dark-700/50 group-hover:border-accent-500/30 transition-colors duration-300">
                  <img
                    src="/jc-portrait.jpg"
                    alt="John Christian Go"
                    className="w-full h-full object-cover object-top scale-110 group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Subtle overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-950/60 via-transparent to-transparent" />
                </div>
                {/* Status indicator */}
                <motion.div
                  className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-dark-900 border border-dark-700/50 flex items-center gap-2"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                >
                  <motion.span
                    className="w-2 h-2 rounded-full bg-accent-400"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  <span className="text-[10px] font-space text-dark-300 whitespace-nowrap">
                    Open to work
                  </span>
                </motion.div>
              </div>
            </motion.div>

            {/* Bio + Quick Facts */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex-1"
            >
              <h3 className="text-2xl md:text-3xl font-bold text-dark-50 mb-1">
                John Christian Go
              </h3>
              <p className="text-sm font-space text-accent-500/80 tracking-wide mb-5">
                Business Process Automation &bull; Marketing Automation &bull;
                AI Agents &bull; CRM & RevOps
              </p>
              <p className="text-dark-300 leading-relaxed mb-4">
                I help businesses eliminate manual work by turning repetitive
                processes into fully automated workflows. From lead capture to
                invoicing, marketing funnels to CRM pipelines — I streamline
                operations so teams can focus on growth instead of busywork.
              </p>
              <p className="text-dark-300 leading-relaxed mb-6">
                I build with{" "}
                <span className="text-dark-100">n8n</span>,{" "}
                <span className="text-dark-100">Make.com</span>,{" "}
                <span className="text-dark-100">Zapier</span>,{" "}
                <span className="text-dark-100">GoHighLevel</span>,{" "}
                <span className="text-dark-100">OpenAI APIs</span>, and{" "}
                <span className="text-dark-100">Claude Code</span> — designing
                end-to-end automation architecture across coaching, SaaS,
                real estate, logistics, and e-commerce.
              </p>

              {/* Quick info grid */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Location", value: "Philippines (Remote)" },
                  { label: "Focus", value: "Business Process & Marketing Automation" },
                  { label: "Portfolio", value: "workwithjc.dev" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="px-3 py-2.5 rounded-lg bg-dark-800/50 border border-dark-700/30"
                  >
                    <span className="block text-[10px] font-space text-dark-500 uppercase tracking-wider mb-0.5">
                      {item.label}
                    </span>
                    <span className="text-sm text-dark-200">{item.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* ── Experience Timeline ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <div className="text-center mb-10">
            <span className="text-sm font-space text-accent-500/70 tracking-widest uppercase block mb-3">
              Experience
            </span>
            <h3 className="text-2xl md:text-3xl font-bold tracking-[-0.02em]">
              <TextReveal>Where I've</TextReveal>{" "}
              <span className="text-accent-400">
                <TextReveal delay={0.3}>built &amp; shipped.</TextReveal>
              </span>
            </h3>
          </div>

          <div className="max-w-2xl mx-auto">
            {experience.map((item, i) => (
              <TimelineItem key={item.role} item={item} index={i} />
            ))}
          </div>
        </motion.div>

        {/* ── The Approach (cards) ── */}
        <div className="mb-16">
          <span className="text-sm font-space text-accent-500/70 tracking-widest uppercase block mb-3">
            The Approach
          </span>
          <h3 className="text-2xl md:text-3xl font-bold tracking-[-0.02em] mb-10">
            <TextReveal>How I think about</TextReveal>{" "}
            <span className="text-accent-400">
              <TextReveal delay={0.3}>automation.</TextReveal>
            </span>
          </h3>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-5"
          >
            {cards.map((card) => (
              <AboutCard key={card.title} card={card} />
            ))}
          </motion.div>
        </div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 grid grid-cols-3 gap-6 max-w-2xl mx-auto text-center"
        >
          {stats.map((stat) => (
            <div key={stat.label}>
              <span className="text-3xl md:text-4xl font-bold font-space text-accent-500">
                <AnimatedCounter
                  end={stat.end}
                  suffix={stat.suffix}
                  decimals={stat.decimals ?? 0}
                />
              </span>
              <span className="block mt-1 text-[11px] tracking-widest uppercase text-dark-400">
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

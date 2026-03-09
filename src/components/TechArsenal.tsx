import { motion } from "framer-motion";
import { useRef, useState } from "react";
import DataFlowBg from "./DataFlowBg";
import ToolLogo from "./ToolLogo";

const tools = [
  { name: "Make", cat: "Automation" },
  { name: "Airtable", cat: "Data" },
  { name: "Asana", cat: "Project Mgmt" },
  { name: "Jira", cat: "Project Mgmt" },
  { name: "Zendesk", cat: "Support" },
  { name: "Google Workspace", cat: "Productivity" },
  { name: "VAPI", cat: "Voice AI" },
  { name: "ServiceNow", cat: "ITSM" },
  { name: "Slack", cat: "Communication" },
  { name: "OpenAI", cat: "AI" },
  { name: "Google Gemini", cat: "AI" },
  { name: "n8n", cat: "Automation" },
  { name: "Zapier", cat: "Automation" },
  { name: "GoHighLevel", cat: "CRM" },
  { name: "Apollo.io", cat: "Sales" },
];

function ToolNode({ tool, delay }: { tool: typeof tools[0]; delay: number }) {
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    setClicked(true);
    setTimeout(() => setClicked(false), 600);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group flex flex-col items-center gap-2.5 py-3 cursor-default relative"
    >
      <div className="relative">
        {/* Orbit ring */}
        <motion.div
          className="absolute -inset-2 rounded-full border border-white/[0.06]"
          animate={hovered ? { rotate: 360, borderColor: "rgba(var(--accent-rgb),0.25)" } : { rotate: 0 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
        {/* Orbiting dot */}
        {hovered && (
          <motion.div
            className="absolute w-1 h-1 rounded-full bg-accent-400/60 shadow-[0_0_6px_rgba(var(--accent-rgb),0.4)]"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            style={{
              top: "-4px",
              left: "50%",
              transformOrigin: "50% calc(50% + 30px)",
            }}
          />
        )}

        <motion.div
          className="w-14 h-14 rounded-xl bg-dark-800 border border-dark-700/50 flex items-center justify-center group-hover:border-accent-500/30 group-hover:bg-dark-800/80 group-hover:shadow-[0_0_25px_rgba(var(--accent-rgb),0.08)] transition-all duration-300 relative z-10 overflow-hidden"
          animate={clicked ? { rotate: [0, -8, 8, -4, 0], y: [0, -6, 0] } : {}}
          transition={clicked ? { duration: 0.45 } : undefined}
        >
          <ToolLogo name={tool.name} size={30} />
          {/* Click flash */}
          {clicked && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0.3 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              style={{
                background: "radial-gradient(circle, rgba(var(--accent-rgb),0.25) 0%, transparent 70%)",
              }}
            />
          )}
        </motion.div>

        {/* Click pulse ring */}
        {clicked && (
          <motion.div
            className="absolute -inset-2 rounded-full border border-accent-500/50 pointer-events-none"
            initial={{ scale: 0.8, opacity: 0.8 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        )}
      </div>
      <div className="flex flex-col items-center gap-0.5">
        <span className="text-[11px] font-medium text-dark-300 group-hover:text-dark-50 transition-colors text-center leading-tight">
          {tool.name}
        </span>
        <span className="text-[9px] font-space text-dark-400/60 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
          {tool.cat}
        </span>
      </div>
    </motion.div>
  );
}

export default function TechArsenal() {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <section id="arsenal" className="relative py-28 md:py-36">
      <div className="max-w-5xl mx-auto px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <span className="text-sm font-space text-accent-500/70 tracking-widest uppercase block mb-3">
            Tech Stack
          </span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-[-0.02em]">
            My <span className="text-accent-400">toolkit.</span>
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear", times: [0, 0.5, 0.5, 1] }}
              className="inline-block w-[3px] h-[0.9em] bg-dark-300 ml-2 align-middle"
            />
          </h2>
        </motion.div>

        {/* Terminal window */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="relative rounded-2xl bg-dark-900 border border-dark-700/40 overflow-hidden"
        >
          {/* Data flow background */}
          <DataFlowBg />

          {/* Title bar */}
          <div className="relative z-10 flex items-center gap-2 px-5 py-3 border-b border-dark-700/30 bg-dark-900/80 backdrop-blur-sm">
            <div className="w-3 h-3 rounded-full bg-dark-600/60" />
            <div className="w-3 h-3 rounded-full bg-dark-600/60" />
            <div className="w-3 h-3 rounded-full bg-dark-600/60" />
            <span className="ml-3 text-xs font-space text-dark-400">
              ~/arsenal
            </span>
            <motion.span
              className="text-xs font-space text-dark-300 ml-auto"
              animate={{ opacity: [0, 1, 1, 0] }}
              transition={{ duration: 3, repeat: Infinity, times: [0, 0.1, 0.8, 1] }}
            >
              loading modules...
            </motion.span>
          </div>

          {/* Scanline overlay */}
          <div
            className="absolute inset-0 pointer-events-none z-20 opacity-[0.015]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.5) 2px, rgba(255,255,255,0.5) 4px)",
              animation: "scanline 8s linear infinite",
            }}
          />
          <style>{`
            @keyframes scanline {
              from { background-position: 0 0; }
              to { background-position: 0 100%; }
            }
          `}</style>

          {/* Tools grid */}
          <div className="relative z-10 p-6 md:p-8 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-6">
            {tools.map((tool, i) => (
              <ToolNode key={tool.name} tool={tool} delay={i * 0.04} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

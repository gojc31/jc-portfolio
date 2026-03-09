import { motion } from "framer-motion";
import ToolLogo from "./ToolLogo";

const clients = [
  { name: "E-Commerce Co.", result: "82% faster response" },
  { name: "TechVentures Inc.", result: "14h/week saved" },
  { name: "Real Estate AI", result: "3.2x conversions" },
  { name: "HealthClinic Net", result: "95% accuracy" },
  { name: "ShopFlow", result: "80% tickets automated" },
  { name: "DataPulse Analytics", result: "60% faster resolution" },
];

const toolLogos = [
  "Make", "OpenAI", "n8n", "Zapier", "Slack", "Airtable",
  "Google Workspace", "Zendesk", "Jira", "GoHighLevel",
  "VAPI", "ServiceNow", "Apollo.io", "Asana", "Google Gemini",
];

export default function ClientMarquee() {
  return (
    <section className="relative py-16 md:py-20 overflow-hidden">
      {/* Section label */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <span className="text-[10px] font-space text-accent-500/50 tracking-[0.3em] uppercase">
          Trusted tools & proven results
        </span>
      </motion.div>

      {/* Results marquee */}
      <div className="relative mb-8">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-r from-dark-950 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-l from-dark-950 to-transparent z-10 pointer-events-none" />

        <div className="flex animate-[marquee-slow_35s_linear_infinite] hover:[animation-play-state:paused] whitespace-nowrap">
          {[...clients, ...clients, ...clients].map((client, i) => (
            <div
              key={i}
              className="inline-flex items-center gap-3 mx-6 px-5 py-2.5 rounded-full border border-dark-700/30 bg-dark-900/80"
            >
              <div className="w-1.5 h-1.5 rotate-45 bg-accent-500/50 flex-shrink-0" />
              <span className="text-xs font-space text-dark-300 tracking-wide">
                {client.name}
              </span>
              <span className="text-[10px] font-space text-accent-400/70 font-semibold">
                {client.result}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Tool logos marquee (opposite direction) */}
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-r from-dark-950 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-l from-dark-950 to-transparent z-10 pointer-events-none" />

        <div className="flex animate-[marquee-reverse_40s_linear_infinite] hover:[animation-play-state:paused] whitespace-nowrap">
          {[...toolLogos, ...toolLogos, ...toolLogos].map((tool, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-2 mx-6 text-dark-400/40 hover:text-dark-300/60 transition-colors duration-300"
            >
              <ToolLogo name={tool} size={20} />
              <span className="text-[11px] font-space uppercase tracking-widest">
                {tool}
              </span>
            </span>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee-slow {
          from { transform: translateX(0); }
          to { transform: translateX(-33.333%); }
        }
        @keyframes marquee-reverse {
          from { transform: translateX(-33.333%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </section>
  );
}

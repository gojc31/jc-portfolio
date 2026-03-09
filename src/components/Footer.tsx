import { useState } from "react";
import { Linkedin, Github, Twitter } from "lucide-react";

export default function Footer() {
  const [showEaster, setShowEaster] = useState(false);

  return (
    <footer className="relative border-t border-dark-700/20 py-8">
      {/* Gradient line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-accent-500/20 to-transparent" />

      <div className="max-w-6xl mx-auto px-6 md:px-10 flex items-center justify-between">
        <div className="relative">
          <button
            onClick={() => setShowEaster(!showEaster)}
            className="text-sm text-dark-400 hover:text-dark-300 transition-colors bg-transparent border-none cursor-pointer"
          >
            &copy; 2026 John Christian Go
          </button>
          {showEaster && (
            <span className="absolute bottom-full left-0 mb-2 text-xs text-dark-300 bg-dark-800 border border-dark-700/50 rounded-lg px-3 py-1.5 whitespace-nowrap">
              Built with AI, obviously 🤖
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <span
            className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"
          />
          <span className="text-[10px] font-space text-dark-500 uppercase tracking-wider">
            All systems online
          </span>
        </div>

        <div className="flex gap-4">
          {[Linkedin, Github, Twitter].map((Icon, i) => (
            <a
              key={i}
              href="#"
              className="text-dark-400 hover:text-accent-400 transition-colors duration-200"
            >
              <Icon size={16} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

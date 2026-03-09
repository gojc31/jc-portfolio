import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  type ReactNode,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SoundContextValue {
  playHover: () => void;
  playClick: () => void;
  playNavigate: () => void;
  playSuccess: () => void;
  enabled: boolean;
  toggleSound: () => void;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const SoundContext = createContext<SoundContextValue | null>(null);

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useSound(): SoundContextValue {
  const ctx = useContext(SoundContext);
  if (!ctx) {
    throw new Error("useSound must be used within a <SoundProvider>");
  }
  return ctx;
}

// ---------------------------------------------------------------------------
// Sound synthesis helpers (pure Web Audio API, no external files)
// ---------------------------------------------------------------------------

function createHover(ctx: AudioContext) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.value = 2000;
  gain.gain.setValueAtTime(0.03, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);
  osc.connect(gain).connect(ctx.destination);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.03);
}

function createClick(ctx: AudioContext) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(800, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.05);
  gain.gain.setValueAtTime(0.05, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
  osc.connect(gain).connect(ctx.destination);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.05);
}

function createNavigate(ctx: AudioContext) {
  const bufferSize = ctx.sampleRate * 0.1; // 100ms
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const source = ctx.createBufferSource();
  source.buffer = buffer;

  const bandpass = ctx.createBiquadFilter();
  bandpass.type = "bandpass";
  bandpass.frequency.setValueAtTime(2000, ctx.currentTime);
  bandpass.frequency.exponentialRampToValueAtTime(500, ctx.currentTime + 0.1);
  bandpass.Q.value = 1.5;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.03, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

  source.connect(bandpass).connect(gain).connect(ctx.destination);
  source.start(ctx.currentTime);
  source.stop(ctx.currentTime + 0.1);
}

function createSuccess(ctx: AudioContext) {
  // Note 1 – 600 Hz
  const osc1 = ctx.createOscillator();
  const gain1 = ctx.createGain();
  osc1.type = "sine";
  osc1.frequency.value = 600;
  gain1.gain.setValueAtTime(0.04, ctx.currentTime);
  gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
  osc1.connect(gain1).connect(ctx.destination);
  osc1.start(ctx.currentTime);
  osc1.stop(ctx.currentTime + 0.08);

  // Note 2 – 900 Hz (starts after first note)
  const osc2 = ctx.createOscillator();
  const gain2 = ctx.createGain();
  osc2.type = "sine";
  osc2.frequency.value = 900;
  gain2.gain.setValueAtTime(0.001, ctx.currentTime);
  gain2.gain.setValueAtTime(0.04, ctx.currentTime + 0.08);
  gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.16);
  osc2.connect(gain2).connect(ctx.destination);
  osc2.start(ctx.currentTime + 0.08);
  osc2.stop(ctx.currentTime + 0.16);
}

// ---------------------------------------------------------------------------
// Storage key
// ---------------------------------------------------------------------------

const STORAGE_KEY = "jc-sound-enabled";

function readPref(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

function writePref(value: boolean) {
  try {
    localStorage.setItem(STORAGE_KEY, String(value));
  } catch {
    // ignore
  }
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function SoundProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(readPref);
  const ctxRef = useRef<AudioContext | null>(null);

  // Persist preference
  useEffect(() => {
    writePref(enabled);
  }, [enabled]);

  const getAudioContext = useCallback((): AudioContext | null => {
    if (!ctxRef.current) {
      try {
        ctxRef.current = new AudioContext();
      } catch {
        return null;
      }
    }
    // Resume if suspended (browser autoplay policy)
    if (ctxRef.current.state === "suspended") {
      ctxRef.current.resume();
    }
    return ctxRef.current;
  }, []);

  const play = useCallback(
    (factory: (ctx: AudioContext) => void) => {
      if (!enabled) return;
      const ctx = getAudioContext();
      if (ctx) factory(ctx);
    },
    [enabled, getAudioContext],
  );

  const playHover = useCallback(() => play(createHover), [play]);
  const playClick = useCallback(() => play(createClick), [play]);
  const playNavigate = useCallback(() => play(createNavigate), [play]);
  const playSuccess = useCallback(() => play(createSuccess), [play]);

  const toggleSound = useCallback(() => {
    setEnabled((prev) => {
      const next = !prev;
      // Create AudioContext on first enable (requires user gesture)
      if (next && !ctxRef.current) {
        try {
          ctxRef.current = new AudioContext();
        } catch {
          // ignore
        }
      }
      return next;
    });
  }, []);

  return (
    <SoundContext.Provider
      value={{ playHover, playClick, playNavigate, playSuccess, enabled, toggleSound }}
    >
      {children}
    </SoundContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Toggle button component
// ---------------------------------------------------------------------------

export function SoundToggle() {
  const { enabled, toggleSound, playClick } = useSound();

  const handleClick = () => {
    toggleSound();
    // Play a small click after enabling so user gets immediate feedback
    if (!enabled) {
      // Will be enabled after state update; schedule a tick
      requestAnimationFrame(() => {
        // noop – the context is created in toggleSound
      });
    }
    if (enabled) {
      playClick();
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={enabled ? "Disable sound effects" : "Enable sound effects"}
      className="relative flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-xs transition-colors cursor-pointer"
      style={{
        borderColor: enabled ? "rgb(var(--accent-rgb))" : "#71717A",
        backgroundColor: enabled ? "rgba(var(--accent-rgb), 0.08)" : "rgba(39, 39, 42, 0.5)",
        color: enabled ? "rgb(var(--accent-rgb))" : "#71717A",
      }}
    >
      <AnimatePresence mode="wait" initial={false}>
        {enabled ? (
          <motion.span
            key="on"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.15 }}
            className="flex items-center"
          >
            <Volume2 size={14} />
          </motion.span>
        ) : (
          <motion.span
            key="off"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.15 }}
            className="flex items-center"
          >
            <VolumeX size={14} />
          </motion.span>
        )}
      </AnimatePresence>

      {/* Small gold sound-wave arcs when enabled */}
      {enabled && (
        <>
          <motion.span
            className="absolute -right-0.5 top-1/2 h-2.5 w-2.5 rounded-full border"
            style={{ borderColor: "rgb(var(--accent-rgb))" }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: [0, 0.6, 0], scale: [0.5, 1.2, 1.6] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut" }}
          />
          <motion.span
            className="absolute -right-1 top-1/2 h-3.5 w-3.5 rounded-full border"
            style={{ borderColor: "rgb(var(--accent-rgb))" }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: [0, 0.35, 0], scale: [0.5, 1.2, 1.8] }}
            transition={{
              duration: 1.4,
              repeat: Infinity,
              ease: "easeOut",
              delay: 0.3,
            }}
          />
        </>
      )}
    </motion.button>
  );
}

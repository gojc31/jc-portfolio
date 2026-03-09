import { useEffect, useRef, useState, useCallback } from "react";

const CHARS = "!@#$%^&*()_+-=[]{}|;:,./<>?ABCDEFabcdef0123456789";

function randomChar() {
  return CHARS[Math.floor(Math.random() * CHARS.length)];
}

interface TextScrambleProps {
  children: string;
  delay?: number;
  speed?: number;
  className?: string;
  trigger?: boolean;
}

export default function TextScramble({
  children,
  delay = 0,
  speed = 50,
  className,
  trigger,
}: TextScrambleProps) {
  const text = children;
  const [display, setDisplay] = useState("");
  const [, setResolvedCount] = useState(0);
  const rafRef = useRef<number>(0);
  const lastCycleRef = useRef(0);
  const startedRef = useRef(false);

  const shouldRun = trigger === undefined ? true : trigger;

  // Cycling animation for unresolved characters
  const cycle = useCallback(
    (time: number) => {
      if (time - lastCycleRef.current >= 30) {
        lastCycleRef.current = time;
        setResolvedCount((rc) => {
          const chars: string[] = [];
          for (let i = 0; i < text.length; i++) {
            if (i < rc) {
              chars.push(text[i]);
            } else if (text[i] === " ") {
              chars.push(" ");
            } else {
              chars.push(randomChar());
            }
          }
          setDisplay(chars.join(""));
          return rc;
        });
      }
      rafRef.current = requestAnimationFrame(cycle);
    },
    [text]
  );

  // Start scramble effect
  useEffect(() => {
    if (!shouldRun || startedRef.current) return;
    startedRef.current = true;

    const delayTimer = setTimeout(() => {
      // Start cycling
      rafRef.current = requestAnimationFrame(cycle);

      // Resolve characters one by one
      const resolveTimers: ReturnType<typeof setTimeout>[] = [];
      for (let i = 0; i <= text.length; i++) {
        resolveTimers.push(
          setTimeout(() => {
            setResolvedCount(i);
            if (i === text.length) {
              cancelAnimationFrame(rafRef.current);
              setDisplay(text);
            }
          }, i * speed)
        );
      }

      return () => {
        resolveTimers.forEach(clearTimeout);
      };
    }, delay);

    return () => {
      clearTimeout(delayTimer);
      cancelAnimationFrame(rafRef.current);
    };
  }, [shouldRun, text, delay, speed, cycle]);

  // Reset when trigger goes false
  useEffect(() => {
    if (trigger === false) {
      startedRef.current = false;
      setResolvedCount(0);
      setDisplay("");
      cancelAnimationFrame(rafRef.current);
    }
  }, [trigger]);

  // Before animation starts, show nothing (or scrambled)
  if (!display && !shouldRun) {
    return <span className={className}>{text}</span>;
  }

  return <span className={className}>{display || text}</span>;
}

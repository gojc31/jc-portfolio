import { useRef, useState, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  href?: string;
}

export default function MagneticButton({
  children,
  className = "",
  onClick,
  href,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [, setIsHovered] = useState(false);

  // Container magnetic pull (existing behavior)
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20 });
  const springY = useSpring(y, { stiffness: 300, damping: 20 });

  // Inner content follows cursor with tighter range
  const contentX = useMotionValue(0);
  const contentY = useMotionValue(0);
  const springContentX = useSpring(contentX, { stiffness: 200, damping: 20 });
  const springContentY = useSpring(contentY, { stiffness: 200, damping: 20 });

  // Scale effect
  const scaleValue = useMotionValue(1);
  const springScale = useSpring(scaleValue, { stiffness: 200, damping: 20 });

  // Spotlight position (percentage-based for radial gradient)
  const spotlightX = useMotionValue(50);
  const spotlightY = useMotionValue(50);
  const spotlightOpacity = useMotionValue(0);
  const springSpotlightOpacity = useSpring(spotlightOpacity, {
    stiffness: 200,
    damping: 20,
  });

  // Build the radial gradient background as a motion value
  const spotlightBackground = useTransform(
    [spotlightX, spotlightY, springSpotlightOpacity],
    ([sx, sy, opacity]: number[]) =>
      `radial-gradient(circle at ${sx}% ${sy}%, rgba(255, 200, 50, ${opacity}), transparent 70%)`
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distX = e.clientX - centerX;
      const distY = e.clientY - centerY;

      // Container magnetic pull
      x.set(distX * 0.15);
      y.set(distY * 0.15);

      // Inner content shift: normalized to [-1, 1] then scaled to max offset
      const normX = distX / (rect.width / 2);
      const normY = distY / (rect.height / 2);
      contentX.set(normX * 8);
      contentY.set(normY * 4);

      // Scale up
      scaleValue.set(1.03);

      // Spotlight position as percentage within the button
      const pctX = ((e.clientX - rect.left) / rect.width) * 100;
      const pctY = ((e.clientY - rect.top) / rect.height) * 100;
      spotlightX.set(pctX);
      spotlightY.set(pctY);
      spotlightOpacity.set(0.08);
    },
    [x, y, contentX, contentY, scaleValue, spotlightX, spotlightY, spotlightOpacity]
  );

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
    contentX.set(0);
    contentY.set(0);
    scaleValue.set(1);
    spotlightOpacity.set(0);
    setIsHovered(false);
  }, [x, y, contentX, contentY, scaleValue, spotlightOpacity]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const innerContent = (
    <motion.span
      style={{
        x: springContentX,
        y: springContentY,
        display: "inline-block",
      }}
    >
      {children}
    </motion.span>
  );

  const sharedProps = {
    className,
    onClick,
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      style={{
        x: springX,
        y: springY,
        scale: springScale,
        position: "relative" as const,
        overflow: "hidden" as const,
      }}
      className="inline-block"
    >
      {/* Gold gradient spotlight overlay */}
      <motion.div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: spotlightBackground,
          pointerEvents: "none" as const,
          borderRadius: "inherit",
          zIndex: 0,
        }}
      />

      {href ? (
        <a href={href} {...sharedProps} style={{ position: "relative", zIndex: 1 }}>
          {innerContent}
        </a>
      ) : (
        <button {...sharedProps} style={{ position: "relative", zIndex: 1 }}>
          {innerContent}
        </button>
      )}
    </motion.div>
  );
}

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useCallback, useRef } from "react";

/**
 * Sliding puzzle animation inspired by the classic 15-puzzle.
 * Tiles continuously shuffle around an empty space as a decorative element.
 */
interface WorkflowAnimationProps {
  className?: string;
}

const GRID = 3; // 3x3 grid = 8 tiles + 1 empty
const TILE_SIZE = 56;
const GAP = 4;

const tiles = [
  { id: 1, icon: "→", label: "Input" },
  { id: 2, icon: "⚙", label: "Process" },
  { id: 3, icon: "◆", label: "AI" },
  { id: 4, icon: "✓", label: "Output" },
  { id: 5, icon: "⟐", label: "Data" },
  { id: 6, icon: "△", label: "Model" },
  { id: 7, icon: "◇", label: "Logic" },
  { id: 8, icon: "⬡", label: "Deploy" },
];

// Solved state: tiles 1-8 in order, empty (0) at position 8
const SOLVED: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 0];

function getNeighbors(emptyIdx: number): number[] {
  const row = Math.floor(emptyIdx / GRID);
  const col = emptyIdx % GRID;
  const neighbors: number[] = [];
  if (row > 0) neighbors.push(emptyIdx - GRID);
  if (row < GRID - 1) neighbors.push(emptyIdx + GRID);
  if (col > 0) neighbors.push(emptyIdx - 1);
  if (col < GRID - 1) neighbors.push(emptyIdx + 1);
  return neighbors;
}

function scramble(board: number[], moves: number): number[] {
  const b = [...board];
  let emptyIdx = b.indexOf(0);
  let lastIdx = -1;

  for (let i = 0; i < moves; i++) {
    const neighbors = getNeighbors(emptyIdx).filter((n) => n !== lastIdx);
    const pick = neighbors[Math.floor(Math.random() * neighbors.length)];
    lastIdx = emptyIdx;
    [b[emptyIdx], b[pick]] = [b[pick], b[emptyIdx]];
    emptyIdx = pick;
  }
  return b;
}

export default function WorkflowAnimation({
  className = "",
}: WorkflowAnimationProps) {
  const [board, setBoard] = useState<number[]>(() => scramble(SOLVED, 30));
  const lastEmpty = useRef(-1);

  const slideOne = useCallback(() => {
    setBoard((prev) => {
      const b = [...prev];
      const emptyIdx = b.indexOf(0);
      const neighbors = getNeighbors(emptyIdx).filter(
        (n) => n !== lastEmpty.current
      );
      const pick = neighbors[Math.floor(Math.random() * neighbors.length)];
      lastEmpty.current = emptyIdx;
      [b[emptyIdx], b[pick]] = [b[pick], b[emptyIdx]];
      return b;
    });
  }, []);

  useEffect(() => {
    const id = setInterval(slideOne, 900);
    return () => clearInterval(id);
  }, [slideOne]);

  const gridPx = GRID * TILE_SIZE + (GRID - 1) * GAP;

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className="relative"
        style={{ width: gridPx, height: gridPx }}
      >
        <AnimatePresence>
          {board.map((tileId, idx) => {
            if (tileId === 0) return null;
            const tile = tiles.find((t) => t.id === tileId)!;
            const row = Math.floor(idx / GRID);
            const col = idx % GRID;
            const x = col * (TILE_SIZE + GAP);
            const y = row * (TILE_SIZE + GAP);

            return (
              <motion.div
                key={tileId}
                layout
                className="absolute flex flex-col items-center justify-center rounded-xl border border-dark-600/50 bg-dark-800/80 cursor-default select-none"
                style={{ width: TILE_SIZE, height: TILE_SIZE }}
                animate={{ x, y }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 30,
                  mass: 0.8,
                }}
              >
                <motion.span
                  className="text-sm font-space text-dark-300"
                  animate={{
                    color: [
                      "rgba(161, 161, 170, 1)",
                      "rgba(var(--accent-rgb), 0.8)",
                      "rgba(161, 161, 170, 1)",
                    ],
                  }}
                  transition={{
                    duration: 3,
                    delay: tileId * 0.3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  {tile.icon}
                </motion.span>
                <span className="text-[7px] font-space text-dark-500 mt-0.5 uppercase tracking-widest">
                  {tile.label}
                </span>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";

interface TapeProps {
  tapeDict: Record<number, string>;
  headPosition: number;
}

export default function Tape({ tapeDict, headPosition }: TapeProps) {
  // We generate a massive static array of indices from -50 to +50.
  // Because these indices never change identity, Framer Motion can translate
  // the entire container smoothly without glitching out.
  const minIndex = Math.min(-40, headPosition - 20);
  const maxIndex = Math.max(40, headPosition + 20);
  
  const cells = [];
  for (let i = minIndex; i <= maxIndex; i++) {
    cells.push(i);
  }

  return (
    <div className="relative w-full max-w-4xl mx-auto overflow-hidden bg-slate-900 border-y-4 border-slate-700 h-32 flex items-center justify-center shadow-xl">
      
      {/* 1. Static Machine Head in the center */}
      <div className="absolute z-20 w-16 h-20 border-4 border-emerald-400 bg-emerald-400/10 rounded-md pointer-events-none shadow-[0_0_15px_rgba(52,211,153,0.5)] flex flex-col justify-between">
        <div className="w-full h-2 bg-emerald-400"></div>
        <div className="w-full h-2 bg-emerald-400"></div>
      </div>

      {/* 2. The Moving Tape Container */}
      <motion.div
        className="flex flex-row absolute z-10"
        animate={{ x: -headPosition * 64 }} // 64px is exactly the width of our w-16 cells
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        {cells.map((absoluteIndex) => {
          const symbol = tapeDict[absoluteIndex] || "B";
          
          return (
            <div
              key={absoluteIndex}
              className={`w-16 h-16 flex items-center justify-center text-3xl font-mono border-r border-slate-700 bg-slate-800 shrink-0 ${symbol !== 'B' ? 'text-white' : 'text-slate-600'}`}
            >
              {symbol === "B" ? "⊔" : symbol}
            </div>
          );
        })}
      </motion.div>

      {/* Fade Edges */}
      <div className="absolute left-0 w-24 h-full bg-gradient-to-r from-slate-900 to-transparent z-30 pointer-events-none" />
      <div className="absolute right-0 w-24 h-full bg-gradient-to-l from-slate-900 to-transparent z-30 pointer-events-none" />
    </div>
  );
}
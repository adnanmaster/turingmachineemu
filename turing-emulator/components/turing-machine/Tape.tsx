"use client";
import { motion } from "framer-motion";

export default function Tape({ tapeDict, headPosition }: { tapeDict: Record<number, string>, headPosition: number }) {
  // Generiert ein fixes Sichtfenster um den Kopf herum
  const minIndex = headPosition - 25;
  const maxIndex = headPosition + 25;
  const cells = [];
  for (let i = minIndex; i <= maxIndex; i++) cells.push(i);

  return (
    <div className="relative w-full max-w-4xl mx-auto overflow-hidden bg-slate-900 border-y-4 border-slate-700 h-32 flex items-center justify-center shadow-xl rounded-lg">
      
      {/* Der statische grüne Kopf (immer exakt in der Mitte) */}
      <div className="absolute z-20 w-16 h-20 border-4 border-emerald-400 bg-emerald-400/10 rounded-md pointer-events-none shadow-[0_0_15px_rgba(52,211,153,0.5)] flex flex-col justify-between">
        <div className="w-full h-2 bg-emerald-400" />
        <div className="w-full h-2 bg-emerald-400" />
      </div>

      {/* Das bewegliche Band */}
      <motion.div
        className="absolute top-0 h-full"
        // Der Ursprung dieses Divs ist exakt die Bildschirmmitte
        style={{ left: "50%" }} 
        // 64px = exakt die Breite einer Zelle (w-16)
        animate={{ x: -headPosition * 64 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {cells.map((idx) => {
          const sym = tapeDict[idx] || "B";
          return (
            <div 
              key={idx} 
              // Jede Zelle wird einzeln berechnet und absolut auf dem Band platziert
              // top-1/2 und -mt-8 zentrieren die 64px (h-16) hohe Zelle vertikal
              className={`absolute top-1/2 -mt-8 w-16 h-16 flex items-center justify-center text-3xl font-mono border-r border-slate-700 bg-slate-800 shrink-0 ${sym !== 'B' ? 'text-white' : 'text-slate-600'}`}
              // idx * 64 berechnet die Position, -32 zieht die halbe Zellenbreite ab, damit die Zelle mittig im Ursprung sitzt
              style={{ left: idx * 64 - 32 }}
            >
              {sym === "B" ? "⊔" : sym}
            </div>
          );
        })}
      </motion.div>

      {/* Fade-Effekte am Rand */}
      <div className="absolute left-0 w-32 h-full bg-gradient-to-r from-slate-900 to-transparent z-30 pointer-events-none" />
      <div className="absolute right-0 w-32 h-full bg-gradient-to-l from-slate-900 to-transparent z-30 pointer-events-none" />
    </div>
  );
}
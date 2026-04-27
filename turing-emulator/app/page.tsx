"use client";

import { useState } from 'react';
import { useTuringStore } from '@/store/useTuringStore';
import Tape from '@/components/turing-machine/Tape';
import { Play, StepForward, RefreshCw } from 'lucide-react';

export default function Home() {
  const [binaryInput, setBinaryInput] = useState("");
  const [tapeInput, setTapeInput] = useState("111");
  
  const { 
    machine, 
    tapeDict, 
    headPosition, 
    currentState, 
    steps, 
    isRunning, 
    initialize, 
    step, 
    run, 
    reset 
  } = useTuringStore();

  // Helper to extract all non-blank characters from the tape dictionary
  const getCompactTapeString = () => {
    const keys = Object.keys(tapeDict).map(Number);
    if (keys.length === 0) return "";
    
    const min = Math.min(...keys);
    const max = Math.max(...keys);
    let out = "";
    
    for (let i = min; i <= max; i++) {
      out += tapeDict[i] || "B";
    }
    
    // Trim leading/trailing Blanks and replace inner Blanks with the ⊔ symbol
    const trimmed = out.replace(/^B+|B+$/g, '');
    return trimmed.replace(/B/g, ' ⊔ ') || "Empty";
  };

  const currentOutput = getCompactTapeString();

  return (
    <main className="min-h-screen bg-slate-950 text-slate-200 p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        
        <header className="text-center">
          <h1 className="text-4xl font-bold text-white mb-2">Turing Machine Emulator</h1>
          <p className="text-slate-400">ZHAW Theoretische Informatik - Aufgabe 1 & 2</p>
        </header>

        {/* --- BUILD MODE --- */}
        {!machine && (
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 space-y-6 shadow-xl">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Binary Code (Paste your T1, T2, or T_quad code here)
              </label>
              <textarea 
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-4 text-emerald-400 font-mono text-sm focus:ring-2 focus:ring-emerald-500 outline-none resize-y"
                rows={6}
                value={binaryInput}
                onChange={(e) => setBinaryInput(e.target.value)}
                placeholder="010010001010011000101010010110001001001010011..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Initial Tape Input (e.g., "111" for Unary 3)
              </label>
              <input 
                type="text"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-4 text-white font-mono focus:ring-2 focus:ring-emerald-500 outline-none"
                value={tapeInput}
                onChange={(e) => setTapeInput(e.target.value)}
              />
            </div>
            <button 
              onClick={() => initialize(binaryInput, tapeInput)}
              disabled={!binaryInput.trim()}
              className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold py-4 rounded-lg transition-colors text-lg"
            >
              Compile & Load Machine
            </button>
          </div>
        )}

        {/* --- RUN MODE --- */}
        {machine && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            <Tape tapeDict={tapeDict} headPosition={headPosition} />

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 flex flex-col items-center justify-center shadow-lg">
                <span className="text-slate-400 text-sm mb-1 uppercase tracking-wider">Current State</span>
                <span className={`text-4xl font-mono font-bold ${currentState === 'q_error' ? 'text-rose-500' : 'text-emerald-400'}`}>
                  {currentState}
                </span>
              </div>
              <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 flex flex-col items-center justify-center shadow-lg">
                <span className="text-slate-400 text-sm mb-1 uppercase tracking-wider">Head Position</span>
                <span className="text-4xl font-mono font-bold text-white">{headPosition}</span>
              </div>
              <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 flex flex-col items-center justify-center shadow-lg">
                <span className="text-slate-400 text-sm mb-1 uppercase tracking-wider">Steps</span>
                <span className="text-4xl font-mono font-bold text-white">{steps}</span>
              </div>
            </div>

            {/* NEW: Live Output Container */}
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-lg">
              <span className="text-slate-400 text-sm mb-2 block uppercase tracking-wider text-center">Full Tape Content</span>
              <div className="text-2xl font-mono text-emerald-300 break-all bg-slate-950 p-4 rounded-lg border border-slate-800 text-center min-h-[4rem] flex flex-col items-center justify-center">
                <p className="tracking-widest">{currentOutput}</p>
                {/* Optional: If it's a unary output, show the integer count too! */}
                {currentOutput.includes("1") && !currentOutput.includes("0") && !currentOutput.includes("X") && (
                   <span className="text-xs text-slate-500 mt-2 font-sans tracking-normal">
                     (Unary Decimal Value: {currentOutput.split("1").length - 1})
                   </span>
                )}
              </div>
            </div>

            <div className="flex justify-center gap-4 bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-lg">
              <button 
                onClick={step} 
                disabled={isRunning}
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 px-8 py-4 rounded-lg font-medium transition-colors disabled:opacity-50 text-white"
              >
                <StepForward size={20} /> Step
              </button>
              <button 
                onClick={run}
                disabled={isRunning}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 px-8 py-4 rounded-lg font-bold transition-colors disabled:opacity-50 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_20px_rgba(16,185,129,0.5)]"
              >
                <Play size={20} /> Run (Laufmodus)
              </button>
              <button 
                onClick={reset}
                className="flex items-center gap-2 bg-slate-950 hover:bg-rose-950/50 text-rose-400 border border-rose-900/50 px-8 py-4 rounded-lg font-medium transition-colors ml-8"
              >
                <RefreshCw size={20} /> Reset Machine
              </button>
            </div>

          </div>
        )}

      </div>
    </main>
  );
}
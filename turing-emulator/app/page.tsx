"use client";
import { useState } from 'react';
import { useTuringStore } from '@/store/useTuringStore';
import Tape from '@/components/turing-machine/Tape';
import { Play, Pause, StepForward, RefreshCw, Cpu, Database, FastForward, Turtle, Rabbit } from 'lucide-react';

export default function Home() {
  const [binaryCode, setBinaryCode] = useState("");
  const [rawInput, setRawInput] = useState("3");
  const [inputType, setInputType] = useState("decimal_to_unary");

  const { machine, tapeDict, headPosition, currentState, steps, isRunning, isFinished, delay, initialize, step, run, pause, runInstant, reset, setDelay } = useTuringStore();

  const handleStart = () => {
    let finalInput = rawInput;
    const num = parseInt(rawInput, 10);
    if (inputType === "decimal_to_unary" && !isNaN(num)) finalInput = "1".repeat(num);
    else if (inputType === "decimal_to_binary" && !isNaN(num)) finalInput = num.toString(2);
    initialize(binaryCode, finalInput);
  };

  const getFullResult = () => {
    const keys = Object.keys(tapeDict).map(Number).sort((a, b) => a - b);
    if (keys.length === 0) return "Leer";
    const res = keys.map(k => tapeDict[k] === "B" ? "⊔" : tapeDict[k]).join("");
    const trimmed = res.replace(/^(⊔)+|(⊔)+$/g, '');
    return trimmed || "Leer";
  };

  const result = getFullResult();

  return (
    <main className="min-h-screen bg-slate-950 text-slate-200 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="text-center space-y-2">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">TM Emulator</h1>
          <p className="text-slate-500 font-medium tracking-widest uppercase text-sm">ZHAW Theoretische Informatik</p>
        </header>

        {!machine ? (
          <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl shadow-2xl space-y-6 max-w-4xl mx-auto">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-emerald-400 text-sm font-bold uppercase"><Cpu size={16}/> Programm (Gödel-Nummer)</label>
              <textarea className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 font-mono text-sm text-emerald-500 focus:ring-2 focus:ring-emerald-500 outline-none transition-all" rows={6} value={binaryCode} onChange={e => setBinaryCode(e.target.value)} placeholder="010010001..." />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-cyan-400 text-sm font-bold uppercase"><Database size={16}/> Input Typ</label>
                <select className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 outline-none focus:ring-2 focus:ring-cyan-500" value={inputType} onChange={e => setInputType(e.target.value)}>
                  <option value="decimal_to_unary">Dezimal ➔ Unär (z.B. 3 ➔ 111)</option>
                  <option value="decimal_to_binary">Dezimal ➔ Binär (z.B. 5 ➔ 101)</option>
                  <option value="raw">Raw String</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-slate-400 text-sm font-bold uppercase block">Eingabe-Wert</label>
                <input className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 font-mono focus:ring-2 focus:ring-cyan-500 outline-none" value={rawInput} onChange={e => setRawInput(e.target.value)} />
              </div>
            </div>
            <button onClick={handleStart} className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl transition-all shadow-lg shadow-emerald-900/20 text-lg uppercase tracking-widest">Maschine Initialisieren</button>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
            <Tape tapeDict={tapeDict} headPosition={headPosition} />
            <div className="grid grid-cols-3 gap-4">
              {/* ANGEPASST: Prüft nun strikt auf currentState === 'q2' */}
              <StatCard 
                label="Zustand" 
                value={
                  isFinished 
                    ? (currentState === "q2" ? "q2 (ACCEPTED)" : `${currentState} (REJECTED)`) 
                    : currentState
                } 
                color={
                  isFinished 
                    ? (currentState === "q2" ? "text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" : "text-rose-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]") 
                    : "text-emerald-400"
                } 
              />
              <StatCard label="Kopf Position" value={headPosition} />
              <StatCard label="Schritte" value={steps} />
            </div>
            <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter block mb-2 text-center">Aktueller Band-Inhalt (Gekürzt)</span>
              <div className="bg-black/40 p-4 rounded-xl border border-slate-800 font-mono text-xl text-cyan-300 text-center break-all">
                {result}
                {inputType === "decimal_to_unary" && !result.includes("0") && (
                  <div className="text-[10px] text-slate-600 mt-2">Wert (Unär): {result.replace(/⊔/g, '').length}</div>
                )}
              </div>
            </div>
            
            {/* Toolbar mit Slider und Play/Pause */}
            <div className="flex flex-col items-center gap-6 bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
              
              <div className="flex items-center gap-4 w-full max-w-lg bg-slate-950 p-4 rounded-xl border border-slate-800 shadow-inner">
                <Turtle className="text-slate-500" size={24} />
                <input 
                  type="range" 
                  min="10" 
                  max="1000" 
                  step="10"
                  value={1010 - delay} 
                  onChange={(e) => setDelay(1010 - parseInt(e.target.value))}
                  className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <Rabbit className="text-emerald-500 drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]" size={24} />
              </div>

              <div className="flex flex-wrap justify-center gap-4">
                <ControlButton onClick={step} disabled={isRunning || isFinished} icon={<StepForward size={20}/>} label="Step" />
                
                {isRunning ? (
                  <ControlButton onClick={pause} icon={<Pause size={20}/>} label="Pause" primary />
                ) : (
                  <ControlButton onClick={run} disabled={isFinished} icon={<Play size={20}/>} label="Animation" primary />
                )}
                
                <ControlButton onClick={runInstant} disabled={isRunning || isFinished} icon={<FastForward size={20}/>} label="Sofortiges Resultat" fast />
                <div className="w-px bg-slate-800 mx-2 hidden sm:block"></div>
                <ControlButton onClick={reset} icon={<RefreshCw size={20}/>} label="Reset" danger />
              </div>
            </div>

          </div>
        )}
      </div>
    </main>
  );
}

function StatCard({ label, value, color = "text-white" }: any) {
  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-center shadow-lg">
      <p className="text-[10px] font-black text-slate-500 uppercase mb-1 tracking-widest">{label}</p>
      <p className={`text-4xl font-mono font-bold transition-colors duration-300 ${color}`}>{value}</p>
    </div>
  );
}

function ControlButton({ onClick, disabled, icon, label, primary, fast, danger }: any) {
  let btnClass = "bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700";
  
  if (primary) {
    btnClass = "bg-emerald-600 text-white shadow-emerald-900/20 hover:scale-105 border border-emerald-500";
  } else if (fast) {
    btnClass = "bg-cyan-600 text-white shadow-cyan-900/20 hover:scale-105 border border-cyan-500";
  } else if (danger) {
    btnClass = "bg-rose-950/30 text-rose-500 border border-rose-900/50 hover:bg-rose-900";
  }

  return (
    <button onClick={onClick} disabled={disabled} className={`flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold transition-all disabled:opacity-30 disabled:pointer-events-none min-w-[140px] ${btnClass}`}>
      {icon} {label}
    </button>
  );
}
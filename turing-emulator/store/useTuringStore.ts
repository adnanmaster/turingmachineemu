import { create } from 'zustand';
import { UniversalTuringMachine } from '@/lib/turing/engine';

interface TuringState {
  machine: UniversalTuringMachine | null;
  tapeDict: Record<number, string>;
  headPosition: number;
  currentState: string;
  steps: number;
  isRunning: boolean;
  isFinished: boolean;
  delay: number; // NEU: Animations-Geschwindigkeit
  
  initialize: (binaryCode: string, input: string) => void;
  step: () => boolean;
  run: () => void;
  pause: () => void; // NEU: Animation pausieren
  runInstant: () => void;
  reset: () => void;
  setDelay: (delay: number) => void; // NEU: Geschwindigkeit ändern
}

export const useTuringStore = create<TuringState>((set, get) => ({
  machine: null,
  tapeDict: {},
  headPosition: 0,
  currentState: "q1",
  steps: 0,
  isRunning: false,
  isFinished: false,
  delay: 100, // Standard: 100ms pro Schritt

  setDelay: (delay) => set({ delay }),

  initialize: async (binaryCode, input) => {
    const { decodeBinaryTM } = await import('@/lib/turing/compiler');
    const rules = decodeBinaryTM(binaryCode);
    const machine = new UniversalTuringMachine(rules, input);
    const snap = machine.getSnapshot();
    
    set({ 
      machine, 
      tapeDict: snap.tapeDict,
      headPosition: snap.headPosition, 
      currentState: snap.state, 
      steps: snap.steps,
      isRunning: false,
      isFinished: false
    });
  },

  step: () => {
    const { machine } = get();
    if (!machine) return false;
    
    const canContinue = machine.step();
    const snap = machine.getSnapshot();
    
    set({
      tapeDict: snap.tapeDict,
      headPosition: snap.headPosition,
      currentState: snap.state,
      steps: snap.steps,
      isFinished: !canContinue
    });
    return canContinue;
  },

  run: () => {
    const { machine, isRunning, isFinished } = get();
    if (!machine || isRunning || isFinished) return;
    
    set({ isRunning: true });
    
    // NEU: Rekursiver Loop statt setInterval. 
    // Dadurch wird die Geschwindigkeit live bei jedem Schritt neu ausgelesen!
    const loop = () => {
      const { step, delay, isRunning } = get();
      if (!isRunning) return; // Stoppt sofort, wenn Pause gedrückt wird
      
      const active = step();
      if (!active) {
        set({ isRunning: false });
        return;
      }
      
      setTimeout(loop, delay);
    };
    
    loop(); 
  },

  pause: () => set({ isRunning: false }),

  runInstant: () => {
    const { machine } = get();
    if (!machine) return;
    
    set({ isRunning: true });
    
    let isAlive = true;
    let snap;
    let fallbackCounter = 0;
    const MAX_STEPS = 100000000; 

    while (isAlive && fallbackCounter < MAX_STEPS) {
      isAlive = machine.step();
      snap = machine.getSnapshot();
      fallbackCounter++;
    }

    if (snap) {
      set({
        tapeDict: snap.tapeDict,
        headPosition: snap.headPosition,
        currentState: snap.state,
        steps: snap.steps,
        isRunning: false,
        isFinished: true
      });
    }
  },

  reset: () => set({ machine: null, steps: 0, headPosition: 0, currentState: "q1", tapeDict: {}, isRunning: false, isFinished: false })
}));
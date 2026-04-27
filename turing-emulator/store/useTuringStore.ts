import { create } from 'zustand';
import { UniversalTuringMachine } from '@/lib/turing/engine';

interface TuringState {
  machine: UniversalTuringMachine | null;
  tapeWindow: string;
  tapeDict: Record<number, string>;
  headPosition: number;
  currentState: string;
  steps: number;
  isRunning: boolean;
  
  initialize: (binaryCode: string, input: string) => void;
  step: () => void;
  run: () => void;
  reset: () => void;
}

export const useTuringStore = create<TuringState>((set, get) => ({
  machine: null,
  tapeWindow: "B".repeat(31), 
  tapeDict: {},
  headPosition: 0,
  currentState: "q1",
  steps: 0,
  isRunning: false,

  initialize: async (binaryCode, input) => {
    const { decodeBinaryTM } = await import('@/lib/turing/compiler');
    const rules = decodeBinaryTM(binaryCode);
    const machine = new UniversalTuringMachine(rules, input);
    const snap = machine.getSnapshot();
    
    set({ 
      machine, 
      tapeWindow: snap.tapeWindow, 
      tapeDict: snap.tapeDict,
      headPosition: snap.headPosition, 
      currentState: snap.state, 
      steps: snap.steps,
      isRunning: false
    });
  },

  step: () => {
    const { machine } = get();
    if (!machine) return;
    
    machine.step();
    const snap = machine.getSnapshot();
    set({
      tapeWindow: snap.tapeWindow,
      tapeDict: snap.tapeDict,
      headPosition: snap.headPosition,
      currentState: snap.state,
      steps: snap.steps
    });
  },

  run: () => {
    const { machine } = get();
    if (!machine) return;
    
    set({ isRunning: true });
    
    const interval = setInterval(() => {
      const isAlive = machine.step();
      const snap = machine.getSnapshot();
      
      set({
        tapeWindow: snap.tapeWindow,
        tapeDict: snap.tapeDict,
        headPosition: snap.headPosition,
        currentState: snap.state,
        steps: snap.steps
      });

      if (!isAlive) {
        clearInterval(interval);
        set({ isRunning: false });
      }
    }, 75); // Slightly slower so you can actually see the animations!
  },

  reset: () => set({ machine: null, steps: 0, headPosition: 0, currentState: "q1", tapeDict: {} })
}));
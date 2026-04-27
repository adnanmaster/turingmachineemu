export type Direction = "L" | "R" | "N";

export interface Transition {
  writeSymbol: string;
  moveDirection: Direction;
  nextState: string;
}

export type TransitionTable = Record<string, Record<string, Transition>>;

export class UniversalTuringMachine {
  private tape: Record<number, string> = {}; 
  private headPosition: number = 0;
  private currentState: string;
  private stepCounter: number = 0;
  private rules: TransitionTable;
  private blankSymbol = "B";

  constructor(rules: TransitionTable, input: string, startState: string = "q1") {
    this.rules = rules;
    this.currentState = startState;
    for (let i = 0; i < input.length; i++) {
      this.tape[i] = input[i];
    }
  }

  private read(): string {
    return this.tape[this.headPosition] || this.blankSymbol;
  }

  public getSnapshot() {
    const windowStart = this.headPosition - 15;
    const windowEnd = this.headPosition + 15;
    let tapeVisual = "";
    
    // Assignment Requirement: 15 cells before and after
    for (let i = windowStart; i <= windowEnd; i++) {
      tapeVisual += this.tape[i] || this.blankSymbol;
    }

    // Check if the machine is halted (no transition defined for current state + symbol)
    const currentSymbol = this.read();
    const isHalted = !this.rules[this.currentState]?.[currentSymbol];

    return {
      state: this.currentState,                 
      tapeWindow: tapeVisual,  
      tapeDict: { ...this.tape },             
      headPosition: this.headPosition,          
      steps: this.stepCounter,                  
      isHalted: isHalted
    };
  }

  public step(): boolean {
    const currentSymbol = this.read();
    const transition = this.rules[this.currentState]?.[currentSymbol];

    // FIX: If no transition is defined, the machine cleanly halts.
    // We return false to stop the loop, but we DO NOT overwrite the currentState.
    if (!transition) {
      return false; 
    }

    // 1. Write Symbol
    this.tape[this.headPosition] = transition.writeSymbol;
    
    // 2. Move Head
    if (transition.moveDirection === "R") this.headPosition++;
    else if (transition.moveDirection === "L") this.headPosition--;

    // 3. Update State & Counter
    this.currentState = transition.nextState;
    this.stepCounter++;

    return true;
  }
}
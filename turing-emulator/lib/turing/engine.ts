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
    // Initialisiere das Band mit dem Input-String
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
    
    for (let i = windowStart; i <= windowEnd; i++) {
      tapeVisual += this.tape[i] || this.blankSymbol;
    }

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

    if (!transition) return false; 

    this.tape[this.headPosition] = transition.writeSymbol;
    
    if (transition.moveDirection === "R") this.headPosition++;
    else if (transition.moveDirection === "L") this.headPosition--;

    this.currentState = transition.nextState;
    this.stepCounter++;

    return true;
  }
}
import { TransitionTable, Direction } from './engine';

// FIX: We now dynamically support an infinite number of custom symbols!
function parseSymbol(zeros: string): string {
  const len = zeros.length;
  if (len === 1) return "0";
  if (len === 2) return "1";
  if (len === 3) return "B"; // Blank / ⊔
  if (len === 4) return "X"; // Marker 1
  if (len === 5) return "Y"; // Marker 2
  if (len === 6) return "Z"; // Marker 3
  return `S${len}`;          // Fallback for S7, S8, etc.
}

export function decodeBinaryTM(binaryString: string): TransitionTable {
  const rules: TransitionTable = {};
  
  // Clean the string just in case there are hidden spaces or newlines
  const cleanString = binaryString.replace(/\s+/g, '');
  const transitionsRaw = cleanString.split("11"); 

  transitionsRaw.forEach(t => {
    const elements = t.split("1"); 
    
    // Ensure it's a valid 5-part rule
    if (elements.length === 5) {
      const currentState = `q${elements[0].length}`;
      const nextState = `q${elements[2].length}`;
      
      const readSymbol = parseSymbol(elements[1]);
      const writeSymbol = parseSymbol(elements[3]);
      
      // Directions: 1 zero = L, 2 zeros = R, 3 zeros = N
      const moveDirection: Direction = elements[4].length === 1 ? "L" : (elements[4].length === 2 ? "R" : "N");

      // Initialize the state in the dictionary if it doesn't exist
      if (!rules[currentState]) rules[currentState] = {};
      
      // Assign the rule
      rules[currentState][readSymbol] = { writeSymbol, moveDirection, nextState };
    }
  });

  return rules;
}
import { TransitionTable, Direction } from './engine';

function parseSymbol(zeros: string): string {
  const len = zeros.length;
  if (len === 1) return "0";
  if (len === 2) return "1";
  if (len === 3) return "B"; // Blank / ⊔
  if (len === 4) return "X"; 
  if (len === 5) return "Y"; 
  if (len === 6) return "Z"; 
  return `S${len}`;
}

export function decodeBinaryTM(binaryString: string): TransitionTable {
  const rules: TransitionTable = {};
  
  let cleanString = binaryString.replace(/\s+/g, '');

  if (cleanString.includes("111")) {
    cleanString = cleanString.split("111")[0];
  }

  cleanString = cleanString.replace(/^1+|1+$/g, '');

  const transitionsRaw = cleanString.split("11"); 

  transitionsRaw.forEach(t => {
    const elements = t.split("1"); 

    if (elements.length === 5) {
      const currentState = `q${elements[0].length}`;
      const nextState = `q${elements[2].length}`;
      const readSymbol = parseSymbol(elements[1]);
      const writeSymbol = parseSymbol(elements[3]);
      const moveDirection: Direction = elements[4].length === 1 ? "L" : (elements[4].length === 2 ? "R" : "N");

      if (!rules[currentState]) rules[currentState] = {};
      rules[currentState][readSymbol] = { writeSymbol, moveDirection, nextState };
    }
  });

  return rules;
}
import { readFile } from "node:fs/promises";

const PART_NUMBER_SYMBOLS: Record<string, boolean> = {
  '-': true,
  '%': true,
  '+': true,
  '=': true,
  '*': true,
  '/': true,
  '$': true,
  '&': true,
  '#': true,
  '@': true,
}

const checkIfCharacterIsAdjacentToSymbol = (currentCoordinate: [number, number], schematicLines: string[]): boolean => {
  const [lineIndex, positionInLineIndex] = currentCoordinate;

  const isFirstLine = lineIndex === 0;
  const isLastLine = lineIndex ==schematicLines.length - 1;

  const isFirstCharacter = positionInLineIndex === 0;
  const isLastCharacter = positionInLineIndex === schematicLines[0].length - 1;

  const charactersToCheck = [
    // Line above.
    !isFirstLine && !isFirstCharacter && schematicLines[lineIndex - 1][positionInLineIndex - 1],
    !isFirstLine && schematicLines[lineIndex - 1][positionInLineIndex],
    !isFirstLine && !isLastCharacter && schematicLines[lineIndex - 1][positionInLineIndex + 1],

    // Same line.
    !isFirstCharacter && schematicLines[lineIndex][positionInLineIndex - 1],
    !isLastCharacter && schematicLines[lineIndex][positionInLineIndex + 1],

    // Line below.
    !isLastLine && !isFirstCharacter && schematicLines[lineIndex + 1][positionInLineIndex - 1],
    !isLastLine && schematicLines[lineIndex + 1][positionInLineIndex],
    !isLastLine && !isLastCharacter && schematicLines[lineIndex + 1][positionInLineIndex + 1],
  ].filter(Boolean);

  
  return charactersToCheck.some((character) => {
    if (!character) {
      return false;
    }

    return Boolean(PART_NUMBER_SYMBOLS[character]);
  });
}

const getSumOfPartNumbers = async (
    pathToSchmatic: string
  ): Promise<number | undefined> => {
    try {
      const schematicLines = (await readFile(pathToSchmatic, { encoding: "utf-8" })).split(
        "\n"
      );

      let runningTotal = 0;
      
      for (let i = 0; i < schematicLines.length; i++) {
        let currentNumber = '';
        let hasAdjacentSymbol = false;

        for (let j = 0; j < schematicLines[i].length; j++) {
          const symbol = schematicLines[i][j];
          const number = Number(symbol);
          const isNumber = number === 0 ? true : Boolean(number);
          if (!isNumber) {
            if (currentNumber && hasAdjacentSymbol) {
              const currentNumberAsNumber = Number(currentNumber);
              runningTotal += currentNumberAsNumber;
            }
            
            currentNumber = '';
            hasAdjacentSymbol = false;
            continue;
          }
          
          currentNumber += number;
          hasAdjacentSymbol = hasAdjacentSymbol || checkIfCharacterIsAdjacentToSymbol([i, j], schematicLines);

          if (j === schematicLines[i].length - 1) {
            if (currentNumber && hasAdjacentSymbol) {
              const currentNumberAsNumber = Number(currentNumber);
              runningTotal += currentNumberAsNumber;
            }
          }
        }
      }
  
      return runningTotal;
    } catch (error) {
      console.error("Had trouble reading file provided!", error);
    }
  };
  
  console.log(await getSumOfPartNumbers("day-3/part-1/input.txt"));
  
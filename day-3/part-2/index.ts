import { getRandomValues } from "node:crypto";
import { readFile } from "node:fs/promises";
import { validateHeaderValue } from "node:http";

const GEAR_SYMBOL = '*';

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

type AdjacentCharacterDetails = {
  isAdjacent: boolean;
  gearCoordinates?: [number, number];
}

const getAdjacentSymbolMetadata = (currentCoordinate: [number, number], schematicLines: string[]): AdjacentCharacterDetails => {
  const [lineIndex, positionInLineIndex] = currentCoordinate;

  const isFirstLine = lineIndex === 0;
  const isLastLine = lineIndex ==schematicLines.length - 1;

  const isFirstCharacter = positionInLineIndex === 0;
  const isLastCharacter = positionInLineIndex === schematicLines[0].length - 1;

  const coordinatesToCheck = [
    // Line above.
    !isFirstLine && !isFirstCharacter && { lineCoordinate: lineIndex - 1, positionCoordinate: positionInLineIndex - 1 },
    !isFirstLine && { lineCoordinate: lineIndex - 1, positionCoordinate: positionInLineIndex },
    !isFirstLine && !isLastCharacter && { lineCoordinate: lineIndex - 1, positionCoordinate: positionInLineIndex + 1 },

    // Same line.
    !isFirstCharacter && { lineCoordinate: lineIndex, positionCoordinate: positionInLineIndex - 1 },
    !isLastCharacter && { lineCoordinate: lineIndex, positionCoordinate: positionInLineIndex + 1 },

    // Line below.
    !isLastLine && !isFirstCharacter && {lineCoordinate: lineIndex + 1, positionCoordinate: positionInLineIndex - 1},
    !isLastLine && { lineCoordinate: lineIndex + 1, positionCoordinate: positionInLineIndex },
    !isLastLine && !isLastCharacter && {lineCoordinate: lineIndex + 1, positionCoordinate: positionInLineIndex + 1},
  ].filter(Boolean);

  
  let gearCoordinates: [number, number] | undefined; 
  const isAdjacent = coordinatesToCheck.some((coordinate) => {
    if (!coordinate) {
      return false;
    }

    const isSymbol = PART_NUMBER_SYMBOLS[schematicLines[coordinate.lineCoordinate][coordinate.positionCoordinate]];
    if (isSymbol) {
      gearCoordinates = schematicLines[coordinate.lineCoordinate][coordinate.positionCoordinate] === GEAR_SYMBOL ? [coordinate.lineCoordinate, coordinate.positionCoordinate] : undefined;
      return true;
    }

    return false;
  });

  return {
    gearCoordinates,
    isAdjacent,
  }
}

const gearCache = new Map<string, Array<number>>();

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
        let isAdjacentToSymbol = false;
        let gearCoordinates: string | undefined;

        for (let j = 0; j < schematicLines[i].length; j++) {
          const symbol = schematicLines[i][j];
          const number = Number(symbol);
          const isNumber = number === 0 ? true : Boolean(number);
          if (!isNumber) {
            if (currentNumber && isAdjacentToSymbol) {
              const currentNumberAsNumber = Number(currentNumber);
              runningTotal += currentNumberAsNumber;

              if (gearCoordinates) {
                const existingPartNumber = gearCache.get(gearCoordinates);
                if (existingPartNumber) {
                  gearCache.set(gearCoordinates, [...existingPartNumber, currentNumberAsNumber]);
                } else {
                  gearCache.set(gearCoordinates, [currentNumberAsNumber]);
                }
              }
            }
            
            currentNumber = '';
            isAdjacentToSymbol = false;
            gearCoordinates = undefined;
            continue;
          }
          
          currentNumber += number;
          const adjacentSymbolMetadata = getAdjacentSymbolMetadata([i, j], schematicLines);
          isAdjacentToSymbol = isAdjacentToSymbol || adjacentSymbolMetadata.isAdjacent;
          if (adjacentSymbolMetadata.gearCoordinates) {
            gearCoordinates = String([...adjacentSymbolMetadata.gearCoordinates]);
          }

          // Refactor this as it's repetitive
          if (j === schematicLines[i].length - 1) {
            if (currentNumber && isAdjacentToSymbol) {
              const currentNumberAsNumber = Number(currentNumber);
              runningTotal += currentNumberAsNumber;

              if (gearCoordinates) {
                const existingPartNumber = gearCache.get(gearCoordinates);
                if (existingPartNumber) {
                  gearCache.set(gearCoordinates, [...existingPartNumber, currentNumberAsNumber]);
                } else {
                  gearCache.set(gearCoordinates, [currentNumberAsNumber]);
                }
              }
            }
          }
        }
      }

      let sumOfGearRatios = 0;
      gearCache.forEach(value => {
        console.log(value);
        if (value.length === 2) {
          sumOfGearRatios += (value[0] * value[1]);
        }
      });

      return sumOfGearRatios;
    } catch (error) {
      console.error("Had trouble reading file provided!", error);
    }
  };
  
  console.log(await getSumOfPartNumbers("day-3/part-2/input.txt"));
  
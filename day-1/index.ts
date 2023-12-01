import { readFile } from "node:fs/promises";

const calculateCalibrationValue = (value: string): number => {
  let firstDigit: number | undefined = undefined;
  let lastDigit: number | undefined = undefined;

  let startPointer = 0;
  let endPointer = value.length - 1;

  while (startPointer < value.length) {
    const isStartCharacterANumber = Boolean(Number(value[startPointer]));
    if (isStartCharacterANumber && firstDigit == undefined) {
      firstDigit = Number(value[startPointer]);
    }

    const isEndCharacterANumber = Boolean(Number(value[endPointer]));
    if (isEndCharacterANumber && lastDigit == undefined) {
      lastDigit = Number(value[endPointer]);
    }

    startPointer++;
    endPointer--;
  }

  if (firstDigit === undefined && lastDigit !== undefined) {
    firstDigit = lastDigit;
  } else if (lastDigit === undefined && firstDigit !== undefined) {
    lastDigit = firstDigit;
  }

  if (firstDigit && lastDigit) {
    return Number(firstDigit.toString() + lastDigit.toString());
  }

  return 0;
};

const getSumOfCalibrationValues = async (
  pathToValues: string
): Promise<number | undefined> => {
  try {
    const values = await readFile(pathToValues, { encoding: "utf-8" });
    const valuesSplitPerLine = values.split("\n");
    const sumOfCalibrationValues = valuesSplitPerLine.reduce(
      (previousValue, currentValue) => {
        return previousValue + calculateCalibrationValue(currentValue);
      },
      0
    );

    return sumOfCalibrationValues;
  } catch (error) {
    console.error("Had trouble reading file provided!", error);
  }
};

console.log(await getSumOfCalibrationValues("day-1/input.txt"));

import { readFile } from "node:fs/promises";

const calculateCalibrationValue = (value: string): number => {
  const matchedNumbers = value.match(/[0-9]/g);
  if (!matchedNumbers) {
    return 0;
  }

  return Number(matchedNumbers[0] + matchedNumbers[matchedNumbers.length - 1]);
};

const getSumOfCalibrationValues = async (
  pathToValues: string
): Promise<number | undefined> => {
  try {
    const values = (await readFile(pathToValues, { encoding: "utf-8" })).split(
      "\n"
    );
    const sumOfCalibrationValues = values.reduce((previous, current) => {
      return previous + calculateCalibrationValue(current);
    }, 0);

    return sumOfCalibrationValues;
  } catch (error) {
    console.error("Had trouble reading file provided!", error);
  }
};

console.log(await getSumOfCalibrationValues("day-1/part-1/input.txt"));

import { readFile } from "node:fs/promises";

const textToNumberMap = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
};

const getNumericDigitAsString = (digit: string): string => {
  return Number(digit)
    ? digit
    : textToNumberMap[digit as keyof typeof textToNumberMap].toString();
};

const calculateCalibrationValue = (value: string): number => {
  const regex = /one|two|three|four|five|six|seven|eight|nine|[0-9]/;
  const matchedFirstDigit = value.match(regex);
  let matchedLastDigit;

  let valueRightToLeft = "";
  for (let i = value.length - 1; i >= 0; i--) {
    valueRightToLeft = value[i] + valueRightToLeft;
    const match = valueRightToLeft.match(regex);
    if (match) {
      matchedLastDigit = match;
      break;
    }
  }

  if (matchedFirstDigit && matchedLastDigit) {
    return Number(
      getNumericDigitAsString(matchedFirstDigit[0]) +
        getNumericDigitAsString(matchedLastDigit[0])
    );
  }

  return 0;
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

console.log(await getSumOfCalibrationValues("day-1/part-2/input.txt"));

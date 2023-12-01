import { readFile } from "node:fs/promises";
// Iterate through text from start + back
// add first digit found with last digit found together
// then find the sum of all of these
const calculateCalibrationValue = (value) => {
    let firstDigit = undefined;
    let lastDigit = undefined;
    let startPointer = 0;
    let endPointer = value.length - 1;
    while (startPointer <= endPointer) {
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
    }
    else if (lastDigit === undefined && firstDigit !== undefined) {
        lastDigit = firstDigit;
    }
    return firstDigit && lastDigit
        ? Number(firstDigit.toString() + lastDigit.toString())
        : 0;
};
const calculateSumOfCalibrationValues = async (pathToValues) => {
    try {
        const values = await readFile(pathToValues, { encoding: "utf-8" });
        const valuesSplitPerLine = values.split("\n");
        const sumOfCalibrationValues = valuesSplitPerLine.reduce((previousValue, currentValue) => {
            return previousValue + calculateCalibrationValue(currentValue);
        }, 0);
        return sumOfCalibrationValues;
    }
    catch (error) {
        console.error(error);
    }
};
console.log(await calculateSumOfCalibrationValues("day-1/input.txt"));

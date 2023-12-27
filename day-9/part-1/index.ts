import { readFile } from "node:fs/promises";

const getExtrapolatedValue = (history: number[]): number => {
  if (history.every((value) => value === 0)) {
    return 0;
  }

  const differences: number[] = [];
  for (let i = 0; i < history.length - 1; i++) {
    differences.push(history[i + 1] - history[i]);
  }

  return history[history.length - 1] + getExtrapolatedValue(differences);
};

const calculateSumOfExtrapolatedValues = async (
  path: string
): Promise<number | undefined> => {
  try {
    const histories = (await readFile(path, { encoding: "utf-8" }))
      .split(/\n/)
      .map((rawHistory) => rawHistory.split(" ").map((value) => Number(value)));

    const sumOfExtrapolatedValues: number = histories.reduce(
      (previous, current) => previous + getExtrapolatedValue(current),
      0
    );

    return sumOfExtrapolatedValues;
  } catch (error) {
    console.error("Had trouble reading file provided!", error);
  }
};

console.log(await calculateSumOfExtrapolatedValues("day-9/part-1/input.txt"));

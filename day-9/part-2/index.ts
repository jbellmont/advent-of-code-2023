import { readFile } from "node:fs/promises";

const getReversedExtrapolatedValue = (history: number[]): number => {
  if (history.every((value) => value === 0)) {
    return 0;
  }

  const differences: number[] = [];
  for (let i = 0; i < history.length - 1; i++) {
    differences.push(history[i + 1] - history[i]);
  }

  return history[0] - getReversedExtrapolatedValue(differences);
};

const calculateSumOfReversedExtrapolatedValues = async (
  path: string
): Promise<number | undefined> => {
  try {
    const histories = (await readFile(path, { encoding: "utf-8" }))
      .split(/\n/)
      .map((rawHistory) => rawHistory.split(" ").map((value) => Number(value)));

    const sumOfReversedExtrapolatedValues: number = histories.reduce(
      (previous, current) => previous + getReversedExtrapolatedValue(current),
      0
    );

    return sumOfReversedExtrapolatedValues;
  } catch (error) {
    console.error("Had trouble reading file provided!", error);
  }
};

console.log(
  await calculateSumOfReversedExtrapolatedValues("day-9/part-2/input.txt")
);

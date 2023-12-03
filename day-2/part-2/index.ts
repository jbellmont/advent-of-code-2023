import { readFile } from "node:fs/promises";

const MATCH_COLOUR_COUNTS_REGEX = /(\d+)\s+(\w+)/g;

type Colours = "blue" | "green" | "red";

const calculateSumOfPowerOfSets = (values: string[]): number => {
  return values.reduce((previous, current) => {
    const colourCountPairs = current.match(MATCH_COLOUR_COUNTS_REGEX);
    if (!colourCountPairs) {
      return previous;
    }

    const minimumSetOfCubes: Record<Colours, number> = {
      blue: 0,
      green: 0,
      red: 0,
    };

    for (const colourCount of colourCountPairs) {
      const splitBySpace = colourCount.split(" ");
      const count = Number(splitBySpace[0]);
      const colour = splitBySpace[1] as Colours;

      if (count > minimumSetOfCubes[colour]) {
        minimumSetOfCubes[colour] = count;
      }
    }

    const sumOfPower = Object.entries(minimumSetOfCubes).reduce(
      (previous, current) => {
        const colourCount = current[1];

        if (previous === 0) {
          return colourCount;
        }

        return colourCount * previous;
      },
      0
    );

    return previous + sumOfPower;
  }, 0);
};

const getSumOfPowerOfSets = async (
  pathToGames: string
): Promise<number | undefined> => {
  try {
    const values = (await readFile(pathToGames, { encoding: "utf-8" })).split(
      "\n"
    );

    return calculateSumOfPowerOfSets(values);
  } catch (error) {
    console.error("Had trouble reading file provided!", error);
  }
};

console.log(await getSumOfPowerOfSets("day-2/part-2/input.txt"));

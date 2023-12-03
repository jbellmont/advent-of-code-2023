import { readFile } from "node:fs/promises";

const MATCH_GAME_ID_REGEX = /(?<=Game\s)(\d+)/g;
const MATCH_COLOUR_COUNTS_REGEX = /(\d+)\s+(\w+)/g;

const MAXIMUM_NUMBER_OF_CUBES = {
  blue: 14,
  green: 13,
  red: 12,
};

const calculateSumOfPossibleGameIds = (values: string[]): number => {
  return values.reduce((previous, current) => {
    const colourCountPairs = current.match(MATCH_COLOUR_COUNTS_REGEX);
    if (!colourCountPairs) {
      return previous;
    }

    for (const colourCount of colourCountPairs) {
      const splitBySpace = colourCount.split(" ");
      const count = Number(splitBySpace[0]);
      const colour = splitBySpace[1] as keyof typeof MAXIMUM_NUMBER_OF_CUBES;

      if (count > MAXIMUM_NUMBER_OF_CUBES[colour]) {
        return previous;
      }
    }

    const gameId = current.match(MATCH_GAME_ID_REGEX);
    if (!gameId) {
      return previous;
    }

    return previous + Number(gameId);
  }, 0);
};

const getSumOfPossibleGameIds = async (
  pathToGames: string
): Promise<number | undefined> => {
  try {
    const values = (await readFile(pathToGames, { encoding: "utf-8" })).split(
      "\n"
    );

    return calculateSumOfPossibleGameIds(values);
  } catch (error) {
    console.error("Had trouble reading file provided!", error);
  }
};

console.log(await getSumOfPossibleGameIds("day-2/part-1/input.txt"));

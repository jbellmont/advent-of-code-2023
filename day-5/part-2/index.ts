import { readFile } from "node:fs/promises";

const splitMapIntoList = (almanacMap: string): number[][] => {
  return [...almanacMap.split("\n").slice(1)].map((numberGroup) =>
    numberGroup.split(" ").map((innerNumber) => Number(innerNumber)),
  );
};

const getLocationValue = (seed: number, almanacMaps: string[]): number => {
  let currentValue = seed;

  for (const almanacMap of almanacMaps) {
    const listOfMaps = splitMapIntoList(almanacMap);
    const sortDescending = listOfMaps.sort((a, b) => b[1] - a[1]);

    for (const map of sortDescending) {
      const highestMapValue = map[1] - 1 + map[2];
      if (currentValue >= map[1] && currentValue <= highestMapValue) {
        const difference = map[1] - map[0];
        currentValue = currentValue - difference;
        break;
      }
    }
  }

  return currentValue;
};

const getLowestLocationNumber = async (
  path: string,
): Promise<number | undefined> => {
  try {
    const almanacGroups = (await readFile(path, { encoding: "utf-8" })).split(
      /\n{2,}/,
    );

    const almanacMaps = [
      almanacGroups[1],
      almanacGroups[2],
      almanacGroups[3],
      almanacGroups[4],
      almanacGroups[5],
      almanacGroups[6],
      almanacGroups[7],
    ];

    const seeds = almanacGroups[0]
      .split(":")[1]
      .split(" ")
      .filter((seed) => seed !== "")
      .map((seed) => Number(seed));

    const seedNumbers = seeds.reduce(
      (previous, current, index) => {
        if (index === 0) return previous;

        if (index % 2 === 0) {
          return [...previous, current];
        }

        return previous;
      },
      [seeds[0]],
    );
    const sortedSeedNumbersAscending = seedNumbers.sort((a, b) => a - b);
    const seedRange = [
      sortedSeedNumbersAscending[0],
      seeds[seeds.indexOf(sortedSeedNumbersAscending[0]) + 1],
    ];

    let lowestLocationValue: number | undefined;

    for (let i = 0; i < seedRange[1]; i++) {
      const locationValue = getLocationValue(seedRange[i], almanacMaps);

      if (
        lowestLocationValue === undefined ||
        locationValue < lowestLocationValue
      ) {
        lowestLocationValue = locationValue;
      }
    }

    return lowestLocationValue;
  } catch (error) {
    console.error("Had trouble reading file provided!", error);
  }
};

console.log(await getLowestLocationNumber("day-5/part-2/input.txt"));

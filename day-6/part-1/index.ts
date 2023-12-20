import { readFile } from "node:fs/promises";

type Race = {
  time: number;
  distance: number;
};

const calculateRecordsBrokenPerRace = (race: Race): number => {
  let numberOfRecordsBroken = 0;
  for (let ms = race.time - 1; ms > 0; ms--) {
    const heldMs = race.time - ms;
    const distanceMm = heldMs * ms;

    if (distanceMm > race.distance) {
      numberOfRecordsBroken++;
    }
  }

  return numberOfRecordsBroken;
};

const getProductOfPossibleWins = async (
  path: string
): Promise<number | undefined> => {
  try {
    const input = (await readFile(path, { encoding: "utf-8" })).split(/\n/);
    const times: number[] = [];
    const distances: number[] = [];

    input.forEach((line, index) => {
      const groupOfTimes = line.split(":")[1];
      const rawTimes = groupOfTimes
        .split(" ")
        .filter((time) => time)
        .map((time) => Number(time));
      rawTimes.forEach((time) => {
        if (index === 0) {
          times.push(time);
        } else {
          distances.push(time);
        }
      });
    });

    const races: Race[] = [];
    for (let i = 0; i < times.length; i++) {
      races.push({
        time: times[i],
        distance: distances[i],
      });
    }

    const productOfRecordsBroken = races.reduce((total, currentRace, index) => {
      const recordsBroken = calculateRecordsBrokenPerRace(currentRace);

      if (index === 0) {
        return recordsBroken;
      }

      return total * recordsBroken;
    }, 0);

    return productOfRecordsBroken;
  } catch (error) {
    console.error("Had trouble reading file provided!", error);
  }
};

console.log(await getProductOfPossibleWins("day-6/part-1/input.txt"));

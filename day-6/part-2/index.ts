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

    let time: number = 0;
    let distance: number = 0;

    input.forEach((line, index) => {
      const groupOfTimes = line.split(":")[1];
      const combinedTime = Number(
        groupOfTimes
          .split(" ")
          .filter((time) => time)
          .join("")
      );

      if (index === 0) {
        time = combinedTime;
      } else {
        distance = combinedTime;
      }
    });

    const race: Race = {
      time,
      distance,
    };

    return calculateRecordsBrokenPerRace(race);
  } catch (error) {
    console.error("Had trouble reading file provided!", error);
  }
};

console.log(await getProductOfPossibleWins("day-6/part-1/input.txt"));

import { readFile } from "node:fs/promises";

const formatAsArrayOfNumbers = (numbersList: string): number[] => {
  return numbersList
    .split(/\D/)
    .filter((value) => value !== "")
    .map((value) => Number(value));
};

const getSumOfScratchcardPoints = async (
  pathToScratchcards: string,
): Promise<number | undefined> => {
  try {
    const scratchcards = (
      await readFile(pathToScratchcards, { encoding: "utf-8" })
    ).split("\n");

    const sumOfScratchcardPoints = scratchcards.reduce(
      (totalGamePoints, currentGame) => {
        const numbers = currentGame.split(":")[1].split("|");

        const winningNumbers = formatAsArrayOfNumbers(numbers[0]);
        const winnersMap = new Map<number, boolean>();
        for (const winningNumber of winningNumbers) {
          winnersMap.set(winningNumber, true);
        }

        const numbersYouHave = formatAsArrayOfNumbers(numbers[1]);
        const pointsForCurrentGame = numbersYouHave.reduce(
          (currentGamePoints, currentNumber) => {
            if (winnersMap.has(currentNumber)) {
              if (currentGamePoints === 0) {
                return 1;
              }

              return currentGamePoints * 2;
            }

            return currentGamePoints;
          },
          0,
        );

        return totalGamePoints + pointsForCurrentGame;
      },
      0,
    );

    return sumOfScratchcardPoints;
  } catch (error) {
    console.error("Had trouble reading file provided!", error);
  }
};

console.log(await getSumOfScratchcardPoints("day-4/part-1/input.txt"));

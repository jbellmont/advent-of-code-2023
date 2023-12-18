import { readFile } from "node:fs/promises";

const formatAsArrayOfNumbers = (numbersList: string): number[] => {
  return numbersList
    .split(/\D/)
    .filter((value) => value !== "")
    .map((value) => Number(value));
};

const getCardCountForSingleGame = (scratchcard: string): number => {
  const numbers = scratchcard.split(":")[1].split("|");

  const winningNumbers = formatAsArrayOfNumbers(numbers[0]);
  const winnersMap = new Map<number, boolean>();
  for (const winningNumber of winningNumbers) {
    winnersMap.set(winningNumber, true);
  }

  const numbersYouHave = formatAsArrayOfNumbers(numbers[1]);
  const matches = numbersYouHave.reduce((currentGamePoints, currentNumber) => {
    if (winnersMap.has(currentNumber)) {
      if (currentGamePoints === 0) {
        return 1;
      }

      return currentGamePoints + 1;
    }

    return currentGamePoints;
  }, 0);

  return matches;
};

const getCardCountOfRange = (
  scratchcards: string[],
  startIndex: number,
  length: number,
): number => {
  let cards = 0;

  for (let i = startIndex; i < length; i++) {
    const cardsForSingleGame = getCardCountForSingleGame(scratchcards[i]);
    const cardsFromRangeOfCards = getCardCountOfRange(
      scratchcards,
      i + 1,
      i + (cardsForSingleGame + 1),
    );
    cards += cardsForSingleGame + cardsFromRangeOfCards;
  }

  return cards;
};

const getSumOfScratchcards = async (
  pathToScratchcards: string,
): Promise<number | undefined> => {
  try {
    const scratchcards = (
      await readFile(pathToScratchcards, { encoding: "utf-8" })
    ).split("\n");

    return (
      getCardCountOfRange(scratchcards, 0, scratchcards.length) +
      scratchcards.length
    );
  } catch (error) {
    console.error("Had trouble reading file provided!", error);
  }
};

console.log(await getSumOfScratchcards("day-4/part-2/input.txt"));

import { readFile } from "node:fs/promises";

type Hand = {
  bid: number;
  cardValues: number[];
  handValue: number;
};

const HAND_VALUES = {
  fiveOfAKind: 7,
  fourOfAKind: 6,
  fullHouse: 5,
  threeOfAKind: 4,
  twoPair: 3,
  onePair: 2,
  highCard: 1,
};

const CARD_VALUES = {
  A: 13,
  K: 12,
  Q: 11,
  T: 10,
  "9": 9,
  "8": 8,
  "7": 7,
  "6": 6,
  "5": 5,
  "4": 4,
  "3": 3,
  "2": 2,
  J: 1,
};

const calculateHandValue = (hand: string): number => {
  const counts: Record<string, number> = {};

  const cards = hand.split("");
  cards.forEach((card) => (counts[card] = counts[card] ? counts[card] + 1 : 1));

  if (counts["J"]) {
    let highestValueCard = "";
    let strongestMultiple = "";

    Object.keys(counts).forEach((card) => {
      if (!highestValueCard) {
        highestValueCard = card;
      } else if (
        CARD_VALUES[card as keyof typeof CARD_VALUES] >
        CARD_VALUES[highestValueCard as keyof typeof CARD_VALUES]
      ) {
        highestValueCard = card;
      }

      if (
        card !== "J" &&
        counts[card] > 1 &&
        (!strongestMultiple ||
          CARD_VALUES[card as keyof typeof CARD_VALUES] >
            CARD_VALUES[strongestMultiple as keyof typeof CARD_VALUES])
      ) {
        strongestMultiple = card;
      }
    });

    Object.keys(counts).forEach((card) => {
      if (
        card !== "J" &&
        (card === strongestMultiple ||
          (!strongestMultiple && card === highestValueCard))
      ) {
        counts[card] += counts["J"];
        counts["J"] = 0;
      }
    });
  }

  const hands: number[] = [];
  Object.values(counts).forEach((count) => {
    switch (true) {
      case count === 5:
        hands.push(HAND_VALUES.fiveOfAKind);
        break;
      case count === 4:
        hands.push(HAND_VALUES.fourOfAKind);
        break;
      case count === 3 && hands.includes(HAND_VALUES.onePair):
        hands.pop();
        hands.push(HAND_VALUES.fullHouse);
        break;
      case count === 3:
        hands.push(HAND_VALUES.threeOfAKind);
        break;
      case count === 2 && hands.includes(HAND_VALUES.threeOfAKind):
        hands.pop();
        hands.push(HAND_VALUES.fullHouse);
        break;
      case count === 2 && hands.includes(HAND_VALUES.onePair):
        hands.pop();
        hands.push(HAND_VALUES.twoPair);
        break;
      case count === 2:
        hands.push(HAND_VALUES.onePair);
        break;
      default:
        break;
    }
  });

  if (!hands.length) {
    hands.push(HAND_VALUES.highCard);
  }

  if (hands.length > 1) {
    throw Error("Something's gone wrong in your algo, mate");
  }

  return hands[0];
};

const calculateCardValues = (hand: string): number[] => {
  return hand
    .split("")
    .map((card) => CARD_VALUES[card as keyof typeof CARD_VALUES]);
};

const calculateTotalWinnings = async (
  path: string
): Promise<number | undefined> => {
  try {
    const input = (await readFile(path, { encoding: "utf-8" })).split(/\n/);
    const hands: Hand[] = input.map((hand: string) => {
      const [rawHand, rawBid] = hand.split(" ");

      const bid = Number(rawBid);
      const cardValues = calculateCardValues(rawHand);
      const handValue = calculateHandValue(rawHand);

      return {
        bid,
        cardValues,
        handValue,
      };
    });

    const sortedHands = hands.sort((a, b) => {
      if (a.handValue === b.handValue) {
        for (let i = 0; i < a.cardValues.length; i++) {
          if (a.cardValues[i] !== b.cardValues[i]) {
            return a.cardValues[i] - b.cardValues[i];
          }
        }
      }

      return a.handValue - b.handValue;
    });

    const totalWinnings = sortedHands.reduce((previous, current, index) => {
      return previous + current.bid * (index + 1);
    }, 0);

    return totalWinnings;
  } catch (error) {
    console.error("Had trouble reading file provided!", error);
  }
};

console.log(await calculateTotalWinnings("day-7/part-2/input.txt"));

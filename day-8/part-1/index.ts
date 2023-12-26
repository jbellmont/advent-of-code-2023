import { readFile } from "node:fs/promises";

type NodeMap = {
  [parent: string]: {
    L: string;
    R: string;
  };
};

const START_NODE = "AAA";
const GOAL_NODE = "ZZZ";

const calculateNumberOfSteps = async (
  path: string
): Promise<number | undefined> => {
  try {
    const [directions, nodes] = (
      await readFile(path, { encoding: "utf-8" })
    ).split(/\n\n/);

    const rawNodes = nodes.split(/\n/);
    const nodeMap = rawNodes.reduce((previous, current) => {
      const [parent, _, left, right] = current.split(" ");
      previous[parent] = {
        L: left.slice(1, left.length - 1),
        R: right.slice(0, right.length - 1),
      };
      return previous;
    }, {} as NodeMap);

    let currentNode = START_NODE;
    let steps = 0;
    while (currentNode !== GOAL_NODE) {
      for (const direction of directions) {
        currentNode = nodeMap[currentNode][direction as "L" | "R"];
        steps++;
        if (currentNode === GOAL_NODE) {
          break;
        }
      }
    }

    return steps;
  } catch (error) {
    console.error("Had trouble reading file provided!", error);
  }
};

console.log(await calculateNumberOfSteps("day-8/part-1/input.txt"));

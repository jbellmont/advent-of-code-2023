import { readFile } from "node:fs/promises";

type NodeMap = {
  [parent: string]: {
    L: string;
    R: string;
  };
};

const START_NODE_ENDING = "A";
const GOAL_NODE_ENDING = "Z";

// Used ChatGPT for these math utils.
const greatestCommonDivisor = (a: number, b: number): number => {
  return b === 0 ? a : greatestCommonDivisor(b, a % b);
};

const calculateLcmOfNumbers = (numbers: number[]): number => {
  const leastCommonMultiple = (a: number, b: number): number => {
    return (a * b) / greatestCommonDivisor(a, b);
  };

  return numbers.reduce(function (acc, curr) {
    return leastCommonMultiple(acc, curr);
  }, 1);
};
//

const calculateStepsForNode = (
  startNode: string,
  nodeMap: NodeMap,
  directions: string
): number => {
  let currentNode = startNode;
  let steps = 0;
  while (currentNode.charAt(currentNode.length - 1) !== GOAL_NODE_ENDING) {
    for (const direction of directions) {
      currentNode = nodeMap[currentNode][direction as "L" | "R"];
      steps++;
      if (currentNode.charAt(currentNode.length - 1) === GOAL_NODE_ENDING) {
        break;
      }
    }
  }

  return steps;
};

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

    const startNodes: string[] = [];
    Object.keys(nodeMap).forEach((key) => {
      if (key.charAt(key.length - 1) === START_NODE_ENDING) {
        startNodes.push(key);
      }
    });

    const stepsForStartNodes = startNodes.map((node) =>
      calculateStepsForNode(node, nodeMap, directions)
    );

    return calculateLcmOfNumbers(stepsForStartNodes);
  } catch (error) {
    console.error("Had trouble reading file provided!", error);
  }
};

console.log(await calculateNumberOfSteps("day-8/part-2/input.txt"));

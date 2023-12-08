import { readFileSync } from "fs";

const firstPuzzle = () => {
  const START_NODE = 'AAA';
  const END_NODE = 'ZZZ';
  const LEFT = 'L';
  
  const lines = readFileSync('src/input.txt', 'utf-8').split('\n');
  const instructions = lines[0].split('');
  const map = lines.slice(2).reduce<{ [key: string]: string[] }>((map, line) => {
    const [node, ...rest] = Array.from(line.matchAll(/[A-Z]+/g)).map((a) => a[0]);
    return { ...map, [node]: rest };
  }, {});
  let steps = 0;
  let currentNode = START_NODE;
  while (currentNode !== END_NODE) {
    const instruction = instructions[steps % instructions.length];
    currentNode = map[currentNode][instruction === LEFT ? 0 : 1];
    steps ++;
  }
  return steps;
};

const lcm = (...arr: number[]) => {
  const gcd = (x: number, y: number): number => (!y ? x : gcd(y, x % y));
  const _lcm = (x: number, y: number) => (x * y) / gcd(x, y);
  return [...arr].reduce((a, b) => _lcm(a, b));
};

const secondPuzzle = () => {
  const START_NODE = 'AAA';
  const END_NODE = 'ZZZ';
  const LEFT = 'L';
  
  const lines = readFileSync('src/input.txt', 'utf-8').split('\n');
  const instructions = lines[0].split('');
  const map = lines.slice(2).reduce<{ [key: string]: string[] }>((map, line) => {
    const [node, ...rest] = Array.from(line.matchAll(/[0-9A-Z]+/g)).map((a) => a[0]);
    return { ...map, [node]: rest };
  }, {});

  const startingNodes = Object.keys(map).filter((key) => key.endsWith('A'));
  const getEndNodeAndCycleStart = (node: string): {
    endNode: string,
    cycleStart: { node: string; stepPosition: number; afterSteps: number },
    cycleLength: number
  } => {
    const visitedNodes: { [key: string]: { stepPosition: number; afterSteps: number }[] } = {};
    let step = 0;

    while(true) {
      const stepPosition = step % instructions.length;
      const instruction = instructions[stepPosition];
      node = map[node][instruction === LEFT ? 0 : 1];
      const nodeVisits = visitedNodes[node] ?? [];
      const previousVisit = nodeVisits.find((visit) => visit.stepPosition === stepPosition);
      if (previousVisit) {
        const endNode = Object.keys(visitedNodes).find((n) => n.endsWith('Z'));
        return { endNode, cycleStart: {...previousVisit, node}, cycleLength: step - previousVisit.afterSteps + 1 };
      }
      visitedNodes[node] = [...nodeVisits, { stepPosition, afterSteps: step + 1 }];
      step++;
    }
  };
  const cycleLengths = startingNodes.map(getEndNodeAndCycleStart).map(({ cycleLength }) => cycleLength);
  return lcm(...cycleLengths);
};

console.log('first puzzle', firstPuzzle());
console.log('second puzzle', secondPuzzle());
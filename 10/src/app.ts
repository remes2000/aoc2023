import { readFileSync } from "fs";

const STARTING_POINT = 'S';
const map = readFileSync('src/input_test.txt', 'utf-8')
  .split('\n')
  .map((line) => line.split(''));
const possibleNeighborPositionFun: { [key: string]: (a: number[]) => number[][] } = {
    ['|']: ([ top, left ]: number[]) => {
      return [
        [top + 1, left],
        [top - 1, left]
      ];
    },
    ['-']: ([ top, left ]: number[]) => {
      return [
        [top, left + 1],
        [top, left - 1]
      ];
    },
    ['L']: ([ top, left ]: number[]) => {
      return [
        [top - 1, left],
        [top, left + 1]
      ];
    },
    ['J']: ([ top, left ]: number[]) => {
      return [
        [top - 1, left],
        [top, left - 1]
      ];
    },
    ['7']: ([ top, left ]: number[]) => {
      return [
        [top + 1, left],
        [top, left - 1]
      ];
    },
    ['F']: ([ top, left ]: number[]) => {
      return [
        [top + 1, left],
        [top, left + 1]
      ];
    }
};
const isEmptyOrGround = (s: string) => s === '' || s === '.';

const getStartingPoint = (map: string[][]): number[] => {
  for (let row = 0; row < map.length; row++) {
    const startingPointIndex = map[row].indexOf(STARTING_POINT);
    if (startingPointIndex !== -1) {
      return [row, startingPointIndex];
    }
  }
  throw new Error('No starting point in map');
};

const getNeigborsOfStartingPoint = ([top, left]: number[], map: string[][]) => {
  const neighbors = [];
  const above = (map[top - 1] ?? [])[left] ?? '';
  if (['F', '7', '|'].includes(above)) {
    neighbors.push([top - 1, left]);
  }
  const below = (map[top + 1] ?? [])[left] ?? '';
  if (['L', 'J', '|'].includes(below)) {
    neighbors.push([top + 1, left]);
  }
  const symbolLeft = map[top][left - 1] ?? '';
  if (['F', 'L', '-'].includes(symbolLeft)) {
    neighbors.push([top, left - 1]);
  }
  const symbolRight = map[top][left + 1] ?? '';
  if (['7', 'J', '-'].includes(symbolRight)) {
    neighbors.push([top, left + 1]);
  }
  return neighbors;
};
const getNodeId = ([top, left]: number[]) => `${top}-${left}`;
const getNodePosition = (id: string) => id.split('-').map(Number);

const firstPuzzle = () => {
  const getNeighbors = ([top, left]: number[], map: string[][]) => {
    const symbol = map[top][left];
    return possibleNeighborPositionFun[symbol]([top, left])
      .filter((possibleNeighbor) => !isEmptyOrGround(map[possibleNeighbor[0]][possibleNeighbor[1]]));
  };
  const startingPoint = getStartingPoint(map);
  const visitedNodes: { [key: string]: number } = {
    [getNodeId(startingPoint)]: 0,
  };
  const nodesToVisit: { node: number[], cost: number }[] = getNeigborsOfStartingPoint(startingPoint, map)
    .map((node) => ({ node, cost: 1 }));

  while (nodesToVisit.length) {
    const currentNode = nodesToVisit.shift();
    visitedNodes[getNodeId(currentNode.node)] = currentNode.cost;
    const allNeighbors = getNeighbors(currentNode.node, map);
    const allUnvisited = allNeighbors.filter((node) => !visitedNodes.hasOwnProperty(getNodeId(node)));
    allUnvisited.map((node) => ({ node, cost: currentNode.cost + 1 })).forEach((n) => nodesToVisit.push(n));
  }
  return {
    furthest: Math.max(...Object.values(visitedNodes)),
    loop: Object.keys(visitedNodes).map(getNodePosition)
  };
};

const secondPuzzle = (loop: number[][]) => {
  const newMap: string[][] = 
    Array.from({ length: map.length * 2 })
    .map(() => Array.from({ length: map[0].length * 2 }).map(() => '*'));
  const visitedNodes = loop.map(getNodeId);

  map.forEach((row, top) => {

    row.forEach((symbol, left) => {


    });

  });

  newMap.forEach((row) => {
    console.log(row.join(''));
  });
  // map.forEach((row, index) => {
  //   const map: string[] = [];
  //   });

  //   newMap.push(map);
  // });

  // newMap.forEach((row) => {
  //   console.log(row.join(''));
  // });
};
const { furthest, loop } = firstPuzzle();
console.log('first puzzle', furthest);
console.log('second puzzle', secondPuzzle(loop));
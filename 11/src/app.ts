import { readFileSync } from "fs";

type Universe = string[][];
type Galaxy = number[];

const EMPTY_SPACE = '.';
const GALAXY = '#';
const getPathId = (a: Galaxy, b: Galaxy) => `${a[0]} ${a[1]} --- ${b[0]} ${b[1]}`;

const firstPuzzle = () => {
  const expandUniverse = (universe: Universe): Universe => {
    const newUniverse: Universe = [];
    const rowsToDuplicate = universe.reduce<number[]>((emptyRows, row, index) => {
      if (row.every((symbol) => symbol === EMPTY_SPACE)) {
        return [...emptyRows, index];
      }
      return emptyRows;
    }, []);
    const columnsToDuplicate = universe[0].reduce((emptyColumns, _, index) => {
      const column = Array.from({ length: universe.length }).map((_, rowIndex) => universe[rowIndex][index]);
      if (column.every((symbol) => symbol === EMPTY_SPACE)) {
        return [...emptyColumns, index];
      }
      return emptyColumns;
    }, []);
    universe.forEach((row, rowIndex) => {
      const newRow: string[] = [];
      row.forEach((symbol, columnIndex) => {
        newRow.push(symbol);
        if (columnsToDuplicate.includes(columnIndex)) {
          newRow.push(symbol);
        }
      });
      newUniverse.push(newRow);
      if (rowsToDuplicate.includes(rowIndex)) {
        newUniverse.push(newRow);
      }
    });
    return newUniverse;
  };

  const bfs = (startNode: Galaxy, endNodes: Galaxy[], universe: Universe): number[][] => {
    const getGalaxyId = ([top, left]: Galaxy) => `${top} ${left}`;
    const nodesToVisit = [
      [...startNode, 0]
    ];
    const visitedNodes: string[] = [];
    const foundPaths: number[][] = [];
    
    while(foundPaths.length !== endNodes.length) {
      const [top, left, distance] = nodesToVisit.shift();
      if (visitedNodes.includes(getGalaxyId([top, left]))) {
        continue;
      }
      if(endNodes.some((node) => node[0] === top && node[1] === left)) {
        foundPaths.push([top, left, distance]);
      }
      const neighbors = [
        [top - 1, left],
        [top + 1, left],
        [top, left - 1],
        [top, left + 1]
      ].filter(([top, left]) => 
        top >= 0 && top < universe.length
        && left >= 0 && left < universe[0].length
      );
      nodesToVisit.push(...neighbors.map((n) => [...n, distance + 1]));
      visitedNodes.push(getGalaxyId([top, left]));
    }

    return foundPaths;
  };

  let universe: Universe = readFileSync('src/input.txt', 'utf-8')
    .split('\n')
    .map((line) => line.split(''));
  universe = expandUniverse(universe);

  const galaxies = universe.reduce<Galaxy[]>((foundGalaxies, row, rowIndex) => {
    const galaxiesInRow = row.reduce((result, symbol, columnIndex) => {
      if (symbol === GALAXY) {
        return [...result, columnIndex];
      }
      return result;
    }, []);
    return [...foundGalaxies, ...galaxiesInRow.map((left) => [rowIndex, left])];
  }, []);

  const { sum } = galaxies.reduce<{ sum: number; calculatedPaths: string[] }>((result, galaxy, index) => { 
    const galaxiesToConnect = galaxies
      .filter((_, galaxyIndex) => galaxyIndex !== index)
      .filter((g) => !result.calculatedPaths.includes(getPathId(g, galaxy)));
    console.log(`Calculating for ${galaxy} (${index + 1}/${galaxies.length}) nees to find ${galaxiesToConnect.length} connections`);
    if (!galaxiesToConnect.length) {
      return result;
    }
    const sumOfPathLength = bfs(galaxy, galaxiesToConnect, universe)
      .map((path) => path[2])
      .reduce((result, num) => result + num, 0);

    return {
      sum: result.sum + sumOfPathLength,
      calculatedPaths: [
        ...result.calculatedPaths,
        ...galaxiesToConnect.map((g) => getPathId(galaxy, g))
      ]
    };
  }, { sum: 0, calculatedPaths: [] });
  return sum;
};

const secondPuzzle = () => {
};

console.log('first puzzle', firstPuzzle());
console.log('second puzzle', secondPuzzle());
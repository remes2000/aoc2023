import { readFileSync } from "fs";

type Universe = string[][];
type Galaxy = number[];
interface ExpandUniverse {
  rowsToExpand: number[];
  columnsToExpand: number[]
}

const EMPTY_SPACE = '.';
const GALAXY = '#';

const getExpandUniverse = (universe: Universe): ExpandUniverse => {
  const rowsToExpand = universe.reduce<number[]>((emptyRows, row, index) => {
    if (row.every((symbol) => symbol === EMPTY_SPACE)) {
      return [...emptyRows, index];
    }
    return emptyRows;
  }, []);
  const columnsToExpand = universe[0].reduce((emptyColumns, _, index) => {
    const column = Array.from({ length: universe.length }).map((_, rowIndex) => universe[rowIndex][index]);
    if (column.every((symbol) => symbol === EMPTY_SPACE)) {
      return [...emptyColumns, index];
    }
    return emptyColumns;
  }, []);
  return { rowsToExpand, columnsToExpand };
};

const extrapolate = (galaxy: Galaxy, { rowsToExpand, columnsToExpand }: ExpandUniverse, speed = 2): Galaxy => {
  const [top, left] = galaxy;
  const rowsBefore = rowsToExpand.filter((row) => row < top).length;
  const columnsBefore = columnsToExpand.filter((column) => column < left).length;
  return [top + rowsBefore * (speed - 1), left + columnsBefore * (speed - 1)];
}

const manhattanDistance = (a: Galaxy, b: Galaxy): number => {
  return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
}

const getSumOfMinPathLengths = (universe: Universe, speed = 2): number => {
  const expandDefinition = getExpandUniverse(universe);

  const galaxies = universe.reduce<Galaxy[]>((foundGalaxies, row, rowIndex) => {
    const galaxiesInRow = row.reduce((result, symbol, columnIndex) => {
      if (symbol === GALAXY) {
        return [...result, columnIndex];
      }
      return result;
    }, []);
    return [...foundGalaxies, ...galaxiesInRow.map((left) => [rowIndex, left])];
  }, []).map((g) => extrapolate(g, expandDefinition, speed));

  let sum = 0;
  while (galaxies.length > 1) {
    const galaxy = galaxies.shift();
    sum = sum + galaxies.reduce((subsum, g) => {
      return subsum + manhattanDistance(galaxy, g)
    }, 0);
  }
  return sum;
}

let universe: Universe = readFileSync('src/input.txt', 'utf-8')
  .split('\n')
  .map((line) => line.split(''));

console.log('first puzzle', getSumOfMinPathLengths(universe, 2));
console.log('second puzzle', getSumOfMinPathLengths(universe, 1_000_000));
import { readFileSync } from "fs";

interface Game {
  red: number;
  green: number;
  blue: number;
}

const numberOfCubes = {
  red: 12,
  green: 13,
  blue: 14,
};

const isPossible = ({ red, green, blue }: Game): boolean => {
  return red <= numberOfCubes.red && green <= numberOfCubes.green && blue <= numberOfCubes.blue;
};

const result = readFileSync('src/input.txt', 'utf-8').split('\n').reduce(
  (result, line) => {
    const id = Number(line.match(/^Game (\d+):/)[1]);
    const games = line.split(':')[1].split(';').map((line) => ({
      red: Number((line.match(/(\d+) red/) ?? [0, 0])[1]),
      green: Number((line.match(/(\d+) green/) ?? [0, 0])[1]),
      blue: Number((line.match(/(\d+) blue/) ?? [0, 0])[1]),
    }))
    for (const game of games) {
      if (!isPossible(game)) {
        return result;
      }
    }
    return result + id;
  }, 0
);
console.log('sum of possible game ids', result);

const resultSecondPuzzle = readFileSync('src/input.txt', 'utf-8').split('\n').reduce(
  (result, line) => {
    const id = Number(line.match(/^Game (\d+):/)[1]);
    const games = line.split(':')[1].split(';').map((line) => ({
      red: Number((line.match(/(\d+) red/) ?? [0, 0])[1]),
      green: Number((line.match(/(\d+) green/) ?? [0, 0])[1]),
      blue: Number((line.match(/(\d+) blue/) ?? [0, 0])[1]),
    }));
    const [maxOfRed, maxOfGreen, maxOfBlue] = [
      Math.max(...games.map(({ red }) => red)),
      Math.max(...games.map(({ green }) => green)),
      Math.max(...games.map(({ blue }) => blue))
    ];
    return result + (maxOfRed * maxOfGreen * maxOfBlue) ;
  }, 0
);
console.log('sum of powers', resultSecondPuzzle);
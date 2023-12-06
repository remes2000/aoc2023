import { readFileSync } from "fs";

const firstPuzzle = () => {
  const input: string[] = readFileSync('src/input.txt', 'utf-8').split('\n');
  const timeArray = Array.from(input[0].matchAll(/\d+/g)).map(([num]) => Number(num));
  const distanceArray = Array.from(input[1].matchAll(/\d+/g)).map(([num]) => Number(num));

  return timeArray.reduce((result, _, index) => {
    const time = timeArray[index];
    const distance = distanceArray[index];
    const delta = Math.pow(time, 2) - 4 * distance;
    if (delta <= 0) {
      return 0 * result;
    }

    const x1 = (-time + Math.sqrt(delta)) / -2;
    const x2 = (-time - Math.sqrt(delta)) / -2;

    let numberOfSolutions = (Math.floor(x2) - Math.ceil(x1) + 1);
    if (Math.floor(x2) === x2) {
      numberOfSolutions--;
    }
    if (Math.ceil(x1) === x1) {
      numberOfSolutions--;
    }

    return result * numberOfSolutions;
  }, 1);
};

const secondPuzzle = () => {
  const input: string[] = readFileSync('src/input.txt', 'utf-8').split('\n');
  const timeArray = [Number(Array.from(input[0].matchAll(/\d+/g)).map(([num]) => num).join(''))];
  const distanceArray = [Number(Array.from(input[1].matchAll(/\d+/g)).map(([num]) => num).join(''))];

  return timeArray.reduce((result, _, index) => {
    const time = timeArray[index];
    const distance = distanceArray[index];
    const delta = Math.pow(time, 2) - 4 * distance;
    if (delta <= 0) {
      return 0 * result;
    }

    const x1 = (-time + Math.sqrt(delta)) / -2;
    const x2 = (-time - Math.sqrt(delta)) / -2;

    let numberOfSolutions = (Math.floor(x2) - Math.ceil(x1) + 1);
    if (Math.floor(x2) === x2) {
      numberOfSolutions--;
    }
    if (Math.ceil(x1) === x1) {
      numberOfSolutions--;
    }

    return result * numberOfSolutions;
  }, 1);
};

console.log('first puzzle', firstPuzzle());
console.log('second puzzle', secondPuzzle());

